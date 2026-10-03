export type Rating = 'again' | 'hard' | 'good' | 'easy';

export const RATINGS: readonly Rating[] = ['again', 'hard', 'good', 'easy'];

/** Everything we remember about one student × one card. Plain JSON so it can live in any store. */
export interface CardProgress {
  cardId: string;
  /** ISO timestamp of the most recent rating, or null if never reviewed. */
  lastReviewedAt: string | null;
  /** ISO timestamp when the card should next be reviewed. */
  dueAt: string | null;
  /** Current spacing in days (0 = relearning, review again soon). */
  intervalDays: number;
  /** Growth multiplier for "Good" answers; drops when the card is hard for the student. */
  ease: number;
  timesCorrect: number;
  timesWrong: number;
  consecutiveCorrect: number;
  lastRating: Rating | null;
}

export type MasteryLevel = 'new' | 'learning' | 'familiar' | 'strong' | 'mastered';
