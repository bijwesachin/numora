import { seededRandom } from './deck/ordering';
import { applyRating, newCardProgress } from './review/scheduler';
import {
  answerChoices,
  distractors,
  factCardId,
  factDifficulty,
  factStrategy,
  factVisual,
  parseFactCardId,
  pickSprintFacts,
  rateAnswer,
  TABLES,
} from './timesTables';

const allPairs = TABLES.flatMap((a) => TABLES.map((b) => [a, b] as const));

describe('fact ids', () => {
  it('are deterministic and round-trip', () => {
    expect(factCardId(7, 8)).toBe('tt-7-008');
    expect(factCardId(15, 13)).toBe('tt-15-013');
    expect(parseFactCardId('tt-7-008')).toEqual({ a: 7, b: 8, product: 56 });
    expect(parseFactCardId('tt-7-001')).toBeUndefined(); // the table's rule card, not a fact
    expect(parseFactCardId('mul-2x2-001')).toBeUndefined();
  });
});

describe('factStrategy', () => {
  it('ends every worked example on the correct product, for all 196 facts', () => {
    for (const [a, b] of allPairs) {
      const { steps } = factStrategy(a, b);
      const last = steps.at(-1)!;
      const result = Number(last.split('=').at(-1)!.trim());
      expect(result, `${a} × ${b}: ${last}`).toBe(a * b);
    }
  });

  it('every step is true arithmetic', () => {
    for (const [a, b] of allPairs) {
      for (const step of factStrategy(a, b).steps) {
        const m = /^(\d+) ([×+−]) (\d+) = (\d+)$/.exec(step);
        if (!m) continue; // "Half of 140 = 70" and "11 × 7 = 77" style steps
        const [x, op, y, z] = [Number(m[1]), m[2], Number(m[3]), Number(m[4])];
        const value = op === '×' ? x * y : op === '+' ? x + y : x - y;
        expect(value, step).toBe(z);
      }
    }
  });

  it('chooses friendly tricks', () => {
    expect(factStrategy(7, 10).name).toBe('Add a zero');
    expect(factStrategy(2, 14).name).toBe('Doubles');
    expect(factStrategy(14, 5).steps).toEqual(['14 × 10 = 140', 'Half of 140 = 70']);
    expect(factStrategy(11, 7).steps).toEqual(['11 × 7 = 77']);
    expect(factStrategy(11, 13).steps).toEqual(['13 × 10 = 130', '130 + 13 = 143']);
    expect(factStrategy(7, 13).steps).toEqual(['7 × 10 = 70', '7 × 3 = 21', '70 + 21 = 91']);
    expect(factStrategy(9, 7).steps).toEqual(['7 × 10 = 70', '70 − 7 = 63']);
    expect(factStrategy(8, 6).name).toBe('Double three times');
    expect(factStrategy(7, 7).isSquare).toBe(true);
    expect(factStrategy(1, 9).steps).toEqual(['9 × 1 = 9']);
  });

  it('is the same trick both ways round', () => {
    for (const [a, b] of allPairs) expect(factStrategy(a, b).name).toBe(factStrategy(b, a).name);
  });
});

describe('factDifficulty', () => {
  it('keeps × 2 and × 10 easy and makes the teens hard', () => {
    expect(factDifficulty(2, 15)).toBeLessThanOrEqual(2);
    expect(factDifficulty(10, 14)).toBeLessThanOrEqual(2);
    expect(factDifficulty(13, 14)).toBe(4);
    expect(factDifficulty(7, 8)).toBe(3);
    expect(factDifficulty(5, 5)).toBe(1);
  });
});

describe('factVisual', () => {
  it('uses an array up to 10 × 10 and a split area model above', () => {
    expect(factVisual(3, 8)).toMatchObject({ kind: 'shaded-grid', rows: 3, cols: 8, shaded: 24 });
    expect(factVisual(13, 6)).toMatchObject({ kind: 'area-model', cells: [['60', '18']], total: '60 + 18 = 78' });
  });
});

describe('distractors', () => {
  it('always returns three different wrong, positive answers', () => {
    for (const [a, b] of allPairs) {
      const wrong = distractors(a, b, seededRandom(a * 100 + b));
      expect(wrong).toHaveLength(3);
      expect(new Set(wrong).size).toBe(3);
      expect(wrong).not.toContain(a * b);
      expect(wrong.every((n) => n > 0 && Number.isInteger(n))).toBe(true);
    }
  });

  it('answer choices contain the product exactly once', () => {
    const choices = answerChoices(7, 8, seededRandom(1));
    expect(choices).toHaveLength(4);
    expect(choices.filter((c) => c === 56)).toHaveLength(1);
  });
});

describe('rateAnswer', () => {
  it('turns speed and accuracy into ratings', () => {
    expect(rateAnswer(false, 500, 'type')).toBe('again');
    expect(rateAnswer(true, 1500, 'type')).toBe('easy');
    expect(rateAnswer(true, 1500, 'choose')).toBe('good');
    expect(rateAnswer(true, 3000, 'type')).toBe('good');
    expect(rateAnswer(true, 6000, 'choose')).toBe('hard');
  });
});

describe('pickSprintFacts', () => {
  const now = new Date('2026-03-01T10:00:00Z');

  it('only uses the chosen tables and returns the requested count', () => {
    const facts = pickSprintFacts([7, 8], {}, 20, seededRandom(3));
    expect(facts).toHaveLength(20);
    expect(facts.every((f) => f.a === 7 || f.a === 8)).toBe(true);
  });

  it('repeats facts only when the round is longer than the pool', () => {
    const facts = pickSprintFacts([7], {}, 14, seededRandom(4));
    expect(new Set(facts.map((f) => f.b)).size).toBe(14);
    expect(pickSprintFacts([7], {}, 20, seededRandom(4))).toHaveLength(20);
  });

  it('prefers facts that were missed over facts already mastered', () => {
    let mastered = newCardProgress(factCardId(7, 3));
    for (let i = 0; i < 6; i++) mastered = applyRating(mastered, 'easy', new Date(now.getTime() + i * 40 * 86_400_000));
    const missed = applyRating(newCardProgress(factCardId(7, 8)), 'again', now);
    const progress = { [mastered.cardId]: mastered, [missed.cardId]: missed };

    let missedPicked = 0;
    let masteredPicked = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const ids = pickSprintFacts([7], progress, 5, seededRandom(seed)).map((f) => factCardId(f.a, f.b));
      if (ids.includes(missed.cardId)) missedPicked++;
      if (ids.includes(mastered.cardId)) masteredPicked++;
    }
    expect(missedPicked).toBe(40);
    expect(masteredPicked).toBe(0);
  });

  it('returns nothing when no tables are chosen', () => {
    expect(pickSprintFacts([], {}, 10)).toEqual([]);
  });
});
