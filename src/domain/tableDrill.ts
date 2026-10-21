import { daySeed, shuffle } from './dailyQuiz';
import { seededRandom } from './deck/ordering';
import type { QuizAnswer, QuizScores } from './quizScores';
import { TABLES } from './timesTables';

/**
 * Daily "learn a table" quiz. One table is worked on over several days:
 *
 * 1. Vanishing table: the table is shown with some answers hidden, to fill in from memory.
 *    Each day the table is passed, more are hidden (3, then 5, 7 and finally all 10).
 * 2. Shuffled round: the same table asked out of order, so a fact comes back without
 *    chanting up to it.
 *
 * Passing the all-hidden level memorizes the table, and the next day moves to the next one.
 * Everything is worked out from the saved daily scores, so there's no extra state to keep.
 */

/** Answers hidden at each level. */
export const HIDE_COUNTS = [3, 5, 7, 10] as const;
export const MASTERED = HIDE_COUNTS.length;
export const MULTIPLIERS: readonly number[] = Array.from({ length: 10 }, (_, i) => i + 1);
/** Shuffled-round misses allowed while still passing the day. */
const MIXED_MISSES_ALLOWED = 1;

export type TablePart = 'fill' | 'mixed';

/** Saved answer id: `fill:7x3` or `mixed:7x3`. */
export function tableAnswerId(part: TablePart, table: number, b: number): string {
  return `${part}:${table}x${b}`;
}

export function parseTableAnswerId(id: string): { part: TablePart; table: number; b: number } | undefined {
  const m = /^(fill|mixed):(\d+)x(\d+)$/.exec(id);
  return m ? { part: m[1] as TablePart, table: Number(m[2]), b: Number(m[3]) } : undefined;
}

/** The table a day's answers were for. */
export function tableOf(answers: readonly QuizAnswer[] | undefined): number | undefined {
  return answers?.length ? parseTableAnswerId(answers[0]!.id)?.table : undefined;
}

export interface TableHistory {
  /** Level reached per table: index into {@link HIDE_COUNTS}, or {@link MASTERED}. */
  levels: Map<number, number>;
  /** Table of the latest day before today, if any. */
  last?: number;
}

/** Replays saved days before `today` in order, levelling a table up on each day it was passed. */
export function tableHistory(scores: QuizScores, today: string): TableHistory {
  const levels = new Map<number, number>();
  let last: number | undefined;
  for (const day of Object.keys(scores).sort()) {
    if (day >= today) continue;
    const answers = scores[day]?.tables;
    const table = tableOf(answers);
    if (table === undefined) continue;
    last = table;
    const level = Math.min(levels.get(table) ?? 0, MASTERED - 1);
    if (passed(answers!, table, level)) levels.set(table, level + 1);
  }
  return { levels, last };
}

/** Finished both parts, every hidden answer right and at most one shuffled miss. */
export function passed(answers: readonly QuizAnswer[], table: number, level: number): boolean {
  const mine = answers.flatMap((a) => {
    const id = parseTableAnswerId(a.id);
    return id?.table === table ? [{ ...id, correct: a.correct }] : [];
  });
  const fill = mine.filter((a) => a.part === 'fill');
  const mixed = mine.filter((a) => a.part === 'mixed');
  return (
    fill.length === HIDE_COUNTS[level] &&
    fill.every((a) => a.correct) &&
    mixed.length === MULTIPLIERS.length &&
    mixed.filter((a) => !a.correct).length <= MIXED_MISSES_ALLOWED
  );
}

export interface TablePlan {
  table: number;
  /** Index into {@link HIDE_COUNTS}. A memorized table picked again is practiced all hidden. */
  level: number;
  /** Multipliers whose answers are hidden, in table order. */
  hidden: number[];
  /** Multipliers in the order the shuffled round asks them. */
  mixed: number[];
  /** Tables memorized so far (within the saved days). */
  mastered: number[];
}

/**
 * Today's table: the one picked, else the one already started today, else the one worked on
 * last time (or the next one once it's memorized), starting with 2.
 */
export function todaysTablePlan(scores: QuizScores, today: string, pick?: number): TablePlan {
  const { levels, last } = tableHistory(scores, today);
  const mastered = TABLES.filter((t) => (levels.get(t) ?? 0) >= MASTERED);
  let table = pick ?? tableOf(scores[today]?.tables) ?? last ?? TABLES[0]!;
  if (pick === undefined && !scores[today]?.tables?.length && (levels.get(table) ?? 0) >= MASTERED) {
    table = TABLES.find((t) => t > table && !mastered.includes(t)) ?? table;
  }
  const level = Math.min(levels.get(table) ?? 0, MASTERED - 1);
  const random = seededRandom(daySeed(new Date(`${today}T12:00:00`), `table-${table}`));
  return {
    table,
    level,
    hidden: shuffle(MULTIPLIERS, random)
      .slice(0, HIDE_COUNTS[level])
      .sort((x, y) => x - y),
    mixed: shuffle(MULTIPLIERS, random),
    mastered,
  };
}

/** Answer ids in the order they're asked: the hidden answers top to bottom, then the shuffled round. */
export function planAnswerIds({ table, hidden, mixed }: TablePlan): string[] {
  return [...hidden.map((b) => tableAnswerId('fill', table, b)), ...mixed.map((b) => tableAnswerId('mixed', table, b))];
}
