import { defineCards } from '@/content/defineCards';

export const wpMissingInfoCards = defineCards('wp-missing-info', ['word-problems', 'missing-information'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'What is a missing-information problem?',
    back: 'A problem that can’t be solved because a fact you need isn’t given. Your job is to name what’s missing.',
    memoryHook: 'No recipe quantity? No cake.',
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'What should you do when information is missing?',
    back: 'Say exactly what is missing (which number, and in what unit) and why you need it. Don’t guess.',
    after: [1],
  },
  {
    n: 3, type: 'solve', difficulty: 1,
    front: 'Sam bought 3 notebooks. How much money did he spend? What is missing?',
    back: 'Missing: the price of one notebook.',
    explanation: 'Cost = number of notebooks × price of each. We only know the number.',
    after: [2],
  },
  {
    n: 4, type: 'solve', difficulty: 2,
    front: 'A train travels at 60 miles per hour. How far does it go? What is missing?',
    back: 'Missing: how long it travels (the time).',
    explanation: 'Distance = speed × time. We know the speed but not the time.',
    after: [2],
  },
  {
    n: 5, type: 'solve', difficulty: 2,
    front: 'Maya has $20 and buys a hat. How much money does she have left? What is missing?',
    back: 'Missing: the price of the hat.',
    explanation: 'Money left = $20 − the price of the hat. We know the $20 but not the price.',
    after: [2],
  },
  {
    n: 6, type: 'solve', difficulty: 3,
    front: 'A rectangle’s length is 12 cm. Find its area. What is missing?',
    back: 'Missing: the width.',
    explanation: 'Area = length × width.',
    after: [2],
  },
  {
    n: 7, type: 'solve', difficulty: 3,
    front: 'A class of 24 students shares pizza equally. How many slices does each student get? What is missing?',
    back: 'Missing: the total number of slices.',
    steps: ['Each share = total slices ÷ 24.', 'We don’t know the total slices.'],
    after: [2],
  },
  {
    n: 8, type: 'misconception', difficulty: 5,
    front: 'True or False: If a word problem is missing a number, you should pick any number so you can finish.',
    back: 'False. Name what’s missing instead. A made-up number gives a made-up answer.',
    after: [2],
  },
  {
    n: 9, type: 'misconception', difficulty: 5,
    front: 'True or False: Every question with numbers in it can be solved. Example: “Tom is 10. How old is his brother?”',
    back: 'False. Nothing tells us how the brothers’ ages are related.',
    after: [3],
  },
  {
    n: 10, type: 'real-life', difficulty: 3,
    front: 'You want a $45 jacket and earn $8 a week doing chores. How many weeks until you can buy it? What do you need to know?',
    back: 'You need to know how much you have already saved.',
    explanation: 'If you have $13 saved: (45 − 13) ÷ 8 = 4 weeks.',
    after: [5],
  },
  {
    n: 11, type: 'challenge', difficulty: 4,
    front: 'Make this solvable: “A bakery sold 48 muffins in the morning. How many did it sell all day?” Add the missing fact and solve.',
    back: 'Missing: the number sold in the afternoon. For example, if 35 muffins were sold in the afternoon, 48 + 35 = 83 muffins.',
    hint: 'What other fact would you need to find the whole day’s total?',
    after: [5, 6],
  },
  {
    n: 12, type: 'challenge', difficulty: 4,
    front: 'Which problem is missing information? A: 6 boxes with 4 toys each; how many toys? B: 5 boxes with the same number of toys in each; how many toys?',
    back: 'B. It never says how many toys are in each box.',
    hint: 'Can you write a multiplication sentence with all numbers known?',
    after: [7],
  },
]);
