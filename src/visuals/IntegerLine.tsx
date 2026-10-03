import type { IntegerLineVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const X0 = 22;
const X1 = 338;
const AXIS_Y = 96;
const RIGHT = '#059669';
const LEFT = '#e11d48';

/** Integers written with a true minus sign, as in the cards. */
export const signed = (n: number) => (n < 0 ? `−${Math.abs(n)}` : String(n));

export function IntegerLine({ min, max, start, jumps = [], showEnd = true, marks = [] }: IntegerLineVisual) {
  const span = max - min;
  const x = (n: number) => X0 + ((n - min) / span) * (X1 - X0);
  const labelEvery = span <= 16 ? 1 : span <= 30 ? 2 : 5;

  let at = start ?? 0;
  const arcs = jumps.map((j, i) => {
    const from = at;
    at += j.by;
    return { from, to: at, by: j.by, label: j.label ?? (j.by > 0 ? `+${j.by}` : signed(j.by)), level: i };
  });
  const end = at;

  const description = [
    `Number line from ${signed(min)} to ${signed(max)}.`,
    start !== undefined ? `Start at ${signed(start)}.` : '',
    ...arcs.map((a) => `Jump ${a.by > 0 ? 'right' : 'left'} ${Math.abs(a.by)}.`),
    jumps.length && showEnd ? `Land on ${signed(end)}.` : '',
    ...marks.map((m) => `${m.label} is marked.`),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg viewBox="0 0 360 132" className="h-auto w-full max-w-lg" role="img" aria-label={description}>
      <defs>
        <marker id="il-right" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={RIGHT} />
        </marker>
        <marker id="il-left" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={LEFT} />
        </marker>
      </defs>

      <line x1={X0 - 12} x2={X1 + 12} y1={AXIS_Y} y2={AXIS_Y} stroke={VISUAL_COLORS.stroke} strokeWidth={2.5} strokeLinecap="round" />
      {Array.from({ length: span + 1 }, (_, i) => {
        const n = min + i;
        const isZero = n === 0;
        return (
          <g key={n}>
            <line x1={x(n)} x2={x(n)} y1={AXIS_Y - (isZero ? 11 : 6)} y2={AXIS_Y + (isZero ? 11 : 6)} stroke={VISUAL_COLORS.stroke} strokeWidth={isZero ? 3 : 1.5} />
            {(n % labelEvery === 0 || isZero) && (
              <text x={x(n)} y={AXIS_Y + 27} textAnchor="middle" fontSize={span > 20 ? 10 : 12} fontWeight={isZero ? 800 : 600} fill={n < 0 ? LEFT : isZero ? VISUAL_COLORS.text : VISUAL_COLORS.muted}>
                {signed(n)}
              </text>
            )}
          </g>
        );
      })}

      {arcs.map((a) => {
        const height = 24 + a.level * 12 + Math.min(18, Math.abs(a.by) * 2);
        const mid = (x(a.from) + x(a.to)) / 2;
        const color = a.by > 0 ? RIGHT : LEFT;
        return (
          <g key={a.level}>
            <path
              d={`M${x(a.from)},${AXIS_Y - 4} Q${mid},${AXIS_Y - 4 - height * 2} ${x(a.to)},${AXIS_Y - 4}`}
              fill="none"
              stroke={color}
              strokeWidth={2.5}
              markerEnd={`url(#${a.by > 0 ? 'il-right' : 'il-left'})`}
            />
            <text x={mid} y={AXIS_Y - 8 - height} textAnchor="middle" fontSize={13} fontWeight={800} fill={color}>
              {a.label}
            </text>
          </g>
        );
      })}

      {start !== undefined && <circle cx={x(start)} cy={AXIS_Y} r={6.5} fill={VISUAL_COLORS.guide} stroke="#fff" strokeWidth={1.5} />}
      {jumps.length > 0 && showEnd && <circle cx={x(end)} cy={AXIS_Y} r={7.5} fill={VISUAL_COLORS.filled} stroke={VISUAL_COLORS.stroke} strokeWidth={1.5} />}
      {marks.map((m) => (
        <g key={`${m.value}-${m.label}`}>
          <circle cx={x(m.value)} cy={AXIS_Y} r={6.5} fill={VISUAL_COLORS.filled} stroke={VISUAL_COLORS.stroke} strokeWidth={1.5} />
          {m.label && (
            <text x={x(m.value)} y={AXIS_Y - 16} textAnchor="middle" fontSize={14} fontWeight={800} fill={VISUAL_COLORS.text}>
              {m.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
