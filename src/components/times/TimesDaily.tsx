import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildDailySession,
  capNewFactRating,
  dueWithin,
  factCardId,
  factHook,
  factStrategy,
  factVisual,
  memoryStatus,
  rateAnswer,
  requeueMiss,
  type SessionItem,
} from '@/domain/timesTables';
import { useProgressStore } from '@/state/progressStore';
import { Callout, StepsPanel, VisualExplanation } from '../flashcard/CardPanels';
import { ProgressBar } from '../ProgressBar';
import { NumberPad } from './NumberPad';

const CORRECT_PAUSE_MS = 700;
/** How many times a missed fact is brought back within one session. */
const MAX_RETRIES = 2;

interface Outcome {
  key: string;
  firstTry: boolean;
}

/**
 * Daily memorising session: review what's due, learn a couple of new turnaround pairs,
 * and recall everything from memory by typing.
 */
export function TimesDaily({ onExplore }: { onExplore: () => void }) {
  const progress = useProgressStore((s) => s.cards);
  const rate = useProgressStore((s) => s.rate);
  const [phase, setPhase] = useState<'start' | 'session' | 'done'>('start');
  const [queue, setQueue] = useState<SessionItem[]>([]);
  const [pos, setPos] = useState(0);
  const [typed, setTyped] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean } | null>(null);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [startMemorized, setStartMemorized] = useState(0);
  const retries = useRef(new Map<string, number>());
  const startedAt = useRef(0);

  const now = new Date();
  const status = memoryStatus(progress, now);
  const plan = useMemo(() => buildDailySession(progress, new Date()), [progress]);
  const item = queue[pos];

  useEffect(() => {
    if (phase === 'session') startedAt.current = performance.now();
  }, [phase, pos]);

  const begin = () => {
    setQueue(plan);
    setPos(0);
    setOutcomes([]);
    setFeedback(null);
    setTyped('');
    retries.current = new Map();
    setStartMemorized(status.memorized);
    setPhase('session');
  };

  const advance = () => {
    setFeedback(null);
    setTyped('');
    if (pos + 1 >= queue.length) setPhase('done');
    else setPos(pos + 1);
  };

  const submit = () => {
    if (!item || item.kind !== 'recall' || feedback || !typed) return;
    const { a, b, product } = item.fact;
    const ms = performance.now() - startedAt.current;
    const correct = Number(typed) === product;
    const id = factCardId(a, b);
    rate(id, capNewFactRating(rateAnswer(correct, ms, 'type'), item.isNew));
    setOutcomes((o) => (o.some((x) => x.key === id) ? o : [...o, { key: id, firstTry: correct }]));
    setFeedback({ correct });
    if (!correct) {
      const tries = retries.current.get(id) ?? 0;
      if (tries < MAX_RETRIES) {
        retries.current.set(id, tries + 1);
        setQueue((q) => requeueMiss(q, pos));
      }
    }
  };

  useEffect(() => {
    if (!feedback?.correct) return;
    const t = window.setTimeout(advance, CORRECT_PAUSE_MS);
    return () => window.clearTimeout(t);
  });

  useEffect(() => {
    if (phase !== 'session' || !item) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest('button') && (e.key === 'Enter' || e.key === ' ')) return; // let the focused button act
      if (item.kind === 'learn' || feedback) {
        if (e.key === 'Enter' && (item.kind === 'learn' || !feedback?.correct)) advance();
        return;
      }
      if (/^\d$/.test(e.key)) setTyped((t) => (t.length < 3 ? t + e.key : t));
      else if (e.key === 'Backspace') setTyped((t) => t.slice(0, -1));
      else if (e.key === 'Enter') submit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (phase === 'start') {
    const newCount = plan.filter((i) => i.kind === 'learn').length;
    const reviewCount = new Set(plan.filter((i) => !i.isNew).map((i) => factCardId(i.fact.a, i.fact.b))).size;
    const newFacts = plan.filter((i) => i.kind === 'learn').map((i) => `${i.fact.a} × ${i.fact.b}`);
    return (
      <div className="mx-auto grid max-w-2xl gap-5">
        <MemoryMeter memorized={status.memorized} learning={status.learning} unseen={status.unseen} total={status.total} />
        {plan.length > 0 ? (
          <div className="grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold">Today’s practice</h2>
            <ul className="grid gap-1 text-slate-700">
              {reviewCount > 0 && <li>🔁 {reviewCount} fact{reviewCount === 1 ? '' : 's'} to remember</li>}
              {newCount > 0 && (
                <li>
                  🌱 {newCount} new fact{newCount === 1 ? '' : 's'}: <span className="font-semibold">{newFacts.join(', ')}</span>
                </li>
              )}
              <li className="text-sm text-slate-500">About {Math.max(2, Math.round(plan.length / 5))} minutes. You’ll type every answer from memory.</li>
            </ul>
            <button type="button" onClick={begin} className="rounded-2xl bg-indigo-600 px-6 py-4 text-xl font-semibold text-white hover:bg-indigo-700">
              Start today’s practice
            </button>
          </div>
        ) : (
          <div className="grid gap-3 rounded-3xl bg-white p-6 text-center ring-1 ring-slate-200">
            <p className="text-4xl" aria-hidden="true">
              🎉
            </p>
            <h2 className="text-xl font-semibold">All done for today!</h2>
            <p className="text-slate-600">Your facts are resting so they stick. Come back tomorrow — short daily practice beats one long session.</p>
            <button type="button" onClick={onExplore} className="mx-auto rounded-2xl bg-white px-5 py-3 font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50">
              Explore the chart
            </button>
          </div>
        )}
        <HowItWorks />
      </div>
    );
  }

  if (phase === 'done') {
    const after = memoryStatus(progress, new Date());
    const firstTry = outcomes.filter((o) => o.firstTry).length;
    const tomorrow = dueWithin(progress, new Date(), 1);
    return (
      <div className="mx-auto grid max-w-2xl gap-5">
        <div className="grid gap-4 rounded-3xl bg-white p-6 text-center ring-1 ring-slate-200">
          <p className="text-5xl" aria-hidden="true">
            🧠
          </p>
          <h2 className="text-2xl font-semibold">Practice complete!</h2>
          <p className="text-lg text-slate-600">
            You recalled <strong>{firstTry}</strong> of <strong>{outcomes.length}</strong> facts on the first try.
          </p>
          {after.memorized > startMemorized && (
            <p className="font-semibold text-emerald-700">
              +{after.memorized - startMemorized} fact{after.memorized - startMemorized === 1 ? '' : 's'} memorized today!
            </p>
          )}
          <p className="text-slate-600">
            {tomorrow > 0 ? `${tomorrow} fact${tomorrow === 1 ? '' : 's'} will be ready to practice tomorrow.` : 'Come back tomorrow for new facts.'}
          </p>
        </div>
        <MemoryMeter memorized={after.memorized} learning={after.learning} unseen={after.unseen} total={after.total} />
      </div>
    );
  }

  if (!item) return null;
  const { a, b, product } = item.fact;
  const strategy = factStrategy(a, b);
  const hook = factHook(a, b);

  return (
    <div className="mx-auto grid max-w-xl gap-5">
      <ProgressBar label={`${pos + 1} of ${queue.length}`} value={(100 * pos) / queue.length} showValue={false} />

      {item.kind === 'learn' ? (
        <div className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200">
          <span className="mx-auto rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">🌱 New fact</span>
          <h2 className="text-center text-5xl font-bold tabular-nums">
            {a} × {b} = <span className="text-indigo-700">{product}</span>
          </h2>
          <p className="text-center text-slate-600">Say it out loud three times: “{a} times {b} is {product}.”</p>
          {hook && (
            <Callout kind="hook">
              <span className="font-semibold">{hook}</span>
            </Callout>
          )}
          <Callout kind="rule">
            <strong>{strategy.name}.</strong> {strategy.tip}
          </Callout>
          <StepsPanel steps={strategy.steps} />
          <VisualExplanation spec={factVisual(a, b)} />
          <button type="button" autoFocus onClick={advance} className="rounded-2xl bg-indigo-600 px-5 py-3 text-lg font-semibold text-white hover:bg-indigo-700">
            I’ve got it
          </button>
        </div>
      ) : (
        <>
          <div className="rounded-[2rem] bg-white p-6 text-center shadow-lg ring-1 ring-slate-200">
            <h2 className="text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">
              {a} × {b}
            </h2>
            <p
              aria-label="Your answer"
              className={`mx-auto mt-4 min-h-16 max-w-48 rounded-2xl px-4 py-2 text-4xl font-bold tabular-nums ring-2 ${
                feedback ? (feedback.correct ? 'bg-emerald-50 text-emerald-700 ring-emerald-300' : 'bg-rose-50 text-rose-700 ring-rose-300') : 'ring-slate-200'
              }`}
            >
              {typed || <span className="text-slate-300">?</span>}
            </p>
          </div>
          <p role="status" aria-live="polite" className="min-h-6 text-center font-semibold">
            {feedback?.correct && <span className="text-emerald-700">✓ {product}</span>}
            {feedback && !feedback.correct && (
              <span className="text-rose-700">
                {a} × {b} = {product}. It will come back in a moment.
              </span>
            )}
          </p>
          {feedback && !feedback.correct ? (
            <div className="grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
              {hook && <p className="font-semibold text-amber-800">💡 {hook}</p>}
              <p>
                <strong>{strategy.name}:</strong> {strategy.tip}
              </p>
              <StepsPanel steps={strategy.steps} />
              <button type="button" autoFocus onClick={advance} className="rounded-2xl bg-indigo-600 px-5 py-3 text-lg font-semibold text-white hover:bg-indigo-700">
                Next <kbd className="ml-1 text-sm text-indigo-200">Enter</kbd>
              </button>
            </div>
          ) : (
            <NumberPad
              disabled={!!feedback}
              canSubmit={typed.length > 0}
              onDigit={(d) => setTyped((t) => (t.length < 3 ? t + d : t))}
              onDelete={() => setTyped((t) => t.slice(0, -1))}
              onSubmit={submit}
            />
          )}
        </>
      )}
    </div>
  );
}

