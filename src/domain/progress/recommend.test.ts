import { CurriculumIndex } from '@/domain/curriculumIndex';
import { makeCard, makeProgress, T0 } from '@/test/fixtures';
import { recommendNextConcept, unmetPrerequisites } from './recommend';

const index = new CurriculumIndex({
  categories: [{ id: 'cat', grade: 5, title: 'Cat', blurb: '', icon: '', color: 'indigo', unitIds: ['u'] }],
  units: [{ id: 'u', categoryId: 'cat', title: 'U', conceptIds: ['empty', 'built', 'base'] }],
  concepts: [
    { id: 'empty', unitId: 'u', title: 'No cards yet', prerequisites: [] },
    { id: 'built', unitId: 'u', title: 'Built', prerequisites: ['base', 'empty'] },
    { id: 'base', unitId: 'u', title: 'Base', prerequisites: [] },
  ],
  cards: [makeCard({ id: 'base-001', conceptId: 'base' }), makeCard({ id: 'built-001', conceptId: 'built' })],
});

const mastered = (id: string) => makeProgress(id, { lastRating: 'good', intervalDays: 30, consecutiveCorrect: 4, timesCorrect: 4 });

describe('recommendations', () => {
  it('ignores prerequisites without content and flags unlearned ones', () => {
    const built = index.concept('built')!;
    expect(unmetPrerequisites(index, built, {}, T0).map((c) => c.id)).toEqual(['base']);
    expect(unmetPrerequisites(index, built, { 'base-001': mastered('base-001') }, T0)).toEqual([]);
  });

  it('recommends a prerequisite before the concept that builds on it', () => {
    expect(recommendNextConcept(index, {}, T0)?.id).toBe('base');
  });

  it('moves on once the prerequisite is learned', () => {
    expect(recommendNextConcept(index, { 'base-001': mastered('base-001') }, T0)?.id).toBe('built');
  });

  it('returns nothing when every card has been studied', () => {
    expect(recommendNextConcept(index, { 'base-001': mastered('base-001'), 'built-001': mastered('built-001') }, T0)).toBeUndefined();
  });
});
