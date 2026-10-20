import { useState } from 'react';
import { rateHintAnswer, type HintQuestion } from '@/domain/dailyQuiz';
import { useProgressStore } from '@/state/progressStore';
import { MathText } from '../MathText';
import { Callout, HintPanel, StepsPanel, VisualExplanation } from '../flashcard/CardPanels';
import { Choices, QuizProgress, QuizSummary, useQuizRun } from './QuizParts';

/** Multiple choice on cards that come with a hint. Each answer is saved to progress like a flashcard rating. */
export function HintQuiz({ day, questions }: { day: string; questions: HintQuestion[] }) {
  const rate = useProgressStore((s) => s.rate);
  const run = useQuizRun(
    'hints',
    day,
    questions.map((q) => q.card.id),
  );
  const { index, given, answers } = run;
  const [hintOpen, setHintOpen] = useState(false);
  const [usedHint, setUsedHint] = useState(false);

  const current = questions[index];
  if (!current) {
    const missed = questions.filter((_, i) => answers[i] && !answers[i].correct);
    return (
      <QuizSummary correct={answers.length - missed.length} total={questions.length} noun="answers">
        {missed.length > 0 ? (
          <ul className="grid gap-2 text-left">
            {missed.map(({ card, prompt, answer }) => (
              <li key={card.id} className="rounded-2xl bg-slate-50 px-4 py-2">
                <MathText text={prompt} /> <span className="font-semibold">→ <MathText text={answer} /></span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600">Perfect score!</p>
        )}
      </QuizSummary>
    );
  }

  const { card } = current;
  const correct = given === current.answer;

  const answer = (choice: string) => {
    const right = choice === current.answer;
    run.submit({ given: choice, correct: right, usedHint });
    rate(card.id, rateHintAnswer(right, usedHint));
  };
  const toggleHint = () => {
    setHintOpen((o) => !o);
    setUsedHint(true);
  };
  const next = () => {
    setHintOpen(false);
    setUsedHint(false);
    run.next();
  };

  return (
    <div className="mx-auto grid max-w-xl gap-5">
      <QuizProgress index={index} total={questions.length} />

      <section aria-label="Question" className="flex flex-col gap-5 rounded-[2rem] bg-white p-5 shadow-lg ring-1 ring-slate-200 sm:p-8">
        <h2 className="text-center text-2xl leading-snug font-semibold text-balance">
          <MathText text={current.prompt} />
        </h2>
        {card.visual && <VisualExplanation spec={card.visual} />}
        {card.image && <img src={card.image.src} alt={card.image.alt} className="mx-auto max-h-64 rounded-2xl" />}
        {!given && card.hint && <HintPanel hint={card.hint} open={hintOpen} onToggle={toggleHint} />}
      </section>

      <Choices id={card.id} choices={current.choices} answer={current.answer} given={given} onAnswer={answer} />

      <p role="status" aria-live="polite" className="min-h-6 text-center font-semibold">
        {given && (correct ? <span className="text-emerald-700">✓ Yes!</span> : <span className="text-rose-700">Not quite</span>)}
      </p>

      {given && (
        <div className="grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <Callout kind="answer">
            <MathText text={card.back} />
          </Callout>
          {card.explanation && (
            <Callout kind="why">
              <MathText text={card.explanation} />
            </Callout>
          )}
          {card.steps && <StepsPanel steps={card.steps} />}
          <button type="button" autoFocus onClick={next} className="rounded-2xl bg-indigo-600 px-5 py-3 text-lg font-semibold text-white hover:bg-indigo-700">
            {index + 1 < questions.length ? 'Next' : 'See my score'}
          </button>
        </div>
      )}
    </div>
  );
}
