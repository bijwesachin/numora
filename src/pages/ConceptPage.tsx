import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '@/app/AppShell';
import { curriculum } from '@/content';
import { Callout } from '@/components/flashcard/CardPanels';
import { MasteryBadge } from '@/components/MasteryBadge';
import { MathText } from '@/components/MathText';
import { ProgressBar } from '@/components/ProgressBar';
import { LEARNING_STAGES, learningStage } from '@/domain/flashcard';
import { unmetPrerequisites } from '@/domain/progress/recommend';
import { deckStats } from '@/domain/progress/stats';
import { isSeen } from '@/domain/review/scheduler';
import { useProgressStore } from '@/state/progressStore';
import { NotFoundPage } from './NotFoundPage';

/** Overview of one micro-concept: the big idea, prerequisites, the learning path and progress. */
export function ConceptPage() {
  const { conceptId = '' } = useParams();
  const concept = curriculum.concept(conceptId);
  const progress = useProgressStore((s) => s.cards);
  const resetCards = useProgressStore((s) => s.resetCards);
  const [confirmReset, setConfirmReset] = useState(false);

  const view = useMemo(() => {
    if (!concept) return undefined;
    const now = new Date();
    const cards = curriculum.cardsOfConcept(concept.id);
    const stages = LEARNING_STAGES.map((label, i) => {
      const inStage = cards.filter((c) => learningStage(c) === i + 1);
      return { label, total: inStage.length, done: inStage.filter((c) => isSeen(progress[c.id])).length };
    });
    return {
      cards,
      stats: deckStats(cards, progress, now),
      stages,
      unmet: unmetPrerequisites(curriculum, concept, progress, now),
      unit: curriculum.unit(concept.unitId),
    };
  }, [concept, progress]);

  if (!concept || !view) return <NotFoundPage />;
  const { stats, stages, unmet, unit, cards } = view;
  const category = unit && curriculum.category(unit.categoryId);
  const started = stats.completed > 0;

  return (
    <div className="grid gap-6">
      <PageHeader
        back={category ? { href: `/topics/${category.id}`, label: category.title } : undefined}
        title={concept.title}
        subtitle={concept.summary && <MathText text={concept.summary} />}
      />

      {concept.memoryHook && (
        <Callout kind="hook">
          <span className="text-lg">
            <MathText text={concept.memoryHook} />
          </span>
        </Callout>
      )}

      {unmet.length > 0 && (
        <div className="rounded-2xl bg-amber-50 p-4 text-amber-950 ring-1 ring-amber-200">
          <p className="font-medium">This builds on:</p>
          <ul className="mt-1 flex flex-wrap gap-2">
            {unmet.map((pre) => (
              <li key={pre.id}>
                <Link to={`/concepts/${pre.id}`} className="inline-block rounded-full bg-white px-3 py-1 text-sm font-medium ring-1 ring-amber-300 hover:bg-amber-100">
                  {pre.title} →
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm">You can start here anyway, but learning these first will make it easier.</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[1fr_20rem]">
        <section aria-labelledby="path" className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <h2 id="path" className="mb-3 text-lg font-semibold">
            Your learning path
          </h2>
          <ol className="grid gap-2">
            {stages.map((s, i) =>
              s.total === 0 ? null : (
                <li key={s.label} className="flex items-center gap-3">
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-semibold ${s.done === s.total ? 'bg-emerald-500 text-white' : s.done > 0 ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-500'}`}
                    aria-hidden="true"
                  >
                    {s.done === s.total ? '✓' : i + 1}
                  </span>
                  <span className="flex-1">{s.label}</span>
                  <span className="text-sm text-slate-500 tabular-nums">
                    {s.done}/{s.total}
                  </span>
                </li>
              ),
            )}
          </ol>
        </section>

        <aside className="grid content-start gap-4 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Progress</span>
            <MasteryBadge level={stats.level} />
          </div>
          <ProgressBar label="Completed" value={stats.completionPercent} />
          <ProgressBar label="Mastery" value={stats.masteryPercent} barClass="bg-emerald-500" />
          <p className="text-sm text-slate-500">
            {stats.mastered} of {stats.total} cards mastered{stats.due > 0 && ` · ${stats.due} due now`}
          </p>
          <Link
            to={`/concepts/${concept.id}/study`}
            className="rounded-2xl bg-indigo-600 px-5 py-3 text-center text-lg font-semibold text-white hover:bg-indigo-700"
          >
            {started ? 'Continue' : 'Start learning'}
          </Link>
          {started &&
            (confirmReset ? (
              <div className="grid gap-2 rounded-2xl bg-rose-50 p-3 text-sm text-rose-900">
                <p>Erase your progress for this concept?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-xl bg-rose-600 px-3 py-1.5 font-semibold text-white"
                    onClick={() => {
                      resetCards(cards.map((c) => c.id));
                      setConfirmReset(false);
                    }}
                  >
                    Yes, reset
                  </button>
                  <button type="button" className="rounded-xl px-3 py-1.5 ring-1 ring-rose-200" onClick={() => setConfirmReset(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmReset(true)} className="text-sm text-slate-500 hover:text-rose-700">
                Reset progress
              </button>
            ))}
        </aside>
      </div>
    </div>
  );
}
