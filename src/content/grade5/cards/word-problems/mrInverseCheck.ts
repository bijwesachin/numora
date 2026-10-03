import { defineCards } from '@/content/defineCards';

export const mrInverseCheckCards = defineCards('mr-inverse-check', ['math-reasoning', 'inverse-operations'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'What is checking with an inverse operation?',
    back: 'Using the opposite operation to see if you get back to where you started.',
    memoryHook: 'A good answer can find its way home.',
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'How do you check addition, subtraction, multiplication and division?',
    back: 'Add ↔ subtract, multiply ↔ divide.',
    example: '28 + 15 = 43 → 43 − 15 = 28 ✓\n6 × 7 = 42 → 42 ÷ 7 = 6 ✓',
    after: [1],
  },
  {
    n: 3, type: 'solve', difficulty: 1,
    front: 'Check 53 − 19 = 34 using addition.',
    back: '34 + 19 = 53, so the answer is correct.',
    after: [2],
    explanation: 'Subtraction and addition undo each other, so adding back the 19 should return you to 53.',
  },
  {
    n: 4, type: 'solve', difficulty: 2,
    front: 'Ben says 8 × 14 = 102. Use division to check.',
    back: '102 ÷ 8 = 12.75, not 14. So it is wrong. 8 × 14 = 112.',
    steps: ['Undo ×8 with ÷8.', '102 ÷ 8 doesn’t give 14.', '112 ÷ 8 = 14 ✓'],
    after: [2],
  },
  {
    n: 5, type: 'solve', difficulty: 3,
    front: 'Check 3,456 ÷ 8 = 432 using multiplication.',
    back: '432 × 8 = 3,456, so it is correct.',
    steps: ['400 × 8 = 3,200', '32 × 8 = 256', '3,200 + 256 = 3,456 ✓'],
    after: [2],
  },
  {
    n: 6, type: 'solve', difficulty: 3,
    front: 'Is 7.5 + 2.8 = 10.3 correct? Check with subtraction.',
    back: '10.3 − 2.8 = 7.5, so it is correct.',
    after: [3],
    explanation: 'Take away the number you added (2.8). You should land back on 7.5.',
  },
  {
    n: 7, type: 'solve', difficulty: 3,
    front: 'Check 25 × 16 = 400 by dividing.',
    back: '400 ÷ 16 = 25, so it is correct.',
    after: [4],
    explanation: 'Multiplication and division undo each other: 400 split into 16 equal parts is 25.',
  },
  {
    n: 8, type: 'misconception', difficulty: 5,
    front: 'True or False: Doing the same calculation a second time is a good way to check your answer.',
    back: 'False. You might repeat the same mistake. Use the inverse operation instead.',
    after: [2],
  },
  {
    n: 9, type: 'misconception', difficulty: 5,
    front: 'True or False: To check the subtraction 90 − 47 = 43, you subtract 47 again.',
    back: 'False. Add the answer to the number you subtracted: 43 + 47 = 90 ✓.',
    after: [3],
  },
  {
    n: 10, type: 'real-life', difficulty: 3,
    front: 'A shop says 6 boxes with 24 markers each hold 154 markers. Check by dividing.',
    back: '154 ÷ 6 isn’t a whole number, so it is wrong. 6 × 24 = 144 markers.',
    after: [4],
  },
  {
    n: 11, type: 'challenge', difficulty: 4,
    front: 'Check 4,215 − 2,789 = 1,426 using addition.',
    back: '1,426 + 2,789 = 4,215, so it is correct.',
    steps: ['1,426 + 2,789', '1,426 + 2,000 = 3,426', '3,426 + 789 = 4,215 ✓'],
    after: [6],
  },
  {
    n: 12, type: 'challenge', difficulty: 4,
    front: 'Zoe says 72 ÷ 9 = 7. Use multiplication to show she is wrong, and fix it.',
    back: '7 × 9 = 63, not 72. The correct answer is 8, because 8 × 9 = 72.',
    after: [5],
    steps: ['Multiply the answer by the divisor: 7 × 9 = 63.', '63 is not 72, so 7 is wrong.', 'Try 8: 8 × 9 = 72 ✓'],
  },
]);
