import type { AreaModelVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const LEFT = 52;
const TOP = 30;
const GRID_W = 270;
const GRID_H = 150;
const MIN_SHARE = 0.17;
const TONES = ['#fde68a', '#bae6fd', '#bbf7d0', '#fbcfe8'];

/** Proportional shares with a floor, so a "3" next to a "20" is still big enough to label. */
function shares(sizes: number[]): number[] {
  const sum = sizes.reduce((a, b) => a + b, 0);
  const raw = sizes.map((s) => Math.max(s / sum, MIN_SHARE));
  const norm = raw.reduce((a, b) => a + b, 0);
  return raw.map((r) => r / norm);
}

export function AreaModel({ cols, rows, cells, total }: AreaModelVisual) {
  const cw = shares(cols.map((c) => c.size)).map((s) => s * GRID_W);
  const rh = shares(rows.map((r) => r.size)).map((s) => s * GRID_H);
  const height = TOP + GRID_H + 12 + (total ? 26 : 0);
  let y = TOP;

  const description = `Area model with columns ${cols.map((c) => c.label).join(' and ')} and rows ${rows.map((r) => r.label).join(' and ')}${
    cells ? `; pieces ${cells.flat().join(', ')}` : ''
  }${total ? `; total ${total}` : ''}`;

  return (
    <svg viewBox={`0 0 ${LEFT + GRID_W + 10} ${height}`} className="h-auto w-full max-w-md" role="img" aria-label={description}>
      {rows.map((row, r) => {
        const y0 = y;
        y += rh[r]!;
        let x = LEFT;
        return (
          <g key={r}>
            <text x={LEFT - 8} y={y0 + rh[r]! / 2 + 5} textAnchor="end" fontSize={14} fontWeight={700} fill={VISUAL_COLORS.text}>
              {row.label}
            </text>
            {cols.map((_, c) => {
              const x0 = x;
              x += cw[c]!;
              return (
                <g key={c}>
                  <rect x={x0} y={y0} width={cw[c]} height={rh[r]} fill={TONES[(r * 2 + c) % TONES.length]} stroke={VISUAL_COLORS.stroke} strokeWidth={2} />
                  {cells?.[r]?.[c] !== undefined && (
                    <text x={x0 + cw[c]! / 2} y={y0 + rh[r]! / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={VISUAL_COLORS.text}>
                      {cells[r]![c]}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
      {(() => {
        let x = LEFT;
        return cols.map((col, c) => {
          const x0 = x;
          x += cw[c]!;
          return (
            <text key={c} x={x0 + cw[c]! / 2} y={TOP - 10} textAnchor="middle" fontSize={14} fontWeight={700} fill={VISUAL_COLORS.text}>
              {col.label}
            </text>
          );
        });
      })()}
      {total && (
        <text x={LEFT + GRID_W / 2} y={TOP + GRID_H + 28} textAnchor="middle" fontSize={15} fontWeight={700} fill={VISUAL_COLORS.guide}>
          {total}
        </text>
      )}
    </svg>
  );
}
