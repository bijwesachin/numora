import { defineCards } from '@/content/defineCards';

export const mrUnnecessaryInfoCards = defineCards('mr-unnecessary-info', ['math-reasoning', 'unnecessary-information'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'What is a quick way to spot unneeded information?',
    back: 'Underline the question first. Then circle only the facts that help answer it.',
    memoryHook: 'Question first, facts second.',
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'What are “distractors” in a problem?',
    back: 'Numbers or facts (ages, times, colors, prices) added to tempt you into using them even though the question doesn’t need them.',
    after: [1],
  },
  {
    n: 3, type: 'solve', difficulty: 1,
    front: 'A teacher has 24 pencils, 3 erasers and 5 rulers. She gives 6 pencils away. How many pencils does she have now? Which facts weren’t needed?',
    back: '18 pencils. The erasers and rulers weren’t needed.',
    steps: ['24 − 6 = 18'],
    after: [2],
  },
  {
    n: 4, type: 'solve', difficulty: 2,
    front: 'A 12-pack of juice costs $6. Tia buys 3 packs. How many juices does she buy? Which fact wasn’t needed?',
    back: '36 juices. The $6 price wasn’t needed.',
    steps: ['3 × 12 = 36'],
    after: [2],
  },
  {
    n: 5, type: 'solve', difficulty: 3,
    front: 'A car travels 60 miles per hour for 3 hours on a sunny day and uses 8 gallons of gas. How far does it travel? Which facts weren’t needed?',
    back: '180 miles. “Sunny day” and 8 gallons weren’t needed.',
    steps: ['Distance = speed × time', '60 × 3 = 180'],
    after: [2],
  },
  {
    n: 6, type: 'solve', difficulty: 3,
    front: 'A garden is 10 m long, 6 m wide and has 20 flowers. Find its perimeter. Which fact wasn’t needed?',
    back: '32 m. The 20 flowers weren’t needed.',
    steps: ['2 × (10 + 6) = 32'],
    after: [2],
  },
  {
    n: 7, type: 'misconception', difficulty: 5,
    front: 'True or False: If a number is in the problem, it must be used.',
    back: 'False. Some numbers are only there to distract you.',
    after: [2],
  },
  {
    n: 8, type: 'misconception', difficulty: 5,
    front: 'True or False: A fact is unnecessary when it is a big number.',
    back: 'False. Whether a fact is needed depends on the question, not on its size.',
    after: [1],
  },
  {
    n: 9, type: 'real-life', difficulty: 3,
    front: 'Mom buys apples for $3, bread for $2 and milk for $4. She pays with $20. How much do the bread and milk cost together?',
    back: '$6. The apples and the $20 aren’t needed.',
    steps: ['2 + 4 = 6'],
    after: [4],
  },
  {
    n: 10, type: 'challenge', difficulty: 4,
    front: 'A shirt costs $15, pants cost $25 and shoes cost $40. Which facts do you need for (a) the cost of the shirt and pants, and (b) the cost of all three?',
    back: '(a) Shirt and pants only: 15 + 25 = $40.\n(b) All three: 15 + 25 + 40 = $80.',
    explanation: 'The same story can need different facts for different questions.',
    after: [5],
  },
  {
    n: 11, type: 'challenge', difficulty: 4,
    front: 'Rewrite this problem with different extra information, then solve it: “Sam has 5 boxes with 12 crayons in each box. How many crayons does he have?”',
    back: 'For example: “Sam, who is 10 years old, has 5 boxes with 12 crayons in each box. The boxes are red.” The answer is still 5 × 12 = 60 crayons.',
    after: [6],
    hint: 'Keep the numbers the question needs (5 and 12) and change only the extras.',
  },
]);
