import type { CardProgress } from '@/domain/review/types';

export const PROGRESS_SCHEMA_VERSION = 1;

/** Everything persisted for one student. Plain JSON, versioned for migrations. */
export interface ProgressSnapshot {
  version: typeof PROGRESS_SCHEMA_VERSION;
  cards: Record<string, CardProgress>;
  bookmarks: string[];
  updatedAt: string | null;
}

/**
 * Persistence boundary. The app only talks to this interface, so moving from
 * localStorage to Supabase / Firebase / a REST API means writing one new class.
 * Async on purpose: remote stores are.
 */
export interface ProgressRepository {
  load(): Promise<ProgressSnapshot>;
  save(snapshot: ProgressSnapshot): Promise<void>;
  clear(): Promise<void>;
}

export function emptySnapshot(): ProgressSnapshot {
  return { version: PROGRESS_SCHEMA_VERSION, cards: {}, bookmarks: [], updatedAt: null };
}

/**
 * Accept unknown JSON and return a valid snapshot. Corrupt data must never crash the
 * app — a child should still be able to study even if storage got mangled.
 */
export function parseSnapshot(raw: unknown): ProgressSnapshot {
  if (!raw || typeof raw !== 'object') return emptySnapshot();
  const data = raw as Partial<ProgressSnapshot>;
  if (data.version !== PROGRESS_SCHEMA_VERSION) return migrate(data);

  const cards: Record<string, CardProgress> = {};
  for (const [id, value] of Object.entries(data.cards ?? {})) {
    if (isCardProgress(value) && value.cardId === id) cards[id] = value;
  }
  const bookmarks = Array.isArray(data.bookmarks) ? data.bookmarks.filter((b): b is string => typeof b === 'string') : [];
  return {
    version: PROGRESS_SCHEMA_VERSION,
    cards,
    bookmarks,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : null,
  };
}

/** Upgrade older snapshot versions here as the schema evolves. */
function migrate(_data: Partial<ProgressSnapshot>): ProgressSnapshot {
  return emptySnapshot();
}

function isCardProgress(v: unknown): v is CardProgress {
  if (!v || typeof v !== 'object') return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.cardId === 'string' &&
    (p.lastReviewedAt === null || typeof p.lastReviewedAt === 'string') &&
    (p.dueAt === null || typeof p.dueAt === 'string') &&
    typeof p.intervalDays === 'number' &&
    typeof p.ease === 'number' &&
    typeof p.timesCorrect === 'number' &&
    typeof p.timesWrong === 'number' &&
    typeof p.consecutiveCorrect === 'number'
  );
}

export class InMemoryProgressRepository implements ProgressRepository {
  private snapshot: ProgressSnapshot;
  constructor(initial: ProgressSnapshot = emptySnapshot()) {
    this.snapshot = structuredClone(initial);
  }
  async load() {
    return structuredClone(this.snapshot);
  }
  async save(snapshot: ProgressSnapshot) {
    this.snapshot = structuredClone(snapshot);
  }
  async clear() {
    this.snapshot = emptySnapshot();
  }
}
