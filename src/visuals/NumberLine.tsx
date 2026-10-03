import type { NumberLineVisual } from '@/domain/visual';
import { SvgLabel, VISUAL_COLORS } from './svgParts';

const X0 = 24;
const X1 = 336;
const AXIS_Y = 70;

export function NumberLine({ min, max, partsPerWhole, marks }: NumberLineVisual) {
  const totalParts = Math.round((max - min) * partsPerWhole);
  const xFor = (value: number) => X0 + ((value - min) / (max - min)) * (X1 - X0);

  return (
    <svg viewBox="0 0 360 140" className="h-auto w-full max-w-md" role="img" aria-label={`Number line from ${min} to ${max} marking ${marks.map((m) => m.label).join(' and ')}`}>
      <line x1={X0 - 10} x2={X1 + 10} y1={AXIS_Y} y2={AXIS_Y} stroke={VISUAL_COLORS.stroke} strokeWidth={2.5} strokeLinecap="round" />
      {Array.from({ length: totalParts + 1 }, (_, i) => {
        const x = X0 + (i / totalParts) * (X1 - X0);
        const isWhole = i % partsPerWhole === 0;
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={AXIS_Y - (isWhole ? 12 : 7)} y2={AXIS_Y + (isWhole ? 12 : 7)} stroke={VISUAL_COLORS.stroke} strokeWidth={isWhole ? 2.5 : 1.5} />
            {isWhole && (
              <text x={x} y={AXIS_Y + 32} textAnchor="middle" fontSize={15} fill={VISUAL_COLORS.muted} fontWeight={600}>
                {min + i / partsPerWhole}
              </text>
            )}
          </g>
        );
      })}
      {marks.map((m, i) => {
        const x = xFor(m.value.numerator / m.value.denominator);
        const above = (m.position ?? 'above') === 'above';
        return (
          <g key={i}>
            <circle cx={x} cy={AXIS_Y} r={6} fill={VISUAL_COLORS.filled} stroke={VISUAL_COLORS.stroke} strokeWidth={1.5} />
            <SvgLabel x={x} y={above ? AXIS_Y - 40 : AXIS_Y + 44} text={m.label} />
          </g>
        );
      })}
    </svg>
  );
}
