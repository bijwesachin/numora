import type { CurriculumData } from './curriculumIndex';
import type { FactorNode, VisualSpec } from './visual';

/**
 * Structural checks for curriculum content. Returns human-readable problems instead of
 * throwing so a test can list every issue at once.
 */
export function validateCurriculum(data: CurriculumData): string[] {
  const errors: string[] = [];
  const dupes = (label: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) errors.push(`Duplicate ${label} id "${id}"`);
      seen.add(id);
    }
    return seen;
  };

  const categoryIds = dupes('category', data.categories.map((c) => c.id));
  const unitIds = dupes('unit', data.units.map((u) => u.id));
  const conceptIds = dupes('concept', data.concepts.map((c) => c.id));
  const cardIds = dupes('card', data.cards.map((c) => c.id));

  for (const category of data.categories) {
    for (const id of category.unitIds) if (!unitIds.has(id)) errors.push(`Category "${category.id}" lists unknown unit "${id}"`);
  }
  for (const unit of data.units) {
    if (!categoryIds.has(unit.categoryId)) errors.push(`Unit "${unit.id}" has unknown category "${unit.categoryId}"`);
    for (const id of unit.conceptIds) if (!conceptIds.has(id)) errors.push(`Unit "${unit.id}" lists unknown concept "${id}"`);
  }
  for (const concept of data.concepts) {
    if (!unitIds.has(concept.unitId)) errors.push(`Concept "${concept.id}" has unknown unit "${concept.unitId}"`);
    for (const pre of concept.prerequisites) {
      if (!conceptIds.has(pre)) errors.push(`Concept "${concept.id}" has unknown prerequisite "${pre}"`);
    }
  }

  for (const card of data.cards) {
    if (!conceptIds.has(card.conceptId)) errors.push(`Card "${card.id}" has unknown concept "${card.conceptId}"`);
    if (!new RegExp(`^${card.conceptId}-\\d{3}$`).test(card.id)) {
      errors.push(`Card "${card.id}" should be named "<concept-id>-NNN"`);
    }
    if (!card.front.trim() || !card.back.trim()) errors.push(`Card "${card.id}" needs a front and a back`);
    for (const pre of card.prerequisites) {
      if (!cardIds.has(pre)) errors.push(`Card "${card.id}" has unknown prerequisite "${pre}"`);
      if (pre === card.id) errors.push(`Card "${card.id}" lists itself as a prerequisite`);
    }
    if (card.steps && card.steps.length === 0) errors.push(`Card "${card.id}" has an empty steps list`);
    for (const visual of [card.visual, card.answerVisual]) {
      if (visual) errors.push(...validateVisual(visual).map((e) => `Card "${card.id}": ${e}`));
    }
  }

  errors.push(...findCycles('concept', data.concepts.map((c) => [c.id, c.prerequisites])));
  errors.push(...findCycles('card', data.cards.map((c) => [c.id, c.prerequisites])));
  return errors;
}

