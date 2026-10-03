import { learningStage, type Flashcard } from '../flashcard';

/** Concept → rule → visual → easy → normal → trap → real life → challenge; easier first within a stage. */
export function progressionOrder(cards: readonly Flashcard[]): Flashcard[] {
  return [...cards].sort(
    (a, b) => learningStage(a) - learningStage(b) || a.difficulty - b.difficulty || a.id.localeCompare(b.id),
  );
}

/** Deterministic PRNG so shuffles are reproducible in tests (mulberry32). */
export function seededRandom(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Random order that still never shows a card before its prerequisites (when both are
 * in the deck). Prerequisites outside the deck are ignored.
 */
export function prerequisiteSafeShuffle(cards: readonly Flashcard[], random: () => number = Math.random): Flashcard[] {
  const inDeck = new Set(cards.map((c) => c.id));
  const placed = new Set<string>();
  const remaining = progressionOrder(cards);
  const result: Flashcard[] = [];

  while (remaining.length > 0) {
    const ready = remaining.filter((c) => c.prerequisites.every((p) => !inDeck.has(p) || placed.has(p)));
    // A prerequisite cycle is a content bug; fall back to progression order rather than looping forever.
    const pool = ready.length > 0 ? ready : remaining.slice(0, 1);
    const pick = pool[Math.floor(random() * pool.length)]!;
    result.push(pick);
    placed.add(pick.id);
    remaining.splice(remaining.indexOf(pick), 1);
  }
  return result;
}
