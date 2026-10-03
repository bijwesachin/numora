import type { Flashcard } from '@/domain/flashcard';

/**
 * Authoring shape for a card. `n` is the card's permanent number within its concept —
 * never renumber or reuse one, because review progress is keyed on the resulting id.
 * `after` lists the numbers of cards in the same concept that must come first.
 */
export type CardDraft = Omit<Flashcard, 'id' | 'grade' | 'conceptId' | 'tags' | 'prerequisites'> & {
  n: number;
  after?: number[];
  /** Cross-concept prerequisites by full card id. */
  prerequisites?: string[];
  tags?: string[];
};

export function cardId(conceptId: string, n: number): string {
  return `${conceptId}-${String(n).padStart(3, '0')}`;
}

export function defineCards(conceptId: string, baseTags: string[], drafts: CardDraft[]): Flashcard[] {
  return drafts.map(({ n, after = [], prerequisites = [], tags = [], ...rest }) => ({
    ...rest,
    id: cardId(conceptId, n),
    grade: 5,
    conceptId,
    tags: [...new Set([...baseTags, ...tags])],
    prerequisites: [...after.map((p) => cardId(conceptId, p)), ...prerequisites],
  }));
}
