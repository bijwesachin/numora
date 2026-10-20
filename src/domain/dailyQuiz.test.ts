import { curriculum } from '@/content';
import { DAILY_QUIZ_LENGTH, dailyHintQuiz, dailyTrickQuiz, dayKey, rateHintAnswer } from './dailyQuiz';
import { factStrategy } from './timesTables';

const monday = new Date(2026, 9, 19, 8);
const mondayNight = new Date(2026, 9, 19, 23, 59);
const tuesday = new Date(2026, 9, 20, 8);

describe('dayKey', () => {
  it('uses the local calendar date', () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });
});

describe('dailyHintQuiz', () => {
  it('asks 10 hint cards, the same all day and different tomorrow', () => {
    const ids = (d: Date) => dailyHintQuiz(curriculum.cards, d).map((q) => q.card.id);
    const today = dailyHintQuiz(curriculum.cards, monday);
    expect(today).toHaveLength(DAILY_QUIZ_LENGTH);
    expect(today.every((q) => q.card.hint)).toBe(true);
    expect(new Set(ids(monday)).size).toBe(DAILY_QUIZ_LENGTH);
    expect(ids(mondayNight)).toEqual(ids(monday));
    expect(ids(tuesday)).not.toEqual(ids(monday));
  });

  it('includes the right answer once among the choices, using the rephrased prompt when there is one', () => {
    for (let day = 1; day <= 30; day++) {
      for (const q of dailyHintQuiz(curriculum.cards, new Date(2026, 5, day))) {
        expect(q.choices.filter((c) => c === q.answer)).toHaveLength(1);
        expect(q.choices).toHaveLength(q.card.quiz!.wrong.length + 1);
        expect(q.prompt).toBe(q.card.quiz!.prompt ?? q.card.front);
      }
    }
  });

  it('rates a correct answer lower when the hint was needed', () => {
    expect(rateHintAnswer(true, false)).toBe('good');
    expect(rateHintAnswer(true, true)).toBe('hard');
    expect(rateHintAnswer(false, false)).toBe('again');
  });
});

describe('dailyTrickQuiz', () => {
  it('asks 10 facts, each with a different trick, the same all day', () => {
    const quiz = dailyTrickQuiz(monday);
    expect(quiz).toHaveLength(DAILY_QUIZ_LENGTH);
    expect(new Set(quiz.map((q) => q.answer)).size).toBe(DAILY_QUIZ_LENGTH);
    expect(dailyTrickQuiz(mondayNight)).toEqual(quiz);
    expect(dailyTrickQuiz(tuesday)).not.toEqual(quiz);
  });

  it('offers four different choices, exactly one being the fact’s own trick', () => {
    for (let day = 1; day <= 30; day++) {
      for (const q of dailyTrickQuiz(new Date(2026, 5, day))) {
        expect(q.answer).toBe(factStrategy(q.fact.a, q.fact.b).name);
        expect(new Set(q.choices).size).toBe(4);
        expect(q.choices.filter((c) => c === q.answer)).toHaveLength(1);
      }
    }
  });
});
