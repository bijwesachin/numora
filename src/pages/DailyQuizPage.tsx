import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/app/AppShell';
import { curriculum } from '@/content';
import { HintQuiz } from '@/components/quiz/HintQuiz';
import { QUIZ_LABEL, QuizScoresView } from '@/components/quiz/QuizScores';
import { TableQuiz } from '@/components/quiz/TableQuiz';
import { TrickQuiz } from '@/components/quiz/TrickQuiz';
import { dailyHintQuiz, dailyTrickQuiz, dayKey } from '@/domain/dailyQuiz';
import { todaysTablePlan } from '@/domain/tableDrill';
import { TABLES } from '@/domain/timesTables';
import { useProgressStore } from '@/state/progressStore';

type Tab = 'hints' | 'tricks' | 'tables' | 'scores';

const TABS: { id: Tab; label: string }[] = [
  { id: 'hints', label: QUIZ_LABEL.hints },
  { id: 'tricks', label: QUIZ_LABEL.tricks },
  { id: 'tables', label: QUIZ_LABEL.tables },
  { id: 'scores', label: '📊 Scores' },
];

export function DailyQuizPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('tab');
  const tab: Tab = requested === 'tricks' || requested === 'tables' || requested === 'scores' ? requested : 'hints';
  const scores = useProgressStore((s) => s.quizScores);
  // Picked once on mount so the quiz (and the day its score is saved under) doesn't change if it's left open past midnight.
  const [{ now, day, hints, tricks }] = useState(() => {
    const opened = new Date();
    return { now: opened, day: dayKey(opened), hints: dailyHintQuiz(curriculum.cards, opened), tricks: dailyTrickQuiz(opened) };
  });
  const picked = Number(params.get('table'));
  const tablePlan = useMemo(() => todaysTablePlan(scores, day, TABLES.includes(picked) ? picked : undefined), [scores, day, picked]);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back={{ href: '/', label: 'Home' }} title="📅 Daily Quiz" subtitle="10 new questions every day. Stuck? Use the hint." />
      <div role="tablist" aria-label="Daily Quiz" className="mb-6 inline-flex max-w-full flex-wrap rounded-2xl bg-slate-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setParams(t.id === 'hints' ? {} : { tab: t.id }, { replace: true })}
            className={`rounded-xl px-4 py-2 font-semibold pointer-coarse:min-h-11 ${tab === t.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === 'hints' ? (
          <HintQuiz day={day} questions={hints} />
        ) : tab === 'tricks' ? (
          <TrickQuiz day={day} questions={tricks} />
        ) : tab === 'tables' ? (
          <TableQuiz key={tablePlan.table} day={day} plan={tablePlan} onPick={(t) => setParams({ tab: 'tables', table: String(t) }, { replace: true })} />
        ) : (
          <QuizScoresView scores={scores} now={now} />
        )}
      </div>
    </div>
  );
}
