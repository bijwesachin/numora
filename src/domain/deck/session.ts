import type { Rating } from '../review/types';

/**
 * A study session over an ordered list of card ids. Pure reducer so it can be unit
 * tested and driven by any UI. Cards answered "Again" come back a few cards later so
 * the student retrieves them again before the session ends.
 */
export interface SessionState {
  queue: string[];
  position: number;
  /** Every rating given this session, per card, in order. */
  ratings: Record<string, Rating[]>;
}

export type SessionAction =
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'rate'; rating: Rating }
  | { type: 'restart'; queue: string[] };

export const REQUEUE_GAP = 3;
/** Stop re-queuing a card after this many misses in one session; the scheduler will bring it back. */
export const MAX_REQUEUES_PER_CARD = 2;

export function createSession(queue: string[]): SessionState {
  return { queue, position: 0, ratings: {} };
}

export function currentCardId(state: SessionState): string | undefined {
  return state.queue[state.position];
}

export function isFinished(state: SessionState): boolean {
  return state.position >= state.queue.length;
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'next':
      return { ...state, position: Math.min(state.position + 1, state.queue.length) };
    case 'prev':
      return { ...state, position: Math.max(state.position - 1, 0) };
    case 'restart':
      return createSession(action.queue);
    case 'rate': {
      const id = currentCardId(state);
      if (!id) return state;
      const history = [...(state.ratings[id] ?? []), action.rating];
      let queue = state.queue;
      const misses = history.filter((r) => r === 'again').length;
      const alreadyComingBack = state.queue.indexOf(id, state.position + 1) !== -1;
      if (action.rating === 'again' && misses <= MAX_REQUEUES_PER_CARD && !alreadyComingBack) {
        const insertAt = Math.min(state.position + 1 + REQUEUE_GAP, state.queue.length);
        queue = [...state.queue.slice(0, insertAt), id, ...state.queue.slice(insertAt)];
      }
      return { queue, position: state.position + 1, ratings: { ...state.ratings, [id]: history } };
    }
  }
}

export interface SessionSummary {
  uniqueCards: number;
  rated: number;
  /** First-try answers that weren't "Again". */
  firstTryCorrect: number;
  missed: string[];
}

export function summarizeSession(state: SessionState): SessionSummary {
  const entries = Object.entries(state.ratings);
  return {
    uniqueCards: new Set(state.queue).size,
    rated: entries.length,
    firstTryCorrect: entries.filter(([, r]) => r[0] !== 'again').length,
    missed: entries.filter(([, r]) => r.includes('again')).map(([id]) => id),
  };
}
