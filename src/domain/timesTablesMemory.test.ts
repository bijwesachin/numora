import { applyRating, newCardProgress } from './review/scheduler';
import type { CardProgress } from './review/types';
import {
  ALL_FACTS,
  buildDailySession,
  capNewFactRating,
  DAILY_CONFIG,
  dueWithin,
  factCardId,
  factDifficulty,
  factHook,
  isTimesTableFactId,
  memoryStatus,
  NEW_PAIR_ORDER,
  requeueMiss,
  type SessionItem,
} from './timesTables';

const NOW = new Date('2026-04-01T16:00:00Z');
const DAY = 86_400_000;
const key = (i: SessionItem) => `${i.kind}:${i.fact.a}x${i.fact.b}`;

function seen(a: number, b: number, dueInDays: number, extra: Partial<CardProgress> = {}): [string, CardProgress] {
  const id = factCardId(a, b);
  return [
    id,
    {
      ...newCardProgress(id),
      lastReviewedAt: new Date(NOW.getTime() - DAY).toISOString(),
      dueAt: new Date(NOW.getTime() + dueInDays * DAY).toISOString(),
      intervalDays: Math.max(1, dueInDays),
      timesCorrect: 1,
      consecutiveCorrect: 1,
      lastRating: 'good',
      ...extra,
    },
  ];
}

describe('memory hooks', () => {
  it('has hooks for famously hard facts, both ways round', () => {
    expect(factHook(7, 8)).toMatch(/5, 6, 7, 8/);
    expect(factHook(8, 7)).toBe(factHook(7, 8));
    expect(factHook(6, 8)).toMatch(/4, 8 → 48/);
    expect(factHook(8, 6)).toMatch(/4, 8 → 48/);
    expect(factHook(12, 12)).toMatch(/144/);
    expect(factHook(2, 3)).toBeUndefined();
  });
});

describe('learning order', () => {
  it('covers every turnaround pair once and starts with the easy tables', () => {
    expect(ALL_FACTS).toHaveLength(196);
    expect(NEW_PAIR_ORDER).toHaveLength(105); // 14 × 15 / 2 unique pairs
    expect(NEW_PAIR_ORDER.slice(0, 5).every((f) => [2, 5, 10].includes(Math.min(f.a, f.b)) || f.a === f.b)).toBe(true);
    expect(NEW_PAIR_ORDER.at(-1)).toMatchObject({ a: 15, b: 15 });
  });
});

describe('buildDailySession', () => {
  it('on day one introduces a few new facts: learn first, recall later, recall again at the end', () => {
    const q = buildDailySession({}, NOW);
    const learns = q.filter((i) => i.kind === 'learn');
    expect(learns.length).toBeGreaterThanOrEqual(4);
    expect(learns.length).toBeLessThanOrEqual(8);
    for (const l of learns) {
      const learnAt = q.findIndex((i) => key(i) === key(l));
      const recalls = q.map((i, idx) => (i.kind === 'recall' && i.fact.a === l.fact.a && i.fact.b === l.fact.b ? idx : -1)).filter((i) => i >= 0);
      expect(recalls.length, `${l.fact.a} × ${l.fact.b}`).toBe(2);
      expect(recalls[0]!).toBeGreaterThan(learnAt + 1); // never straight after learning it
    }
    expect(learns.map((l) => `${l.fact.a}x${l.fact.b}`)).toContain(`${learns[0]!.fact.b}x${learns[0]!.fact.a}`);
  });

  it('puts due facts first, most overdue first', () => {
    const progress = Object.fromEntries([seen(7, 8, -3), seen(6, 9, -1), seen(4, 4, 5)]);
    const q = buildDailySession(progress, NOW);
    expect(key(q[0]!)).toBe('recall:7x8');
    expect(key(q[1]!)).toBe('recall:6x9');
  });

  it('does not introduce new facts on a heavy review day', () => {
    const many = ALL_FACTS.slice(0, DAILY_CONFIG.newFactsOnlyIfDueBelow).map((f) => seen(f.a, f.b, -1));
    const q = buildDailySession(Object.fromEntries(many), NOW);
    expect(q.some((i) => i.kind === 'learn')).toBe(false);
    expect(q.filter((i) => i.kind === 'recall')).toHaveLength(DAILY_CONFIG.newFactsOnlyIfDueBelow);
  });

  it('caps the number of reviews per day', () => {
    const many = ALL_FACTS.slice(0, 40).map((f) => seen(f.a, f.b, -1));
    const q = buildDailySession(Object.fromEntries(many), NOW);
    expect(q.length).toBe(DAILY_CONFIG.maxReviews);
  });

  it('skips facts already learned when choosing new ones', () => {
    const first = NEW_PAIR_ORDER[0]!;
    const progress = Object.fromEntries([seen(first.a, first.b, 2), seen(first.b, first.a, 2)]);
    const q = buildDailySession(progress, NOW);
    expect(q.some((i) => i.kind === 'learn' && i.fact.a === first.a && i.fact.b === first.b)).toBe(false);
  });

  it('tops up a light day with facts that are still being learned', () => {
    const progress = Object.fromEntries([seen(7, 8, 3), seen(6, 7, 3)]);
    const q = buildDailySession(progress, NOW);
    expect(q.some((i) => key(i) === 'recall:7x8')).toBe(true);
  });
});

