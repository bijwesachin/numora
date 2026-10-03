import { defineCards } from '@/content/defineCards';

export const fractionsMixedNumbersCards = defineCards('fractions-mixed-numbers', ['fractions', 'mixed-numbers'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'What is a mixed number?',
    back: 'A whole number and a proper fraction together. It means the whole number PLUS the fraction.',
    example: '2 3/4 = 2 + 3/4',
    memoryHook: 'Full pizzas plus a few extra slices.',
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'How do you read a mixed number from a picture?',
    back: 'Count the full wholes for the whole-number part. Count the shaded slices in the last, partly shaded whole for the fraction.',
    after: [1],
  },
  {
    n: 3, type: 'rule', difficulty: 2,
    front: 'Where is a mixed number on a number line?',
    back: 'Between two whole numbers. 3 2/5 is between 3 and 4, a little past 3.',
    after: [1],
  },
  {
    n: 4, type: 'visual', difficulty: 1,
    front: 'What mixed number do these pizzas show?',
    back: '2 3/4',
    explanation: 'Two full pizzas and 3 of 4 slices of the third.',
    visual: {
      kind: 'row',
      items: [
        { kind: 'fraction-circle', numerator: 4, denominator: 4 },
        { kind: 'fraction-circle', numerator: 4, denominator: 4 },
        { kind: 'fraction-circle', numerator: 3, denominator: 4 },
      ],
    },
    after: [2],
  },
  {
    n: 5, type: 'visual', difficulty: 2,
    front: 'What mixed number is marked on this number line?',
    back: '2 1/2',
    explanation: 'It is past 2 by two fourths (2/4), which equals 1/2.',
    visual: {
      kind: 'number-line', min: 0, max: 3, partsPerWhole: 4,
      marks: [{ value: { numerator: 5, denominator: 2 }, label: '', position: 'above' }],
    },
    answerVisual: {
      kind: 'number-line', min: 0, max: 3, partsPerWhole: 4,
      marks: [{ value: { numerator: 5, denominator: 2 }, label: '2 1/2', position: 'above' }],
    },
    after: [3],
  },
  {
    n: 6, type: 'solve', difficulty: 1,
    front: 'Write 1 + 1/2 as a mixed number.',
    back: '1 1/2',
    after: [1],
    explanation: 'One whole plus one half is 1 and 1/2.',
  },
  {
    n: 7, type: 'solve', difficulty: 2,
    front: 'Between which two whole numbers is 3 2/5?',
    back: '3 and 4',
    after: [3],
    explanation: '3 2/5 is 3 wholes plus a little more, but less than 4.',
  },
  {
    n: 8, type: 'solve', difficulty: 3,
    front: 'Which is greater: 2 1/3 or 2 3/4?',
    back: '2 3/4',
    steps: ['Both have 2 wholes, so compare the fractions.', '1/3 = 4/12 and 3/4 = 9/12.', '9/12 > 4/12'],
    after: [6],
  },
  {
    n: 9, type: 'solve', difficulty: 3,
    front: 'Order from least to greatest: 1 3/4, 1 1/2, 2 1/8',
    back: '1 1/2, 1 3/4, 2 1/8',
    steps: ['2 1/8 has the biggest whole number.', 'For the two with 1 whole: 1/2 = 2/4 < 3/4.'],
    after: [8],
  },
  {
    n: 10, type: 'misconception', difficulty: 5,
    front: 'True or False: 3 1/2 means 3 × 1/2, which is 1 1/2.',
    back: 'False. A mixed number means 3 + 1/2 = 3 1/2. Written side by side, the whole number and fraction are added.',
    commonMistake: 'Multiplying the whole number and the fraction.',
    after: [1],
  },
  {
    n: 11, type: 'misconception', difficulty: 5,
    front: 'True or False: 2 5/6 is greater than 3 because 5/6 is nearly 1.',
    back: 'False. 2 5/6 is 1/6 short of 3.',
    after: [3],
  },
  {
    n: 12, type: 'real-life', difficulty: 3,
    front: 'A board is 4 3/8 feet long. Between which two whole numbers is its length, and is it closer to the lower or the higher one?',
    back: 'Between 4 and 5 feet, and closer to 4, because 3/8 is less than 1/2.',
    after: [7],
  },
  {
    n: 13, type: 'challenge', difficulty: 4,
    front: 'Write a mixed number that is between 2 1/4 and 2 1/2.',
    back: 'For example 2 1/3 (since 3/12 < 4/12 < 6/12) or 2 3/8.',
    hint: 'Both have 2 wholes. Find a fraction between 1/4 and 1/2.',
    after: [8],
  },
  {
    n: 14, type: 'challenge', difficulty: 4,
    front: 'Which mixed number is 1/4 less than 3?',
    back: '2 3/4',
    steps: ['3 is 2 wholes and 4/4.', 'Take away 1/4: 2 and 3/4.'],
    after: [8],
  },
]);
