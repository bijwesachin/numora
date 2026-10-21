import type { QuizAnswer, QuizScores } from './quizScores';
import { HIDE_COUNTS, MASTERED, passed, planAnswerIds, tableAnswerId, tableHistory, todaysTablePlan } from './tableDrill';

const at = '2026-10-20T08:00:00.000Z';

/** A finished day on `table` at `level`, with `fillMisses` hidden answers and `mixedMisses` shuffled answers wrong. */
function day(table: number, level: number, fillMisses = 0, mixedMisses = 0): QuizAnswer[] {
  const fill = Array.from({ length: HIDE_COUNTS[level]! }, (_, i) => ({ id: tableAnswerId('fill', table, i + 1), given: '', correct: i >= fillMisses, at }));
  const mixed = Array.from({ length: 10 }, (_, i) => ({ id: tableAnswerId('mixed', table, i + 1), given: '', correct: i >= mixedMisses, at }));
  return [...fill, ...mixed];
}

describe('table quiz', () => {
  it('starts on the 2 table with 3 answers hidden, then the shuffled round', () => {
    const plan = todaysTablePlan({}, '2026-10-20');
    expect(plan).toMatchObject({ table: 2, level: 0, mastered: [] });
    expect(plan.hidden).toHaveLength(3);
    expect(plan.hidden).toEqual([...plan.hidden].sort((a, b) => a - b));
    expect([...plan.mixed].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(planAnswerIds(plan)).toHaveLength(13);
    expect(todaysTablePlan({}, '2026-10-20')).toEqual(plan);
  });

  it('passes a day with every hidden answer right and at most one shuffled miss', () => {
    expect(passed(day(7, 1), 7, 1)).toBe(true);
    expect(passed(day(7, 1, 0, 1), 7, 1)).toBe(true);
    expect(passed(day(7, 1, 0, 2), 7, 1)).toBe(false);
    expect(passed(day(7, 1, 1), 7, 1)).toBe(false);
    expect(passed(day(7, 1).slice(0, -1), 7, 1)).toBe(false);
  });

  it('hides more answers each day the table is passed, and repeats a level that wasn’t', () => {
    const scores: QuizScores = { '2026-10-17': { tables: day(7, 0) }, '2026-10-18': { tables: day(7, 1, 1) }, '2026-10-19': { tables: day(7, 1) } };
    expect(todaysTablePlan(scores, '2026-10-19')).toMatchObject({ table: 7, level: 1 });
    expect(todaysTablePlan(scores, '2026-10-20')).toMatchObject({ table: 7, level: 2 });
    expect(todaysTablePlan(scores, '2026-10-20').hidden).toHaveLength(7);
  });

  it('moves on to the next table once the all-hidden level is passed', () => {
    const scores: QuizScores = { '2026-10-16': { tables: day(7, 0) }, '2026-10-17': { tables: day(7, 1) }, '2026-10-18': { tables: day(7, 2) }, '2026-10-19': { tables: day(7, 3) } };
    expect(tableHistory(scores, '2026-10-20').levels.get(7)).toBe(MASTERED);
    expect(todaysTablePlan(scores, '2026-10-20')).toMatchObject({ table: 8, level: 0, mastered: [7] });
    // Picking a memorized table again practices it all hidden.
    expect(todaysTablePlan(scores, '2026-10-20', 7)).toMatchObject({ table: 7, level: 3 });
  });

  it('keeps today’s table once started, and lets another be picked', () => {
    const scores: QuizScores = { '2026-10-20': { tables: day(9, 0).slice(0, 2) } };
    expect(todaysTablePlan(scores, '2026-10-20').table).toBe(9);
    expect(todaysTablePlan(scores, '2026-10-20', 12)).toMatchObject({ table: 12, level: 0 });
  });
});
