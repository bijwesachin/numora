import type { Flashcard } from '@/domain/flashcard';
import { newCardProgress } from '@/domain/review/scheduler';
import type { CardProgress } from '@/domain/review/types';

export const T0 = new Date('2026-01-05T15:00:00.000Z');

export function daysAfter(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function makeCard(overrides: Partial<Flashcard> & Pick<Flashcard, 'id'>): Flashcard {
  return {
    grade: 5,
    conceptId: 'concept-a',
    type: 'solve',
    difficulty: 3,
    front: 'Q',
    back: 'A',
    tags: [],
    prerequisites: [],
    ...overrides,
  };
}

export function makeProgress(cardId: string, overrides: Partial<CardProgress> = {}): CardProgress {
  return { ...newCardProgress(cardId), lastReviewedAt: T0.toISOString(), dueAt: T0.toISOString(), ...overrides };
}
