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
  | VisualRow;

export type VisualKind = VisualSpec['kind'];
