import { T0 } from '@/test/fixtures';
import { LocalStorageProgressRepository } from '@/storage/localStorageRepository';
import { emptySnapshot, InMemoryProgressRepository, parseSnapshot } from '@/storage/progressRepository';
import { createProgressStore } from './progressStore';

describe('progress store', () => {
  it('hydrates, rates, bookmarks and persists through the repository', async () => {
    const repo = new InMemoryProgressRepository();
    const store = createProgressStore(repo);
    await store.getState().hydrate();
    expect(store.getState().status).toBe('ready');

    store.getState().rate('fractions-equivalent-001', 'good', T0);
    store.getState().toggleBookmark('fractions-equivalent-001');
    await Promise.resolve();

    const saved = await repo.load();
    expect(saved.cards['fractions-equivalent-001']?.intervalDays).toBe(3);
    expect(saved.bookmarks).toEqual(['fractions-equivalent-001']);

    // A fresh store (e.g. next app launch) sees the same progress.
    const reopened = createProgressStore(repo);
    await reopened.getState().hydrate();
    expect(reopened.getState().cards['fractions-equivalent-001']?.timesCorrect).toBe(1);
    expect(reopened.getState().bookmarks['fractions-equivalent-001']).toBe(true);
  });

  it('toggling a bookmark twice removes it', async () => {
    const store = createProgressStore(new InMemoryProgressRepository());
    await store.getState().hydrate();
    store.getState().toggleBookmark('x');
    store.getState().toggleBookmark('x');
    expect(store.getState().bookmarks).toEqual({});
  });

  it('resets progress for a set of cards only', async () => {
    const store = createProgressStore(new InMemoryProgressRepository());
    await store.getState().hydrate();
    store.getState().rate('a', 'good', T0);
    store.getState().rate('b', 'good', T0);
    store.getState().resetCards(['a']);
    expect(Object.keys(store.getState().cards)).toEqual(['b']);
  });
});

describe('persistence', () => {
  const memoryStorage = () => {
    const data = new Map<string, string>();
    return {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
      removeItem: (k: string) => void data.delete(k),
    };
  };

  it('round-trips through localStorage', async () => {
    const repo = new LocalStorageProgressRepository('test', memoryStorage());
    const store = createProgressStore(repo);
    await store.getState().hydrate();
    store.getState().rate('a', 'easy', T0);
    expect((await repo.load()).cards.a?.intervalDays).toBe(7);
  });

  it('survives corrupt storage', async () => {
    const storage = memoryStorage();
    storage.setItem('test', '{not json');
    expect(await new LocalStorageProgressRepository('test', storage).load()).toEqual(emptySnapshot());
  });

  it('drops malformed card records but keeps valid ones', () => {
    const snapshot = parseSnapshot({
      version: 1,
      cards: {
        good: { cardId: 'good', lastReviewedAt: null, dueAt: null, intervalDays: 0, ease: 2.5, timesCorrect: 0, timesWrong: 0, consecutiveCorrect: 0, lastRating: null },
        bad: { cardId: 'bad', intervalDays: 'soon' },
        mismatched: { cardId: 'other', lastReviewedAt: null, dueAt: null, intervalDays: 0, ease: 2.5, timesCorrect: 0, timesWrong: 0, consecutiveCorrect: 0, lastRating: null },
      },
      bookmarks: ['good', 3],
    });
    expect(Object.keys(snapshot.cards)).toEqual(['good']);
    expect(snapshot.bookmarks).toEqual(['good']);
  });

  it('ignores unknown schema versions', () => {
    expect(parseSnapshot({ version: 99, cards: {} })).toEqual(emptySnapshot());
  });
});
