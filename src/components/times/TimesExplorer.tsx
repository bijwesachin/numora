import { useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { masteryLevel } from '@/domain/review/mastery';
import { factCardId, factStrategy, factVisual, MIN_FACTOR, tableConceptId } from '@/domain/timesTables';
import { useProgressStore } from '@/state/progressStore';
import { Callout, StepsPanel, VisualExplanation } from '../flashcard/CardPanels';
import { MASTERY_THEME } from '../theme';

const SIZE = 15;
const NUMBERS = Array.from({ length: SIZE }, (_, i) => i + 1);

type Highlight = 'none' | 'progress' | 'squares' | 'multiples';

const HIGHLIGHTS: { id: Highlight; label: string }[] = [
  { id: 'none', label: 'Plain' },
  { id: 'progress', label: 'My progress' },
  { id: 'squares', label: 'Square numbers' },
  { id: 'multiples', label: 'One table' },
];

const ARROWS: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

const clamp = (n: number) => Math.min(SIZE, Math.max(1, n));

/** Tappable 15 × 15 chart with highlight modes and a panel that explains the chosen fact. */
export function TimesExplorer({ onSprint }: { onSprint: (table: number) => void }) {
  const progress = useProgressStore((s) => s.cards);
  const [sel, setSel] = useState({ a: 7, b: 8 });
  const [highlight, setHighlight] = useState<Highlight>('none');
  const [table, setTable] = useState(7);
  const gridRef = useRef<HTMLDivElement>(null);

  const select = (a: number, b: number, focus = false) => {
    setSel({ a, b });
    if (focus) requestAnimationFrame(() => gridRef.current?.querySelector<HTMLButtonElement>(`[data-cell="${a}-${b}"]`)?.focus());
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const d = ARROWS[e.key];
    if (!d) return;
    e.preventDefault();
    select(clamp(sel.a + d[0]), clamp(sel.b + d[1]), true);
  };

  const cellClass = (a: number, b: number): string => {
    if (a === sel.a && b === sel.b) return 'bg-indigo-600 text-white font-bold';
    if (highlight === 'progress' && a >= MIN_FACTOR && b >= MIN_FACTOR) return MASTERY_THEME[masteryLevel(progress[factCardId(a, b)])];
    if (highlight === 'squares' && a === b) return 'bg-amber-300 text-amber-950 font-bold';
    if (highlight === 'multiples' && (a === table || b === table)) return 'bg-indigo-200 text-indigo-950 font-semibold';
    if (a === sel.a || b === sel.b) return 'bg-indigo-50 text-slate-800';
    return 'bg-white text-slate-600';
  };

  const { a, b } = sel;
  const strategy = factStrategy(a, b);
  const deckTable = Math.max(a, MIN_FACTOR) === a ? a : b;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section aria-labelledby="chart-title" className="grid content-start gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="chart-title" className="text-lg font-semibold">
            Multiplication chart
          </h2>
          <div className="flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label="Highlight">
            {HIGHLIGHTS.map((h) => (
              <button
                key={h.id}
                type="button"
                role="radio"
                aria-checked={highlight === h.id}
                onClick={() => setHighlight(h.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 pointer-coarse:min-h-11 ${
                  highlight === h.id ? 'bg-indigo-600 text-white ring-indigo-600' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
                }`}
              >
                {h.label}
              </button>
            ))}
            {highlight === 'multiples' && (
              <select
                value={table}
                onChange={(e) => setTable(Number(e.target.value))}
                aria-label="Table to highlight"
                className="rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-slate-200 pointer-coarse:min-h-11"
              >
                {NUMBERS.slice(1).map((n) => (
                  <option key={n} value={n}>
                    × {n}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div
          ref={gridRef}
          role="grid"
          aria-label="Multiplication chart from 1 × 1 to 15 × 15. Use the arrow keys to move."
          onKeyDown={onKeyDown}
          className="grid min-w-[30rem] grid-cols-[repeat(16,minmax(0,1fr))] gap-px overflow-hidden rounded-2xl bg-slate-200 ring-1 ring-slate-200 select-none sm:min-w-0"
        >
          <div role="row" className="contents">
            <div role="columnheader" className="flex aspect-square items-center justify-center bg-slate-100 text-xs font-bold text-slate-500">
              ×
            </div>
            {NUMBERS.map((n) => (
              <div
                key={n}
                role="columnheader"
                className={`flex aspect-square items-center justify-center text-[10px] font-bold sm:text-sm ${n === b ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {n}
              </div>
            ))}
          </div>
          {NUMBERS.map((row) => (
            <div key={row} role="row" className="contents">
              <div
                role="rowheader"
                className={`flex aspect-square items-center justify-center text-[10px] font-bold sm:text-sm ${row === a ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {row}
              </div>
              {NUMBERS.map((col) => {
                const isSelected = row === a && col === b;
                const isTwin = !isSelected && row === b && col === a;
                return (
                  <button
                    key={col}
                    type="button"
                    role="gridcell"
                    data-cell={`${row}-${col}`}
                    tabIndex={isSelected ? 0 : -1}
                    aria-selected={isSelected}
                    aria-label={`${row} times ${col} equals ${row * col}`}
                    onClick={() => select(row, col)}
                    className={`flex aspect-square items-center justify-center text-[9px] tabular-nums transition-colors sm:text-xs md:text-sm ${cellClass(row, col)} ${
                      isTwin ? 'outline-2 -outline-offset-2 outline-indigo-500 outline-dashed' : ''
                    }`}
                  >
                    {row * col}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        </div>
        <p className="text-sm text-slate-500">
          Tap any square. The dashed square is its turnaround twin — same answer, factors swapped.
          {highlight === 'progress' && ' Colors show how well you know each fact; play Fact Sprint to fill them in.'}
        </p>
      </section>

      <aside aria-live="polite" className="grid content-start gap-4 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
        <p className="text-center text-4xl font-bold tabular-nums">
          {a} × {b} = <span className="text-indigo-700">{a * b}</span>
        </p>
        <p className="text-center text-sm text-slate-500">
          {a === b ? `${a} × ${a} is a square number.` : `Turnaround twin: ${b} × ${a} = ${a * b}`}
        </p>
        <Callout kind="hook">
          <strong>{strategy.name}.</strong> {strategy.tip}
        </Callout>
        <StepsPanel steps={strategy.steps} />
        <VisualExplanation spec={factVisual(a, b)} />
        {deckTable >= MIN_FACTOR && (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <button
              type="button"
              onClick={() => onSprint(deckTable)}
              className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Sprint the × {deckTable} table
            </button>
            <Link
              to={`/concepts/${tableConceptId(deckTable)}/study`}
              className="rounded-2xl bg-white px-4 py-3 text-center font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
            >
              × {deckTable} flashcards
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
