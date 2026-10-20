/**
 * Daily quiz results, kept per calendar day so a grown-up can review them. A new day starts
 * empty ("resets every morning"); older days are kept for {@link KEEP_DAYS} days.
 */

export type QuizKind = 'hints' | 'tricks';

export const QUIZ_KINDS: readonly QuizKind[] = ['hints', 'tricks'];

export interface QuizAnswer {
  /** Card id for the hint quiz, `"7x9"` for the trick quiz. */
  id: string;
  given: string;
  correct: boolean;
  usedHint?: boolean;
  at: string;
}

/** Day key (`YYYY-MM-DD`) → quiz → answers in the order given. */
export type QuizScores = Record<string, Partial<Record<QuizKind, QuizAnswer[]>>>;

export const KEEP_DAYS = 30;

export function trickQuestionId(a: number, b: number): string {
  return `${a}x${b}`;
}

/** Adds an answer to `day`. A question already answered that day keeps its first answer. */
export function recordQuizAnswer(scores: QuizScores, day: string, kind: QuizKind, answer: QuizAnswer): QuizScores {
  const answers = scores[day]?.[kind] ?? [];
  if (answers.some((a) => a.id === answer.id)) return scores;
  return pruneQuizScores({ ...scores, [day]: { ...scores[day], [kind]: [...answers, answer] } }, day);
}

/** Drops days more than {@link KEEP_DAYS} before `today`. Day keys sort as dates. */
export function pruneQuizScores(scores: QuizScores, today: string): QuizScores {
  const [y, m, d] = today.split('-').map(Number);
  const cutoff = new Date(y!, m! - 1, d! - KEEP_DAYS);
  const pad = (n: number) => String(n).padStart(2, '0');
  const oldest = `${cutoff.getFullYear()}-${pad(cutoff.getMonth() + 1)}-${pad(cutoff.getDate())}`;
  return Object.fromEntries(Object.entries(scores).filter(([day]) => day >= oldest));
}

export interface QuizScore {
  answered: number;
  correct: number;
  hintsUsed: number;
}

export function scoreOf(answers: readonly QuizAnswer[] | undefined): QuizScore {
  const list = answers ?? [];
  return { answered: list.length, correct: list.filter((a) => a.correct).length, hintsUsed: list.filter((a) => a.usedHint).length };
}

/** Days with any answers, newest first. */
export function scoredDays(scores: QuizScores): string[] {
  return Object.keys(scores)
    .filter((day) => QUIZ_KINDS.some((k) => scores[day]?.[k]?.length))
    .sort()
    .reverse();
}

export function parseQuizScores(raw: unknown): QuizScores {
  if (!raw || typeof raw !== 'object') return {};
  const out: QuizScores = {};
  for (const [day, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !value || typeof value !== 'object') continue;
    for (const kind of QUIZ_KINDS) {
      const list = (value as Record<string, unknown>)[kind];
      if (!Array.isArray(list)) continue;
      const answers = list.filter(isQuizAnswer);
      if (answers.length) out[day] = { ...out[day], [kind]: answers };
    }
  }
  return out;
}

function isQuizAnswer(v: unknown): v is QuizAnswer {
  if (!v || typeof v !== 'object') return false;
  const a = v as Record<string, unknown>;
  return (
    typeof a.id === 'string' &&
    typeof a.given === 'string' &&
    typeof a.correct === 'boolean' &&
    (a.usedHint === undefined || typeof a.usedHint === 'boolean') &&
    typeof a.at === 'string'
  );
}
