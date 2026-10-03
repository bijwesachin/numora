import type { Flashcard } from '../flashcard';
import type { CurriculumIndex } from '../curriculumIndex';
import { levelForPercent, masteryLevel, masteryScore } from '../review/mastery';
import { isDue, isSeen } from '../review/scheduler';
import type { CardProgress, MasteryLevel } from '../review/types';

export type ProgressMap = Readonly<Record<string, CardProgress>>;

export interface DeckStats {
  total: number;
  /** Cards reviewed at least once. */
  completed: number;
  completionPercent: number;
  /** Average card mastery, unseen cards counting as 0. */
  masteryPercent: number;
  due: number;
  mastered: number;
  level: MasteryLevel;
}

export function deckStats(cards: readonly Flashcard[], progress: ProgressMap, now: Date): DeckStats {
  let completed = 0;
  let scoreSum = 0;
  let due = 0;
  let mastered = 0;

  for (const card of cards) {
    const p = progress[card.id];
    if (!isSeen(p)) continue;
    completed += 1;
    scoreSum += masteryScore(p);
    if (isDue(p, now)) due += 1;
    if (masteryLevel(p) === 'mastered') mastered += 1;
  }

  const total = cards.length;
  const masteryPercent = total === 0 ? 0 : Math.round(scoreSum / total);
  return {
    total,
    completed,
    completionPercent: total === 0 ? 0 : Math.round((100 * completed) / total),
    masteryPercent,
    due,
    mastered,
    level: levelForPercent(masteryPercent, completed > 0),
  };
}

export const WEAK_CONCEPT_CONFIG = {
  /** Average mastery of *seen* cards below this marks a concept weak. */
  maxSeenMastery: 50,
  /** Share of seen cards whose last answer was Again/Hard that marks a concept weak. */
  struggleShare: 0.25,
} as const;

/**
 * A concept is weak when the student has started it and is struggling: their recent
 * answers include several Again/Hard ratings, or the cards they've seen have low mastery.
 * Unstarted concepts are "new", not weak.
 */
export function isWeakConcept(cards: readonly Flashcard[], progress: ProgressMap): boolean {
  const seen = cards.flatMap((c) => {
    const p = progress[c.id];
    return isSeen(p) ? [p] : [];
  });
  if (seen.length === 0) return false;
  const avg = seen.reduce((sum, p) => sum + masteryScore(p), 0) / seen.length;
  const struggling = seen.filter((p) => p.lastRating === 'again' || p.lastRating === 'hard').length;
  return avg < WEAK_CONCEPT_CONFIG.maxSeenMastery || struggling / seen.length >= WEAK_CONCEPT_CONFIG.struggleShare;
}

export function weakConceptIds(index: CurriculumIndex, conceptIds: readonly string[], progress: ProgressMap): string[] {
  return conceptIds.filter((id) => isWeakConcept(index.cardsOfConcept(id), progress));
}

export function dueCards(cards: readonly Flashcard[], progress: ProgressMap, now: Date): Flashcard[] {
  return cards
    .filter((c) => isDue(progress[c.id], now))
    .sort((a, b) => (progress[a.id]?.dueAt ?? '').localeCompare(progress[b.id]?.dueAt ?? ''));
}
