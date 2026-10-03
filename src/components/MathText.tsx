import { Fragment } from 'react';

const FRACTION = /(\d+|\?)\/(\d+|\?)/g;

interface MathTextProps {
  text: string;
  /** Smaller stacked fractions for dense text such as steps. */
  compact?: boolean;
}

/**
 * Renders plain content text, turning "3/4" into a stacked fraction and "\n" into line
 * breaks. Screen readers get the original "3/4" text.
 */
export function MathText({ text, compact = false }: MathTextProps) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {renderLine(line, compact)}
        </Fragment>
      ))}
    </>
  );
}

function renderLine(line: string, compact: boolean) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of line.matchAll(FRACTION)) {
    const [whole, num, den] = match;
    const start = match.index;
    if (start > last) parts.push(line.slice(last, start));
    parts.push(
      <span key={start}>
        <span className="sr-only">{whole}</span>
        <span className={compact ? 'frac frac-sm' : 'frac'} aria-hidden="true">
          <span className="frac-num">{num}</span>
          <span className="frac-den">{den}</span>
        </span>
      </span>,
    );
    last = start + whole.length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}
