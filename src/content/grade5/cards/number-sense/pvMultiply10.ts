import { defineCards } from '@/content/defineCards';
import { wholeChart } from './charts';

const HOOK = 'Place Value Elevator: × 10 sends every digit UP one floor (one place left).';

export const pvMultiply10Cards = defineCards('pv-multiply-10', ['number-sense', 'place-value', 'multiply-by-10'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'What happens to the digits when you multiply a whole number by 10?',
    back: 'Every digit moves one place to the left. A 0 fills the empty ones place.',
    example: '45 × 10 = 450',
    memoryHook: HOOK,
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'How does multiplying by 100 or by 1,000 change a number?',
    back: 'Digits move 2 places left for 100 and 3 places left for 1,000.',
    rule: 'The number of zeros in the multiplier = the number of places the digits move.',
    example: '7 × 1,000 = 7,000',
    memoryHook: HOOK,
    after: [1],
  },
  {
    n: 3, type: 'visual', difficulty: 1,
    front: 'Here is 45 before and after multiplying by 10. What happened to the digits?',
    back: 'Each digit moved one place left, and a 0 took the ones place: 45 × 10 = 450.',
    visual: { kind: 'row', separator: '→', items: [wholeChart('_45', [1, 2]), wholeChart('450', [0, 1])] },
    memoryHook: HOOK,
    after: [1],
  },
  {
    n: 4, type: 'solve', difficulty: 1,
    front: '36 × 10 = ?',
    back: '360',
    steps: ['Move each digit one place left: 3 and 6 shift up.', 'Fill the ones place with 0.', '360'],
    after: [1],
  },
  {
    n: 5, type: 'solve', difficulty: 2,
    front: '52 × 100 = ?',
    back: '5,200',
    steps: ['100 has two zeros → move two places left.', '52 → 5,200'],
    after: [2],
  },
  {
    n: 6, type: 'solve', difficulty: 3,
    front: '408 × 1,000 = ?',
    back: '408,000',
    steps: ['1,000 has three zeros → move three places left.', 'Keep the 0 inside 408 as a placeholder.', '408 → 408,000'],
    after: [2],
  },
  {
    n: 7, type: 'solve', difficulty: 3,
    front: '9 × 10,000 = ?',
    back: '90,000',
    steps: ['10,000 has four zeros → move four places left.', '9 → 90,000'],
    after: [5],
  },
  {
    n: 8, type: 'misconception', difficulty: 5,
    front: 'True or False: To multiply by 10 you just “add a zero,” so 2.5 × 10 = 2.50.',
    back: 'False. 2.5 × 10 = 25. The digits move one place left.',
    explanation: '“Add a zero” only works for whole numbers. 2.50 is the same number as 2.5, so nothing changed.',
    commonMistake: 'Using “add a zero” with decimals.',
    memoryHook: 'Don’t add zeros — move the digits.',
    after: [2],
  },
  {
    n: 9, type: 'misconception', difficulty: 5,
    front: 'Sam says 60 × 100 = 600 because 6 × 100 = 600. What did he forget?',
    back: 'The zero already in 60. 60 × 100 = 6,000.',
    explanation: 'Move both digits two places left: 60 → 6,000.',
    after: [5],
  },
  {
    n: 10, type: 'real-life', difficulty: 3,
    front: 'A box has 24 crayons. A school orders 100 boxes. How many crayons is that?',
    back: '2,400 crayons',
    steps: ['24 crayons per box × 100 boxes.', '× 100 moves digits two places left.', '24 → 2,400'],
    after: [5],
  },
  {
    n: 11, type: 'challenge', difficulty: 4,
    front: 'Find the missing numbers:\n35 × ? = 35,000\n? × 100 = 4,800',
    back: '1,000 and 48',
    steps: ['35 → 35,000 moves three places, so × 1,000.', '4,800 moved two places left from 48, so 48 × 100 = 4,800.'],
    after: [6],
  },
  {
    n: 12, type: 'challenge', difficulty: 4,
    front: 'A factory makes 250 toys every day. How many toys does it make in 100 days? Explain how the digits move.',
    back: '25,000 toys. Each digit of 250 moves two places left.',
    steps: ['250 × 100', 'Move each digit two places left: 25,000'],
    after: [6, 7],
  },
]);
