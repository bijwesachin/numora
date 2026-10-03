import { defineCards } from '@/content/defineCards';

export const wpExtraInfoCards = defineCards('wp-extra-info', ['word-problems', 'extra-information'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'What is extra (unneeded) information in a word problem?',
    back: 'A fact that isn’t needed to answer the question — a distractor.',
    memoryHook: 'Not every number is invited to the party.',
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'How do you find extra information?',
    back: 'Underline the question. List what you need to answer it. Cross out the facts you don’t need.',
    after: [1],
  },
  {
    n: 3, type: 'solve', difficulty: 1,
    front: 'Ben has 8 red cars and 5 blue cars. He is 9 years old. How many cars does he have? Which fact is extra?',
    back: '13 cars. His age (9) is extra.',
    steps: ['The question is about cars.', '8 + 5 = 13.', 'His age isn’t needed.'],
    after: [2],
  },
  {
    n: 4, type: 'solve', difficulty: 2,
    front: 'A book has 120 pages and costs $8. Mia has read 45 pages. How many pages does she have left? Which fact is extra?',
    back: '75 pages. The $8 price is extra.',
    steps: ['120 − 45 = 75'],
    after: [2],
  },
  {
    n: 5, type: 'solve', difficulty: 3,
    front: 'A recipe uses 3 cups of flour, 2 eggs and 1 cup of sugar. Joel makes 4 batches. How many cups of flour does he need?',
    back: '12 cups. The eggs and sugar are extra.',
    steps: ['The question asks about flour.', '4 × 3 = 12.'],
    after: [3],
  },
  {
    n: 6, type: 'solve', difficulty: 3,
    front: 'A bus has 40 seats and is 10 meters long. 28 seats are filled. How many seats are empty? Which fact is extra?',
    back: '12 seats. The length (10 m) is extra.',
    steps: ['40 − 28 = 12'],
    after: [3],
  },
  {
    n: 7, type: 'solve', difficulty: 3,
    front: 'Pete walked 2 miles on Monday and 3 miles on Tuesday. He also bought a $4 snack. How many miles did he walk?',
    back: '5 miles. The $4 snack is extra.',
    steps: ['2 + 3 = 5'],
    after: [3],
  },
  {
    n: 8, type: 'misconception', difficulty: 5,
    front: 'True or False: You must use every number in a word problem.',
    back: 'False. Some numbers are there to distract you.',
    after: [2],
  },
  {
    n: 9, type: 'misconception', difficulty: 5,
    front: 'A shirt costs $15 and pants cost $25. Dad pays with $50. Zoe is asked, “How much do the shirt and pants cost?” and says “$10.” What went wrong?',
    back: 'She found the change, which wasn’t asked. The cost is 15 + 25 = $40. The $50 is extra.',
    after: [4],
  },
  {
    n: 10, type: 'real-life', difficulty: 3,
    front: 'A soccer team has 14 players and practices 3 days a week for 90 minutes each day. How many minutes does the team practice in a week?',
    back: '270 minutes. The 14 players is extra.',
    steps: ['3 × 90 = 270'],
    after: [5],
  },
  {
    n: 11, type: 'challenge', difficulty: 4,
    front: 'Cross out the extra fact, then solve: “A rectangular garden is 8 m long, 5 m wide and has 3 rose bushes. Find the perimeter.”',
    back: 'Perimeter = 26 m. The 3 rose bushes are extra.',
    steps: ['2 × (8 + 5) = 2 × 13 = 26.'],
    after: [5],
  },
  {
    n: 12, type: 'challenge', difficulty: 4,
    front: 'A store had 60 shirts and opens at 9 a.m. It sold 18 shirts on Monday and 12 on Tuesday. How many shirts are left?',
    back: '30 shirts. The opening time is extra.',
    steps: ['Sold: 18 + 12 = 30.', 'Left: 60 − 30 = 30.'],
    after: [6],
  },
]);
