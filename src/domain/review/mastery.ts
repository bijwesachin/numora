import type { CardProgress, MasteryLevel } from './types';

/**
 * Mastery is *derived* from review history rather than stored, so it can never drift
 * out of sync and tuning the formula re-scores everyone's existing progress.
 *
 * score (0–100) blends:
 *   45% memory strength — how far apart reviews have grown (30-day interval = full)
 *   35% streak          — consecutive correct answers (4 = full)
 *   20% accuracy        — correct / total
 *
 * "Mastered" additionally requires a streak of 3 spaced correct answers, so a single
 * correct answer — even an "Easy" — is never enough.
 */

export const MASTERY_CONFIG = {
  strengthFullAtDays: 30,
  streakFullAt: 4,
  weights: { strength: 0.45, streak: 0.35, accuracy: 0.2 },
  /** A card the student just got wrong is capped here until they recover it. */
  againCap: 25,
  masteredMinScore: 85,
  masteredMinStreak: 3,
  thresholds: { learning: 1, familiar: 40, strong: 70 },
} as const;

export function masteryScore(progress: CardProgress | undefined): number {
  if (!progress || !progress.lastReviewedAt) return 0;
  const { strengthFullAtDays, streakFullAt, weights, againCap } = MASTERY_CONFIG;

  const total = progress.timesCorrect + progress.timesWrong;
  const accuracy = total === 0 ? 0 : progress.timesCorrect / total;
  const strength = Math.min(1, Math.log1p(progress.intervalDays) / Math.log1p(strengthFullAtDays));
  const streak = Math.min(1, progress.consecutiveCorrect / streakFullAt);

  const raw = 100 * (weights.strength * strength + weights.streak * streak + weights.accuracy * accuracy);
  const score = Math.round(raw);
  return progress.lastRating === 'again' ? Math.min(score, againCap) : score;
}

export function masteryLevel(progress: CardProgress | undefined): MasteryLevel {
  if (!progress || !progress.lastReviewedAt) return 'new';
  const score = masteryScore(progress);
  const { masteredMinScore, masteredMinStreak, thresholds } = MASTERY_CONFIG;
  if (score >= masteredMinScore && progress.consecutiveCorrect >= masteredMinStreak) return 'mastered';
  if (score >= thresholds.strong) return 'strong';
  if (score >= thresholds.familiar) return 'familiar';
  return 'learning';
}

export const MASTERY_LABEL: Record<MasteryLevel, string> = {
  new: 'New',
  learning: 'Learning',
  familiar: 'Getting there',
  strong: 'Strong',
  mastered: 'Mastered',
};

/** Level for an aggregate percentage (topic / category). */
export function levelForPercent(percent: number, anySeen: boolean): MasteryLevel {
  if (!anySeen) return 'new';
  if (percent >= MASTERY_CONFIG.masteredMinScore) return 'mastered';
  if (percent >= MASTERY_CONFIG.thresholds.strong) return 'strong';
  if (percent >= MASTERY_CONFIG.thresholds.familiar) return 'familiar';
  return 'learning';
}
