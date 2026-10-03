import { Link } from 'react-router-dom';
import type { Category } from '@/domain/curriculum';
import type { DeckStats } from '@/domain/progress/stats';
import { MasteryBadge } from './MasteryBadge';
import { ProgressBar } from './ProgressBar';
import { CATEGORY_THEME } from './theme';

interface TopicCardProps {
  category: Category;
  stats: DeckStats;
  weakConcepts: string[];
  conceptCount: number;
}

/** Dashboard tile for one category. */
export function TopicCard({ category, stats, weakConcepts, conceptCount }: TopicCardProps) {
  const theme = CATEGORY_THEME[category.color];
  const hasCards = stats.total > 0;

  return (
    <Link
      to={`/topics/${category.id}`}
      className={`group flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300`}
    >
      <div className="flex items-start gap-3">
        <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-2xl ${theme.tile}`} aria-hidden="true">
          {category.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold leading-tight">{category.title}</h3>
          <p className="text-sm text-slate-500">{category.blurb}</p>
        </div>
        {hasCards && <MasteryBadge level={stats.level} />}
      </div>

      {hasCards ? (
        <>
          <div className="grid gap-2.5">
            <ProgressBar label="Completed" value={stats.completionPercent} barClass={theme.bar} />
            <ProgressBar label="Mastery" value={stats.masteryPercent} barClass="bg-emerald-500" />
          </div>
          <dl className="grid grid-cols-3 gap-2 text-center">
            <Stat label="Cards done" value={`${stats.completed}/${stats.total}`} />
            <Stat label="Due" value={stats.due} highlight={stats.due > 0} />
            <Stat label="Weak spots" value={weakConcepts.length} highlight={weakConcepts.length > 0} />
          </dl>
          {weakConcepts.length > 0 && (
            <p className="text-sm text-rose-700">
              <span className="font-medium">Needs practice:</span> {weakConcepts.slice(0, 2).join(', ')}
              {weakConcepts.length > 2 && ` +${weakConcepts.length - 2}`}
            </p>
          )}
        </>
      ) : (
        <p className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
          {conceptCount} concepts planned · cards coming soon
        </p>
      )}
    </Link>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-slate-50 py-1.5">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className={`text-base font-semibold tabular-nums ${highlight ? 'text-rose-600' : 'text-slate-800'}`}>{value}</dd>
    </div>
  );
}
