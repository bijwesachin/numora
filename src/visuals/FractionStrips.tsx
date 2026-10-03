import type { FractionStripStackVisual, FractionStripVisual, FractionValue } from '@/domain/visual';
import { fractionWords, SvgLabel, VISUAL_COLORS } from './svgParts';

const LABEL_W = 56;
const STRIP_W = 280;
const STRIP_H = 34;
const GAP = 14;
const PAD = 8;

function Strip({ numerator, denominator, y }: FractionValue & { y: number }) {
  const w = STRIP_W / denominator;
  return (
    <g>
      {Array.from({ length: denominator }, (_, i) => (
        <rect
          key={i}
          x={LABEL_W + i * w}
          y={y}
          width={w}
          height={STRIP_H}
          fill={i < numerator ? VISUAL_COLORS.filled : VISUAL_COLORS.empty}
          stroke={VISUAL_COLORS.stroke}
          strokeWidth={2}
        />
      ))}
    </g>
  );
}

/** Chocolate-bar strips stacked so lengths can be compared; an optional guide shows equal lengths. */
export function FractionStripStack({ strips, showAlignment = false }: FractionStripStackVisual) {
  const height = PAD * 2 + strips.length * STRIP_H + (strips.length - 1) * GAP;
  const first = strips[0];
  const guideX = first ? LABEL_W + (STRIP_W * first.numerator) / first.denominator : 0;
  const description = strips.map((s) => `${s.numerator}/${s.denominator}`).join(', ');

  return (
    <svg
      viewBox={`0 0 ${LABEL_W + STRIP_W + PAD} ${height}`}
      className="h-auto w-full max-w-md"
      role="img"
      aria-label={`Fraction strips of equal length showing ${description}`}
    >
      {strips.map((s, i) => {
        const y = PAD + i * (STRIP_H + GAP);
        return (
          <g key={i}>
            <SvgLabel x={LABEL_W / 2 - 4} y={y + STRIP_H / 2} text={`${s.numerator}/${s.denominator}`} size={14} />
            <Strip {...s} y={y} />
          </g>
        );
      })}
      {showAlignment && first && (
        <line x1={guideX} x2={guideX} y1={2} y2={height - 2} stroke={VISUAL_COLORS.guide} strokeWidth={2.5} strokeDasharray="6 4" />
      )}
    </svg>
  );
}

export function FractionStrip({ numerator, denominator, label }: FractionStripVisual) {
  const height = STRIP_H + PAD * 2 + (label ? 40 : 0);
  return (
    <svg
      viewBox={`${LABEL_W} 0 ${STRIP_W + PAD} ${height}`}
      className="h-auto w-full max-w-sm"
      role="img"
      aria-label={`Strip: ${fractionWords(numerator, denominator)}`}
    >
      <Strip numerator={numerator} denominator={denominator} y={PAD} />
      {label && <SvgLabel x={LABEL_W + STRIP_W / 2} y={STRIP_H + PAD + 24} text={label} />}
    </svg>
  );
}
