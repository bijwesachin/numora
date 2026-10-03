import { defineCards } from '@/content/defineCards';

export const mrMakeTableCards = defineCards('mr-make-table', ['math-reasoning', 'make-a-table'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'When is making a table helpful?',
    back: 'When quantities change step by step, or when you need to organize several possibilities so none are missed.',
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'How do you build a helpful table?',
    back: 'Choose clear column headings. Fill the first rows from the story. Look for the rule. Extend the table to the row you need.',
    after: [1],
  },
  {
    n: 3, type: 'solve', difficulty: 1,
    front: 'A taxi charges $3 plus $2 per mile. Make a table for 1 to 4 miles.',
    back: '1 mile → $5\n2 miles → $7\n3 miles → $9\n4 miles → $11',
    steps: ['Cost = 3 + 2 × miles.', 'Each extra mile adds $2.'],
    after: [2],
  },
  {
    n: 4, type: 'solve', difficulty: 2,
    front: 'A plant is 5 cm tall and grows 2 cm each week. How tall is it after 6 weeks?',
    back: '17 cm',
    steps: ['Week 0: 5, week 1: 7, week 2: 9, week 3: 11, week 4: 13, week 5: 15, week 6: 17.', 'Rule: 5 + 2 × weeks = 5 + 12.'],
    after: [3],
  },
  {
    n: 5, type: 'solve', difficulty: 3,
    front: 'A gym charges $20 to join plus $15 per month. After how many months have you paid $95 in all?',
    back: '5 months',
    steps: ['Months → total: 1 → 35, 2 → 50, 3 → 65, 4 → 80, 5 → 95.', 'CHECK: 20 + 15 × 5 = 95 ✓'],
    after: [3],
  },
  {
    n: 6, type: 'solve', difficulty: 3,
    front: 'How many different outfits can you make from 3 shirts and 2 pairs of pants?',
    back: '6 outfits',
    steps: ['List every shirt with each pair of pants: 3 shirts × 2 pants.', 'Shirt 1 + pants A, B; shirt 2 + pants A, B; shirt 3 + pants A, B.', '3 × 2 = 6'],
    after: [2],
  },
  {
    n: 7, type: 'solve', difficulty: 3,
    front: 'Rosa saves $4 on day 1, $6 on day 2, $8 on day 3, and so on. How much does she save on day 7?',
    back: '$16',
    steps: ['Day: 1, 2, 3, 4, 5, 6, 7.', 'Saved: 4, 6, 8, 10, 12, 14, 16.', 'The amount grows by $2 each day.'],
    after: [4],
  },
  {
    n: 8, type: 'misconception', difficulty: 5,
    front: 'True or False: You can’t use a table when the numbers keep getting bigger.',
    back: 'False. A table is exactly how you spot a rule when numbers grow.',
    after: [2],
  },
  {
    n: 9, type: 'misconception', difficulty: 5,
    front: 'Maria says 3 shirts and 2 pairs of pants make 5 outfits (3 + 2). What is wrong?',
    back: 'Each shirt can go with each pair of pants, so the total is 3 × 2 = 6 outfits.',
    explanation: 'Listing the combinations in a table shows all 6.',
    after: [6],
  },
  {
    n: 10, type: 'real-life', difficulty: 3,
    front: 'A candle is 18 cm tall and burns down 2 cm every hour. How tall is it after 5 hours?',
    back: '8 cm',
    steps: ['Hour 0: 18, 1: 16, 2: 14, 3: 12, 4: 10, 5: 8.'],
    after: [4],
  },
  {
    n: 11, type: 'challenge', difficulty: 4,
    front: 'Rental A costs $12 plus $2 per hour. Rental B costs $4 per hour with no extra fee. After how many hours do they cost the same?',
    back: '6 hours (both cost $24)',
    steps: ['Hours 1–6, A: 14, 16, 18, 20, 22, 24.', 'Hours 1–6, B: 4, 8, 12, 16, 20, 24.', 'They match at 6 hours.'],
    after: [5],
  },
  {
    n: 12, type: 'challenge', difficulty: 4,
    front: 'Five people each shake hands once with every other person. How many handshakes happen?',
    back: '10 handshakes',
    steps: ['Person 1 shakes 4 hands, person 2 shakes 3 new ones, person 3 shakes 2 new ones, person 4 shakes 1 new one.', '4 + 3 + 2 + 1 = 10'],
    after: [6],
  },
]);
