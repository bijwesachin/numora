import type { Concept } from '../curriculum';
import type { CurriculumIndex } from '../curriculumIndex';
import { deckStats, type ProgressMap } from './stats';

export const RECOMMEND_CONFIG = {
  /** A prerequisite with cards counts as "ready" once its mastery reaches this. */
  prerequisiteReadyMastery: 40,
} as const;

/** Prerequisite concepts that have cards but haven't been learned well enough yet. */
export function unmetPrerequisites(index: CurriculumIndex, concept: Concept, progress: ProgressMap, now: Date): Concept[] {
  return concept.prerequisites.flatMap((id) => {
    const pre = index.concept(id);
    if (!pre) return [];
    const cards = index.cardsOfConcept(id);
    if (cards.length === 0) return []; // no content yet — can't hold the student back
    return deckStats(cards, progress, now).masteryPercent < RECOMMEND_CONFIG.prerequisiteReadyMastery ? [pre] : [];
  });
}

/**
 * The next concept to start or continue, in curriculum order: the first concept with
 * unfinished cards whose prerequisites are ready. Falls back to the first unfinished
 * concept so there's always a suggestion.
 */
export function recommendNextConcept(index: CurriculumIndex, progress: ProgressMap, now: Date): Concept | undefined {
  const candidates = index.categories
    .flatMap((c) => index.conceptsOfCategory(c.id))
    .filter((c) => {
      const stats = deckStats(index.cardsOfConcept(c.id), progress, now);
      return stats.total > 0 && stats.completed < stats.total;
    });
  return candidates.find((c) => unmetPrerequisites(index, c, progress, now).length === 0) ?? candidates[0];
}
