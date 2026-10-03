import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/app/AppShell';
import { TimesDaily } from '@/components/times/TimesDaily';
import { TimesExplorer } from '@/components/times/TimesExplorer';
import { TimesSprint } from '@/components/times/TimesSprint';

type Tab = 'daily' | 'explore' | 'sprint';

const TABS: { id: Tab; label: string }[] = [
  { id: 'daily', label: '🧠 Daily Practice' },
  { id: 'explore', label: '🔍 Explore' },
  { id: 'sprint', label: '⚡ Fact Sprint' },
];

export function TimesTablesPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('tab');
  const tab: Tab = requested === 'sprint' || requested === 'explore' ? requested : 'daily';
  const [sprintTables, setSprintTables] = useState<number[]>([6, 7, 8]);
  const [sprintKey, setSprintKey] = useState(0);

  const showTab = (next: Tab) => setParams(next === 'daily' ? {} : { tab: next }, { replace: true });

  return (
    <div>
      <PageHeader
        back={{ href: '/topics/times-tables', label: 'Times Tables' }}
        title="⚡ Times Table Lab"
        subtitle="Memorize every fact up to 15 × 15 — a few minutes a day."
      />
      <div role="tablist" aria-label="Times Table Lab" className="mb-6 inline-flex max-w-full flex-wrap rounded-2xl bg-slate-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => showTab(t.id)}
            className={`rounded-xl px-4 py-2 font-semibold pointer-coarse:min-h-11 ${tab === t.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === 'daily' ? (
          <TimesDaily onExplore={() => showTab('explore')} />
        ) : tab === 'explore' ? (
          <TimesExplorer
            onSprint={(table) => {
              setSprintTables([table]);
              setSprintKey((k) => k + 1);
              showTab('sprint');
            }}
          />
        ) : (
          <TimesSprint key={sprintKey} initialTables={sprintTables} />
        )}
      </div>
    </div>
  );
}