function validateVisual(v: VisualSpec): string[] {
  const fraction = (n: number, d: number) =>
    Number.isInteger(n) && Number.isInteger(d) && n >= 0 && d > 0 ? [] : [`invalid fraction ${n}/${d}`];
  switch (v.kind) {
    case 'fraction-circle':
    case 'fraction-strip':
      return [...fraction(v.numerator, v.denominator), ...(v.numerator > v.denominator ? [`${v.kind} can't show more than one whole`] : [])];
    case 'fraction-strip-stack':
      return v.strips.flatMap((s) => fraction(s.numerator, s.denominator));
    case 'number-line':
      return [
        ...(v.max > v.min ? [] : ['number line max must exceed min']),
        ...v.marks.flatMap((m) => fraction(m.value.numerator, m.value.denominator)),
      ];
    case 'shaded-grid':
      return v.shaded <= v.rows * v.cols ? [] : ['grid shades more cells than it has'];
    case 'place-value-chart':
      return [
        ...(v.headers.length === v.digits.length ? [] : ['place-value chart headers and digits differ in length']),
        ...(v.highlight ?? []).filter((i) => i < 0 || i >= v.digits.length).map((i) => `highlight index ${i} out of range`),
      ];
    case 'rounding-line':
      return [
        ...(v.max > v.min && v.step > 0 ? [] : ['rounding line needs max > min and step > 0']),
        ...(v.value >= v.min && v.value <= v.max && v.roundsTo >= v.min && v.roundsTo <= v.max ? [] : ['rounding line value outside range']),
      ];
    case 'bar-model':
      return [
        ...(v.bars.length > 0 && v.bars.every((b) => b.segments.length > 0) ? [] : ['bar model needs bars with segments']),
        ...(v.bars.every((b) => b.segments.every((seg) => seg.size > 0)) ? [] : ['bar model segment sizes must be positive']),
      ];
    case 'area-model':
      return [
        ...(v.cells && (v.cells.length !== v.rows.length || v.cells.some((r) => r.length !== v.cols.length))
          ? ['area model cells must be rows × cols']
          : []),
        ...(v.rows.every((r) => r.size > 0) && v.cols.every((c) => c.size > 0) ? [] : ['area model sizes must be positive']),
      ];
    case 'long-division': {
      const last = v.dividend.length - 1;
      const bad = [{ endCol: v.quotientEndCol ?? last }, ...v.steps].filter((s) => s.endCol < 0 || s.endCol > last);
      return bad.length ? ['long division line extends past the dividend'] : [];
    }
    case 'number-grid':
      return [
        ...(v.from <= v.to && v.cols > 0 ? [] : ['number grid needs from <= to and cols > 0']),
        ...[...v.a, ...(v.b ?? [])].filter((n) => n < v.from || n > v.to).map((n) => `number grid highlights ${n} outside ${v.from}–${v.to}`),
      ];
    case 'factor-tree':
      return checkFactorNode(v.root);
    case 'fraction-area-model':
      return v.shadeRows >= 0 && v.shadeRows <= v.rows && v.shadeCols >= 0 && v.shadeCols <= v.cols && v.rows > 0 && v.cols > 0
        ? []
        : ['fraction area model shades more rows/columns than it has'];
    case 'math-machine':
      return v.pairs.length > 0 && v.pairs.length <= 8 ? [] : ['math machine needs 1–8 input/output pairs'];
    case 'balance':
      return v.left.length > 0 && v.right.length > 0 && v.left.length <= 3 && v.right.length <= 3
        ? []
        : ['balance needs 1–3 tiles on each side'];
    case 'integer-line': {
      const errors: string[] = [];
      if (!(v.max > v.min) || v.max - v.min > 30) errors.push('integer line needs min < max and a range of at most 30');
      let at = v.start ?? 0;
      const inRange = (n: number) => Number.isInteger(n) && n >= v.min && n <= v.max;
      if (!inRange(at)) errors.push(`integer line start ${at} is outside ${v.min}..${v.max}`);
      for (const j of v.jumps ?? []) {
        at += j.by;
        if (!inRange(at)) errors.push(`integer line jump lands at ${at}, outside ${v.min}..${v.max}`);
      }
      for (const m of v.marks ?? []) if (!inRange(m.value)) errors.push(`integer line mark ${m.value} is outside the range`);
      return errors;
    }
    case 'counters':
      return [v.positive, v.negative].every((n) => Number.isInteger(n) && n >= 0 && n <= 12) ? [] : ['counters need 0–12 of each color'];
    case 'row':
      return v.items.flatMap(validateVisual);
  }
}

function findCycles(label: string, edges: [string, string[]][]): string[] {
  const graph = new Map(edges);
  const state = new Map<string, 'visiting' | 'done'>();
  const errors: string[] = [];
  const visit = (id: string, path: string[]) => {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'visiting') {
      errors.push(`Prerequisite cycle among ${label}s: ${[...path, id].join(' → ')}`);
      return;
    }
    state.set(id, 'visiting');
    for (const next of graph.get(id) ?? []) visit(next, [...path, id]);
    state.set(id, 'done');
  };
  for (const id of graph.keys()) visit(id, []);
  return errors;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

function checkFactorNode(node: FactorNode): string[] {
  if (!node.children) return isPrime(node.value) ? [] : [`factor tree leaf ${node.value} is not prime`];
  const [a, b] = node.children;
  return [
    ...(a.value * b.value === node.value ? [] : [`factor tree: ${a.value} × ${b.value} ≠ ${node.value}`]),
    ...checkFactorNode(a),
    ...checkFactorNode(b),
  ];
}
