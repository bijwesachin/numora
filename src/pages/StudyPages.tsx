import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/app/AppShell';
import { curriculum } from '@/content';
import { FlashcardDeck } from '@/components/flashcard/FlashcardDeck';
import { progressionOrder } from '@/domain/deck/ordering';
import type { Flashcard } from '@/domain/flashcard';
import { dueCards } from '@/domain/progress/stats';
import { practiceWhatINeed } from '@/domain/progress/weakAreas';
import { useProgressStore } from '@/state/progressStore';
import { NotFoundPage } from './NotFoundPage';

/**
 * Each study page picks a list of cards once (on mount) and hands it to the deck.
 * Freezing the list keeps a session stable while ratings change progress underneath.
 */
function useFrozenCards(select: () => Flashcard[]): Flashcard[] {
  const [cards] = useState(select);
  return cards;
}

export function ConceptStudyPage() {
  const { conceptId = '' } = useParams();
  return <ConceptStudy key={conceptId} conceptId={conceptId} />;
}

function ConceptStudy({ conceptId }: { conceptId: string }) {
  const concept = curriculum.concept(conceptId);
  const cards = useFrozenCards(() => progressionOrder(curriculum.cardsOfConcept(conceptId)));
  if (!concept) return <NotFoundPage />;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back={{ href: `/concepts/${concept.id}`, label: concept.title }} title={concept.title} />
      <FlashcardDeck cards={cards} exitTo={{ href: `/concepts/${concept.id}`, label: 'Back to topic' }} />
    </div>
  );
}

export function DailyReviewPage() {
  const cards = useFrozenCards(() => dueCards(curriculum.cards, useProgressStore.getState().cards, new Date()));
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back={{ href: '/', label: 'Home' }} title="Daily Review" subtitle="Cards that are ready to be remembered." />
      {cards.length > 0 ? <FlashcardDeck cards={cards} exitTo={{ href: '/', label: 'Back home' }} /> : <EmptyState message="Nothing is due right now. Great job keeping up!" />}
    </div>
  );
}

export function PracticePage() {
  const cards = useFrozenCards(() => practiceWhatINeed(curriculum, useProgressStore.getState().cards, new Date()).map((p) => p.card));
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back={{ href: '/', label: 'Home' }} title="Practice What I Need" subtitle="Cards you missed, found hard, or need to build on." />
      {cards.length > 0 ? (
        <FlashcardDeck cards={cards} exitTo={{ href: '/', label: 'Back home' }} />
      ) : (
        <EmptyState message="No weak spots yet! Keep studying and this will fill with cards that need extra practice." />
      )}
    </div>
  );
}

export function SavedPage() {
  const cards = useFrozenCards(() =>
    progressionOrder(Object.keys(useProgressStore.getState().bookmarks).flatMap((id) => curriculum.card(id) ?? [])),
  );
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back={{ href: '/', label: 'Home' }} title="Saved Cards" subtitle="Cards you starred to come back to." />
      {cards.length > 0 ? <FlashcardDeck cards={cards} exitTo={{ href: '/', label: 'Back home' }} /> : <EmptyState message="Tap ☆ Save on any card to keep it here." />}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="rounded-3xl bg-white p-8 text-center text-lg text-slate-600 ring-1 ring-slate-200">{message}</p>;
}
