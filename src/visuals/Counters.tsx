import type { CountersVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const COL = 38;
const R = 14;
const POS = '#facc15';
const NEG = '#f43f5e';

function Chip({ cx, cy, positive }: { cx: number; cy: number; positive: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={R} fill={positive ? POS : NEG} stroke={VISUAL_COLORS.stroke} strokeWidth={1.8} />
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize={18} fontWeight={900} fill={positive ? VISUAL_COLORS.text : '#fff'}>
        {positive ? '+' : '−'}
      </text>
    </g>
  );
}

/** Yellow +1 and red −1 counters, lined up so each + sits above a −; matched columns are zero pairs. */
export function Counters({ positive, negative, showPairs = false }: CountersVisual) {
  const pairs = Math.min(positive, negative);
  const cols = Math.max(positive, negative, 1);
  const width = Math.max(cols * COL + 24, 220);
  const x0 = (width - cols * COL) / 2;
  const cx = (i: number) => x0 + i * COL + COL / 2;
  const topY = 26;
  const bottomY = 70;
  const leftover = positive - negative;

  return (
    <svg
      viewBox={`0 0 ${width} 130`}
      className="h-auto w-full"
      style={{ maxWidth: Math.max(width * 1.2, 260) }}
      role="img"
      aria-label={`${positive} positive counters and ${negative} negative counters${showPairs ? `; ${pairs} zero pairs cancel, leaving ${leftover === 0 ? 'nothing' : `${Math.abs(leftover)} ${leftover > 0 ? 'positive' : 'negative'}`}` : ''}`}
    >
      {showPairs &&
        Array.from({ length: pairs }, (_, i) => (
          <rect key={`p${i}`} x={cx(i) - R - 4} y={topY - R - 4} width={2 * R + 8} height={bottomY - topY + 2 * R + 8} rx={12} fill="none" stroke={VISUAL_COLORS.guide} strokeWidth={2} strokeDasharray="5 4" />
        ))}
      {Array.from({ length: positive }, (_, i) => (
        <Chip key={`+${i}`} cx={cx(i)} cy={topY} positive />
      ))}
      {Array.from({ length: negative }, (_, i) => (
        <Chip key={`-${i}`} cx={cx(i)} cy={bottomY} positive={false} />
      ))}
      {showPairs && pairs > 0 && (
        <text x={cx((pairs - 1) / 2)} y={bottomY + R + 26} textAnchor="middle" fontSize={12} fontWeight={700} fill={VISUAL_COLORS.guide}>
          {pairs} zero pair{pairs === 1 ? '' : 's'} = 0
        </text>
      )}
      {!showPairs && (
        <g transform={`translate(${width / 2 - 70}, ${bottomY + R + 12})`}>
          <Chip cx={10} cy={10} positive />
          <text x={30} y={15} fontSize={12} fontWeight={600} fill={VISUAL_COLORS.text}>
            = +1
          </text>
          <Chip cx={90} cy={10} positive={false} />
          <text x={110} y={15} fontSize={12} fontWeight={600} fill={VISUAL_COLORS.text}>
            = −1
          </text>
        </g>
      )}
    </svg>
  );
}
