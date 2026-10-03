import { defineCards } from '@/content/defineCards';

export const mrEliminateCards = defineCards('mr-eliminate', ['math-reasoning', 'eliminate'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'What does it mean to eliminate impossible choices?',
    back: 'In a multiple-choice question, cross out answers that can’t be right, so only a few are left to check.',
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'What are quick ways to eliminate wrong answers?',
    back: 'Estimate the size. Check the units. Check even/odd and the last digit. Ask whether the answer could happen in the story.',
    after: [1],
  },
  {
    n: 3, type: 'solve', difficulty: 1,
    front: 'Which is 24 × 5? A) 12  B) 120  C) 1,200',
    back: 'B) 120',
    steps: ['24 × 5 is about 25 × 5 = 125, so it is more than 100.', 'A is far too small and C is far too big.'],
    after: [2],
  },
  {
    n: 4, type: 'solve', difficulty: 2,
    front: 'Which is 7 × 8? A) 54  B) 56  C) 58  D) 65',
    back: 'B) 56',
    steps: ['7 × 8 is 7 groups of 8 → an even number, so 65 is out.', '7 × 8 = 56 (and 54 and 58 are not multiples of 7).'],
    after: [2],
  },
  {
    n: 5, type: 'solve', difficulty: 3,
    front: 'What is the area of a 6 m by 4 m room? A) 10 m  B) 24 m  C) 24 square m',
    back: 'C) 24 square m',
    steps: ['Area is measured in square units, so A and B are out.', '6 × 4 = 24 square meters.'],
    after: [2],
  },
  {
    n: 6, type: 'solve', difficulty: 3,
    front: 'What is 1/2 + 1/3? A) 2/5  B) 5/6  C) 1/6  D) 2/6',
    back: 'B) 5/6',
    steps: ['The sum must be MORE than 1/2.', '2/5, 1/6 and 2/6 are all less than 1/2, so they are out.', 'Only 5/6 is left.'],
    after: [2],
  },
  {
    n: 7, type: 'misconception', difficulty: 5,
    front: 'True or False: If one answer choice is what you get by adding the two numbers in the problem, it is probably correct.',
    back: 'False. Test writers often include answers from common mistakes. Check that the operation fits the story.',
    after: [2],
  },
  {
    n: 8, type: 'misconception', difficulty: 5,
    front: 'True or False: Estimation can always pick the right answer, even when the choices are 345 and 354.',
    back: 'False. When choices are very close, an estimate is not enough. Use exact math, or check the last digit.',
    after: [2],
  },
  {
    n: 9, type: 'real-life', difficulty: 3,
    front: '24 apples are shared equally by 6 kids. How many does each kid get? A) 3  B) 4  C) 6  D) 18',
    back: 'B) 4',
    steps: ['Sharing 24 among 6 means each gets less than 24 and more than 1.', '6 and 18 would take too many apples. 3 × 6 = 18, not 24.', '4 × 6 = 24 ✓'],
    after: [3],
  },
  {
    n: 10, type: 'challenge', difficulty: 4,
    front: 'Which can NOT be the sum of two odd numbers? A) 12  B) 15  C) 30  D) 100',
    back: 'B) 15',
    explanation: 'Odd + odd is always even. 15 is odd.',
    after: [4],
  },
  {
    n: 11, type: 'challenge', difficulty: 4,
    front: 'The product 36 × 25 is closest to: A) 700  B) 900  C) 1,100',
    back: 'B) 900',
    steps: ['25 × 4 = 100, so 25 × 36 = 25 × 4 × 9 = 100 × 9.', '= 900'],
    after: [3],
  },
]);
