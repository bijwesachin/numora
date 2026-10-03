import type { FractionCircleVisual } from '@/domain/visual';
import { fractionWords, SvgLabel, VISUAL_COLORS } from './svgParts';

const R = 52;
const C = 60;

function point(angle: number): [number, number] {
  return [C + R * Math.cos(angle), C + R * Math.sin(angle)];
}

/** A pizza cut into `denominator` equal slices with `numerator` shaded, starting at 12 o'clock. */
export function FractionCircle({ numerator, denominator, label }: FractionCircleVisual) {
  const slices = Array.from({ length: denominator }, (_, i) => {
    const a0 = -Math.PI / 2 + (2 * Math.PI * i) / denominator;
    const a1 = -Math.PI / 2 + (2 * Math.PI * (i + 1)) / denominator;
    const [x0, y0] = point(a0);
    const [x1, y1] = point(a1);
    const largeArc = a1 - a0 > Math.PI ? 1 : 0;
    return { d: `M${C},${C} L${x0},${y0} A${R},${R} 0 ${largeArc} 1 ${x1},${y1} Z`, filled: i < numerator };
  });
  const height = label ? 160 : 120;

  return (
    <svg viewBox={`0 0 120 ${height}`} className="h-auto w-28 sm:w-32" role="img" aria-label={`Circle: ${fractionWords(numerator, denominator)}`}>
      {denominator === 1 ? (
        <circle cx={C} cy={C} r={R} fill={numerator ? VISUAL_COLORS.filled : VISUAL_COLORS.empty} stroke={VISUAL_COLORS.stroke} strokeWidth={2} />
      ) : (
        slices.map((s, i) => (
          <path key={i} d={s.d} fill={s.filled ? VISUAL_COLORS.filled : VISUAL_COLORS.empty} stroke={VISUAL_COLORS.stroke} strokeWidth={2} strokeLinejoin="round" />
        ))
      )}
      {label && <SvgLabel x={C} y={140} text={label} />}
    </svg>
  );
}
