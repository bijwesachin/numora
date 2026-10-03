import { defineCards } from '@/content/defineCards';

export const fractionsProperImproperCards = defineCards('fractions-proper-improper', ['fractions', 'improper-fractions'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'What are proper and improper fractions?',
    back: 'A proper fraction has a numerator smaller than its denominator (less than 1 whole). An improper fraction has a numerator equal to or greater than its denominator (1 whole or more).',
    example: 'Proper: 3/4. Improper: 5/4 and 4/4.',
    memoryHook: 'Improper = top-heavy.',
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'How can you quickly tell which kind a fraction is?',
    back: 'Compare the numerator with the denominator. Smaller → proper. Equal or bigger → improper.',
    after: [1],
  },
  {
    n: 3, type: 'rule', difficulty: 2,
    front: 'What does a fraction with the same numerator and denominator equal?',
    back: '1 whole. For example 5/5 = 1.',
    after: [2],
  },
  {
    n: 4, type: 'visual', difficulty: 1,
    front: 'These pizzas are cut into fourths. What improper fraction do they show?',
    back: '5/4',
    explanation: 'One whole pizza is 4/4, plus 1/4 more makes 5/4.',
    visual: {
      kind: 'row',
      items: [
        { kind: 'fraction-circle', numerator: 4, denominator: 4 },
        { kind: 'fraction-circle', numerator: 1, denominator: 4 },
      ],
    },
    after: [2],
  },
  {
    n: 5, type: 'solve', difficulty: 1,
    front: 'Is 3/8 proper or improper?',
    back: 'Proper, because 3 is less than 8.',
    after: [2],
    explanation: '3 slices out of 8 is less than one whole pizza.',
  },
  {
    n: 6, type: 'solve', difficulty: 2,
    front: 'Is 9/5 proper or improper?',
    back: 'Improper, because 9 is greater than 5. It is more than 1 whole.',
    after: [2],
    explanation: 'One whole is 5/5, and 9/5 is more than that.',
  },
  {
    n: 7, type: 'solve', difficulty: 2,
    front: 'Is 6/6 proper or improper?',
    back: 'Improper. 6/6 equals exactly 1 whole.',
    after: [3],
    explanation: '6 slices out of 6 is the whole pizza.',
  },
  {
    n: 8, type: 'solve', difficulty: 3,
    front: 'Sort these into proper and improper: 2/9, 11/10, 7/7, 5/12',
    back: 'Proper: 2/9 and 5/12. Improper: 11/10 and 7/7.',
    after: [6],
    steps: ['2/9: 2 < 9 → proper.', '11/10: 11 > 10 → improper.', '7/7: 7 = 7 → improper.', '5/12: 5 < 12 → proper.'],
  },
  {
    n: 9, type: 'solve', difficulty: 3,
    front: 'Write 3 whole pizzas as an improper fraction with denominator 4.',
    back: '12/4',
    steps: ['Each whole is 4/4.', '3 wholes = 3 × 4/4 = 12/4.'],
    after: [7],
  },
  {
    n: 10, type: 'misconception', difficulty: 5,
    front: 'True or False: An improper fraction is “wrong” and should never be used.',
    back: 'False. Improper fractions are perfectly good numbers. They just show an amount of 1 whole or more.',
    after: [2],
  },
  {
    n: 11, type: 'misconception', difficulty: 5,
    front: 'True or False: 7/7 is a proper fraction because the numerator equals the denominator.',
    back: 'False. 7/7 equals 1 whole, so it is improper. A proper fraction must be less than 1.',
    after: [3],
  },
  {
    n: 12, type: 'real-life', difficulty: 3,
    front: 'Each cake is cut into 8 slices. You have 11 slices. Write that as an improper fraction. How many cakes is that?',
    back: '11/8 of a cake, which is 1 whole cake and 3 more slices.',
    after: [8],
  },
  {
    n: 13, type: 'challenge', difficulty: 4,
    front: 'The fraction n/6 is improper and less than 2. What whole numbers could n be?',
    back: '6, 7, 8, 9, 10 or 11',
    steps: ['Improper means n ≥ 6.', 'Less than 2 means n/6 < 12/6, so n < 12.'],
    after: [9],
  },
  {
    n: 14, type: 'challenge', difficulty: 4,
    front: 'A fraction with denominator 5 is greater than 1 and less than 8/5. List the possible numerators.',
    back: '6 and 7 (so 6/5 and 7/5)',
    steps: ['Greater than 1 means numerator > 5.', 'Less than 8/5 means numerator < 8.'],
    after: [9],
  },
]);
