import type { CurriculumIndex } from '../curriculumIndex';
import type { Flashcard } from '../flashcard';
import { masteryScore } from '../review/mastery';
import { isSeen, MS_PER_DAY } from '../review/scheduler';
import { isWeakConcept, type ProgressMap } from './stats';

/**
 * "Practice What I Need" — ranks cards by how much reviewing them would help right now.
 * Each factor is additive so the ranking is easy to explain and to tune.
 */
export const WEAK_AREA_WEIGHTS = {
  lastAgain: 50,
  lastHard: 25,
  /** × (100 − mastery) / 100 */
  lowMastery: 30,
  /** × wrong / total answers */
  wrongRatio: 30,
  /** per day overdue, capped */
  overduePerDay: 2,
  overdueCap: 20,
  /** not reviewed in `staleAfterDays` */
  stale: 10,
  staleAfterDays: 14,
  /** card belongs to a prerequisite of a concept the student is weak in */
  weakPrerequisite: 20,
  /** Below this a card isn't worth surfacing. */
  minPriority: 20,
} as const;

export interface PrioritizedCard {
  card: Flashcard;
  priority: number;
  reasons: WeakReason[];
}

export type WeakReason = 'missed' | 'hard' | 'low-mastery' | 'overdue' | 'stale' | 'foundation';

export const WEAK_REASON_LABEL: Record<WeakReason, string> = {
  missed: 'Missed last time',
  hard: 'Felt hard',
  'low-mastery': 'Still learning',
  overdue: 'Overdue',
  stale: "Haven't seen in a while",
  foundation: 'Builds a skill you need',
};

/** Prerequisite concepts of weak concepts, excluding concepts that are already solid. */
export function weakFoundationConceptIds(index: CurriculumIndex, progress: ProgressMap): Set<string> {
  const result = new Set<string>();
  for (const category of index.categories) {
    for (const concept of index.conceptsOfCategory(category.id)) {
      if (!isWeakConcept(index.cardsOfConcept(concept.id), progress)) continue;
      for (const pre of concept.prerequisites) result.add(pre);
    }
  }
  return result;
}

export function scoreCard(
  card: Flashcard,
  progress: ProgressMap,
  now: Date,
  weakFoundations: ReadonlySet<string>,
): PrioritizedCard {
  const w = WEAK_AREA_WEIGHTS;
  const p = progress[card.id];
  const reasons: WeakReason[] = [];
  let priority = 0;

  const isFoundation = weakFoundations.has(card.conceptId);

  if (!isSeen(p)) {
    // Unseen cards only matter here when they shore up a weak skill.
    if (isFoundation) {
      priority += w.weakPrerequisite;
      reasons.push('foundation');
    }
    return { card, priority, reasons };
  }

  if (p.lastRating === 'again') {
    priority += w.lastAgain;
    reasons.push('missed');
  } else if (p.lastRating === 'hard') {
    priority += w.lastHard;
    reasons.push('hard');
  }

  const mastery = masteryScore(p);
  priority += (w.lowMastery * (100 - mastery)) / 100;
  if (mastery < 40) reasons.push('low-mastery');

  const total = p.timesCorrect + p.timesWrong;
  if (total > 0) priority += (w.wrongRatio * p.timesWrong) / total;

  if (p.dueAt) {
    const overdueDays = (now.getTime() - new Date(p.dueAt).getTime()) / MS_PER_DAY;
    if (overdueDays > 0) {
      priority += Math.min(w.overdueCap, overdueDays * w.overduePerDay);
      if (overdueDays >= 1) reasons.push('overdue');
    }
  }

  const sinceLastDays = (now.getTime() - new Date(p.lastReviewedAt!).getTime()) / MS_PER_DAY;
  if (sinceLastDays >= w.staleAfterDays) {
    priority += w.stale;
    reasons.push('stale');
  }

  if (isFoundation) {
    priority += w.weakPrerequisite;
    reasons.push('foundation');
  }

  return { card, priority: Math.round(priority), reasons };
}

export function practiceWhatINeed(
  index: CurriculumIndex,
  progress: ProgressMap,
  now: Date,
  limit = 20,
): PrioritizedCard[] {
  const foundations = weakFoundationConceptIds(index, progress);
  return index.cards
    .map((card) => scoreCard(card, progress, now, foundations))
    .filter((c) => c.priority >= WEAK_AREA_WEIGHTS.minPriority)
    .sort((a, b) => b.priority - a.priority || a.card.id.localeCompare(b.card.id))
    .slice(0, limit);
}
