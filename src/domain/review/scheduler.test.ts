import { daysAfter, T0 } from '@/test/fixtures';
import { applyRating, describeNextInterval, isDue, MS_PER_DAY, newCardProgress, SCHEDULER_CONFIG } from './scheduler';
import type { CardProgress, Rating } from './types';

const dueInDays = (p: CardProgress, from: Date) => (new Date(p.dueAt!).getTime() - from.getTime()) / MS_PER_DAY;

/** Rate a card repeatedly, each time on its due date. */
function reviewOnSchedule(ratings: Rating[]): CardProgress {
  let p = newCardProgress('c');
  let now = T0;
  for (const r of ratings) {
    p = applyRating(p, r, now);
    now = new Date(p.dueAt!);
  }
  return p;
}

describe('applyRating — first review', () => {
  it.each([
    ['hard', 1],
    ['good', 3],
    ['easy', 7],
  ] as const)('%s schedules %i day(s) out', (rating, days) => {
    const p = applyRating(newCardProgress('c'), rating, T0);
    expect(p.intervalDays).toBe(days);
    expect(dueInDays(p, T0)).toBe(days);
    expect(p.timesCorrect).toBe(1);
    expect(p.consecutiveCorrect).toBe(1);
    expect(p.lastReviewedAt).toBe(T0.toISOString());
  });

  it('again brings the card back in minutes and counts a miss', () => {
    const p = applyRating(newCardProgress('c'), 'again', T0);
    expect(p.intervalDays).toBe(0);
    expect(new Date(p.dueAt!).getTime() - T0.getTime()).toBe(SCHEDULER_CONFIG.relearnMinutes * 60_000);
    expect(p.timesWrong).toBe(1);
    expect(p.consecutiveCorrect).toBe(0);
  });
});

describe('applyRating — later reviews', () => {
  it('grows intervals progressively with repeated Good answers', () => {
    const intervals: number[] = [];
    let p = newCardProgress('c');
    let now = T0;
    for (let i = 0; i < 4; i++) {
      p = applyRating(p, 'good', now);
      intervals.push(p.intervalDays);
      now = new Date(p.dueAt!);
    }
    expect(intervals).toEqual([3, 8, 20, 50]);
  });

  it('Easy grows faster than Good, Hard grows slower', () => {
    const base = reviewOnSchedule(['good', 'good']); // interval 8
    const at = new Date(base.dueAt!);
    const hard = applyRating(base, 'hard', at).intervalDays;
    const good = applyRating(base, 'good', at).intervalDays;
    const easy = applyRating(base, 'easy', at).intervalDays;
    expect(hard).toBeLessThan(good);
    expect(good).toBeLessThan(easy);
  });

  it('a miss resets the streak and the next correct answer restarts from the base interval', () => {
    const missed = applyRating(reviewOnSchedule(['good', 'good', 'good']), 'again', daysAfter(T0, 40));
    expect(missed.consecutiveCorrect).toBe(0);
    const recovered = applyRating(missed, 'good', daysAfter(T0, 41));
    expect(recovered.intervalDays).toBe(3);
    expect(recovered.consecutiveCorrect).toBe(1);
  });

  it('lowers ease on Again/Hard and never below the floor', () => {
    let p = newCardProgress('c');
    for (let i = 0; i < 20; i++) p = applyRating(p, 'again', daysAfter(T0, i));
    expect(p.ease).toBe(SCHEDULER_CONFIG.minEase);
  });

  it('caps intervals', () => {
    const p = reviewOnSchedule(Array<Rating>(12).fill('easy'));
    expect(p.intervalDays).toBe(SCHEDULER_CONFIG.maxIntervalDays);
  });
});

describe('applyRating — cramming guard', () => {
  it('repeated correct answers in one sitting do not extend the interval or streak', () => {
    let p = applyRating(newCardProgress('c'), 'good', T0);
    const firstDue = p.dueAt;
    for (let i = 1; i <= 5; i++) p = applyRating(p, 'easy', new Date(T0.getTime() + i * 60_000));
    expect(p.intervalDays).toBe(3);
    expect(p.dueAt).toBe(firstDue);
    expect(p.consecutiveCorrect).toBe(1);
    expect(p.timesCorrect).toBe(6);
  });

  it('relearning after Again in the same sitting does count', () => {
    let p = applyRating(newCardProgress('c'), 'again', T0);
    p = applyRating(p, 'good', new Date(T0.getTime() + 5 * 60_000));
    expect(p.intervalDays).toBe(3);
    expect(p.consecutiveCorrect).toBe(1);
  });

  it('a miss still counts even while cramming', () => {
    let p = applyRating(newCardProgress('c'), 'good', T0);
    p = applyRating(p, 'again', new Date(T0.getTime() + 60_000));
    expect(p.timesWrong).toBe(1);
    expect(p.intervalDays).toBe(0);
  });
});

describe('isDue / describeNextInterval', () => {
  it('unseen cards are not "due"; reviewed cards become due on their date', () => {
    expect(isDue(undefined, T0)).toBe(false);
    const p = applyRating(newCardProgress('c'), 'good', T0);
    expect(isDue(p, daysAfter(T0, 2))).toBe(false);
    expect(isDue(p, daysAfter(T0, 3))).toBe(true);
  });

  it('describes the next interval for button labels', () => {
    const p = newCardProgress('c');
    expect(describeNextInterval(p, 'again', T0)).toBe('10 min');
    expect(describeNextInterval(p, 'hard', T0)).toBe('1 day');
    expect(describeNextInterval(p, 'good', T0)).toBe('3 days');
    expect(describeNextInterval(p, 'easy', T0)).toBe('7 days');
  });
});
