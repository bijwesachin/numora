import type { PlaceValueChartVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const CELL_W = 64;
const HEAD_H = 40;
const CELL_H = 54;

export function PlaceValueChart({ headers, digits, highlight = [], decimalAfter, label }: PlaceValueChartVisual) {
  const width = headers.length * CELL_W + 4;
  const height = HEAD_H + CELL_H + 4 + (label ? 28 : 0);
  const hl = new Set(highlight);
  const readable = digits.map((d) => d || 'blank').join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      style={{ maxWidth: Math.max(160, width * 1.1) }}
      role="img"
      aria-label={`Place-value chart, columns ${headers.join(', ')}; digits ${readable}`}
    >
      {headers.map((h, i) => {
        const x = 2 + i * CELL_W;
        return (
          <g key={i}>
            <rect x={x} y={2} width={CELL_W} height={HEAD_H} fill="#eef2ff" stroke={VISUAL_COLORS.stroke} strokeWidth={1.5} />
            <HeaderText label={h} cx={x + CELL_W / 2} />
            <rect x={x} y={2 + HEAD_H} width={CELL_W} height={CELL_H} fill={hl.has(i) ? VISUAL_COLORS.filled : VISUAL_COLORS.empty} stroke={VISUAL_COLORS.stroke} strokeWidth={1.5} />
            <text x={x + CELL_W / 2} y={2 + HEAD_H + CELL_H / 2 + 10} textAnchor="middle" fontSize={28} fontWeight={700} fill={VISUAL_COLORS.text}>
              {digits[i]}
            </text>
          </g>
        );
      })}
      {decimalAfter !== undefined && (
        <circle cx={2 + (decimalAfter + 1) * CELL_W} cy={2 + HEAD_H + CELL_H - 8} r={5} fill={VISUAL_COLORS.guide} />
      )}
      {label && (
        <text x={width / 2} y={HEAD_H + CELL_H + 26} textAnchor="middle" fontSize={14} fontWeight={600} fill={VISUAL_COLORS.text}>
          {label}
        </text>
      )}
    </svg>
  );
}

/** Long names ("100 Thousands") wrap onto two lines so they fit a column. */
function HeaderText({ label, cx }: { label: string; cx: number }) {
  const mid = 2 + HEAD_H / 2;
  const split = label.length > 8 ? label.indexOf(' ') : -1;
  const lines = split > 0 ? [label.slice(0, split), label.slice(split + 1)] : [label];
  const fontSize = lines.some((l) => l.length > 8) ? 10 : 11.5;
  return (
    <text textAnchor="middle" fontSize={fontSize} fontWeight={600} fill={VISUAL_COLORS.text}>
      {lines.map((line, i) => (
        <tspan key={i} x={cx} y={lines.length === 1 ? mid + 4 : mid - 3 + i * 13}>
          {line}
        </tspan>
      ))}
    </text>
  );
}
