import { defineCards } from '@/content/defineCards';

const HOOK = 'R-U-N-C: Read · Understand · Name · Calculate — then CHECK.';

export const wpRuncCards = defineCards('wp-runc', ['word-problems', 'runc'], [
  {
    n: 1, type: 'concept', difficulty: 1,
    front: 'What does R-U-N-C stand for?',
    back: 'R = Read the problem.\nU = Understand what is being asked.\nN = Name what you know.\nC = Calculate.\nThen CHECK: does the answer make sense?',
    memoryHook: HOOK,
  },
  {
    n: 2, type: 'rule', difficulty: 2,
    front: 'Why shouldn’t you rely only on “trigger words” like total, left or each?',
    back: 'The same word can go with different operations. Understanding the story tells you which operation fits.',
    example: '“Ana gave away 4 stickers and has 5 left. How many did she start with?”\n“Left” is here, but you ADD: 4 + 5 = 9.',
    memoryHook: 'Picture the story. Words are clues, not commands.',
    after: [1],
  },
  {
    n: 3, type: 'rule', difficulty: 2,
    front: 'What do you do in the U step (Understand)?',
    back: 'Say in your own words what the question is asking and what kind of answer you need (a number of what?).',
    example: '“How many more…?” asks for a difference. “How many in each group?” asks for a share.',
    after: [1],
  },
  {
    n: 4, type: 'visual', difficulty: 2,
    front: 'Tom has 9 marbles. Sara has 15. How many more marbles does Sara have? What does the picture show?',
    back: 'Sara’s bar is 15 long. Tom’s bar is 9, so the missing piece is the difference: 15 − 9 = 6.',
    explanation: 'A bar model shows what you know (9 and 15) and what you want to find (?).',
    visual: {
      kind: 'bar-model',
      bars: [
        { label: 'Sara', segments: [{ label: '15', size: 15 }] },
        { label: 'Tom', segments: [{ label: '9', size: 9 }, { label: '?', size: 6, tone: 'unknown' }] },
      ],
    },
    after: [3],
  },
  {
    n: 5, type: 'solve', difficulty: 2,
    front: 'Mia has 14 stickers. She gives 6 to Leo. How many stickers does she have now? Use R-U-N-C.',
    back: '8 stickers',
    steps: ['R: Read the story once.', 'U: I need how many stickers Mia has left.', 'N: She started with 14 and gave away 6.', 'C: 14 − 6 = 8.', 'CHECK: 8 + 6 = 14 ✓'],
    after: [3],
  },
  {
    n: 6, type: 'solve', difficulty: 3,
    front: 'A pack has 6 pencils. Ms. Cho buys 5 packs. How many pencils does she buy? Use R-U-N-C.',
    back: '30 pencils',
    steps: ['U: I need the total in 5 equal groups.', 'N: 5 packs, 6 pencils in each pack.', 'C: 5 × 6 = 30.', 'CHECK: 30 ÷ 5 = 6 ✓'],
    after: [5],
  },
  {
    n: 7, type: 'misconception', difficulty: 5,
    front: 'True or False: If you see the word “total,” you should always add.',
    back: 'False. It depends on the story.',
    explanation: '“There are 24 cookies in total, shared equally among 4 friends. How many does each get?” The total is given, so you divide: 24 ÷ 4 = 6.',
    commonMistake: 'Picking the operation from one word.',
    after: [2],
  },
  {
    n: 8, type: 'misconception', difficulty: 5,
    front: 'True or False: As soon as you have a number for your answer, you are done.',
    back: 'False. Always CHECK: Does it make sense? Does it answer the question that was asked? Does it have the right unit?',
    memoryHook: 'R-U-N-C-CHECK',
    after: [1],
  },
  {
    n: 9, type: 'real-life', difficulty: 3,
    front: 'A bus has 38 riders. At the first stop 9 get off and 14 get on. How many riders are on the bus now?',
    back: '43 riders',
    steps: ['U: I need the number of riders after both changes.', 'N: Start 38, minus 9, plus 14.', 'C: 38 − 9 = 29, then 29 + 14 = 43.', 'CHECK: about 40 − 10 + 15 = 45 ✓'],
    after: [5],
  },
  {
    n: 10, type: 'challenge', difficulty: 4,
    front: 'Ben has 20 apples. That is 8 more than Cy has. How many apples does Cy have? Use R-U-N-C.',
    back: '12 apples',
    hint: 'The word “more” is a trap. Who has more? So who has fewer?',
    steps: ['U: Ben has more than Cy, so Cy has fewer.', 'N: Ben 20; Ben has 8 more than Cy.', 'C: 20 − 8 = 12.', 'CHECK: 12 + 8 = 20 ✓'],
    after: [2, 5],
  },
  {
    n: 11, type: 'challenge', difficulty: 4,
    front: 'Write a story problem that is solved by 36 ÷ 4, and say what the answer means.',
    back: 'For example: “36 cookies are shared equally among 4 friends. How many does each get?” The answer, 9, means each friend gets 9 cookies.',
    explanation: 'Many stories work. What matters is that the story has 36 split into 4 equal groups.',
    after: [6],
  },
]);
