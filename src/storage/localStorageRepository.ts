import { emptySnapshot, parseSnapshot, type ProgressRepository, type ProgressSnapshot } from './progressRepository';

export const DEFAULT_STORAGE_KEY = 'numora.progress';

/** Browser persistence. Storage failures (private mode, quota) degrade to an in-session experience. */
export class LocalStorageProgressRepository implements ProgressRepository {
  constructor(
    private readonly key: string = DEFAULT_STORAGE_KEY,
    private readonly storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | undefined = globalThis.localStorage,
  ) {}

  async load(): Promise<ProgressSnapshot> {
    try {
      const raw = this.storage?.getItem(this.key);
      return raw ? parseSnapshot(JSON.parse(raw)) : emptySnapshot();
    } catch {
      return emptySnapshot();
    }
  }

  async save(snapshot: ProgressSnapshot): Promise<void> {
    try {
      this.storage?.setItem(this.key, JSON.stringify(snapshot));
    } catch {
      // Quota or privacy mode: keep working from memory for this session.
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage?.removeItem(this.key);
    } catch {
      // ignore
    }
  }
}
