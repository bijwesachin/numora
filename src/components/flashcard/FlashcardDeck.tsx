import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { curriculum } from '@/content';
import { prerequisiteSafeShuffle } from '@/domain/deck/ordering';
import { createSession, currentCardId, isFinished, sessionReducer, summarizeSession } from '@/domain/deck/session';
import type { Flashcard as FlashcardModel } from '@/domain/flashcard';
import { describeNextInterval, newCardProgress } from '@/domain/review/scheduler';
import type { Rating } from '@/domain/review/types';
import { useProgressStore } from '@/state/progressStore';
import { ProgressBar } from '../ProgressBar';
import { Flashcard } from './Flashcard';
import { ReviewControls } from './ReviewControls';

interface FlashcardDeckProps {
  /** Cards in the order they should first be studied. */
  cards: FlashcardModel[];
  /** Where "Done" leads. */
  exitTo: { href: string; label: string };
}

const ENCOURAGEMENT: Record<Rating, string[]> = {
  again: ['No problem — you’ll see it again soon.', 'Mistakes help memory. It’s coming back in a few cards.'],
  hard: ['Nice effort! We’ll check back tomorrow.', 'Tough one — you still got it.'],
  good: ['Nice recall!', 'You knew it!', 'Solid!'],
  easy: ['Too easy for you!', 'Excellent!', 'Super quick!'],
};

/**
 * Runs one study session: shows the current card, records ratings, re-queues misses,
 * and supports keyboard control. Session order is fixed at start so ratings don't
 * reshuffle the deck mid-session.
 */
export function FlashcardDeck({ cards, exitTo }: FlashcardDeckProps) {
  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);
  const [session, dispatch] = useReducer(sessionReducer, cardIds, createSession);
  const [feedback, setFeedback] = useState('');
  const rate = useProgressStore((s) => s.rate);

  const cardId = currentCardId(session);

  const handleRate = useCallback(
    (rating: Rating) => {
      if (!cardId) return;
      const now = new Date();
      const prev = useProgressStore.getState().cards[cardId] ?? newCardProgress(cardId);
      const options = ENCOURAGEMENT[rating];
      const cheer = options[session.position % options.length];
      setFeedback(rating === 'again' ? cheer! : `${cheer} Next review in ${describeNextInterval(prev, rating, now)}.`);
      rate(cardId, rating, now);
      dispatch({ type: 'rate', rating });
    },
    [cardId, rate, session.position],
  );

  const restart = (queue: string[]) => {
    setFeedback('');
    dispatch({ type: 'restart', queue });
  };

  if (cards.length === 0) {
    return <p className="rounded-3xl bg-white p-8 text-center text-slate-600 ring-1 ring-slate-200">No cards here yet.</p>;
  }

  if (isFinished(session) || !cardId) {
    const summary = summarizeSession(session);
    return (
      <SessionComplete
        summary={summary}
        exitTo={exitTo}
        onRestart={() => restart(cardIds)}
        onReviewMissed={summary.missed.length > 0 ? () => restart(summary.missed) : undefined}
      />
    );
  }

  const card = curriculum.card(cardId)!;
  const uniqueTotal = new Set(session.queue).size;
  const reviewedSoFar = new Set(session.queue.slice(0, session.position)).size;

  return (
    <div className="grid gap-5">
      <div className="grid gap-3">
        <ProgressBar label={`Card ${Math.min(session.position + 1, session.queue.length)} of ${session.queue.length}`} value={(100 * reviewedSoFar) / uniqueTotal} showValue={false} />
        <DeckToolbar
          cardId={cardId}
          canPrev={session.position > 0}
          onPrev={() => dispatch({ type: 'prev' })}
          onNext={() => dispatch({ type: 'next' })}
          onShuffle={() => restart(prerequisiteSafeShuffle(cards).map((c) => c.id))}
          onRestart={() => restart(cardIds)}
        />
      </div>

      <CardStage key={`${session.position}:${cardId}`} card={card} onRate={handleRate} onPrev={() => dispatch({ type: 'prev' })} onNext={() => dispatch({ type: 'next' })} />

      <p className="min-h-6 text-center text-sm font-medium text-emerald-700" role="status" aria-live="polite">
        {feedback}
      </p>
    </div>
  );
}

