import type { Difficulty } from './flashcard';
import { masteryScore } from './review/mastery';
import type { CardProgress, Rating } from './review/types';
import type { VisualSpec } from './visual';

/**
 * Times tables 2–15. Pure helpers shared by the flashcard content, the Explorer and the
 * Fact Sprint game, so a fact means the same thing (id, difficulty, trick) everywhere.
 */

export const MIN_FACTOR = 2;
export const MAX_FACTOR = 15;
export const TABLES: readonly number[] = Array.from({ length: MAX_FACTOR - MIN_FACTOR + 1 }, (_, i) => i + MIN_FACTOR);

export interface Fact {
  a: number;
  b: number;
  product: number;
}

export function fact(a: number, b: number): Fact {
  return { a, b, product: a * b };
}

/** Card id for the fact a × b, living in the "× a" table deck: `tt-7-008` is 7 × 8. */
export function factCardId(a: number, b: number): string {
  return `tt-${a}-${String(b).padStart(3, '0')}`;
}

export function parseFactCardId(id: string): Fact | undefined {
  const m = /^tt-(\d+)-(\d{3})$/.exec(id);
  if (!m) return undefined;
  const a = Number(m[1]);
  const b = Number(m[2]);
  return b >= MIN_FACTOR ? fact(a, b) : undefined;
}

export const tableConceptId = (table: number) => `tt-${table}`;

/** How hard each table feels, 1 (easy) – 4 (hard). */
const TABLE_DIFFICULTY: Record<number, Difficulty> = {
  2: 1, 5: 1, 10: 1,
  3: 2, 4: 2, 11: 2,
  6: 3, 9: 3, 12: 3, 7: 3, 8: 3,
  13: 4, 14: 4, 15: 4,
};

export function factDifficulty(a: number, b: number): Difficulty {
  const hardest = Math.max(TABLE_DIFFICULTY[a] ?? 3, TABLE_DIFFICULTY[b] ?? 3) as Difficulty;
  // Anything times 2 or 10 stays easy, however big the other number is.
  if (a === 2 || b === 2 || a === 10 || b === 10) return Math.min(hardest, 2) as Difficulty;
  return hardest;
}

export interface Strategy {
  name: string;
  tip: string;
  steps: string[];
  isSquare: boolean;
}

/**
 * A mental-math trick for a × b with worked numbers. The friendliest factor wins: tens,
 * doubles and halves first; big factors (12–15) are split into 10 + a small number.
 */
export function factStrategy(a: number, b: number): Strategy {
  const p = a * b;
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  const isSquare = a === b;
  const other = (n: number) => (a === n ? b : a);
  const make = (name: string, tip: string, steps: string[]): Strategy => ({ name, tip, steps, isSquare });

  if (a === 1 || b === 1) {
    return make('Times 1', 'Any number times 1 stays the same.', [`${other(1)} × 1 = ${p}`]);
  }
  if (a === 10 || b === 10) {
    const o = other(10);
    return make('Add a zero', 'Times 10: write the number, then put a zero on the end.', [`${o} × 10 = ${o * 10}`]);
  }
  if (small === 2) {
    return make('Doubles', 'Times 2 means double it.', [`${big} + ${big} = ${p}`]);
  }
  if (a === 5 || b === 5) {
    const o = other(5);
    return make('Half of × 10', 'Times 5 is half of times 10.', [`${o} × 10 = ${o * 10}`, `Half of ${o * 10} = ${p}`]);
  }
  if (a === 11 || b === 11) {
    const o = other(11);
    if (o <= 9) return make('Repeat the digit', '11 times a single digit just repeats the digit.', [`11 × ${o} = ${o}${o}`]);
    return make('× 10 plus one more', 'Times 11 is times 10 plus one more group.', [
      `${o} × 10 = ${o * 10}`,
      `${o * 10} + ${o} = ${p}`,
    ]);
  }
  if (big >= 12) {
    const r = big - 10;
    return make(`Split ${big} into 10 + ${r}`, `Break ${big} into 10 and ${r}, multiply each part, then add.`, [
      `${small} × 10 = ${small * 10}`,
      `${small} × ${r} = ${small * r}`,
      `${small * 10} + ${small * r} = ${p}`,
    ]);
  }
  if (a === 9 || b === 9) {
    const o = other(9);
    return make('× 10 minus one group', 'Times 9 is times 10 take away one group.', [`${o} × 10 = ${o * 10}`, `${o * 10} − ${o} = ${p}`]);
  }
  if (a === 4 || b === 4) {
    const o = other(4);
    return make('Double, then double again', 'Times 4 is double, then double again.', [`${o} × 2 = ${o * 2}`, `${o * 2} × 2 = ${p}`]);
  }
  if (a === 3 || b === 3) {
    const o = other(3);
    return make('Double plus one more', 'Times 3 is double it, then add one more group.', [`${o} × 2 = ${o * 2}`, `${o * 2} + ${o} = ${p}`]);
  }
  if (a === 8 || b === 8) {
    const o = other(8);
    return make('Double three times', 'Times 8 is double, double, double.', [`${o} × 2 = ${o * 2}`, `${o * 2} × 2 = ${o * 4}`, `${o * 4} × 2 = ${p}`]);
  }
  if (a === 6 || b === 6) {
    const o = other(6);
    return make('× 5 plus one more', 'Times 6 is times 5 plus one more group.', [`${o} × 5 = ${o * 5}`, `${o * 5} + ${o} = ${p}`]);
  }
  // Only 7 × 7 is left.
  return make('× 5 plus × 2', 'Split 7 into 5 and 2.', [`${a} × 5 = ${a * 5}`, `${a} × 2 = ${a * 2}`, `${a * 5} + ${a * 2} = ${p}`]);
}

