import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '@/app/AppShell';
import { curriculum } from '@/content';
import { MasteryBadge } from '@/components/MasteryBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { CATEGORY_THEME } from '@/components/theme';
import { deckStats, isWeakConcept } from '@/domain/progress/stats';
import { useProgressStore } from '@/state/progressStore';
import { NotFoundPage } from './NotFoundPage';

/** Topic dashboard: every unit in a category and the concepts inside it. */
export function CategoryPage() {
  const { categoryId = '' } = useParams();
  const category = curriculum.category(categoryId);
  const progress = useProgressStore((s) => s.cards);

  const units = useMemo(() => {
    const now = new Date();
    return curriculum.unitsOf(categoryId).map((unit) => ({
      unit,
      concepts: curriculum.conceptsOfUnit(unit.id).map((concept) => {
        const cards = curriculum.cardsOfConcept(concept.id);
        return { concept, stats: deckStats(cards, progress, now), weak: isWeakConcept(cards, progress) };
      }),
    }));
  }, [categoryId, progress]);

  if (!category) return <NotFoundPage />;
  const theme = CATEGORY_THEME[category.color];

  return (
    <div>
      <PageHeader
        back={{ href: '/', label: 'All topics' }}
        title={`${category.icon} ${category.title}`}
        subtitle={category.blurb}
      />
      {category.feature && (
        <Link
          to={category.feature.href}
          className="mb-8 flex items-center justify-between gap-4 rounded-3xl bg-indigo-600 p-5 text-white shadow-sm hover:bg-indigo-700"
        >
          <span>
            <span className="block text-lg font-semibold">{category.feature.label}</span>
            <span className="text-indigo-100">Interactive chart, tricks and a speed game — all saved to your progress.</span>
          </span>
          <span aria-hidden="true" className="text-3xl">
            →
          </span>
        </Link>
      )}
      <div className="grid gap-8">
        {units.map(({ unit, concepts }) => (
          <section key={unit.id} aria-labelledby={`unit-${unit.id}`}>
            <h2 id={`unit-${unit.id}`} className={`mb-3 text-xl font-semibold ${theme.text}`}>
              {unit.title}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {concepts.map(({ concept, stats, weak }) => (
                <li key={concept.id}>
                  {stats.total > 0 ? (
                    <Link
                      to={`/concepts/${concept.id}`}
                      className="flex h-full flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:shadow-md hover:ring-slate-300"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{concept.title}</h3>
                        <MasteryBadge level={stats.level} />
                      </div>
                      <ProgressBar label={`${stats.completed} of ${stats.total} cards`} value={stats.completionPercent} barClass={theme.bar} />
                      <p className="flex gap-3 text-sm text-slate-500">
                        <span>Mastery {stats.masteryPercent}%</span>
                        {stats.due > 0 && <span className="font-medium text-indigo-700">{stats.due} due</span>}
                        {weak && <span className="font-medium text-rose-700">Needs practice</span>}
                      </p>
                    </Link>
                  ) : (
                    <div className="flex h-full items-center justify-between gap-2 rounded-2xl border border-dashed border-slate-300 p-4 text-slate-500">
                      <span>{concept.title}</span>
                      <span className="text-xs">Coming soon</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
