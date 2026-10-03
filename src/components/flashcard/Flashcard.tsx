import { useEffect, useRef } from 'react';
import { CARD_TYPE_LABEL, DIFFICULTY_LABEL, type CardType, type Flashcard as FlashcardModel } from '@/domain/flashcard';
import { MathText } from '../MathText';
import { Callout, HintPanel, StepsPanel, VisualExplanation, WorkedExample } from './CardPanels';

interface FlashcardProps {
  card: FlashcardModel;
  flipped: boolean;
  hintOpen: boolean;
  stepsOpen: boolean;
  onFlip: () => void;
  onToggleHint: () => void;
  onToggleSteps: () => void;
}

const TYPE_STYLE: Record<CardType, string> = {
  concept: 'bg-indigo-100 text-indigo-800',
  rule: 'bg-sky-100 text-sky-800',
  visual: 'bg-amber-100 text-amber-900',
  solve: 'bg-emerald-100 text-emerald-800',
  misconception: 'bg-rose-100 text-rose-800',
  'real-life': 'bg-teal-100 text-teal-800',
  challenge: 'bg-violet-100 text-violet-800',
};

/** Presentational two-sided card. State lives in the deck so keyboard shortcuts can drive it. */
export function Flashcard({ card, flipped, hintOpen, stepsOpen, onFlip, onToggleHint, onToggleSteps }: FlashcardProps) {
  const faceRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    // Focus follows the flip so keyboard and screen-reader users land on the new side.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    faceRef.current?.focus();
  }, [flipped]);

  const face = 'flex flex-col gap-5 rounded-[2rem] bg-white p-5 shadow-lg ring-1 ring-slate-200 sm:p-8';

  // Only the visible face is mounted; the key restarts the flip-in animation on each turn.
  return !flipped ? (
    <section key="front" ref={faceRef} tabIndex={-1} className={`${face} outline-none`} aria-label="Question">
      <CardMeta card={card} />
      <h2 className="text-center text-2xl leading-snug font-semibold text-balance sm:text-3xl">
        <MathText text={card.front} />
      </h2>
      {card.visual && <VisualExplanation spec={card.visual} />}
      {card.image && <img src={card.image.src} alt={card.image.alt} className="mx-auto max-h-64 rounded-2xl" />}
      <div className="mt-auto flex flex-col items-center gap-4 pt-2">
        {card.hint && <HintPanel hint={card.hint} open={hintOpen} onToggle={onToggleHint} />}
        <button
          type="button"
          onClick={onFlip}
          className="w-full max-w-xs rounded-2xl bg-indigo-600 px-6 py-3.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Show answer <kbd className="ml-1 text-sm text-indigo-200">Space</kbd>
        </button>
      </div>
    </section>
  ) : (
    <section key="back" ref={faceRef} tabIndex={-1} className={`${face} flip-in outline-none`} aria-label="Answer">
      <CardMeta card={card} />
      <div className="text-center">
        <p className="text-sm font-medium tracking-wide text-slate-500 uppercase">Answer</p>
        <p className="mt-1 text-2xl leading-snug font-semibold text-balance text-emerald-800 sm:text-3xl">
          <MathText text={card.back} />
        </p>
      </div>
      {/* Keep the picture next to the answer so the two are remembered together. */}
      {(card.answerVisual ?? card.visual) && <VisualExplanation spec={(card.answerVisual ?? card.visual)!} />}
      <div className="grid gap-3">
        {card.explanation && (
          <Callout kind="why">
            <MathText text={card.explanation} />
          </Callout>
        )}
        {card.rule && (
          <Callout kind="rule">
            <MathText text={card.rule} />
          </Callout>
        )}
        {card.memoryHook && (
          <Callout kind="hook">
            <MathText text={card.memoryHook} />
          </Callout>
        )}
        {card.example && <WorkedExample example={card.example} />}
        {card.commonMistake && (
          <Callout kind="mistake">
            <MathText text={card.commonMistake} />
          </Callout>
        )}
      </div>
      {card.steps && (
        <div className="grid gap-3">
          <button
            type="button"
            onClick={onToggleSteps}
            aria-expanded={stepsOpen}
            className="mx-auto rounded-full px-4 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50"
          >
            {stepsOpen ? 'Hide steps' : 'Show steps'} <kbd className="ml-1 text-xs text-emerald-400">S</kbd>
          </button>
          {stepsOpen && <StepsPanel steps={card.steps} />}
        </div>
      )}
      <button type="button" onClick={onFlip} className="mx-auto mt-auto text-sm text-slate-500 underline-offset-4 hover:underline">
        See the question again
      </button>
    </section>
  );
}

function CardMeta({ card }: { card: FlashcardModel }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${TYPE_STYLE[card.type]}`}>{CARD_TYPE_LABEL[card.type]}</span>
      <DifficultyMeter level={card.difficulty} />
    </div>
  );
}

export function DifficultyMeter({ level }: { level: number }) {
  const label = DIFFICULTY_LABEL[level as keyof typeof DIFFICULTY_LABEL];
  return (
    <span className="flex items-center gap-2 text-sm text-slate-500" title={`Level ${level}: ${label}`}>
      <span className="sr-only">
        Difficulty level {level} of 5: {label}
      </span>
      <span className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`size-2.5 rounded-full ${n <= level ? 'bg-indigo-500' : 'bg-slate-200'}`} />
        ))}
      </span>
      <span aria-hidden="true">{label}</span>
    </span>
  );
}
