import { curriculum } from '@/content';
import { buildSearchIndex, normalize, search } from './search';

const idx = buildSearchIndex(curriculum);
const conceptIds = (q: string) => search(idx, q).concepts.map((r) => r.id);
const cardIds = (q: string) => search(idx, q).cards.map((r) => r.id);

describe('normalize', () => {
  it('unifies multiplication symbols, minus signs, case and punctuation', () => {
    expect(normalize('7 x 8')).toBe('7×8');
    expect(normalize('7*8')).toBe('7×8');
    expect(normalize('7 × 8 = ?')).toBe('7×8 =');
    expect(normalize('−3 + (−5)')).toBe('-3 + (-5)');
    expect(normalize('What is a GCF?')).toBe('what is a gcf');
    expect(normalize('Café')).toBe('cafe');
  });

  it('does not glue words that merely contain an x', () => {
    expect(normalize('box 3')).toBe('box 3');
  });
});

describe('search', () => {
  it('indexes every concept and every card', () => {
    const concepts = curriculum.categories.flatMap((c) => curriculum.conceptsOfCategory(c.id));
    expect(idx.docs.filter((d) => d.kind === 'concept')).toHaveLength(concepts.length);
    expect(idx.docs.filter((d) => d.kind === 'card')).toHaveLength(curriculum.cards.length);
  });

  it('finds topics by title', () => {
    expect(conceptIds('equivalent fractions')[0]).toBe('fractions-equivalent');
    expect(conceptIds('absolute value')[0]).toBe('int-absolute-value');
    expect(conceptIds('prime factorization')[0]).toBe('fm-prime-factorization');
  });

  it('finds a times-table fact however it is typed', () => {
    for (const q of ['7 x 8', '7x8', '7 * 8', '7 × 8']) expect(cardIds(q), q).toContain('tt-7-008');
  });

  it('matches negative numbers typed with a hyphen', () => {
    expect(cardIds('-3 + (-5)')).toContain('int-add-same-004');
  });

  it('requires every word to match', () => {
    const results = search(idx, 'fraction remainder');
    for (const r of [...results.concepts, ...results.cards]) {
      expect(JSON.stringify(r.card ?? r).toLowerCase()).toMatch(/remainder/);
    }
  });

  it('understands everyday words', () => {
    expect(conceptIds('gcf')).toContain('fm-gcf');
    expect(conceptIds('pemdas')).toContain('expr-order-of-operations');
    expect(conceptIds('times tables').some((id) => id.startsWith('tt-'))).toBe(true);
  });

  it('ignores filler words but still searches if that is all there is', () => {
    expect(conceptIds('what is the area of a triangle')).toContain('ap-area-triangle');
    expect(search(idx, '   ').concepts).toEqual([]);
  });

  it('returns nothing for gibberish', () => {
    expect(search(idx, 'zzqxwv')).toEqual({ concepts: [], cards: [] });
  });

  it('respects result limits', () => {
    const r = search(idx, 'fraction', { concepts: 3, cards: 5 });
    expect(r.concepts.length).toBeLessThanOrEqual(3);
    expect(r.cards.length).toBeLessThanOrEqual(5);
  });
});
