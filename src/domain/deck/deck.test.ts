import { learningStage } from '@/domain/flashcard';
import { makeCard } from '@/test/fixtures';
import { prerequisiteSafeShuffle, progressionOrder, seededRandom } from './ordering';
import { createSession, currentCardId, isFinished, REQUEUE_GAP, sessionReducer, summarizeSession } from './session';

describe('progressionOrder', () => {
  it('follows concept → rule → visual → easy → normal → trap → real life → challenge', () => {
    const cards = [
      makeCard({ id: 'x-008', type: 'challenge', difficulty: 4 }),
      makeCard({ id: 'x-006', type: 'misconception', difficulty: 5 }),
      makeCard({ id: 'x-005', type: 'solve', difficulty: 3 }),
      makeCard({ id: 'x-004', type: 'solve', difficulty: 2 }),
      makeCard({ id: 'x-007', type: 'real-life', difficulty: 3 }),
      makeCard({ id: 'x-003', type: 'visual', difficulty: 1 }),
      makeCard({ id: 'x-002', type: 'rule', difficulty: 2 }),
      makeCard({ id: 'x-001', type: 'concept', difficulty: 1 }),
    ];
    const ordered = progressionOrder(cards);
    expect(ordered.map((c) => c.id)).toEqual(['x-001', 'x-002', 'x-003', 'x-004', 'x-005', 'x-006', 'x-007', 'x-008']);
    expect(ordered.map(learningStage)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

describe('prerequisiteSafeShuffle', () => {
  const cards = [
    makeCard({ id: 'x-001', type: 'concept' }),
    makeCard({ id: 'x-002', type: 'solve', prerequisites: ['x-001'] }),
    makeCard({ id: 'x-003', type: 'solve' }),
    makeCard({ id: 'x-004', type: 'challenge', prerequisites: ['x-002', 'x-003'] }),
    makeCard({ id: 'x-005', type: 'real-life', prerequisites: ['outside-deck-001'] }),
  ];

  it('never places a card before its in-deck prerequisites', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const order = prerequisiteSafeShuffle(cards, seededRandom(seed)).map((c) => c.id);
      expect(order.indexOf('x-001')).toBeLessThan(order.indexOf('x-002'));
      expect(order.indexOf('x-002')).toBeLessThan(order.indexOf('x-004'));
      expect(order.indexOf('x-003')).toBeLessThan(order.indexOf('x-004'));
      expect(order).toHaveLength(5);
    }
  });

  it('actually varies the order', () => {
    const orders = new Set(
      Array.from({ length: 20 }, (_, i) => prerequisiteSafeShuffle(cards, seededRandom(i + 1)).map((c) => c.id).join()),
    );
    expect(orders.size).toBeGreaterThan(1);
  });

  it('is deterministic for a seed', () => {
    const a = prerequisiteSafeShuffle(cards, seededRandom(7)).map((c) => c.id);
    const b = prerequisiteSafeShuffle(cards, seededRandom(7)).map((c) => c.id);
    expect(a).toEqual(b);
  });
});

describe('session', () => {
  const queue = ['a', 'b', 'c', 'd', 'e', 'f'];

  it('advances on rating and finishes at the end', () => {
    let s = createSession(['a', 'b']);
    s = sessionReducer(s, { type: 'rate', rating: 'good' });
    expect(currentCardId(s)).toBe('b');
    s = sessionReducer(s, { type: 'rate', rating: 'easy' });
    expect(isFinished(s)).toBe(true);
  });

  it('re-queues a missed card a few cards later', () => {
    const s = sessionReducer(createSession(queue), { type: 'rate', rating: 'again' });
    expect(s.queue.indexOf('a', 1)).toBe(1 + REQUEUE_GAP);
    expect(s.queue).toHaveLength(queue.length + 1);
  });

  it('re-queues near the end by appending', () => {
    let s = createSession(['a', 'b']);
    s = sessionReducer(s, { type: 'next' });
    s = sessionReducer(s, { type: 'rate', rating: 'again' });
    expect(s.queue).toEqual(['a', 'b', 'b']);
  });

  it('stops re-queuing a card after repeated misses', () => {
    let s = createSession(['a']);
    for (let i = 0; i < 5; i++) s = sessionReducer(s, { type: 'rate', rating: 'again' });
    expect(isFinished(s)).toBe(true);
    expect(s.queue.length).toBeLessThanOrEqual(3);
  });

  it('prev/next stay in bounds', () => {
    let s = createSession(['a']);
    s = sessionReducer(s, { type: 'prev' });
    expect(s.position).toBe(0);
    s = sessionReducer(sessionReducer(s, { type: 'next' }), { type: 'next' });
    expect(s.position).toBe(1);
  });

  it('summarizes first-try results', () => {
    let s = createSession(['a', 'b', 'c']);
    s = sessionReducer(s, { type: 'rate', rating: 'good' });
    s = sessionReducer(s, { type: 'rate', rating: 'again' });
    s = sessionReducer(s, { type: 'rate', rating: 'easy' });
    s = sessionReducer(s, { type: 'rate', rating: 'good' }); // b again
    expect(summarizeSession(s)).toEqual({ uniqueCards: 3, rated: 3, firstTryCorrect: 2, missed: ['b'] });
  });
});
