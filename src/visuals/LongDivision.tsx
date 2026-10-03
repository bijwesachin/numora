import type { LongDivisionVisual } from '@/domain/visual';
import { VISUAL_COLORS } from './svgParts';

const CW = 17;
const FONT = 24;
const LINE_H = 30;
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

export function LongDivision({ divisor, dividend, quotient, quotientEndCol, steps }: LongDivisionVisual) {
  const pad = 12;
  const x0 = pad + divisor.length * CW + 16;
  const colX = (col: number) => x0 + col * CW;
  const barY = 44;
  const dividendY = barY + 26;
  const width = x0 + dividend.length * CW + pad + 6;
  const height = dividendY + steps.length * LINE_H + 16;
  const qEnd = quotientEndCol ?? dividend.length - 1;

  const textAt = (text: string, endCol: number, y: number) => (
    <text x={colX(endCol - text.length + 1)} y={y} fontFamily={MONO} fontSize={FONT} fontWeight={600} fill={VISUAL_COLORS.text} xmlSpace="preserve">
      {text}
    </text>
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      style={{ maxWidth: width * 1.6 }}
      role="img"
      aria-label={`Long division of ${dividend} by ${divisor} with quotient ${quotient}`}
    >
      <text x={pad} y={dividendY} fontFamily={MONO} fontSize={FONT} fontWeight={700} fill={VISUAL_COLORS.guide}>
        {divisor}
      </text>
      <path d={`M${x0 - 6},${barY} H${x0 + dividend.length * CW + 4} M${x0 - 6},${barY} V${dividendY + 6}`} fill="none" stroke={VISUAL_COLORS.stroke} strokeWidth={2.5} strokeLinecap="round" />
      {textAt(quotient, qEnd, barY - 8)}
      {textAt(dividend, dividend.length - 1, dividendY)}
      {steps.map((step, i) => {
        const y = dividendY + (i + 1) * LINE_H;
        return (
          <g key={i}>
            {textAt(step.text, step.endCol, y)}
            {step.rule && (
              <line x1={colX(step.endCol - step.text.length + 1) - 2} x2={colX(step.endCol + 1) + 2} y1={y + 6} y2={y + 6} stroke={VISUAL_COLORS.stroke} strokeWidth={2} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
