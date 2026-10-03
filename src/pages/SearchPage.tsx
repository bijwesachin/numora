import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/app/AppShell';
import { curriculum } from '@/content';
import { MathText } from '@/components/MathText';
import { CARD_TYPE_LABEL } from '@/domain/flashcard';
import { buildSearchIndex, search, type SearchIndex } from '@/domain/search';

let index: SearchIndex | undefined;
/** Built on first use and kept for the session. */
function getIndex(): SearchIndex {
  index ??= buildSearchIndex(curriculum);
  return index;
}

const SUGGESTIONS = ['equivalent fractions', '7 × 8', 'negative numbers', 'area', 'remainder', 'decimals', 'gcf', 'volume'];

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const results = useMemo(() => (query.trim() ? search(getIndex(), query) : undefined), [query]);
  const total = results ? results.concepts.length + results.cards.length : 0;

  const setQuery = (q: string) => setParams(q ? { q } : {}, { replace: true });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="🔍 Search" subtitle="Find any topic, rule or problem." />

      <form role="search" onSubmit={(e) => e.preventDefault()} className="mb-6">
        <label htmlFor="search-input" className="sr-only">
          Search topics and cards
        </label>
        <input
          id="search-input"
          type="search"
          autoFocus
          autoComplete="off"
          enterKeyHint="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “fractions”, “7 × 8” or “absolute value”"
          className="w-full rounded-2xl bg-white px-5 py-4 text-lg shadow-sm ring-1 ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </form>

      <p className="sr-only" role="status" aria-live="polite">
        {results ? `${total} results` : ''}
      </p>

      {!results && <Suggestions onPick={setQuery} />}

      {results && total === 0 && (
        <div className="grid gap-4 rounded-3xl bg-white p-6 text-center ring-1 ring-slate-200">
          <p className="text-lg text-slate-700">
            No matches for “<span className="font-semibold">{query}</span>”.
          </p>
          <p className="text-slate-500">Check the spelling, or try fewer or different words.</p>
          <Suggestions onPick={setQuery} />
        </div>
      )}

      {results && results.concepts.length > 0 && (
        <section aria-labelledby="topic-results" className="mb-8">
          <h2 id="topic-results" className="mb-3 text-lg font-semibold">
            Topics
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {results.concepts.map((r) => {
              const hasCards = curriculum.cardsOfConcept(r.id).length > 0;
              const body = (
                <>
                  <span className="block font-semibold">{r.title}</span>
                  <span className="block text-sm text-slate-500">{r.subtitle}</span>
                  {!hasCards && <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Coming soon</span>}
                </>
              );
              return (
                <li key={r.id}>
                  {hasCards ? (
                    <Link to={`/concepts/${r.id}`} className="block h-full rounded-2xl bg-white p-4 ring-1 ring-slate-200 hover:shadow-md hover:ring-slate-300">
                      {body}
                    </Link>
                  ) : (
                    <div className="h-full rounded-2xl border border-dashed border-slate-300 p-4 text-slate-600">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {results && results.cards.length > 0 && (
        <section aria-labelledby="card-results">
          <h2 id="card-results" className="mb-3 text-lg font-semibold">
            Cards
          </h2>
          <ul className="grid gap-2">
            {results.cards.map((r) => (
              <li key={r.id}>
                <Link to={`/cards/${r.id}`} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 hover:shadow-md hover:ring-slate-300">
                  <span className="mt-0.5 shrink-0 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                    {r.card ? CARD_TYPE_LABEL[r.card.type] : 'Card'}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-slate-900">
                      <MathText text={r.title} compact />
                    </span>
                    <span className="block text-sm text-slate-500">{r.subtitle}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Suggestions({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-sm text-slate-500">Popular searches</p>
      <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" onClick={() => onPick(s)} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-indigo-50 pointer-coarse:min-h-11">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
