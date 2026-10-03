import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/app/AppShell';
import { TimesExplorer } from '@/components/times/TimesExplorer';
import { TimesSprint } from '@/components/times/TimesSprint';

type Tab = 'explore' | 'sprint';

const TABS: { id: Tab; label: string }[] = [
  { id: 'explore', label: '🔍 Explore' },
  { id: 'sprint', label: '⚡ Fact Sprint' },
];

export function TimesTablesPage() {
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get('tab') === 'sprint' ? 'sprint' : 'explore';
  const [sprintTables, setSprintTables] = useState<number[]>([6, 7, 8]);
  const [sprintKey, setSprintKey] = useState(0);

  const showTab = (next: Tab) => setParams(next === 'explore' ? {} : { tab: next }, { replace: true });

  return (
    <div>
      <PageHeader
        back={{ href: '/topics/times-tables', label: 'Times Tables' }}
        title="⚡ Times Table Lab"
        subtitle="Explore every fact up to 15 × 15, then put them to the test."
      />
      <div role="tablist" aria-label="Times Table Lab" className="mb-6 inline-flex rounded-2xl bg-slate-100 p-1">
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
        {tab === 'explore' ? (
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
