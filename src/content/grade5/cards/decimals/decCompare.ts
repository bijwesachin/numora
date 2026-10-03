import { defineCards } from '@/content/defineCards';

export const decCompareCards = defineCards('dec-compare', ['decimals', 'comparing', 'ordering'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'How do you compare and order decimals?',
    back: 'Line up the decimal points and compare place by place from the left. Use zeros as placeholders so every number has the same number of places.',
    memoryHook: 'Same number of places, then compare like whole numbers.',
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'What do you do to compare 0.62 and 0.6?',
    back: 'Write 0.6 as 0.60. Now compare 62 hundredths with 60 hundredths: 0.62 > 0.6.',
    after: [1],
  },
  {
    n: 3, type: 'rule', difficulty: 2,
    front: 'How do you order decimals from least to greatest?',
    back: 'Give them all the same number of decimal places, then order them as if they were whole numbers.',
    after: [2],
  },
  {
    n: 4, type: 'visual', difficulty: 1,
    front: 'On the number line, 0.3 and 0.35 are marked. Which is greater?',
    back: '0.35, because it is farther right.',
    explanation: '0.35 is halfway between 0.3 and 0.4.',
    visual: {
      kind: 'number-line', min: 0, max: 1, partsPerWhole: 10,
      marks: [
        { value: { numerator: 3, denominator: 10 }, label: '0.3', position: 'below' },
        { value: { numerator: 7, denominator: 20 }, label: '0.35', position: 'above' },
      ],
    },
    after: [2],
  },
  {
    n: 5, type: 'visual', difficulty: 2,
    front: 'Which grid shows more: the one with 40 squares shaded (0.4) or the one with 38 squares shaded (0.38)?',
    back: '0.4, because 40 hundredths is more than 38 hundredths.',
    visual: {
      kind: 'row',
      separator: 'vs',
      items: [
        { kind: 'shaded-grid', rows: 10, cols: 10, shaded: 40 },
        { kind: 'shaded-grid', rows: 10, cols: 10, shaded: 38 },
      ],
    },
    after: [2],
  },
  {
    n: 6, type: 'solve', difficulty: 1,
    front: 'Compare: 0.8 ○ 0.5',
    back: '0.8 > 0.5',
    after: [1],
    explanation: 'Compare tenths: 8 tenths is more than 5 tenths.',
  },
  {
    n: 7, type: 'solve', difficulty: 2,
    front: 'Compare: 0.62 ○ 0.6',
    back: '0.62 > 0.6',
    steps: ['0.6 = 0.60.', '62 hundredths > 60 hundredths.'],
    after: [2],
  },
  {
    n: 8, type: 'solve', difficulty: 3,
    front: 'Compare: 3.07 ○ 3.7',
    back: '3.07 < 3.7',
    steps: ['Whole parts are equal.', '3.7 = 3.70. 7 hundredths < 70 hundredths.'],
    after: [7],
  },
  {
    n: 9, type: 'solve', difficulty: 3,
    front: 'Order from least to greatest: 0.9, 0.09, 0.19, 0.91',
    back: '0.09, 0.19, 0.9, 0.91',
    steps: ['Use hundredths: 0.90, 0.09, 0.19, 0.91.', 'Order: 09, 19, 90, 91.'],
    after: [3],
  },
  {
    n: 10, type: 'solve', difficulty: 3,
    front: 'Order from greatest to least: 5.5, 5.05, 5.55, 5.505',
    back: '5.55, 5.505, 5.5, 5.05',
    steps: ['Use thousandths: 5.500, 5.050, 5.550, 5.505.', 'Greatest to least: 5.550, 5.505, 5.500, 5.050.'],
    after: [9],
  },
  {
    n: 11, type: 'misconception', difficulty: 5,
    front: 'True or False: 0.7 < 0.65 because 7 is less than 65.',
    back: 'False. 0.7 = 0.70, which is greater than 0.65.',
    commonMistake: 'Treating the digits after the point as a whole number.',
    after: [7],
  },
  {
    n: 12, type: 'misconception', difficulty: 5,
    front: 'True or False: 2.30 is greater than 2.3.',
    back: 'False. They are equal; a zero on the end doesn’t change the value.',
    after: [2],
  },
  {
    n: 13, type: 'real-life', difficulty: 3,
    front: 'Lena jumped 1.45 m and Ben jumped 1.5 m. Who jumped farther?',
    back: 'Ben. 1.50 is greater than 1.45.',
    after: [7],
  },
  {
    n: 14, type: 'challenge', difficulty: 4,
    front: 'Name a decimal between 0.74 and 0.75.',
    back: 'For example 0.745 (0.7401, 0.748 and others also work).',
    hint: 'Write both with thousandths: 0.740 and 0.750.',
    after: [9],
  },
  {
    n: 15, type: 'challenge', difficulty: 4,
    front: 'Which digits can replace ■ so that 6.■8 > 6.58?',
    back: '6, 7, 8 or 9',
    steps: ['Whole parts are the same, so compare tenths.', '■ must be greater than 5. If ■ = 5 the numbers are equal.'],
    after: [8],
  },
]);
