import { useEffect, useMemo, useRef, useState } from 'react';
import { curriculum } from '@/content';
import { deckStats } from '@/domain/progress/stats';
import {
  answerChoices,
  factCardId,
  factStrategy,
  pickSprintFacts,
  rateAnswer,
  TABLES,
  tableConceptId,
  type Fact,
  type SprintMode,
} from '@/domain/timesTables';
import { useProgressStore } from '@/state/progressStore';
import { StepsPanel } from '../flashcard/CardPanels';

interface TimesSprintProps {
  initialTables?: number[];
  /** Injected for deterministic tests. */
  random?: () => number;
}

interface Result {
  fact: Fact;
  correct: boolean;
  ms: number;
}

const PRESETS: { label: string; tables: number[] }[] = [
  { label: '2–5', tables: [2, 3, 4, 5] },
  { label: '6–9', tables: [6, 7, 8, 9] },
  { label: '10–12', tables: [10, 11, 12] },
  { label: '13–15', tables: [13, 14, 15] },
  { label: 'All', tables: [...TABLES] },
];

const LENGTHS = [10, 20, 30];
const CORRECT_PAUSE_MS = 700;

/**
 * A short practice round. Facts are chosen from the student's weakest spots in the selected
 * tables, and every answer is recorded in the shared spaced-repetition progress.
 */
