import { useMemo } from 'react';
import { curriculum } from '@/content';
import { DailyReview, UpNext, WeakAreas } from '@/components/DashboardPanels';
import { ProgressBar } from '@/components/ProgressBar';
import { TopicCard } from '@/components/TopicCard';
import { recommendNextConcept } from '@/domain/progress/recommend';
import { deckStats, dueCards, weakConceptIds } from '@/domain/progress/stats';
import { practiceWhatINeed } from '@/domain/progress/weakAreas';
import { isTimesTableFactId, memoryStatus } from '@/domain/timesTables';
import { useProgressStore } from '@/state/progressStore';

export function DashboardPage() {
  const progress = useProgressStore((s) => s.cards);

  const view = useMemo(() => {
    const now = new Date();
    const overall = deckStats(curriculum.cards, progress, now);
    const notFact = (card: { id: string }) => !isTimesTableFactId(card.id);
    const practice = practiceWhatINeed(curriculum, progress, now, 20, notFact);
    const practiceConcepts = [...new Set(practice.map((p) => p.card.conceptId))].flatMap((id) => curriculum.concept(id) ?? []);
    const next = recommendNextConcept(curriculum, progress, now);
    const nextCategory = next && curriculum.category(curriculum.unit(next.unitId)?.categoryId ?? '');
    const categories = curriculum.categories.map((category) => {
      const concepts = curriculum.conceptsOfCategory(category.id);
      return {
        category,
        conceptCount: concepts.length,
        stats: deckStats(curriculum.cardsOfCategory(category.id), progress, now),
        weak: weakConceptIds(curriculum, concepts.map((c) => c.id), progress).map((id) => curriculum.concept(id)!.title),
      };
    });
    return { overall, due: dueCards(curriculum.cards.filter(notFact), progress, now).length, tables: memoryStatus(progress, now), practice, practiceConcepts, next, nextCategory, categories };
  }, [progress]);

  return (
    <div className="grid gap-8">
      <header className="grid gap-4 sm:grid-cols-[1fr_18rem] sm:items-end">
        <div>
          <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">Numora</p>
          <h1 className="text-4xl font-bold tracking-tight">5th Grade Math</h1>
          <p className="mt-1 text-lg text-slate-600">Understand it. Remember it. Use it.</p>
        </div>
        <div className="grid gap-2 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
          <ProgressBar label="Cards completed" value={view.overall.completionPercent} />
          <ProgressBar label="Mastery" value={view.overall.masteryPercent} barClass="bg-emerald-500" />
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <DailyReview dueCount={view.due} tablesDue={view.tables.due} />
        <WeakAreas cards={view.practice} concepts={view.practiceConcepts} />
        <UpNext concept={view.next} categoryTitle={view.nextCategory?.title} />
      </div>

      <section aria-labelledby="topics">
        <h2 id="topics" className="mb-4 text-2xl font-semibold">
          Topics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {view.categories.map(({ category, stats, weak, conceptCount }) => (
            <TopicCard key={category.id} category={category} stats={stats} weakConcepts={weak} conceptCount={conceptCount} />
          ))}
        </div>
      </section>
    </div>
  );
}
