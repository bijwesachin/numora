import { defineCards } from '@/content/defineCards';

export const mrReasonableCards = defineCards('mr-reasonable', ['math-reasoning', 'reasonableness'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'How do you decide whether an answer is reasonable?',
    back: 'Compare it with your estimate, check its size and unit, and ask: could this happen in the story?',
    memoryHook: 'Answer + common sense.',
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'What three questions help you check reasonableness?',
    back: '1) Is it close to my estimate?\n2) Is it the right kind of unit?\n3) Does it make sense in the story?',
    after: [1],
  },
  {
    n: 3, type: 'solve', difficulty: 1,
    front: 'Is it reasonable that a pencil weighs 15 kilograms?',
    back: 'No. A pencil weighs only a few grams.',
    after: [2],
    explanation: 'Compare with things you know: a pencil is much lighter than a bag of sugar (about 1 kg).',
  },
  {
    n: 4, type: 'solve', difficulty: 2,
    front: 'Ben says 49 + 52 = 1,011. Is that reasonable?',
    back: 'No. 49 + 52 is about 50 + 50 = 100. The exact sum is 101.',
    after: [2],
    steps: ['Round: 49 ≈ 50 and 52 ≈ 50.', '50 + 50 = 100.', '1,011 is ten times too big.'],
  },
  {
    n: 5, type: 'solve', difficulty: 3,
    front: 'A student says 3.8 × 5.1 = 193.8. Is that reasonable?',
    back: 'No. 4 × 5 = 20, so the answer should be about 20. The decimal point is misplaced; the exact answer is 19.38.',
    after: [4],
    steps: ['Round: 3.8 ≈ 4 and 5.1 ≈ 5.', '4 × 5 = 20.', '193.8 is far from 20, so the decimal point is in the wrong place.'],
  },
  {
    n: 6, type: 'solve', difficulty: 3,
    front: 'Maya says 4 shirts at $9.95 each will cost about $85. Is that reasonable?',
    back: 'No. 4 × $10 = $40, so the cost is about $40 (exactly $39.80).',
    after: [4],
    steps: ['Round: $9.95 ≈ $10.', '4 × 10 = 40.', '$85 is more than twice the estimate.'],
  },
  {
    n: 7, type: 'solve', difficulty: 3,
    front: 'A recipe for 4 people uses 3/4 cup of sugar. For 8 people, Dan says 3/8 cup. Is that reasonable?',
    back: 'No. Twice as many people need MORE sugar, not less. The right amount is 1 1/2 cups.',
    after: [2],
    explanation: 'Doubling the people means doubling the sugar: 3/4 + 3/4 = 1 1/2 cups.',
  },
  {
    n: 8, type: 'misconception', difficulty: 5,
    front: 'True or False: If a calculator gives an answer, it must be reasonable.',
    back: 'False. A calculator only does what you type. A mistyped number or a misplaced decimal gives an unreasonable answer.',
    after: [2],
  },
  {
    n: 9, type: 'misconception', difficulty: 5,
    front: 'True or False: “3 1/2 buses” is a reasonable answer to “How many buses are needed?”',
    back: 'False. You can’t use half a bus, so you need 4 buses.',
    explanation: 'Always check whether the answer fits what is being counted.',
    after: [2],
  },
  {
    n: 10, type: 'real-life', difficulty: 3,
    front: 'A runner says they ran 5 kilometers in 2 minutes. Is that reasonable?',
    back: 'No. That would be 150 km per hour — far faster than any person can run. 5 km usually takes at least 12 minutes.',
    after: [3],
  },
  {
    n: 11, type: 'challenge', difficulty: 4,
    front: 'Find the error: “There are 24 students at 6 tables. Each table has 40 students.”',
    back: '24 ÷ 6 = 4, so each table has 4 students — not 40. The answer was bigger than the total number of students, which isn’t possible.',
    after: [4],
    hint: 'Could one table hold more students than the whole class?',
  },
  {
    n: 12, type: 'challenge', difficulty: 4,
    front: '3 notebooks cost $4.50. Zoe says 12 notebooks cost $6.00. Use estimation to check.',
    back: 'Not reasonable. 12 notebooks is 4 sets of 3, so the cost is about 4 × $4.50 = $18.00 — far more than $6.',
    after: [5],
    steps: ['3 → 12 is 4 sets of 3 notebooks.', '4 × 4.50 = 18.00', 'Compare: $6 is much less than $18.'],
  },
]);
