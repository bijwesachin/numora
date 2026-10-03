import { learningStage } from '@/domain/flashcard';
import { parseFactCardId } from '@/domain/timesTables';
import { validateCurriculum } from '@/domain/validateCurriculum';
import { curriculum } from '.';
import { grade5Cards } from './grade5/cards';
import { grade5Curriculum } from './grade5/curriculum';

describe('grade 5 content', () => {
  it('passes structural validation', () => {
    expect(validateCurriculum({ ...grade5Curriculum, cards: grade5Cards })).toEqual([]);
  });

  it('covers all 21 curriculum units (plus Times Tables and 3 Integers units) and 100+ micro-concepts', () => {
    expect(grade5Curriculum.units).toHaveLength(25);
    expect(grade5Curriculum.concepts.length).toBeGreaterThanOrEqual(100);
  });

  it('Equivalent Fractions covers all 8 learning stages and all 5 difficulty levels', () => {
    const cards = curriculum.cardsOfConcept('fractions-equivalent');
    expect(new Set(cards.map(learningStage))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8]));
    expect(new Set(cards.map((c) => c.difficulty))).toEqual(new Set([1, 2, 3, 4, 5]));
    expect(new Set(cards.map((c) => c.type))).toEqual(
      new Set(['concept', 'rule', 'visual', 'solve', 'misconception', 'real-life', 'challenge']),
    );
  });

  it('hard cards always build on easier ones', () => {
    for (const card of grade5Cards.filter((c) => c.difficulty >= 4 && c.type !== 'misconception')) {
      expect(card.prerequisites.length, card.id).toBeGreaterThan(0);
    }
  });
});

describe.each([
  { categoryId: 'number-sense', conceptCount: 11 },
  { categoryId: 'word-problems', conceptCount: 22 },
  { categoryId: 'operations', conceptCount: 24 },
  { categoryId: 'fractions', conceptCount: 23 },
  { categoryId: 'decimals', conceptCount: 13 },
  { categoryId: 'algebra', conceptCount: 11 },
  { categoryId: 'integers', conceptCount: 9 },
])('$categoryId content', ({ categoryId, conceptCount }) => {
  const concepts = curriculum.conceptsOfCategory(categoryId);

  it('has cards for every concept', () => {
    expect(concepts).toHaveLength(conceptCount);
    for (const concept of concepts) {
      expect(curriculum.cardsOfConcept(concept.id).length, concept.id).toBeGreaterThanOrEqual(10);
    }
  });

  it('teaches each concept with a rule, a trap, a real-life problem and a challenge', () => {
    for (const concept of concepts) {
      const types = new Set(curriculum.cardsOfConcept(concept.id).map((c) => c.type));
      for (const type of ['concept', 'rule', 'solve', 'misconception', 'real-life', 'challenge'] as const) {
        expect(types.has(type), `${concept.id} is missing a ${type} card`).toBe(true);
      }
    }
  });

  it('gives solve and challenge cards worked steps, a hint or an explanation', () => {
    const cards = concepts.flatMap((c) => curriculum.cardsOfConcept(c.id)).filter((c) => c.type === 'solve' || c.type === 'challenge');
    const bare = cards.filter((c) => !(c.steps?.length || c.hint || c.explanation)).map((c) => c.id);
    expect(bare).toEqual([]);
  });

  it('introduces cards in a sensible order: every prerequisite is easier or the same level', () => {
    const byId = new Map(concepts.flatMap((c) => curriculum.cardsOfConcept(c.id)).map((c) => [c.id, c]));
    const outOfOrder = [...byId.values()].flatMap((card) =>
      card.prerequisites.flatMap((pre) => {
        const before = byId.get(pre);
        return before && before.difficulty > Math.max(card.difficulty, 2) ? [`${card.id} (d${card.difficulty}) after ${pre} (d${before.difficulty})`] : [];
      }),
    );
    expect(outOfOrder).toEqual([]);
  });
});

describe('times tables content', () => {
  it('has a deck for every table 2–15 with a trick card and all 14 facts', () => {
    for (let a = 2; a <= 15; a++) {
      const cards = curriculum.cardsOfConcept(`tt-${a}`);
      expect(cards, `× ${a}`).toHaveLength(15);
      expect(cards[0]?.type).toBe('rule');
    }
  });

  it('every fact card states the correct product', () => {
    for (const card of grade5Cards.filter((c) => /^tt-\d+-\d{3}$/.test(c.id) && c.type === 'solve')) {
      const fact = parseFactCardId(card.id)!;
      expect(card.front, card.id).toBe(`${fact.a} × ${fact.b} = ?`);
      expect(card.back, card.id).toBe(`${fact.a} × ${fact.b} = ${fact.product}`);
    }
  });
});

describe('validateCurriculum', () => {
  it('reports broken references, bad ids and cycles', () => {
    const errors = validateCurriculum({
      categories: [{ id: 'c', grade: 5, title: '', blurb: '', icon: '', color: 'indigo', unitIds: ['u', 'nope'] }],
      units: [{ id: 'u', categoryId: 'c', title: '', conceptIds: ['k'] }],
      concepts: [{ id: 'k', unitId: 'u', title: '', prerequisites: ['k'] }],
      cards: [
        { id: 'k-1', grade: 5, conceptId: 'k', type: 'solve', difficulty: 1, front: 'q', back: 'a', tags: [], prerequisites: ['missing'] },
        {
          id: 'k-002', grade: 5, conceptId: 'k', type: 'visual', difficulty: 1, front: 'q', back: 'a', tags: [], prerequisites: [],
          visual: { kind: 'fraction-circle', numerator: 5, denominator: 4 },
        },
      ],
    });
    expect(errors).toEqual(
      expect.arrayContaining([
        'Category "c" lists unknown unit "nope"',
        'Card "k-1" should be named "<concept-id>-NNN"',
        'Card "k-1" has unknown prerequisite "missing"',
        'Card "k-002": fraction-circle can\'t show more than one whole',
        'Prerequisite cycle among concepts: k → k',
      ]),
    );
  });
});
