import { create } from 'zustand';
import { applyRating, newCardProgress } from '@/domain/review/scheduler';
import type { CardProgress, Rating } from '@/domain/review/types';
import { LocalStorageProgressRepository } from '@/storage/localStorageRepository';
import { PROGRESS_SCHEMA_VERSION, type ProgressRepository } from '@/storage/progressRepository';

export interface ProgressState {
  status: 'idle' | 'loading' | 'ready';
  cards: Record<string, CardProgress>;
  bookmarks: Record<string, true>;
  hydrate(): Promise<void>;
  rate(cardId: string, rating: Rating, now?: Date): void;
  toggleBookmark(cardId: string): void;
  resetCards(cardIds: readonly string[]): void;
}

/**
 * Progress state + write-through persistence. The review math lives in the domain
 * layer; this store only applies it and saves the result.
 */
export function createProgressStore(repository: ProgressRepository) {
  return create<ProgressState>()((set, get) => {
    const persist = () => {
      const { cards, bookmarks } = get();
      void repository.save({
        version: PROGRESS_SCHEMA_VERSION,
        cards,
        bookmarks: Object.keys(bookmarks),
        updatedAt: new Date().toISOString(),
      });
    };

    return {
      status: 'idle',
      cards: {},
      bookmarks: {},

      async hydrate() {
        if (get().status !== 'idle') return;
        set({ status: 'loading' });
        const snapshot = await repository.load();
        set({
          status: 'ready',
          cards: snapshot.cards,
          bookmarks: Object.fromEntries(snapshot.bookmarks.map((id) => [id, true] as const)),
        });
      },

      rate(cardId, rating, now = new Date()) {
        const prev = get().cards[cardId] ?? newCardProgress(cardId);
        set((s) => ({ cards: { ...s.cards, [cardId]: applyRating(prev, rating, now) } }));
        persist();
      },

      toggleBookmark(cardId) {
        set((s) => {
          const bookmarks = { ...s.bookmarks };
          if (bookmarks[cardId]) delete bookmarks[cardId];
          else bookmarks[cardId] = true;
          return { bookmarks };
        });
        persist();
      },

      resetCards(cardIds) {
        set((s) => {
          const cards = { ...s.cards };
          for (const id of cardIds) delete cards[id];
          return { cards };
        });
        persist();
      },
    };
  });
}

export const useProgressStore = createProgressStore(new LocalStorageProgressRepository());