describe('new-fact pacing', () => {
  it('teaches up to four easy pairs a day but only two hard ones', () => {
    const pairsIn = (q: SessionItem[]) => new Set(q.filter((i) => i.kind === 'learn').map((i) => [i.fact.a, i.fact.b].sort((x, y) => x - y).join('x'))).size;
    expect(pairsIn(buildDailySession({}, NOW))).toBe(4); // first pairs are all × 2 / × 5 / × 10

    // Mark every easy-or-medium pair as already learned (not due), leaving only hard ones.
    const learned = ALL_FACTS.filter((f) => factDifficulty(f.a, f.b) <= 3).map((f) => seen(f.a, f.b, 5));
    expect(pairsIn(buildDailySession(Object.fromEntries(learned), NOW))).toBe(2);
  });
});

describe('requeueMiss', () => {
  it('brings a missed fact back a few questions later as a recall', () => {
    const q: SessionItem[] = ALL_FACTS.slice(0, 6).map((f) => ({ kind: 'recall', fact: f, isNew: false }));
    const out = requeueMiss(q, 0);
    expect(out).toHaveLength(7);
    expect(key(out[4]!)).toBe(key(q[0]!));
    expect(requeueMiss(q, 5)).toHaveLength(7); // appended at the end
  });
});

describe('capNewFactRating', () => {
  it('keeps just-learned facts on a 1-day schedule', () => {
    expect(capNewFactRating('easy', true)).toBe('hard');
    expect(capNewFactRating('good', true)).toBe('hard');
    expect(capNewFactRating('again', true)).toBe('again');
    expect(capNewFactRating('easy', false)).toBe('easy');
    const p = applyRating(newCardProgress('x'), capNewFactRating('easy', true), NOW);
    expect(p.intervalDays).toBe(1);
  });
});

describe('memoryStatus / dueWithin', () => {
  it('counts memorized, learning, unseen and due facts', () => {
    const mastered: CardProgress = { ...seen(2, 2, 30)[1], intervalDays: 30, consecutiveCorrect: 4, timesCorrect: 4 };
    const progress = Object.fromEntries([[factCardId(2, 2), mastered], seen(7, 8, -1), seen(6, 9, 1)]);
    expect(memoryStatus(progress, NOW)).toEqual({ total: 196, memorized: 1, learning: 2, unseen: 193, due: 1 });
    expect(dueWithin(progress, NOW, 1)).toBe(2);
  });

  it('recognises fact card ids', () => {
    expect(isTimesTableFactId('tt-7-008')).toBe(true);
    expect(isTimesTableFactId('tt-7-001')).toBe(false);
    expect(isTimesTableFactId('tt-strategies-003')).toBe(false);
  });
});
