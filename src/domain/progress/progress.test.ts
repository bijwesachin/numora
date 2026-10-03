import { CurriculumIndex } from '@/domain/curriculumIndex';
import { daysAfter, makeCard, makeProgress, T0 } from '@/test/fixtures';
import { deckStats, dueCards, isWeakConcept } from './stats';
import { practiceWhatINeed, scoreCard, weakFoundationConceptIds } from './weakAreas';

const cards = [makeCard({ id: 'a-001' }), makeCard({ id: 'a-002' }), makeCard({ id: 'a-003' }), makeCard({ id: 'a-004' })];

describe('deckStats', () => {
  it('reports zeros for an untouched deck', () => {
    expect(deckStats(cards, {}, T0)).toEqual({
      total: 4,
      completed: 0,
      completionPercent: 0,
      masteryPercent: 0,
      due: 0,
      mastered: 0,
      level: 'new',
    });
  });

  it('counts completion, due cards and averages mastery over the whole deck', () => {
    const progress = {
      'a-001': makeProgress('a-001', { intervalDays: 30, consecutiveCorrect: 4, timesCorrect: 4, lastRating: 'good', dueAt: daysAfter(T0, 30).toISOString() }),
      'a-002': makeProgress('a-002', { timesWrong: 1, lastRating: 'again', dueAt: T0.toISOString() }),
    };
    const stats = deckStats(cards, progress, daysAfter(T0, 1));
    expect(stats.completed).toBe(2);
    expect(stats.completionPercent).toBe(50);
    expect(stats.due).toBe(1);
    expect(stats.mastered).toBe(1);
    expect(stats.masteryPercent).toBe(25); // (100 + 0 + 0 + 0) / 4
  });
});

describe('dueCards', () => {
  it('returns only due cards, most overdue first', () => {
    const progress = {
      'a-001': makeProgress('a-001', { dueAt: daysAfter(T0, -1).toISOString() }),
      'a-002': makeProgress('a-002', { dueAt: daysAfter(T0, -5).toISOString() }),
      'a-003': makeProgress('a-003', { dueAt: daysAfter(T0, 3).toISOString() }),
    };
    expect(dueCards(cards, progress, T0).map((c) => c.id)).toEqual(['a-002', 'a-001']);
  });
});

describe('isWeakConcept', () => {
  it('is false for unstarted concepts', () => {
    expect(isWeakConcept(cards, {})).toBe(false);
  });

  it('is true when recent answers include misses', () => {
    const progress = { 'a-001': makeProgress('a-001', { lastRating: 'again', timesWrong: 1 }) };
    expect(isWeakConcept(cards, progress)).toBe(true);
  });

  it('is false when seen cards are going well', () => {
    const progress = {
      'a-001': makeProgress('a-001', { lastRating: 'good', intervalDays: 8, consecutiveCorrect: 2, timesCorrect: 2 }),
    };
    expect(isWeakConcept(cards, progress)).toBe(false);
  });
});

describe('Practice What I Need', () => {
  const index = new CurriculumIndex({
    categories: [{ id: 'cat', grade: 5, title: 'Cat', blurb: '', icon: '', color: 'indigo', unitIds: ['u'] }],
    units: [{ id: 'u', categoryId: 'cat', title: 'U', conceptIds: ['base', 'built'] }],
    concepts: [
      { id: 'base', unitId: 'u', title: 'Base', prerequisites: [] },
      { id: 'built', unitId: 'u', title: 'Built', prerequisites: ['base'] },
    ],
    cards: [
      makeCard({ id: 'base-001', conceptId: 'base' }),
      makeCard({ id: 'base-002', conceptId: 'base' }),
      makeCard({ id: 'built-001', conceptId: 'built' }),
      makeCard({ id: 'built-002', conceptId: 'built' }),
    ],
  });
  const now = daysAfter(T0, 1);
  const solid = (id: string) =>
    makeProgress(id, { lastRating: 'good', intervalDays: 20, consecutiveCorrect: 3, timesCorrect: 3, dueAt: daysAfter(T0, 20).toISOString() });

  it('is empty when nothing is struggling', () => {
    expect(practiceWhatINeed(index, { 'built-001': solid('built-001') }, now)).toEqual([]);
  });

  it('ranks missed above hard above merely low mastery', () => {
    const progress = {
      'built-001': makeProgress('built-001', { lastRating: 'hard', timesCorrect: 1, intervalDays: 1, consecutiveCorrect: 1 }),
      'built-002': makeProgress('built-002', { lastRating: 'again', timesWrong: 1 }),
    };
    const ids = practiceWhatINeed(index, progress, now).map((p) => p.card.id);
    expect(ids.indexOf('built-002')).toBeLessThan(ids.indexOf('built-001'));
  });

  it('surfaces prerequisite concepts of a weak concept as foundations', () => {
    const progress = { 'built-001': makeProgress('built-001', { lastRating: 'again', timesWrong: 2 }) };
    expect([...weakFoundationConceptIds(index, progress)]).toEqual(['base']);
    const result = practiceWhatINeed(index, progress, now);
    const base = result.find((r) => r.card.id === 'base-001');
    expect(base?.reasons).toContain('foundation');
  });

  it('does not surface unseen cards unless they are foundations', () => {
    const s = scoreCard(index.card('base-001')!, {}, now, new Set());
    expect(s.priority).toBe(0);
  });

  it('boosts overdue and stale cards', () => {
    const p = { 'built-001': makeProgress('built-001', { lastRating: 'good', intervalDays: 3, consecutiveCorrect: 1, timesCorrect: 1, dueAt: daysAfter(T0, 3).toISOString() }) };
    const fresh = scoreCard(index.card('built-001')!, p, daysAfter(T0, 3), new Set());
    const late = scoreCard(index.card('built-001')!, p, daysAfter(T0, 20), new Set());
    expect(late.priority).toBeGreaterThan(fresh.priority);
    expect(late.reasons).toEqual(expect.arrayContaining(['overdue', 'stale']));
  });
});