export function TimesSprint({ initialTables = [6, 7, 8], random = Math.random }: TimesSprintProps) {
  const progress = useProgressStore((s) => s.cards);
  const rate = useProgressStore((s) => s.rate);

  const [tables, setTables] = useState<number[]>(initialTables);
  const [mode, setMode] = useState<SprintMode>('choose');
  const [length, setLength] = useState(20);
  const [phase, setPhase] = useState<'setup' | 'play' | 'done'>('setup');

  const [questions, setQuestions] = useState<Fact[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [typed, setTyped] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; given: number } | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const startedAt = useRef(0);

  const current = questions[index];
  const choices = useMemo(() => (current ? answerChoices(current.a, current.b, random) : []), [current, random]);

  const start = (facts: Fact[]) => {
    if (facts.length === 0) return;
    setQuestions(facts);
    setIndex(0);
    setResults([]);
    setStreak(0);
    setBestStreak(0);
    setFeedback(null);
    setTyped('');
    setPhase('play');
  };

  // Start the clock whenever a new question appears.
  useEffect(() => {
    if (phase === 'play') startedAt.current = performance.now();
  }, [phase, index]);

  const advance = () => {
    setFeedback(null);
    setTyped('');
    if (index + 1 >= questions.length) setPhase('done');
    else setIndex(index + 1);
  };

  const answer = (given: number) => {
    if (!current || feedback) return;
    const ms = performance.now() - startedAt.current;
    const correct = given === current.product;
    rate(factCardId(current.a, current.b), rateAnswer(correct, ms, mode));
    setResults((r) => [...r, { fact: current, correct, ms }]);
    setFeedback({ correct, given });
    if (correct) {
      const next = streak + 1;
      setStreak(next);
      setBestStreak((b) => Math.max(b, next));
    } else {
      setStreak(0);
    }
  };

  // Correct answers move on by themselves; wrong ones wait so the trick can be read.
  useEffect(() => {
    if (!feedback?.correct) return;
    const t = window.setTimeout(advance, CORRECT_PAUSE_MS);
    return () => window.clearTimeout(t);
  });

  // Keyboard: digits / Backspace / Enter to type, 1–4 to pick, Enter to continue.
  useEffect(() => {
    if (phase !== 'play') return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (feedback) {
        if (!feedback.correct && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          advance();
        }
        return;
      }
      if (mode === 'choose') {
        const i = Number(e.key) - 1;
        if (i >= 0 && i < choices.length) answer(choices[i]!);
        return;
      }
      if (/^\d$/.test(e.key)) setTyped((t) => (t.length < 3 ? t + e.key : t));
      else if (e.key === 'Backspace') setTyped((t) => t.slice(0, -1));
      else if (e.key === 'Enter' && typed) answer(Number(typed));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (phase === 'setup') {
    return (
      <SprintSetup
        tables={tables}
        setTables={setTables}
        mode={mode}
        setMode={setMode}
        length={length}
        setLength={setLength}
        onStart={() => start(pickSprintFacts(tables, progress, length, random))}
      />
    );
  }

  if (phase === 'done') {
    return (
      <SprintSummary
        results={results}
        bestStreak={bestStreak}
        onPlayAgain={() => start(pickSprintFacts(tables, progress, length, random))}
        onPracticeMissed={(missed) => start(missed)}
        onChangeTables={() => setPhase('setup')}
      />
    );
  }

  if (!current) return null;
  const strategy = factStrategy(current.a, current.b);

  return (
    <div className="mx-auto grid max-w-xl gap-5">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span className={`font-semibold ${streak >= 3 ? 'text-amber-600' : ''}`} aria-label={`Streak ${streak}`}>
          {streak >= 3 ? '🔥' : '⚡'} Streak {streak}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-indigo-500 transition-[width]" style={{ width: `${(100 * index) / questions.length}%` }} />
      </div>

      <div className="rounded-[2rem] bg-white p-6 text-center shadow-lg ring-1 ring-slate-200">
        <h2 className="text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">
          {current.a} × {current.b}
        </h2>
        {mode === 'type' && (
          <p
            className={`mx-auto mt-4 min-h-16 max-w-48 rounded-2xl px-4 py-2 text-4xl font-bold tabular-nums ring-2 ${
              feedback ? (feedback.correct ? 'bg-emerald-50 text-emerald-700 ring-emerald-300' : 'bg-rose-50 text-rose-700 ring-rose-300') : 'ring-slate-200'
            }`}
            aria-label="Your answer"
          >
            {typed || <span className="text-slate-300">?</span>}
          </p>
        )}
      </div>

      <p role="status" aria-live="polite" className="min-h-6 text-center font-semibold">
        {feedback?.correct && <span className="text-emerald-700">✓ {current.product}</span>}
        {feedback && !feedback.correct && (
          <span className="text-rose-700">
            Not quite — {current.a} × {current.b} = {current.product}
          </span>
        )}
      </p>

      {feedback && !feedback.correct ? (
        <div className="grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <p className="font-semibold">
            Try this trick: <span className="font-normal">{strategy.tip}</span>
          </p>
          <StepsPanel steps={strategy.steps} />
          <button type="button" autoFocus onClick={advance} className="rounded-2xl bg-indigo-600 px-5 py-3 text-lg font-semibold text-white hover:bg-indigo-700">
            Next <kbd className="ml-1 text-sm text-indigo-200">Enter</kbd>
          </button>
        </div>
      ) : mode === 'choose' ? (
        <div className="grid grid-cols-2 gap-3">
          {choices.map((c, i) => {
            const picked = feedback?.given === c;
            const tone = feedback && c === current.product ? 'bg-emerald-500 text-white ring-emerald-600' : picked ? 'bg-rose-500 text-white ring-rose-600' : 'bg-white text-slate-800 ring-slate-300 hover:bg-indigo-50';
            return (
              <button
                key={`${index}-${c}`}
                type="button"
                disabled={!!feedback}
                onClick={() => answer(c)}
                className={`flex h-20 items-center justify-center gap-2 rounded-2xl text-3xl font-bold tabular-nums ring-2 transition-colors ${tone}`}
              >
                {c} <kbd className="text-xs font-normal opacity-50">{i + 1}</kbd>
              </button>
            );
          })}
        </div>
      ) : (
        <NumberPad
          disabled={!!feedback}
          onDigit={(d) => setTyped((t) => (t.length < 3 ? t + d : t))}
          onDelete={() => setTyped((t) => t.slice(0, -1))}
          onSubmit={() => typed && answer(Number(typed))}
          canSubmit={typed.length > 0}
        />
      )}
    </div>
  );
}

function NumberPad({
  disabled,
  canSubmit,
  onDigit,
  onDelete,
  onSubmit,
}: {
  disabled: boolean;
  canSubmit: boolean;
  onDigit: (d: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
}) {
  const key = 'flex h-16 items-center justify-center rounded-2xl text-2xl font-bold ring-1 disabled:opacity-40';
  return (
    <div className="mx-auto grid w-full max-w-sm grid-cols-3 gap-2" role="group" aria-label="Number pad">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
        <button key={d} type="button" disabled={disabled} onClick={() => onDigit(d)} className={`${key} bg-white text-slate-800 ring-slate-300 hover:bg-slate-50`}>
          {d}
        </button>
      ))}
      <button type="button" disabled={disabled} onClick={onDelete} aria-label="Delete" className={`${key} bg-slate-100 text-slate-600 ring-slate-300`}>
        ⌫
      </button>
      <button type="button" disabled={disabled} onClick={() => onDigit('0')} className={`${key} bg-white text-slate-800 ring-slate-300 hover:bg-slate-50`}>
        0
      </button>
      <button type="button" disabled={disabled || !canSubmit} onClick={onSubmit} aria-label="Check answer" className={`${key} bg-indigo-600 text-white ring-indigo-700`}>
        ✓
      </button>
    </div>
  );
}

