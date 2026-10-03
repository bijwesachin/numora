import type { ShadedGridVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const CELL = 28;
const LABEL_CHAR_W = 8;

export function ShadedGrid({ rows, cols, shaded, label }: ShadedGridVisual) {
  const gridW = cols * CELL + 4;
  // Make room for the label even when the grid itself is tiny (e.g. 2 × 2).
  const width = Math.max(gridW, label ? label.length * LABEL_CHAR_W + 16 : 0);
  const x0 = (width - gridW) / 2;
  const height = rows * CELL + 4 + (label ? 30 : 0);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      style={{ maxWidth: Math.min(320, width * 1.4) }}
      role="img"
      aria-label={`Grid of ${rows * cols} squares with ${shaded} shaded`}
    >
      {Array.from({ length: rows * cols }, (_, i) => (
        <rect
          key={i}
          x={x0 + 2 + (i % cols) * CELL}
          y={2 + Math.floor(i / cols) * CELL}
          width={CELL}
          height={CELL}
          fill={i < shaded ? VISUAL_COLORS.filled : VISUAL_COLORS.empty}
          stroke={VISUAL_COLORS.stroke}
          strokeWidth={1.5}
        />
      ))}
      {label && (
        <text x={width / 2} y={rows * CELL + 26} textAnchor="middle" fontSize={14} fontWeight={600} fill={VISUAL_COLORS.text}>
          {label}
        </text>
      )}
    </svg>
  );
}
