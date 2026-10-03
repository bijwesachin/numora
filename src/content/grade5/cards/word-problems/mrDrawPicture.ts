import { defineCards } from '@/content/defineCards';

export const mrDrawPictureCards = defineCards('mr-draw-picture', ['math-reasoning', 'draw-a-picture'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'When does drawing a picture help in math?',
    back: 'When a story has parts, groups, distances or fractions. A quick sketch shows how the pieces fit together.',
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'What are some quick drawings that help?',
    back: 'Bar models for parts and totals, number lines for distance and time, arrays for equal groups, rectangles for area.',
    memoryHook: 'A sketch only needs to show relationships — it doesn’t have to be neat.',
    after: [1],
  },
  {
    n: 3, type: 'visual', difficulty: 2,
    front: 'A bar is 24 long and split into 4 equal parts. 3 parts are shaded. What is 3/4 of 24?',
    back: '18',
    explanation: 'Each part is 24 ÷ 4 = 6. Three parts: 3 × 6 = 18.',
    visual: {
      kind: 'bar-model',
      total: '24',
      bars: [{ segments: [{ label: '6', size: 6 }, { label: '6', size: 6 }, { label: '6', size: 6 }, { label: '6', size: 6, tone: 'empty' }] }],
    },
    after: [2],
  },
  {
    n: 4, type: 'solve', difficulty: 1,
    front: 'A string is 12 meters long. It is cut into 4 equal pieces. How long is each piece? Draw it.',
    back: '3 meters',
    steps: ['Draw a bar and split it into 4 equal parts.', '12 ÷ 4 = 3'],
    after: [2],
  },
  {
    n: 5, type: 'solve', difficulty: 2,
    front: 'Sam has 3 times as many cards as Jo. Together they have 48 cards. How many cards does each have?',
    back: 'Jo has 12 cards. Sam has 36 cards.',
    steps: ['Draw Jo as 1 part and Sam as 3 parts → 4 equal parts in all.', '48 ÷ 4 = 12 in each part.', 'Jo: 12. Sam: 3 × 12 = 36.', 'CHECK: 12 + 36 = 48 ✓'],
    answerVisual: {
      kind: 'bar-model',
      bars: [
        { label: 'Jo', segments: [{ label: '12', size: 12 }] },
        { label: 'Sam', segments: [{ label: '12', size: 12, tone: 'empty' }, { label: '12', size: 12, tone: 'empty' }, { label: '12', size: 12, tone: 'empty' }] },
      ],
    },
    after: [3],
  },
  {
    n: 6, type: 'solve', difficulty: 3,
    front: 'Draw a rectangle that is 8 m by 5 m. What are its area and its perimeter?',
    back: 'Area 40 square meters. Perimeter 26 meters.',
    steps: ['Area: 8 × 5 = 40.', 'Perimeter: 8 + 5 + 8 + 5 = 26.'],
    after: [2],
  },
  {
    n: 7, type: 'solve', difficulty: 3,
    front: 'Ria walks 3/5 of a 20 km trail. How many kilometers does she still have to walk?',
    back: '8 km',
    steps: ['Draw the trail as 5 equal parts of 4 km each.', 'She walked 3 parts = 12 km.', 'Left: 2 parts = 8 km.'],
    after: [3],
  },
  {
    n: 8, type: 'misconception', difficulty: 5,
    front: 'True or False: A drawing has to be neat and exactly to scale to be useful.',
    back: 'False. A sketch only needs to show how the numbers relate to each other.',
    after: [2],
  },
  {
    n: 9, type: 'misconception', difficulty: 5,
    front: 'True or False: Drawing pictures is only for younger students.',
    back: 'False. Mathematicians and engineers sketch diagrams all the time to understand a problem.',
    after: [1],
  },
  {
    n: 10, type: 'real-life', difficulty: 3,
    front: 'A pizza has 8 slices. Three friends each eat 2 slices. How many slices are left?',
    back: '2 slices',
    steps: ['Draw 8 slices.', 'Cross out 2 slices three times → 6 slices gone.', '8 − 6 = 2'],
    after: [4],
  },
  {
    n: 11, type: 'challenge', difficulty: 4,
    front: 'Tom spends 1/2 of his money on a game and 1/4 on lunch. He has $6 left. How much money did he start with?',
    back: '$24',
    hint: 'Draw the whole as 4 equal parts.',
    steps: ['Game: 2 of the 4 parts. Lunch: 1 part.', 'Left: 1 part = $6.', 'Whole: 4 × 6 = $24.'],
    answerVisual: {
      kind: 'bar-model',
      total: '?',
      bars: [{ segments: [{ label: 'game', size: 2 }, { label: 'lunch', size: 1, tone: 'empty' }, { label: '$6', size: 1, tone: 'unknown' }] }],
    },
    after: [5, 7],
  },
  {
    n: 12, type: 'challenge', difficulty: 4,
    front: 'A tank is 2/3 full. After 10 liters are added, it is full. How many liters does the tank hold?',
    back: '30 liters',
    steps: ['The missing part is 1/3 of the tank.', '1/3 = 10 liters.', 'Whole: 3 × 10 = 30 liters.'],
    after: [7],
  },
]);