function SprintSetup({
  tables,
  setTables,
  mode,
  setMode,
  length,
  setLength,
  onStart,
}: {
  tables: number[];
  setTables: (t: number[]) => void;
  mode: SprintMode;
  setMode: (m: SprintMode) => void;
  length: number;
  setLength: (n: number) => void;
  onStart: () => void;
}) {
  const progress = useProgressStore((s) => s.cards);
  const now = new Date();
  const toggle = (n: number) => setTables(tables.includes(n) ? tables.filter((t) => t !== n) : [...tables, n].sort((x, y) => x - y));
  const pill = (on: boolean) =>
    `rounded-full px-4 py-2 font-semibold ring-1 pointer-coarse:min-h-11 ${on ? 'bg-indigo-600 text-white ring-indigo-600' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'}`;

  return (
    <div className="mx-auto grid max-w-2xl gap-6 rounded-3xl bg-white p-6 ring-1 ring-slate-200">
      <div>
        <h2 className="text-xl font-semibold">Fact Sprint</h2>
        <p className="text-slate-600">Pick your tables. The sprint focuses on the facts you find hardest.</p>
      </div>

      <fieldset className="grid gap-3">
        <legend className="mb-2 font-semibold">Tables</legend>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" onClick={() => setTables(p.tables)} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 pointer-coarse:min-h-11">
              {p.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">
          {TABLES.map((n) => {
            const on = tables.includes(n);
            const mastery = deckStats(curriculum.cardsOfConcept(tableConceptId(n)), progress, now).masteryPercent;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(n)}
                className={`flex flex-col items-center rounded-2xl py-2 ring-2 ${on ? 'bg-indigo-600 text-white ring-indigo-600' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'}`}
              >
                <span className="text-lg font-bold">× {n}</span>
                <span className={`text-xs ${on ? 'text-indigo-100' : 'text-slate-500'}`}>{mastery}%</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset>
          <legend className="mb-2 font-semibold">How to answer</legend>
          <div className="flex gap-2">
            <button type="button" aria-pressed={mode === 'choose'} onClick={() => setMode('choose')} className={pill(mode === 'choose')}>
              Pick it
            </button>
            <button type="button" aria-pressed={mode === 'type'} onClick={() => setMode('type')} className={pill(mode === 'type')}>
              Type it
            </button>
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 font-semibold">Questions</legend>
          <div className="flex gap-2">
            {LENGTHS.map((n) => (
              <button key={n} type="button" aria-pressed={length === n} onClick={() => setLength(n)} className={pill(length === n)}>
                {n}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <button
        type="button"
        disabled={tables.length === 0}
        onClick={onStart}
        className="rounded-2xl bg-indigo-600 px-6 py-4 text-xl font-semibold text-white hover:bg-indigo-700 disabled:opacity-40"
      >
        Start sprint
      </button>
      <p className="text-center text-sm text-slate-500">Typing the answer builds stronger memory than picking it. Try both!</p>
    </div>
  );
}

function SprintSummary({
  results,
  bestStreak,
  onPlayAgain,
  onPracticeMissed,
  onChangeTables,
}: {
  results: Result[];
  bestStreak: number;
  onPlayAgain: () => void;
  onPracticeMissed: (facts: Fact[]) => void;
  onChangeTables: () => void;
}) {
  const correct = results.filter((r) => r.correct).length;
  const accuracy = results.length ? Math.round((100 * correct) / results.length) : 0;
  const avgSeconds = results.length ? results.reduce((s, r) => s + r.ms, 0) / results.length / 1000 : 0;
  const missed = [...new Map(results.filter((r) => !r.correct).map((r) => [factCardId(r.fact.a, r.fact.b), r.fact])).values()];
  const cheer = accuracy === 100 ? 'Perfect round! 🌟' : accuracy >= 80 ? 'Great work! 🎉' : accuracy >= 50 ? 'Good effort — keep going! 💪' : 'Every miss is a fact you’re about to learn. 🌱';

  return (
    <div className="mx-auto grid max-w-2xl gap-5 rounded-3xl bg-white p-6 text-center ring-1 ring-slate-200">
      <h2 className="text-2xl font-semibold">{cheer}</h2>
      <dl className="grid grid-cols-3 gap-3">
        <SummaryStat label="Correct" value={`${correct}/${results.length}`} />
        <SummaryStat label="Avg. time" value={`${avgSeconds.toFixed(1)}s`} />
        <SummaryStat label="Best streak" value={String(bestStreak)} />
      </dl>
      {missed.length > 0 && (
        <div className="grid gap-2 text-left">
          <h3 className="font-semibold">Facts to practice</h3>
          <ul className="grid gap-2">
            {missed.map((f) => (
              <li key={`${f.a}x${f.b}`} className="rounded-2xl bg-rose-50 px-4 py-2 text-rose-950">
                <span className="font-bold tabular-nums">
                  {f.a} × {f.b} = {f.product}
                </span>{' '}
                — <span className="text-sm">{factStrategy(f.a, f.b).tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        {missed.length > 0 && (
          <button type="button" onClick={() => onPracticeMissed(missed)} className="rounded-2xl bg-rose-600 px-5 py-3 font-semibold text-white hover:bg-rose-700">
            Practice the {missed.length} I missed
          </button>
        )}
        <button type="button" onClick={onPlayAgain} className="rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">
          Play again
        </button>
        <button type="button" onClick={onChangeTables} className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50">
          Change tables
        </button>
      </div>
      <p className="text-sm text-slate-500">Your answers are saved. Missed facts will come back in Daily Review.</p>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 py-3">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-2xl font-bold tabular-nums">{value}</dd>
    </div>
  );
}
