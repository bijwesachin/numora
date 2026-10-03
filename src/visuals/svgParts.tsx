export const VISUAL_COLORS = {
  filled: '#f59e0b',
  empty: '#ffffff',
  stroke: '#334155',
  guide: '#4f46e5',
  text: '#1e293b',
  muted: '#64748b',
} as const;

const FRACTION_LABEL = /^(\d+)\/(\d+)$/;

/**
 * Text label for SVG diagrams. "3/4" is drawn as a stacked fraction centred on
 * (x, y); anything else is drawn as plain text. Prefix text ("Maya 2/8") is kept.
 */
export function SvgLabel({ x, y, text, size = 15 }: { x: number; y: number; text: string; size?: number }) {
  const [prefix, last] = splitLast(text);
  const match = FRACTION_LABEL.exec(last);
  if (!match) {
    return (
      <text x={x} y={y + size / 3} textAnchor="middle" fontSize={size} fill={VISUAL_COLORS.text} fontWeight={600}>
        {text}
      </text>
    );
  }
  const [, num, den] = match;
  const barHalf = Math.max(num!.length, den!.length) * size * 0.33 + 3;
  // Centre "prefix + fraction" as one group, estimating glyph width.
  const prefixW = prefix ? prefix.length * size * 0.58 + 6 : 0;
  const startX = x - (prefixW + 2 * barHalf) / 2;
  const fracX = prefix ? startX + prefixW + barHalf : x;
  return (
    <g fill={VISUAL_COLORS.text} fontSize={size} fontWeight={600} textAnchor="middle">
      {prefix && (
        <text x={startX} y={y + size / 3} textAnchor="start">
          {prefix}
        </text>
      )}
      <text x={fracX} y={y - 4}>
        {num}
      </text>
      <line x1={fracX - barHalf} x2={fracX + barHalf} y1={y} y2={y} stroke={VISUAL_COLORS.text} strokeWidth={1.6} />
      <text x={fracX} y={y + size}>
        {den}
      </text>
    </g>
  );
}

function splitLast(text: string): [string, string] {
  const i = text.lastIndexOf(' ');
  return i === -1 ? ['', text] : [text.slice(0, i), text.slice(i + 1)];
}

export function fractionWords(numerator: number, denominator: number): string {
  return `${numerator} out of ${denominator} equal parts shaded`;
}
