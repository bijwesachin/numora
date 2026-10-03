import type { BalanceVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const TILE = 42;
const GAP = 6;
const BEAM_Y = 112;

function Pan({ tiles, cx }: { tiles: string[]; cx: number }) {
  const width = tiles.length * TILE + (tiles.length - 1) * GAP;
  return (
    <g>
      {tiles.map((tile, i) => {
        const unknown = /^[a-z]$/i.test(tile);
        const x = cx - width / 2 + i * (TILE + GAP);
        return (
          <g key={i}>
            <rect x={x} y={BEAM_Y - TILE - 3} width={TILE} height={TILE} rx={8} fill={unknown ? VISUAL_COLORS.empty : '#fde68a'} stroke={unknown ? VISUAL_COLORS.guide : VISUAL_COLORS.stroke} strokeWidth={2.5} strokeDasharray={unknown ? '6 4' : undefined} />
            <text x={x + TILE / 2} y={BEAM_Y - TILE / 2 + 4} textAnchor="middle" fontSize={tile.length > 2 ? 15 : 20} fontWeight={800} fill={unknown ? VISUAL_COLORS.guide : VISUAL_COLORS.text}>
              {tile}
            </text>
          </g>
        );
      })}
      <line x1={cx - 78} x2={cx + 78} y1={BEAM_Y} y2={BEAM_Y} stroke={VISUAL_COLORS.stroke} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
}

export function Balance({ left, right }: BalanceVisual) {
  return (
    <svg viewBox="0 0 360 190" className="h-auto w-full max-w-md" role="img" aria-label={`Balanced scale. Left side: ${left.join(' and ')}. Right side: ${right.join(' and ')}. Both sides are equal.`}>
      <path d={`M180,${BEAM_Y + 4} L158,170 L202,170 Z`} fill="#cbd5e1" stroke={VISUAL_COLORS.stroke} strokeWidth={2.5} strokeLinejoin="round" />
      <line x1={130} x2={230} y1={172} y2={172} stroke={VISUAL_COLORS.stroke} strokeWidth={5} strokeLinecap="round" />
      <Pan tiles={left} cx={82} />
      <Pan tiles={right} cx={278} />
      <text x={180} y={BEAM_Y - 22} textAnchor="middle" fontSize={26} fontWeight={800} fill={VISUAL_COLORS.guide}>
        =
      </text>
    </svg>
  );
}
