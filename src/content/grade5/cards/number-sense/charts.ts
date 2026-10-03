import type { PlaceValueChartVisual } from '@/domain/visual';

const WHOLE_HEADERS = ['Billions', '100 Millions', '10 Millions', 'Millions', '100 Thousands', '10 Thousands', 'Thousands', 'Hundreds', 'Tens', 'Ones'];
const DECIMAL_HEADERS = ['Tenths', 'Hundredths', 'Thousandths'];

/** Chart for a whole number given as plain digits, e.g. wholeChart('52430', [2]). Columns are named from the right. */
export function wholeChart(digits: string, highlight: number[] = [], label?: string): PlaceValueChartVisual {
  return {
    kind: 'place-value-chart',
    headers: WHOLE_HEADERS.slice(WHOLE_HEADERS.length - digits.length),
    digits: [...digits].map((d) => (d === '_' ? '' : d)),
    highlight,
    ...(label ? { label } : {}),
  };
}

/** Chart for a decimal such as '6.275'. Use '_' for a blank cell (e.g. '_4.5'). */
export function decimalChart(value: string, highlight: number[] = [], label?: string): PlaceValueChartVisual {
  const [whole = '', fraction = ''] = value.split('.');
  return {
    kind: 'place-value-chart',
    headers: [...WHOLE_HEADERS.slice(WHOLE_HEADERS.length - whole.length), ...DECIMAL_HEADERS.slice(0, fraction.length)],
    digits: [...whole, ...fraction].map((d) => (d === '_' ? '' : d)),
    highlight,
    decimalAfter: whole.length - 1,
    ...(label ? { label } : {}),
  };
}
