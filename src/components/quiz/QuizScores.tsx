import { curriculum } from '@/content';
import { DAILY_QUIZ_LENGTH, dayKey } from '@/domain/dailyQuiz';
import { type QuizAnswer, type QuizKind, QUIZ_KINDS, type QuizScores, scoredDays, scoreOf } from '@/domain/quizScores';
import { factStrategy } from '@/domain/timesTables';
import { MathText } from '../MathText';

export const QUIZ_LABEL: Record<QuizKind, string> = { hints: '🔎 Hint Quiz', tricks: '🧠 Trick Quiz' };

/** "Today", "Yesterday" or e.g. "Sat, Oct 17" for a `YYYY-MM-DD` key. */
export function dayLabel(day: string, now: Date): string {
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(y!, m! - 1, d!);
  if (day === dayKey(now)) return 'Today';
  if (day === dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))) return 'Yesterday';
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

/** The question and right answer behind a saved answer, for review. */
function describe(kind: QuizKind, id: string): { question: string; answer: string } {
  if (kind === 'tricks') {
    const [a, b] = id.split('x').map(Number);
    return { question: `Which trick works for ${a} × ${b}?`, answer: factStrategy(a!, b!).name };
  }
  const card = curriculum.card(id);
  if (!card) return { question: id, answer: '' };
  return { question: card.quiz?.prompt ?? card.front, answer: card.quiz?.answer ?? card.back };
}

export function ScoreLine({ kind, answers }: { kind: QuizKind; answers: readonly QuizAnswer[] | undefined }) {
  const { answered, correct, hintsUsed } = scoreOf(answers);
  return (
    <span>
      {QUIZ_LABEL[kind]}:{' '}
      {answered === 0 ? (
        <span className="text-slate-500">not started</span>
      ) : (
        <>
          <span className="font-semibold tabular-nums">
            {correct} / {answered}
          </span>
          {answered < DAILY_QUIZ_LENGTH && <span className="text-slate-500"> ({answered} of {DAILY_QUIZ_LENGTH} answered)</span>}
          {hintsUsed > 0 && <span className="text-slate-500"> · {hintsUsed} hint{hintsUsed === 1 ? '' : 's'}</span>}
        </>
      )}
    </span>
  );
}

/** Every saved day, newest first, with each answer open for review. */
export function QuizScoresView({ scores, now }: { scores: QuizScores; now: Date }) {
  const days = scoredDays(scores);
  if (days.length === 0) {
    return <p className="rounded-3xl bg-white p-8 text-center text-lg text-slate-600 ring-1 ring-slate-200">No scores yet. Finish a quiz and it shows up here.</p>;
  }
  return (
    <div className="grid gap-4">
      <p className="text-slate-600">Each morning starts a fresh score. The last 30 days are kept here.</p>
      {days.map((day) => (
        <section key={day} aria-label={dayLabel(day, now)} className="grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">{dayLabel(day, now)}</h2>
          {QUIZ_KINDS.map((kind) => {
            const answers = scores[day]?.[kind];
            if (!answers?.length) return null;
            return (
              <details key={kind} className="rounded-2xl bg-slate-50 px-4 py-2">
                <summary className="cursor-pointer py-1">
                  <ScoreLine kind={kind} answers={answers} />
                </summary>
                <ol className="mt-2 grid gap-2 pb-2">
                  {answers.map((a) => {
                    const { question, answer } = describe(kind, a.id);
                    return (
                      <li key={a.id} className="flex gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                        <span aria-label={a.correct ? 'Right' : 'Wrong'}>{a.correct ? '✅' : '❌'}</span>
                        <div className="grid gap-0.5">
                          <MathText text={question} />
                          <span className="text-sm text-slate-600">
                            Picked: <MathText text={a.given} compact />
                            {!a.correct && (
                              <>
                                {' '}· Answer: <MathText text={answer} compact />
                              </>
                            )}
                            {a.usedHint && ' · 🔎 used the hint'}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </details>
            );
          })}
        </section>
      ))}
    </div>
  );
}