/**
 * A picture of the fact: an array of dots for facts up to 10 × 10, otherwise an area model
 * that splits the bigger factor into 10 + the rest.
 */
export function factVisual(a: number, b: number): VisualSpec {
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  if (big <= 10) return { kind: 'shaded-grid', rows: a, cols: b, shaded: a * b, label: `${a} rows of ${b}` };
  const r = big - 10;
  return {
    kind: 'area-model',
    cols: [{ label: '10', size: 10 }, { label: String(r), size: r }],
    rows: [{ label: String(small), size: small }],
    cells: [[String(small * 10), String(small * r)]],
    total: `${small * 10} + ${small * r} = ${a * b}`,
  };
}

function swapDigits(n: number): number | undefined {
  const s = String(n);
  if (s.length !== 2 || s[0] === s[1]) return undefined;
  return Number(s[1]! + s[0]!);
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * Three wrong answers that look like real mistakes: a neighbouring fact, off by ten,
 * adding instead of multiplying, or swapped digits.
 */
export function distractors(a: number, b: number, random: () => number = Math.random): number[] {
  const p = a * b;
  const candidates = [a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, p + 10, p - 10, a + b, swapDigits(p)];
  const pool = [...new Set(candidates.filter((n): n is number => n !== undefined && n > 0 && n !== p))];
  for (let step = 1; pool.length < 3; step++) {
    for (const n of [p + step, p - step]) if (n > 0 && !pool.includes(n)) pool.push(n);
  }
  return shuffle(pool, random).slice(0, 3);
}

/** Answer choices: the product plus three distractors, in random order. */
export function answerChoices(a: number, b: number, random: () => number = Math.random): number[] {
  return shuffle([a * b, ...distractors(a, b, random)], random);
}

export type SprintMode = 'choose' | 'type';

/**
 * Turn a sprint answer into a spaced-repetition rating. A slow correct answer means the fact
 * isn't automatic yet. Picking from choices is easier than recalling, so it can't earn "easy".
 */
export function rateAnswer(correct: boolean, ms: number, mode: SprintMode): Rating {
  if (!correct) return 'again';
  if (mode === 'type' && ms < 2000) return 'easy';
  return ms < 4000 ? 'good' : 'hard';
}

/**
 * Pick facts for a sprint from the chosen tables, favouring facts the student hasn't seen,
 * got wrong, or found hard. Repeats only when the round is longer than the pool.
 */
export function pickSprintFacts(
  tables: readonly number[],
  progress: Readonly<Record<string, CardProgress>>,
  count: number,
  random: () => number = Math.random,
): Fact[] {
  const pool: { f: Fact; weight: number }[] = [];
  for (const a of tables) {
    for (let b = MIN_FACTOR; b <= MAX_FACTOR; b++) {
      const p = progress[factCardId(a, b)];
      let weight = 100 - masteryScore(p);
      if (p?.lastRating === 'again') weight += 60;
      else if (p?.lastRating === 'hard') weight += 30;
      weight += random() * 25;
      pool.push({ f: fact(a, b), weight });
    }
  }
  if (pool.length === 0) return [];
  const ranked = pool.sort((x, y) => y.weight - x.weight).map((x) => x.f);
  const picked = Array.from({ length: count }, (_, i) => ranked[i % ranked.length]!);
  return shuffle(picked, random);
}
