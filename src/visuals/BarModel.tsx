import type { BarModelVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const W = 360;
const BAR_H = 38;
const GAP = 14;

export function BarModel({ bars, total }: BarModelVisual) {
  const hasLabels = bars.some((b) => b.label);
  const barX = hasLabels ? 74 : 10;
  const barW = W - barX - 10;
  const top = total ? 34 : 8;
  const height = top + bars.length * BAR_H + (bars.length - 1) * GAP + 10;
  const longest = Math.max(...bars.map((b) => b.segments.reduce((sum, s) => sum + s.size, 0)));
  const scale = barW / longest;
  const firstWidth = bars[0]!.segments.reduce((sum, s) => sum + s.size, 0) * scale;

  const description = bars
    .map((b) => `${b.label ? `${b.label}: ` : ''}${b.segments.map((s) => s.label).join(', ')}`)
    .join('; ');

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="h-auto w-full max-w-md" role="img" aria-label={`Bar model. ${description}${total ? `. Total ${total}` : ''}`}>
      {total && (
        <g>
          <path
            d={`M${barX},${top - 8} v-6 h${firstWidth} v6`}
            fill="none"
            stroke={VISUAL_COLORS.stroke}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <text x={barX + firstWidth / 2} y={top - 19} textAnchor="middle" fontSize={14} fontWeight={700} fill={VISUAL_COLORS.text}>
            {total}
          </text>
        </g>
      )}
      {bars.map((bar, row) => {
        const y = top + row * (BAR_H + GAP);
        let x = barX;
        return (
          <g key={row}>
            {bar.label && (
              <text x={barX - 8} y={y + BAR_H / 2 + 5} textAnchor="end" fontSize={13} fontWeight={600} fill={VISUAL_COLORS.text}>
                {bar.label}
              </text>
            )}
            {bar.segments.map((seg, i) => {
              const w = seg.size * scale;
              const x0 = x;
              x += w;
              const tone = seg.tone ?? 'filled';
              return (
                <g key={i}>
                  <rect
                    x={x0}
                    y={y}
                    width={w}
                    height={BAR_H}
                    fill={tone === 'filled' ? VISUAL_COLORS.filled : VISUAL_COLORS.empty}
                    stroke={tone === 'unknown' ? VISUAL_COLORS.guide : VISUAL_COLORS.stroke}
                    strokeWidth={2}
                    strokeDasharray={tone === 'unknown' ? '6 4' : undefined}
                  />
                  <text
                    x={x0 + w / 2}
                    y={y + BAR_H / 2 + 5}
                    textAnchor="middle"
                    fontSize={w < 34 ? 11 : 14}
                    fontWeight={700}
                    fill={tone === 'unknown' ? VISUAL_COLORS.guide : VISUAL_COLORS.text}
                  >
                    {seg.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
