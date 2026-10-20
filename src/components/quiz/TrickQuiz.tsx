import type { TrickQuestion } from '@/domain/dailyQuiz';
import { trickQuestionId } from '@/domain/quizScores';
import { factStrategy } from '@/domain/timesTables';
import { StepsPanel } from '../flashcard/CardPanels';
import { Choices, QuizProgress, QuizSummary, useQuizRun } from './QuizParts';

/** Multiple choice: pick the mental-math trick that fits each fact, then see it worked out. */
export function TrickQuiz({ day, questions }: { day: string; questions: TrickQuestion[] }) {
  const { index, given, answers, submit, next } = useQuizRun(
    'tricks',
    day,
    questions.map((q) => trickQuestionId(q.fact.a, q.fact.b)),
  );

  const current = questions[index];
  if (!current) {
    const missed = questions.filter((_, i) => answers[i] && !answers[i].correct);
    return (
      <QuizSummary correct={answers.length - missed.length} total={questions.length} noun="tricks">
        {missed.length > 0 ? (
          <ul className="grid gap-2 text-left">
            {missed.map(({ fact, answer }) => (
              <li key={`${fact.a}x${fact.b}`} className="rounded-2xl bg-slate-50 px-4 py-2">
                <span className="font-semibold tabular-nums">
                  {fact.a} × {fact.b}
                </span>{' '}
                — {answer}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600">Perfect! You know your tricks.</p>
        )}
      </QuizSummary>
    );
  }

  const { a, b } = current.fact;
  const strategy = factStrategy(a, b);

  const answer = (choice: string) => submit({ given: choice, correct: choice === current.answer });

  return (
    <div className="mx-auto grid max-w-xl gap-5">
      <QuizProgress index={index} total={questions.length} />

      <div className="rounded-[2rem] bg-white p-6 text-center shadow-lg ring-1 ring-slate-200">
        <p className="text-slate-600">Which trick works for</p>
        <h2 className="text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">
          {a} × {b}
        </h2>
      </div>

      <Choices id={index} choices={current.choices} answer={current.answer} given={given} onAnswer={answer} />

      <p role="status" aria-live="polite" className="min-h-6 text-center font-semibold">
        {given &&
          (given === current.answer ? <span className="text-emerald-700">✓ Yes!</span> : <span className="text-rose-700">Not quite — use “{current.answer}”</span>)}
      </p>

      {given && (
        <div className="grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <p>{strategy.tip}</p>
          <StepsPanel steps={strategy.steps} />
          <button type="button" autoFocus onClick={next} className="rounded-2xl bg-indigo-600 px-5 py-3 text-lg font-semibold text-white hover:bg-indigo-700">
            {index + 1 < questions.length ? 'Next' : 'See my score'}
          </button>
        </div>
      )}
    </div>
  );
}
