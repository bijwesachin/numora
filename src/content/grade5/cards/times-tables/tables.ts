import { defineCards, type CardDraft } from '@/content/defineCards';
import { factDifficulty, factStrategy, factVisual, MAX_FACTOR, MIN_FACTOR, TABLES, tableConceptId } from '@/domain/timesTables';

/** One trick per table, shown as the first card of its deck. */
const TABLE_TRICKS: Record<number, { tip: string; example: string; hook?: string }> = {
  2: { tip: 'Double the number.', example: '2 × 13 = 13 + 13 = 26' },
  3: { tip: 'Double it, then add one more group.', example: '3 × 8 = 16 + 8 = 24' },
  4: { tip: 'Double, then double again.', example: '4 × 7 → 14 → 28' },
  5: { tip: 'Find × 10, then take half.', example: '5 × 14 = half of 140 = 70', hook: 'Fives end in 0 or 5.' },
  6: { tip: 'Find × 5, then add one more group.', example: '6 × 7 = 35 + 7 = 42' },
  7: { tip: 'Split 7 into 5 and 2: find × 5 and × 2, then add.', example: '7 × 8 = 40 + 16 = 56' },
  8: { tip: 'Double three times.', example: '8 × 6 → 12 → 24 → 48' },
  9: { tip: 'Find × 10, then take away one group.', example: '9 × 7 = 70 − 7 = 63', hook: 'Up to 9 × 10, the digits of the answer add to 9: 63 → 6 + 3 = 9.' },
  10: { tip: 'Write the number and add a zero.', example: '10 × 13 = 130' },
  11: { tip: 'For 2–9, repeat the digit. For bigger numbers, find × 10 and add one more group.', example: '11 × 7 = 77     11 × 13 = 130 + 13 = 143' },
  12: { tip: 'Find × 10 and × 2, then add.', example: '12 × 7 = 70 + 14 = 84' },
  13: { tip: 'Find × 10 and × 3, then add.', example: '13 × 6 = 60 + 18 = 78' },
  14: { tip: 'Find × 10 and × 4, then add — or double the × 7 fact.', example: '14 × 6 = 60 + 24 = 84' },
  15: { tip: 'Find × 10, then add half of it (that is × 5).', example: '15 × 8 = 80 + 40 = 120' },
};

function tableDeck(a: number) {
  const trick = TABLE_TRICKS[a]!;
  const drafts: CardDraft[] = [
    {
      n: 1,
      type: 'rule',
      difficulty: 2,
      front: `What is a quick way to multiply any number by ${a}?`,
      back: trick.tip,
      example: trick.example,
      ...(trick.hook ? { memoryHook: trick.hook } : {}),
    },
  ];
  for (let b = MIN_FACTOR; b <= MAX_FACTOR; b++) {
    const strategy = factStrategy(a, b);
    drafts.push({
      n: b,
      type: 'solve',
      difficulty: factDifficulty(a, b),
      front: `${a} × ${b} = ?`,
      back: `${a} × ${b} = ${a * b}`,
      hint: strategy.tip,
      steps: strategy.steps,
      memoryHook: strategy.isSquare ? `${a} × ${a} is a square number: ${a} rows of ${a} make a perfect square.` : `Turnaround twin: ${b} × ${a} = ${a * b}`,
      answerVisual: factVisual(a, b),
      after: [1],
    });
  }
  return defineCards(tableConceptId(a), ['times-tables', `table-${a}`], drafts);
}

export const timesTableCards = TABLES.flatMap(tableDeck);
