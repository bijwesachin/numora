import type { ShadedGridVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const CELL = 28;

export function ShadedGrid({ rows, cols, shaded, label }: ShadedGridVisual) {
  const width = cols * CELL + 4;
  const height = rows * CELL + 4 + (label ? 30 : 0);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full max-w-xs" role="img" aria-label={`Grid of ${rows * cols} squares with ${shaded} shaded`}>
      {Array.from({ length: rows * cols }, (_, i) => (
        <rect
          key={i}
          x={2 + (i % cols) * CELL}
          y={2 + Math.floor(i / cols) * CELL}
          width={CELL}
          height={CELL}
          fill={i < shaded ? VISUAL_COLORS.filled : VISUAL_COLORS.empty}
          stroke={VISUAL_COLORS.stroke}
          strokeWidth={1.5}
        />
      ))}
      {label && (
        <text x={width / 2} y={rows * CELL + 26} textAnchor="middle" fontSize={14} fill={VISUAL_COLORS.text} fontWeight={600}>
          {label}
        </text>
      )}
    </svg>
  );
}
