import { seededRandom } from './deck/ordering';
import type { Flashcard } from './flashcard';
import type { Rating } from './review/types';
import { ALL_FACTS, type Fact, factStrategy, isTimesTableFactId } from './timesTables';

/**
 * Three 10-question daily quizzes. Both are seeded by the local calendar date, so everyone gets
 * the same questions all day and a fresh set tomorrow.
 */

export const DAILY_QUIZ_LENGTH = 10;

/** `YYYY-MM-DD` in the student's own time zone. */
export function dayKey(now: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function daySeed(now: Date, salt: string): number {
  let h = 2166136261;
  for (const ch of `${dayKey(now)}:${salt}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export interface HintQuestion {
  card: Flashcard;
  prompt: string;
  /** Answer choices, one of which is {@link answer}. */
  choices: string[];
  answer: string;
}

/** Today's hint quiz: multiple-choice versions of cards that have a hint (times-table facts live in the Lab). */
export function dailyHintQuiz(cards: readonly Flashcard[], now: Date, count = DAILY_QUIZ_LENGTH): HintQuestion[] {
  const random = seededRandom(daySeed(now, 'hints'));
  const pool = cards.filter((c) => c.hint && c.quiz && !isTimesTableFactId(c.id));
  return shuffle(pool, random)
    .slice(0, count)
    .map((card) => {
      const { prompt = card.front, answer, wrong } = card.quiz!;
      return { card, prompt, answer, choices: shuffle([answer, ...wrong], random) };
    });
}

/** Saved to progress like a flashcard rating: needing the hint means the card isn't solid yet. */
export function rateHintAnswer(correct: boolean, usedHint: boolean): Rating {
  if (!correct) return 'again';
  return usedHint ? 'hard' : 'good';
}

export interface TrickQuestion {
  fact: Fact;
  /** Trick names, one of which is {@link answer}. */
  choices: string[];
  answer: string;
}

/**
 * Today's trick quiz: "Which trick works for a × b?". Facts are picked so each question uses a
 * different trick. Wrong choices come from facts sharing no factor with this one, so a
 * distractor's trick never also applies (every trick is triggered by one of its own factors).
 */
export function dailyTrickQuiz(now: Date, count = DAILY_QUIZ_LENGTH): TrickQuestion[] {
  const random = seededRandom(daySeed(now, 'tricks'));
  const facts = shuffle(ALL_FACTS, random);

  const picked: Fact[] = [];
  const used = new Set<string>();
  for (const f of facts) {
    const name = factStrategy(f.a, f.b).name;
    if (used.has(name)) continue;
    used.add(name);
    picked.push(f);
    if (picked.length === count) break;
  }

  return picked.map((f) => {
    const answer = factStrategy(f.a, f.b).name;
    const wrong = new Set<string>();
    for (const o of shuffle(ALL_FACTS, random)) {
      if ([o.a, o.b].some((n) => n === f.a || n === f.b)) continue;
      const name = factStrategy(o.a, o.b).name;
      if (name !== answer) wrong.add(name);
      if (wrong.size === 3) break;
    }
    return { fact: f, answer, choices: shuffle([answer, ...wrong], random) };
  });
}

