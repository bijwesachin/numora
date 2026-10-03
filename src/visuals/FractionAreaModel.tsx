import type { FractionAreaModelVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const ROW_ONLY = '#fcd34d';
const COL_ONLY = '#7dd3fc';
const BOTH = '#6ee7b7';

export function FractionAreaModel({ rows, cols, shadeRows, shadeCols, label }: FractionAreaModelVisual) {
  const cell = Math.min(44, 280 / cols);
  const gridW = cols * cell;
  const gridH = rows * cell;
  const legendY = gridH + 18;
  const width = Math.max(gridW + 4, 250);
  const height = legendY + 26 + (label ? 26 : 0);
  const x0 = (width - gridW) / 2;
  const overlap = shadeRows * shadeCols;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      style={{ maxWidth: width * 1.4 }}
      role="img"
      aria-label={`Area model: a square cut into ${rows} rows and ${cols} columns. ${shadeRows} rows and ${shadeCols} columns are shaded; ${overlap} of ${rows * cols} cells overlap.`}
    >
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const inRow = r < shadeRows;
        const inCol = c < shadeCols;
        const fill = inRow && inCol ? BOTH : inRow ? ROW_ONLY : inCol ? COL_ONLY : VISUAL_COLORS.empty;
        return <rect key={i} x={x0 + c * cell} y={2 + r * cell} width={cell} height={cell} fill={fill} stroke={VISUAL_COLORS.stroke} strokeWidth={1.4} />;
      })}
      <rect x={x0} y={2} width={gridW} height={gridH} fill="none" stroke={VISUAL_COLORS.stroke} strokeWidth={3} />
      {[
        { color: ROW_ONLY, text: 'rows' },
        { color: COL_ONLY, text: 'columns' },
        { color: BOTH, text: 'overlap' },
      ].map((item, i) => (
        <g key={item.text} transform={`translate(${width / 2 - 100 + i * 72}, ${legendY})`}>
          <rect width={12} height={12} fill={item.color} stroke={VISUAL_COLORS.stroke} strokeWidth={1.2} />
          <text x={17} y={11} fontSize={10.5} fontWeight={600} fill={VISUAL_COLORS.text}>
            {item.text}
          </text>
        </g>
      ))}
      {label && (
        <text x={width / 2} y={legendY + 44} textAnchor="middle" fontSize={14} fontWeight={700} fill={VISUAL_COLORS.guide}>
          {label}
        </text>
      )}
    </svg>
  );
}