function MemoryMeter({ memorized, learning, unseen, total }: { memorized: number; learning: number; unseen: number; total: number }) {
  return (
    <section aria-labelledby="memory-meter" className="grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="memory-meter" className="text-lg font-semibold">
          🧠 Facts memorized
        </h2>
        <span className="text-2xl font-bold tabular-nums">
          {memorized} <span className="text-base font-medium text-slate-500">/ {total}</span>
        </span>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-slate-200" role="img" aria-label={`${memorized} memorized, ${learning} learning, ${unseen} not started`}>
        <div className="bg-emerald-500" style={{ width: `${(100 * memorized) / total}%` }} />
        <div className="bg-amber-400" style={{ width: `${(100 * learning) / total}%` }} />
      </div>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
        <span>
          <span className="mr-1 inline-block size-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
          Memorized {memorized}
        </span>
        <span>
          <span className="mr-1 inline-block size-2.5 rounded-full bg-amber-400" aria-hidden="true" />
          Learning {learning}
        </span>
        <span>
          <span className="mr-1 inline-block size-2.5 rounded-full bg-slate-300" aria-hidden="true" />
          Not started {unseen}
        </span>
      </p>
    </section>
  );
}

function HowItWorks() {
  return (
    <details className="rounded-3xl bg-white p-5 text-slate-700 ring-1 ring-slate-200">
      <summary className="cursor-pointer font-semibold">How does this help me remember?</summary>
      <ul className="mt-3 grid list-disc gap-1.5 pl-5 text-sm">
        <li>
          <strong>A few new facts a day.</strong> Each day adds two new pairs, like 7 × 8 and 8 × 7, so your brain isn’t flooded.
        </li>
        <li>
          <strong>Recall, don’t recognize.</strong> Typing the answer from memory makes it stick much better than picking it.
        </li>
        <li>
          <strong>Mistakes come back.</strong> A missed fact returns a few questions later, until you get it.
        </li>
        <li>
          <strong>Spaced review.</strong> Facts you know come back after longer and longer gaps — 1 day, 3 days, a week, a month.
        </li>
        <li>
          <strong>Memorized means fast and lasting.</strong> A fact counts as memorized after several quick, correct answers on different days.
        </li>
      </ul>
    </details>
  );
}
