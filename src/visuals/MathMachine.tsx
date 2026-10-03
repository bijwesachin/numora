import type { MathMachineVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const W = 360;

export function MathMachine({ rule, ruleHidden = false, pairs }: MathMachineVisual) {
  const cell = Math.min(52, (W - 90) / pairs.length);
  const tableX = 70;
  const tableY = 104;
  const height = tableY + 76;

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className="h-auto w-full max-w-md"
      role="img"
      aria-label={`Math machine with rule ${ruleHidden ? 'hidden' : rule}. ${pairs.map((p) => `${p.input} becomes ${p.output}`).join(', ')}`}
    >
      <defs>
        <marker id="mm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={VISUAL_COLORS.stroke} />
        </marker>
      </defs>
      <text x={34} y={50} textAnchor="middle" fontSize={14} fontWeight={700} fill={VISUAL_COLORS.muted}>
        IN
      </text>
      <line x1={58} y1={44} x2={116} y2={44} stroke={VISUAL_COLORS.stroke} strokeWidth={2.5} markerEnd="url(#mm-arrow)" />
      <rect x={120} y={12} width={120} height={64} rx={14} fill={ruleHidden ? VISUAL_COLORS.empty : '#fde68a'} stroke={ruleHidden ? VISUAL_COLORS.guide : VISUAL_COLORS.stroke} strokeWidth={3} strokeDasharray={ruleHidden ? '7 5' : undefined} />
      <text x={180} y={52} textAnchor="middle" fontSize={ruleHidden ? 34 : 24} fontWeight={800} fill={ruleHidden ? VISUAL_COLORS.guide : VISUAL_COLORS.text}>
        {ruleHidden ? '?' : rule}
      </text>
      <line x1={244} y1={44} x2={302} y2={44} stroke={VISUAL_COLORS.stroke} strokeWidth={2.5} markerEnd="url(#mm-arrow)" />
      <text x={330} y={50} textAnchor="middle" fontSize={14} fontWeight={700} fill={VISUAL_COLORS.muted}>
        OUT
      </text>

      {(['Input', 'Output'] as const).map((label, row) => {
        const y = tableY + row * 34;
        return (
          <g key={label}>
            <text x={tableX - 8} y={y + 22} textAnchor="end" fontSize={13} fontWeight={700} fill={VISUAL_COLORS.text}>
              {label}
            </text>
            {pairs.map((p, i) => {
              const value = row === 0 ? p.input : p.output;
              const unknown = value === '?';
              return (
                <g key={i}>
                  <rect x={tableX + i * cell} y={y} width={cell} height={32} fill={row === 0 ? '#e0e7ff' : unknown ? VISUAL_COLORS.empty : '#fef3c7'} stroke={unknown ? VISUAL_COLORS.guide : VISUAL_COLORS.stroke} strokeWidth={2} strokeDasharray={unknown ? '5 3' : undefined} />
                  <text x={tableX + i * cell + cell / 2} y={y + 22} textAnchor="middle" fontSize={16} fontWeight={700} fill={unknown ? VISUAL_COLORS.guide : VISUAL_COLORS.text}>
                    {value}
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
