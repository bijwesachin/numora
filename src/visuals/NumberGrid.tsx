import type { NumberGridVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const CELL = 36;
const COLOR_A = '#fcd34d';
const COLOR_B = '#7dd3fc';
const COLOR_BOTH = '#6ee7b7';

export function NumberGrid({ from, to, cols, a, b = [], labelA, labelB }: NumberGridVisual) {
  const count = to - from + 1;
  const rows = Math.ceil(count / cols);
  const inA = new Set(a);
  const inB = new Set(b);
  const legend = [labelA && { label: labelA, color: COLOR_A }, labelB && { label: labelB, color: COLOR_B }, labelA && labelB && { label: 'both', color: COLOR_BOTH }].filter(
    (x): x is { label: string; color: string } => !!x,
  );
  const width = cols * CELL + 4;
  const height = rows * CELL + 4 + (legend.length ? 30 : 0);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      style={{ maxWidth: width * 1.2 }}
      role="img"
      aria-label={`Number grid ${from} to ${to}. ${labelA ?? 'Highlighted'}: ${a.join(', ')}${b.length ? `. ${labelB ?? 'Second set'}: ${b.join(', ')}` : ''}`}
    >
      {Array.from({ length: count }, (_, i) => {
        const n = from + i;
        const hitA = inA.has(n);
        const hitB = inB.has(n);
        const fill = hitA && hitB ? COLOR_BOTH : hitA ? COLOR_A : hitB ? COLOR_B : VISUAL_COLORS.empty;
        const x = 2 + (i % cols) * CELL;
        const y = 2 + Math.floor(i / cols) * CELL;
        return (
          <g key={n}>
            <rect x={x} y={y} width={CELL} height={CELL} fill={fill} stroke={VISUAL_COLORS.stroke} strokeWidth={1.2} />
            <text x={x + CELL / 2} y={y + CELL / 2 + 5} textAnchor="middle" fontSize={n >= 100 ? 11 : 14} fontWeight={hitA || hitB ? 700 : 500} fill={hitA || hitB ? VISUAL_COLORS.text : VISUAL_COLORS.muted}>
              {n}
            </text>
          </g>
        );
      })}
      {legend.map((item, i) => {
        const x = 4 + i * 96;
        const y = rows * CELL + 14;
        return (
          <g key={item.label}>
            <rect x={x} y={y} width={14} height={14} fill={item.color} stroke={VISUAL_COLORS.stroke} strokeWidth={1.2} />
            <text x={x + 20} y={y + 12} fontSize={12} fontWeight={600} fill={VISUAL_COLORS.text}>
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
