import { useEffect, useRef, useState } from 'react';
import { HIDE_COUNTS, MASTERED, MULTIPLIERS, parseTableAnswerId, passed, planAnswerIds, type TablePlan } from '@/domain/tableDrill';
import { TABLES } from '@/domain/timesTables';
import { NumberPad } from '../times/NumberPad';
import { QuizProgress, QuizSummary, useQuizRun } from './QuizParts';

const CORRECT_PAUSE_MS = 600;

/**
 * Learn one table over several days: fill in the hidden answers of the table, then answer it
 * shuffled. See `tableDrill.ts` for how the levels work.
 */
export function TableQuiz({ day, plan, onPick }: { day: string; plan: TablePlan; onPick: (table: number) => void }) {
  const { table, level, hidden, mixed } = plan;
  const ids = planAnswerIds(plan);
  const { index, given, answers, submit, next } = useQuizRun('tables', day, ids);
  const [typed, setTyped] = useState('');
  const [mixedStarted, setMixedStarted] = useState(index > hidden.length);
  const shownAt = useRef(performance.now());

  const inFill = index < hidden.length;
  const waiting = !inFill && index < ids.length && !mixedStarted;
  const b = inFill ? hidden[index] : mixed[index - hidden.length];
  const product = b === undefined ? 0 : table * b;
  const correct = given !== null && Number(given) === product;

  useEffect(() => {
    shownAt.current = performance.now();
  }, [index, mixedStarted]);

  const check = () => {
    if (given !== null || !typed || b === undefined || waiting) return;
    submit({ given: typed, correct: Number(typed) === product, ms: Math.round(performance.now() - shownAt.current) });
  };
  const advance = () => {
    setTyped('');
    next();
  };

  useEffect(() => {
    if (!correct) return;
    const t = window.setTimeout(advance, CORRECT_PAUSE_MS);
    return () => window.clearTimeout(t);
  });

  useEffect(() => {
    if (b === undefined || waiting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof Element && e.target.closest('button') && (e.key === 'Enter' || e.key === ' ')) return;
      if (given !== null) {
        if (e.key === 'Enter' && !correct) advance();
        return;
      }
      if (/^\d$/.test(e.key)) setTyped((t) => (t.length < 3 ? t + e.key : t));
      else if (e.key === 'Backspace') setTyped((t) => t.slice(0, -1));
      else if (e.key === 'Enter') check();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const header = <TableHeader plan={plan} onPick={onPick} />;

  if (b === undefined) {
    const fill = answers.slice(0, hidden.length);
    const shuffled = answers.slice(hidden.length);
    const seconds = Math.round(shuffled.reduce((sum, a) => sum + (a.ms ?? 0), 0) / 1000);
    const missed = answers.filter((a) => !a.correct).flatMap((a) => parseTableAnswerId(a.id) ?? []);
    const ok = passed(answers, table, level);
    return (
      <div className="grid gap-5">
        {header}
        <QuizSummary correct={answers.filter((a) => a.correct).length} total={ids.length} noun="answers">
          <ul className="grid gap-1 text-slate-700">
            <li>
              🫥 Hidden answers: <strong className="tabular-nums">{fill.filter((a) => a.correct).length} / {hidden.length}</strong>
            </li>
            <li>
              🔀 Shuffled: <strong className="tabular-nums">{shuffled.filter((a) => a.correct).length} / {mixed.length}</strong>
              {seconds > 0 && <span className="text-slate-500"> in {seconds} s</span>}
            </li>
          </ul>
          {missed.length > 0 && (
            <p className="rounded-2xl bg-rose-50 px-4 py-2 text-rose-800">
              Practice these: {[...new Set(missed.map((m) => m.b))].map((m) => `${table} × ${m} = ${table * m}`).join(', ')}
            </p>
          )}
          <p className="rounded-2xl bg-indigo-50 px-4 py-3 font-semibold text-indigo-900">
            {ok && level === MASTERED - 1
              ? `🏆 You know the ${table} table by heart! Tomorrow: the next table.`
              : ok
                ? `⭐ Level up! Tomorrow ${HIDE_COUNTS[level + 1]} answers are hidden.`
                : 'Tomorrow you’ll try this level again. Get every hidden answer right (and miss at most one shuffled) to hide more.'}
          </p>
        </QuizSummary>
      </div>
    );
  }

  const answerBox = (
    <span
      aria-label="Your answer"
      className={`inline-block min-w-16 rounded-xl px-2 text-center ring-2 ${
        given === null ? 'bg-white text-indigo-700 ring-indigo-400' : correct ? 'bg-emerald-50 text-emerald-700 ring-emerald-300' : 'bg-rose-50 text-rose-700 ring-rose-300'
      }`}
    >
      {(given ?? typed) || '?'}
    </span>
  );

  return (
    <div className="mx-auto grid max-w-xl gap-5">
      {header}
      <QuizProgress index={index} total={ids.length} />

      {inFill ? (
        <section aria-label={`${table} table`} className="rounded-[2rem] bg-white p-5 shadow-lg ring-1 ring-slate-200">
          <p className="mb-3 text-center text-slate-600">🫥 Fill in the hidden answers from memory.</p>
          <ol className="mx-auto grid w-fit gap-1 text-2xl font-semibold tabular-nums">
            {MULTIPLIERS.map((m) => {
              const h = hidden.indexOf(m);
              const done = h !== -1 && h < index ? answers[h] : undefined;
              return (
                <li key={m} className={`flex items-center gap-2 rounded-xl px-3 py-0.5 ${h === index ? 'bg-indigo-50' : ''}`}>
                  <span className="w-24 text-right text-slate-500">
                    {table} × {m}
                  </span>
                  <span className="text-slate-400">=</span>
                  {h === -1 ? (
                    <span>{table * m}</span>
                  ) : h === index ? (
                    answerBox
                  ) : done ? (
                    <span className={done.correct ? 'text-emerald-700' : 'text-rose-700'}>
                      {table * m}
                      {!done.correct && <span className="ml-2 text-base line-through">{done.given}</span>}
                    </span>
                  ) : (
                    <span className="inline-block min-w-16 rounded-xl bg-slate-100 text-center text-slate-400">?</span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ) : waiting ? (
        <section className="grid gap-4 rounded-[2rem] bg-white p-6 text-center shadow-lg ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold">🔀 Now mixed up!</h2>
          <p className="text-slate-600">
            The table is hidden. Answer the {table} table in a jumbled order — try to know each one without counting up.
          </p>
          <button type="button" autoFocus onClick={() => setMixedStarted(true)} className="rounded-2xl bg-indigo-600 px-5 py-3 text-lg font-semibold text-white hover:bg-indigo-700">
            Start
          </button>
        </section>
      ) : (
        <section aria-label="Question" className="rounded-[2rem] bg-white p-6 text-center shadow-lg ring-1 ring-slate-200">
          <p className="mb-2 text-slate-600">🔀 Shuffled</p>
          <h2 className="flex items-center justify-center gap-3 text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">
            <span>
              {table} × {b} =
            </span>
            {answerBox}
          </h2>
        </section>
      )}

      {!waiting && (
        <>
          <p role="status" aria-live="polite" className="min-h-6 text-center font-semibold">
            {given !== null &&
              (correct ? (
                <span className="text-emerald-700">✓ {product}</span>
              ) : (
                <span className="text-rose-700">
                  {table} × {b} = {product}
                </span>
              ))}
          </p>
          {given !== null && !correct ? (
            <button type="button" autoFocus onClick={advance} className="rounded-2xl bg-indigo-600 px-5 py-3 text-lg font-semibold text-white hover:bg-indigo-700">
              Next <kbd className="ml-1 text-sm text-indigo-200">Enter</kbd>
            </button>
          ) : (
            <NumberPad
              disabled={given !== null}
              canSubmit={typed.length > 0}
              onDigit={(d) => setTyped((t) => (t.length < 3 ? t + d : t))}
              onDelete={() => setTyped((t) => t.slice(0, -1))}
              onSubmit={check}
            />
          )}
        </>
      )}
    </div>
  );
}

/** Which table, how far along it is, and a way to pick another. */
function TableHeader({ plan, onPick }: { plan: TablePlan; onPick: (table: number) => void }) {
  const { table, level, mastered } = plan;
  return (
    <section aria-label="Today’s table" className="grid gap-3 rounded-3xl bg-violet-50 p-4 ring-1 ring-violet-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">📚 Learning the {table} table</h2>
        <span className="flex items-center gap-1 text-sm text-slate-600" aria-label={`Level ${level + 1} of ${MASTERED}`}>
          Level {level + 1} of {MASTERED}
          {HIDE_COUNTS.map((_, i) => (
            <span key={i} aria-hidden="true" className={`inline-block size-2.5 rounded-full ${i <= level ? 'bg-violet-600' : 'bg-violet-200'}`} />
          ))}
        </span>
      </div>
      <details>
        <summary className="cursor-pointer text-sm font-semibold text-violet-700">Pick another table</summary>
        <div role="group" aria-label="Tables" className="mt-2 flex flex-wrap gap-2">
          {TABLES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={t === table}
              onClick={() => onPick(t)}
              className={`min-w-11 rounded-xl px-3 py-1.5 font-semibold tabular-nums ring-1 ${t === table ? 'bg-violet-600 text-white ring-violet-700' : 'bg-white text-slate-700 ring-violet-200 hover:bg-violet-100'}`}
            >
              {t}
              {mastered.includes(t) && <span aria-label=" memorized"> ⭐</span>}
            </button>
          ))}
        </div>
      </details>
    </section>
  );
}