/** One card on screen. Keyed by position so flip/hint/steps reset for every card. */
function CardStage({
  card,
  onRate,
  onPrev,
  onNext,
}: {
  card: FlashcardModel;
  onRate: (r: Rating) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [stepsOpen, setStepsOpen] = useState(false);
  const progress = useProgressStore((s) => s.cards[card.id]);
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);
  const location = curriculum.locate(card.id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const onButton = !!target?.closest('button, a');

      switch (e.key) {
        case ' ':
        case 'Enter':
          if (onButton) return; // let the focused control handle it
          e.preventDefault();
          setFlipped((f) => !f);
          break;
        case 'ArrowLeft':
          onPrev();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case 'h':
        case 'H':
          if (card.hint && !flipped) setHintOpen((o) => !o);
          break;
        case 's':
        case 'S':
          if (card.steps && flipped) setStepsOpen((o) => !o);
          break;
        case 'b':
        case 'B':
          toggleBookmark(card.id);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          if (flipped) onRate((['again', 'hard', 'good', 'easy'] as const)[Number(e.key) - 1]!);
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, flipped, onNext, onPrev, onRate, toggleBookmark]);

  return (
    <div className="grid gap-4">
      {location && (
        <p className="text-center text-sm text-slate-500">
          {location.category.title} <span aria-hidden="true">›</span> <span className="font-medium text-slate-700">{location.concept.title}</span>
        </p>
      )}
      <Flashcard
        card={card}
        flipped={flipped}
        hintOpen={hintOpen}
        stepsOpen={stepsOpen}
        onFlip={() => setFlipped((f) => !f)}
        onToggleHint={() => setHintOpen((o) => !o)}
        onToggleSteps={() => setStepsOpen((o) => !o)}
      />
      <ReviewControls cardId={card.id} progress={progress} enabled={flipped} onRate={onRate} />
    </div>
  );
}

function DeckToolbar({
  cardId,
  canPrev,
  onPrev,
  onNext,
  onShuffle,
  onRestart,
}: {
  cardId: string;
  canPrev: boolean;
  onPrev: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onRestart: () => void;
}) {
  const bookmarked = useProgressStore((s) => !!s.bookmarks[cardId]);
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);
  const btn = 'inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40';

  return (
    <div className="flex flex-wrap items-center justify-between gap-2" role="toolbar" aria-label="Deck controls">
      <div className="flex gap-2">
        <button type="button" className={btn} onClick={onPrev} disabled={!canPrev} aria-label="Previous card">
          <span aria-hidden="true">←</span> <span className="hidden sm:inline">Previous</span>
        </button>
        <button type="button" className={btn} onClick={onNext} aria-label="Next card (skip)">
          <span className="hidden sm:inline">Next</span> <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="flex gap-2">
        <button type="button" className={btn} onClick={() => toggleBookmark(cardId)} aria-pressed={bookmarked}>
          <span aria-hidden="true" className={bookmarked ? 'text-amber-500' : ''}>
            {bookmarked ? '★' : '☆'}
          </span>
          <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
          <span className="sr-only sm:hidden">Bookmark</span>
        </button>
        <button type="button" className={btn} onClick={onShuffle}>
          <span aria-hidden="true">🔀</span> <span className="hidden sm:inline">Shuffle</span>
          <span className="sr-only sm:hidden">Shuffle</span>
        </button>
        <button type="button" className={btn} onClick={onRestart}>
          <span aria-hidden="true">↺</span> <span className="hidden sm:inline">Restart</span>
          <span className="sr-only sm:hidden">Restart</span>
        </button>
      </div>
    </div>
  );
}

function SessionComplete({
  summary,
  exitTo,
  onRestart,
  onReviewMissed,
}: {
  summary: ReturnType<typeof summarizeSession>;
  exitTo: { href: string; label: string };
  onRestart: () => void;
  onReviewMissed?: () => void;
}) {
  const allFirstTry = summary.rated > 0 && summary.firstTryCorrect === summary.rated;
  return (
    <div className="grid gap-5 rounded-[2rem] bg-white p-8 text-center shadow-lg ring-1 ring-slate-200">
      <p className="text-5xl" aria-hidden="true">
        {allFirstTry ? '🌟' : '🎉'}
      </p>
      <h2 className="text-2xl font-semibold">{summary.rated === 0 ? 'You flipped through the deck' : 'Session complete!'}</h2>
      {summary.rated > 0 && (
        <p className="text-lg text-slate-600">
          You answered <strong>{summary.firstTryCorrect}</strong> of <strong>{summary.rated}</strong> cards on the first try.
          {summary.missed.length > 0 && ' The ones you missed will come back soon — that’s how memory gets stronger.'}
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        {onReviewMissed && (
          <button type="button" onClick={onReviewMissed} className="rounded-2xl bg-rose-600 px-5 py-3 font-semibold text-white hover:bg-rose-700">
            Practice the {summary.missed.length} I missed
          </button>
        )}
        <button type="button" onClick={onRestart} className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50">
          Go through again
        </button>
        <Link to={exitTo.href} className="rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">
          {exitTo.label}
        </Link>
      </div>
    </div>
  );
}
