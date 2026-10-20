import { type ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import type { QuizAnswer, QuizKind } from '@/domain/quizScores';
import { useProgressStore } from '@/state/progressStore';
import { MathText } from '../MathText';

/** Pieces shared by the daily hint quiz and trick quiz. */

const NO_ANSWERS: QuizAnswer[] = [];

/**
 * Walks through one day's questions, saving each answer to that day's score. Questions already
 * answered today are skipped, so reopening the quiz continues it and a finished quiz shows its
 * score instead of starting over.
 */
export function useQuizRun(kind: QuizKind, day: string, ids: readonly string[]) {
  const answers = useProgressStore((s) => s.quizScores[day]?.[kind]) ?? NO_ANSWERS;
  const record = useProgressStore((s) => s.recordQuizAnswer);
  const [index, setIndex] = useState(() => {
    const done = new Set(answers.map((a) => a.id));
    const first = ids.findIndex((id) => !done.has(id));
    return first === -1 ? ids.length : first;
  });
  const [given, setGiven] = useState<string | null>(null);

  return {
    index,
    given,
    /** Today's saved answers to these questions, in question order. */
    answers: ids.flatMap((id) => answers.find((a) => a.id === id) ?? []),
    submit(answer: Omit<QuizAnswer, 'at' | 'id'>) {
      setGiven(answer.given);
      record(day, kind, { id: ids[index]!, ...answer });
    },
    next() {
      setGiven(null);
      setIndex((i) => i + 1);
    },
  };
}

export function QuizProgress({ index, total }: { index: number; total: number }) {
  return (
    <>
      <p className="text-sm text-slate-500">
        Question {index + 1} of {total}
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-indigo-500 transition-[width]" style={{ width: `${(100 * index) / total}%` }} />
      </div>
    </>
  );
}

/** Answer buttons. Once answered, the right one turns green and a wrong pick turns red. */
export function Choices({ id, choices, answer, given, onAnswer }: { id: string | number; choices: string[]; answer: string; given: string | null; onAnswer: (choice: string) => void }) {
  return (
    <div role="group" aria-label="Choices" className="grid gap-3">
      {choices.map((c) => {
        const tone =
          given && c === answer ? 'bg-emerald-500 text-white ring-emerald-600' : given === c ? 'bg-rose-500 text-white ring-rose-600' : 'bg-white text-slate-800 ring-slate-300 hover:bg-indigo-50';
        return (
          <button
            key={`${id}-${c}`}
            type="button"
            disabled={given !== null}
            onClick={() => onAnswer(c)}
            className={`rounded-2xl px-4 py-3 text-lg font-semibold ring-2 transition-colors ${tone}`}
          >
            <MathText text={c} compact />
          </button>
        );
      })}
    </div>
  );
}

export function QuizSummary({ correct, total, noun, children }: { correct: number; total: number; noun: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-xl gap-4 rounded-3xl bg-white p-6 text-center ring-1 ring-slate-200">
      <h2 className="text-2xl font-bold">
        {correct} / {total} {noun} right
      </h2>
      {children}
      <p className="text-slate-600">New questions tomorrow.</p>
      <Link to="/" className="rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">
        Back home
      </Link>
    </div>
  );
}
