/**
 * Declarative descriptions of educational diagrams. Content authors describe *what*
 * to show; the visuals module decides *how* to draw it as SVG. New diagram kinds
 * (place-value chart, area model, coordinate plane, …) are added by extending this
 * union and registering a renderer.
 */

export interface FractionValue {
  numerator: number;
  denominator: number;
}

/** A pizza / pie cut into equal slices. */
export interface FractionCircleVisual extends FractionValue {
  kind: 'fraction-circle';
  label?: string;
}

/** A chocolate-bar style strip cut into equal pieces. */
export interface FractionStripVisual extends FractionValue {
  kind: 'fraction-strip';
  label?: string;
}

/** Several strips stacked so their lengths can be compared. */
export interface FractionStripStackVisual {
  kind: 'fraction-strip-stack';
  strips: FractionValue[];
  /** Draw a dashed guide at the end of the first strip's shaded part. */
  showAlignment?: boolean;
}

/** A 0 → max number line with optional marked points. */
export interface NumberLineVisual {
  kind: 'number-line';
  min: number;
  max: number;
  /** Equal parts each whole is cut into. */
  partsPerWhole: number;
  marks: { value: FractionValue; label: string; position?: 'above' | 'below' }[];
}

/** A rectangle grid with the first `shaded` cells filled (decimal grids, area). */
export interface ShadedGridVisual {
  kind: 'shaded-grid';
  rows: number;
  cols: number;
  shaded: number;
  label?: string;
}

/**
 * A place-value chart. `headers` and `digits` line up column by column; use empty
 * strings for blank cells. `decimalAfter` draws the decimal point after that column index.
 */
export interface PlaceValueChartVisual {
  kind: 'place-value-chart';
  headers: string[];
  digits: string[];
  highlight?: number[];
  decimalAfter?: number;
  label?: string;
}

/** A plain-number line for rounding: shows where `value` sits and which mark it rounds to. */
export interface RoundingLineVisual {
  kind: 'rounding-line';
  min: number;
  max: number;
  /** Distance between labelled tick marks. */
  step: number;
  value: number;
  roundsTo: number;
  /** Mark the halfway point between the two nearest ticks. */
  showMidpoint?: boolean;
}

/** One labelled piece of a bar model. `size` is relative; `unknown` draws a dashed "?" piece. */
export interface BarSegment {
  label: string;
  size: number;
  tone?: 'filled' | 'empty' | 'unknown';
}

export interface BarRow {
  label?: string;
  segments: BarSegment[];
}

/**
 * A bar model (tape diagram) for word problems. Bars share one scale, so a longer total
 * looks longer. `total` draws a bracket over the first bar.
 */
export interface BarModelVisual {
  kind: 'bar-model';
  bars: BarRow[];
  total?: string;
}

/**
 * Area model for multiplication. Row and column sizes are the place-value parts of the
 * factors (e.g. 23 = 20 + 3); `cells[row][col]` holds each partial product.
 */
export interface AreaModelVisual {
  kind: 'area-model';
  cols: { label: string; size: number }[];
  rows: { label: string; size: number }[];
  cells?: string[][];
  total?: string;
}

/**
 * Long-division layout. Columns are counted from 0 at the first dividend digit; each
 * step line is right-aligned to `endCol`. `rule` underlines the line (a subtraction).
 */
export interface LongDivisionVisual {
  kind: 'long-division';
  divisor: string;
  dividend: string;
  quotient: string;
  /** Column of the quotient's last digit; defaults to the last dividend column. */
  quotientEndCol?: number;
  steps: { text: string; endCol: number; rule?: boolean }[];
}

/** A grid of consecutive numbers with two overlapping highlight sets (multiples, factors, primes). */
export interface NumberGridVisual {
  kind: 'number-grid';
  from: number;
  to: number;
  cols: number;
  a: number[];
  b?: number[];
  labelA?: string;
  labelB?: string;
}

export interface FactorNode {
  value: number;
  children?: [FactorNode, FactorNode];
}

/** A factor tree. Every leaf must be prime and every node must equal the product of its children. */
export interface FactorTreeVisual {
  kind: 'factor-tree';
  root: FactorNode;
}

/**
 * Fraction-times-fraction area model. The unit square has `rows` × `cols` cells; the first
 * `shadeRows` rows show one fraction, the first `shadeCols` columns the other, and the
 * overlap is the product.
 */
export interface FractionAreaModelVisual {
  kind: 'fraction-area-model';
  rows: number;
  cols: number;
  shadeRows: number;
  shadeCols: number;
  label?: string;
}

/**
 * "Math Machine": Input → Rule → Output, with a table of input/output pairs underneath.
 * Set `ruleHidden` to ask the student to find the rule; use "?" for unknown table cells.
 */
export interface MathMachineVisual {
  kind: 'math-machine';
  rule: string;
  ruleHidden?: boolean;
  pairs: { input: string; output: string }[];
}

/**
 * A level balance scale for equations. Each string is one tile on that side; a single
 * letter (like "x") is drawn as an unknown.
 */
export interface BalanceVisual {
  kind: 'balance';
  left: string[];
  right: string[];
}

/**
 * Integer number line with optional jumps: start at `start` and make each jump in turn
 * (positive jumps go right, negative jumps go left). Used for adding and subtracting integers.
 */
export interface IntegerLineVisual {
  kind: 'integer-line';
  min: number;
  max: number;
  start?: number;
  jumps?: { by: number; label?: string }[];
  /** Highlight the landing point after the last jump. Hide it on question sides. */
  showEnd?: boolean;
  marks?: { value: number; label: string }[];
}

/** Two-color counters: yellow +1 chips and red −1 chips. `showPairs` circles each zero pair. */
export interface CountersVisual {
  kind: 'counters';
  positive: number;
  negative: number;
  showPairs?: boolean;
}

/** Lay several visuals side by side with an optional symbol between them. */
export interface VisualRow {
  kind: 'row';
  items: VisualSpec[];
  separator?: '=' | '≠' | '→' | 'vs';
}

export type VisualSpec =
  | FractionCircleVisual
  | FractionStripVisual
  | FractionStripStackVisual
  | NumberLineVisual
  | ShadedGridVisual
  | PlaceValueChartVisual
  | RoundingLineVisual
  | BarModelVisual
  | AreaModelVisual
  | LongDivisionVisual
  | NumberGridVisual
  | FactorTreeVisual
  | FractionAreaModelVisual
  | MathMachineVisual
  | BalanceVisual
  | IntegerLineVisual
  | CountersVisual
  | VisualRow;

export type VisualKind = VisualSpec['kind'];
