import type { RoundingLineVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const X0 = 30;
const X1 = 330;
const AXIS_Y = 62;

const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 4 });

export function RoundingLine({ min, max, step, value, roundsTo, showMidpoint }: RoundingLineVisual) {
  const xFor = (n: number) => X0 + ((n - min) / (max - min)) * (X1 - X0);
  const count = Math.round((max - min) / step);
  const lower = Math.floor((value - min) / step + 1e-9) * step + min;
  const mid = lower + step / 2;

  return (
    <svg viewBox="0 0 360 120" className="h-auto w-full max-w-md" role="img" aria-label={`Number line from ${fmt(min)} to ${fmt(max)}: ${fmt(value)} is closest to ${fmt(roundsTo)}`}>
      <line x1={X0 - 12} x2={X1 + 12} y1={AXIS_Y} y2={AXIS_Y} stroke={VISUAL_COLORS.stroke} strokeWidth={2.5} strokeLinecap="round" />
      {Array.from({ length: count + 1 }, (_, i) => {
        const n = min + i * step;
        const x = xFor(n);
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={AXIS_Y - 10} y2={AXIS_Y + 10} stroke={VISUAL_COLORS.stroke} strokeWidth={2.5} />
            <text x={x} y={AXIS_Y + 30} textAnchor="middle" fontSize={13} fontWeight={n === roundsTo ? 700 : 500} fill={n === roundsTo ? VISUAL_COLORS.guide : VISUAL_COLORS.muted}>
              {fmt(n)}
            </text>
          </g>
        );
      })}
      {showMidpoint && mid < max && (
        <g>
          <line x1={xFor(mid)} x2={xFor(mid)} y1={AXIS_Y - 20} y2={AXIS_Y + 8} stroke={VISUAL_COLORS.guide} strokeWidth={2} strokeDasharray="4 3" />
          <text x={xFor(mid)} y={AXIS_Y - 26} textAnchor="middle" fontSize={11} fill={VISUAL_COLORS.guide} fontWeight={600}>
            halfway {fmt(mid)}
          </text>
        </g>
      )}
      <circle cx={xFor(roundsTo)} cy={AXIS_Y} r={11} fill="none" stroke={VISUAL_COLORS.guide} strokeWidth={2.5} />
      <circle cx={xFor(value)} cy={AXIS_Y} r={6} fill={VISUAL_COLORS.filled} stroke={VISUAL_COLORS.stroke} strokeWidth={1.5} />
      <text x={xFor(value)} y={AXIS_Y + 56} textAnchor="middle" fontSize={14} fontWeight={700} fill={VISUAL_COLORS.text}>
        {fmt(value)}
      </text>
    </svg>
  );
}
