import { defineCards } from '@/content/defineCards';
import { wholeChart } from './charts';

export const pvPowersOfTenCards = defineCards('pv-powers-of-ten', ['number-sense', 'place-value', 'powers-of-10'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'What is a power of 10?',
    back: 'A number you get by multiplying 10 by itself: 10, 100, 1,000, 10,000 …',
    example: '10³ = 10 × 10 × 10 = 1,000',
    memoryHook: 'The little number counts the zeros.',
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'What does the small raised number (exponent) in 10⁴ tell you?',
    back: 'How many 10s are multiplied together — and how many zeros come after the 1.',
    example: '10⁴ = 10 × 10 × 10 × 10 = 10,000 (four zeros)',
    after: [1],
  },
  {
    n: 3, type: 'visual', difficulty: 1,
    front: 'What pattern do you see as the 1 moves one place left each time?',
    back: 'It becomes 10 times bigger each time: 1 → 10 → 100.',
    explanation: 'Each move left adds one more zero, which is one more factor of 10.',
    visual: { kind: 'row', separator: '→', items: [wholeChart('1', [0]), wholeChart('10', [0]), wholeChart('100', [0])] },
    after: [1],
  },
  {
    n: 4, type: 'solve', difficulty: 1,
    front: 'Write 10³ as a standard number.',
    back: '1,000',
    steps: ['The exponent is 3, so there are 3 zeros.', '1 followed by 3 zeros = 1,000.'],
    after: [2],
  },
  {
    n: 5, type: 'solve', difficulty: 2,
    front: 'Write 10 × 10 × 10 × 10 using an exponent, then find its value.',
    back: '10⁴ = 10,000',
    steps: ['Count the 10s being multiplied: 4.', 'Write 10⁴.', 'Four zeros after the 1 → 10,000.'],
    after: [4],
  },
  {
    n: 6, type: 'solve', difficulty: 3,
    front: 'What is 10⁶ in standard form and in words?',
    back: '1,000,000 — one million.',
    steps: ['Six zeros after the 1: 1,000,000.', 'Group in threes: 1 | 000 | 000 → one million.'],
    after: [4],
  },
  {
    n: 7, type: 'solve', difficulty: 3,
    front: 'Write 100,000 as a power of 10.',
    back: '10⁵',
    hint: 'Count the zeros.',
    steps: ['100,000 has five zeros.', 'So it is 10⁵.'],
    after: [5],
  },
  {
    n: 8, type: 'misconception', difficulty: 5,
    front: 'True or False: 10³ means 10 × 3, so it equals 30.',
    back: 'False. 10³ = 10 × 10 × 10 = 1,000.',
    commonMistake: 'Multiplying the base by the exponent instead of multiplying the base by itself.',
    after: [2],
  },
  {
    n: 9, type: 'misconception', difficulty: 5,
    front: 'True or False: 10⁵ has five zeros, so it equals 500,000.',
    back: 'False. The five zeros come AFTER a 1: 10⁵ = 100,000.',
    commonMistake: 'Putting the exponent in front of the zeros.',
    after: [2],
  },
  {
    n: 10, type: 'real-life', difficulty: 3,
    front: 'A box holds 10² pencils. A case holds 10 boxes. How many pencils are in a case? Write it as a power of 10.',
    back: '1,000 pencils = 10³',
    steps: ['One box: 10² = 100 pencils.', 'A case is 10 boxes: 100 × 10 = 1,000.', '1,000 = 10³ (10² × 10 = 10³).'],
    after: [5],
  },
  {
    n: 11, type: 'challenge', difficulty: 4,
    front: 'How many times as great is 10⁵ as 10³?',
    back: '100 times (10² times).',
    steps: ['10⁵ = 100,000 and 10³ = 1,000.', '100,000 ÷ 1,000 = 100.', 'Shortcut: 5 − 3 = 2 extra tens → 10² = 100.'],
    after: [6, 7],
  },
]);
