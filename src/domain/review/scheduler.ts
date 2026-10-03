import type { CardProgress, Rating } from './types';

/**
 * A small SM-2–style spaced-repetition scheduler tuned for kids:
 *
 *   Again → relearn: due again in a few minutes, streak resets
 *   Hard  → 1 day, then grows slowly (×1.2)
 *   Good  → 3 days, then grows by the card's ease (≈ ×2.5)
 *   Easy  → 7 days, then grows faster (ease × 1.3)
 *
 * Correct answers given shortly after a previous review (cramming) are recorded but
 * don't extend the interval or the streak, so tapping "Easy" five times in a row
 * can't fake mastery.
 */

export const SCHEDULER_CONFIG = {
  relearnMinutes: 10,
  firstIntervalDays: { hard: 1, good: 3, easy: 7 },
  hardMultiplier: 1.2,
  easyBonus: 1.3,
  initialEase: 2.5,
  minEase: 1.3,
  maxEase: 3.0,
  easeDelta: { again: -0.2, hard: -0.15, good: 0, easy: 0.15 },
  maxIntervalDays: 180,
  /** A correct answer within this window of the last review is treated as practice. */
  crammingWindowHours: 12,
} as const;

const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

export function newCardProgress(cardId: string): CardProgress {
  return {
    cardId,
    lastReviewedAt: null,
    dueAt: null,
    intervalDays: 0,
    ease: SCHEDULER_CONFIG.initialEase,
    timesCorrect: 0,
    timesWrong: 0,
    consecutiveCorrect: 0,
    lastRating: null,
  };
}

export function isCorrect(rating: Rating): boolean {
  return rating !== 'again';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function nextInterval(prev: CardProgress, rating: Exclude<Rating, 'again'>): number {
  const { firstIntervalDays, hardMultiplier, easyBonus, maxIntervalDays } = SCHEDULER_CONFIG;
  // A card that is new, or was just relearned after "Again", starts from the base interval.
  if (prev.intervalDays <= 0) return firstIntervalDays[rating];

  const grown =
    rating === 'hard'
      ? prev.intervalDays * hardMultiplier
      : rating === 'good'
        ? prev.intervalDays * prev.ease
        : prev.intervalDays * prev.ease * easyBonus;

  return clamp(Math.round(grown), firstIntervalDays[rating], maxIntervalDays);
}

function isCramming(prev: CardProgress, now: Date): boolean {
  if (!prev.lastReviewedAt || prev.intervalDays <= 0) return false;
  const sinceLast = now.getTime() - new Date(prev.lastReviewedAt).getTime();
  return sinceLast < SCHEDULER_CONFIG.crammingWindowHours * MS_PER_HOUR;
}

/** Pure: returns the next progress state for a rating given at `now`. */
export function applyRating(prev: CardProgress, rating: Rating, now: Date): CardProgress {
  const ease = clamp(
    prev.ease + SCHEDULER_CONFIG.easeDelta[rating],
    SCHEDULER_CONFIG.minEase,
    SCHEDULER_CONFIG.maxEase,
  );
  const reviewedAt = now.toISOString();

  if (rating === 'again') {
    return {
      ...prev,
      ease,
      lastReviewedAt: reviewedAt,
      dueAt: new Date(now.getTime() + SCHEDULER_CONFIG.relearnMinutes * MS_PER_MINUTE).toISOString(),
      intervalDays: 0,
      timesWrong: prev.timesWrong + 1,
      consecutiveCorrect: 0,
      lastRating: rating,
    };
  }

  if (isCramming(prev, now)) {
    // Credit the effort, keep the existing schedule.
    return {
      ...prev,
      lastReviewedAt: reviewedAt,
      timesCorrect: prev.timesCorrect + 1,
      lastRating: rating,
    };
  }

  const intervalDays = nextInterval(prev, rating);
  return {
    ...prev,
    ease,
    lastReviewedAt: reviewedAt,
    dueAt: new Date(now.getTime() + intervalDays * MS_PER_DAY).toISOString(),
    intervalDays,
    timesCorrect: prev.timesCorrect + 1,
    consecutiveCorrect: prev.consecutiveCorrect + 1,
    lastRating: rating,
  };
}

export function isDue(progress: CardProgress | undefined, now: Date): boolean {
  if (!progress?.dueAt) return false;
  return new Date(progress.dueAt).getTime() <= now.getTime();
}

export function isSeen(progress: CardProgress | undefined): progress is CardProgress {
  return !!progress?.lastReviewedAt;
}

/** Human-friendly preview shown on the rating buttons, e.g. "10 min", "3 days". */
export function describeNextInterval(prev: CardProgress, rating: Rating, now: Date): string {
  const next = applyRating(prev, rating, now);
  if (!next.dueAt) return '';
  const ms = new Date(next.dueAt).getTime() - now.getTime();
  if (ms <= 0) return 'now';
  if (ms < MS_PER_HOUR) return `${Math.round(ms / MS_PER_MINUTE)} min`;
  if (ms < MS_PER_DAY) return `${Math.round(ms / MS_PER_HOUR)} hr`;
  const days = Math.round(ms / MS_PER_DAY);
  return days === 1 ? '1 day' : `${days} days`;
}
