import { T0 } from '@/test/fixtures';
import { masteryLevel, masteryScore } from './mastery';
import { applyRating, newCardProgress } from './scheduler';
import type { CardProgress, Rating } from './types';

function history(ratings: Rating[]): CardProgress {
  let p = newCardProgress('c');
  let now = T0;
  for (const r of ratings) {
    p = applyRating(p, r, now);
    now = new Date(new Date(p.dueAt!).getTime() + 1);
  }
  return p;
}

describe('mastery', () => {
  it('is 0 / new for unseen cards', () => {
    expect(masteryScore(undefined)).toBe(0);
    expect(masteryLevel(newCardProgress('c'))).toBe('new');
  });

  it('a single correct answer — even Easy — is never mastery', () => {
    expect(masteryLevel(history(['easy']))).not.toBe('mastered');
    expect(masteryLevel(history(['good']))).not.toBe('mastered');
  });

  it('cramming the same card many times in a row is not mastery', () => {
    let p = newCardProgress('c');
    for (let i = 0; i < 10; i++) p = applyRating(p, 'easy', new Date(T0.getTime() + i * 60_000));
    expect(masteryLevel(p)).not.toBe('mastered');
  });

  it('several spaced correct answers reach mastery', () => {
    expect(masteryLevel(history(['good', 'good', 'good', 'good']))).toBe('mastered');
  });

  it('rises monotonically with consecutive spaced Good answers', () => {
    const scores = [1, 2, 3, 4].map((n) => masteryScore(history(Array<Rating>(n).fill('good'))));
    expect([...scores].sort((a, b) => a - b)).toEqual(scores);
    expect(new Set(scores).size).toBe(4);
  });

  it('a recent miss caps mastery even after a strong history', () => {
    const p = history(['good', 'good', 'good', 'good', 'again']);
    expect(masteryScore(p)).toBeLessThanOrEqual(25);
    expect(masteryLevel(p)).toBe('learning');
  });

  it('Hard answers build mastery more slowly than Good', () => {
    expect(masteryScore(history(['hard', 'hard', 'hard']))).toBeLessThan(masteryScore(history(['good', 'good', 'good'])));
  });
});
