import { Link } from 'react-router-dom';
import type { Concept } from '@/domain/curriculum';
import type { PrioritizedCard } from '@/domain/progress/weakAreas';

const panel = 'flex flex-col gap-3 rounded-3xl p-5 ring-1';

export function DailyReview({ dueCount }: { dueCount: number }) {
  return (
    <section className={`${panel} bg-indigo-600 text-white ring-indigo-700`} aria-labelledby="daily-review">
      <h2 id="daily-review" className="text-lg font-semibold">
        <span aria-hidden="true">🔁 </span>Daily Review
      </h2>
      {dueCount > 0 ? (
        <>
          <p className="text-indigo-100">
            <span className="text-4xl font-bold text-white tabular-nums">{dueCount}</span> card{dueCount === 1 ? '' : 's'} ready to remember
          </p>
          <Link to="/review" className="mt-auto rounded-2xl bg-white px-4 py-2.5 text-center font-semibold text-indigo-700 hover:bg-indigo-50">
            Start review
          </Link>
        </>
      ) : (
        <p className="text-indigo-100">All caught up! Cards come back here when it’s time to remember them.</p>
      )}
    </section>
  );
}

export function WeakAreas({ cards, concepts }: { cards: PrioritizedCard[]; concepts: Concept[] }) {
  return (
    <section className={`${panel} bg-white ring-slate-200`} aria-labelledby="weak-areas">
      <h2 id="weak-areas" className="text-lg font-semibold">
        <span aria-hidden="true">🎯 </span>Practice What I Need
      </h2>
      {cards.length > 0 ? (
        <>
          <p className="text-slate-600">
            {cards.length} card{cards.length === 1 ? '' : 's'} picked for you
            {concepts.length > 0 && (
              <>
                {' '}from <span className="font-medium text-slate-800">{concepts.slice(0, 3).map((c) => c.title).join(', ')}</span>
              </>
            )}
            .
          </p>
          <Link to="/practice" className="mt-auto rounded-2xl bg-rose-600 px-4 py-2.5 text-center font-semibold text-white hover:bg-rose-700">
            Practice now
          </Link>
        </>
      ) : (
        <p className="text-slate-600">Nothing tricky yet. Cards you miss or find hard will show up here.</p>
      )}
    </section>
  );
}

export function UpNext({ concept, categoryTitle }: { concept: Concept | undefined; categoryTitle?: string }) {
  return (
    <section className={`${panel} bg-white ring-slate-200`} aria-labelledby="up-next">
      <h2 id="up-next" className="text-lg font-semibold">
        <span aria-hidden="true">🚀 </span>Up Next
      </h2>
      {concept ? (
        <>
          <p className="text-slate-600">
            <span className="block text-sm">{categoryTitle}</span>
            <span className="text-xl font-semibold text-slate-900">{concept.title}</span>
          </p>
          <Link to={`/concepts/${concept.id}`} className="mt-auto rounded-2xl bg-slate-900 px-4 py-2.5 text-center font-semibold text-white hover:bg-slate-700">
            Keep learning
          </Link>
        </>
      ) : (
        <p className="text-slate-600">You’ve studied every card available. Amazing work!</p>
      )}
    </section>
  );
}
