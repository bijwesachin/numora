import { parseQuizScores, pruneQuizScores, recordQuizAnswer, scoredDays, scoreOf, type QuizAnswer } from './quizScores';

const answer = (id: string, correct: boolean, usedHint = false): QuizAnswer => ({ id, given: 'x', correct, usedHint, at: '2026-10-20T08:00:00.000Z' });

describe('quiz scores', () => {
  it('keeps each day separate, so every morning starts a fresh score', () => {
    let scores = recordQuizAnswer({}, '2026-10-19', 'hints', answer('a', true));
    scores = recordQuizAnswer(scores, '2026-10-20', 'hints', answer('b', false, true));
    scores = recordQuizAnswer(scores, '2026-10-20', 'tricks', answer('7x9', true));
    expect(scoreOf(scores['2026-10-19']?.hints)).toEqual({ answered: 1, correct: 1, hintsUsed: 0 });
    expect(scoreOf(scores['2026-10-20']?.hints)).toEqual({ answered: 1, correct: 0, hintsUsed: 1 });
    expect(scoredDays(scores)).toEqual(['2026-10-20', '2026-10-19']);
  });

  it('keeps the first answer to a question, so re-answering can’t raise the score', () => {
    const once = recordQuizAnswer({}, '2026-10-20', 'hints', answer('a', false));
    expect(recordQuizAnswer(once, '2026-10-20', 'hints', answer('a', true))).toBe(once);
  });

  it('forgets days older than 30 days', () => {
    const scores = { '2026-09-19': { hints: [answer('a', true)] }, '2026-09-20': { hints: [answer('b', true)] } };
    expect(Object.keys(pruneQuizScores(scores, '2026-10-20'))).toEqual(['2026-09-20']);
  });

  it('drops malformed saved data instead of crashing', () => {
    const parsed = parseQuizScores({
      '2026-10-20': { hints: [answer('a', true), { id: 1 }], tricks: 'nope' },
      'not-a-day': { hints: [answer('b', true)] },
    });
    expect(parsed).toEqual({ '2026-10-20': { hints: [answer('a', true)] } });
    expect(parseQuizScores(null)).toEqual({});
  });
});
