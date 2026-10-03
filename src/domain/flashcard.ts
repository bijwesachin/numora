import type { Grade } from './curriculum';
import type { VisualSpec } from './visual';

/** The seven ways a concept is presented. */
export type CardType =
  | 'concept' // What does it mean?
  | 'rule' // How do you do it?
  | 'visual' // What does this picture show?
  | 'solve' // Work it out
  | 'misconception' // Spot the trap
  | 'real-life' // Use it in the world
  | 'challenge'; // Multi-step / reasoning

/**
 * 1 Recognition · 2 Basic application · 3 Standard grade-level
 * 4 Multi-step reasoning · 5 Challenge / misconception
 */
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface CardImage {
  src: string;
  alt: string;
}

export interface Flashcard {
  /** Deterministic, human-readable and stable forever: `<concept-id>-<nnn>`. Progress is keyed on it. */
  id: string;
  grade: Grade;
  conceptId: string;
  type: CardType;
  difficulty: Difficulty;

  front: string;
  back: string;

  /** The general rule this card exercises. */
  rule?: string;
  /** Short "why it works" explanation. */
  explanation?: string;
  /** A worked example, e.g. "1/2 = 2/4". */
  example?: string;
  memoryHook?: string;
  commonMistake?: string;
  hint?: string;
  /** Step-by-step solution shown behind "Show Steps". */
  steps?: string[];

  /** SVG visual rendered on the front of the card. */
  visual?: VisualSpec;
  /** SVG visual rendered with the answer. */
  answerVisual?: VisualSpec;
  /** Optional raster/SVG file for content that can't be generated. */
  image?: CardImage;

  tags: string[];
  /** Card ids that should be learned before this card. */
  prerequisites: string[];
}

/** The 8-step learning progression each concept follows. */
export const LEARNING_STAGES = [
  'Understand the concept',
  'Learn the rule',
  'See a visual',
  'Solve an easy example',
  'Solve a normal problem',
  'Detect a common mistake',
  'Solve a real-world problem',
  'Solve a challenge problem',
] as const;

/** 1-based stage in {@link LEARNING_STAGES}; derived so content authors can't get it out of sync. */
export function learningStage(card: Pick<Flashcard, 'type' | 'difficulty'>): number {
  switch (card.type) {
    case 'concept':
      return 1;
    case 'rule':
      return 2;
    case 'visual':
      return 3;
    case 'solve':
      return card.difficulty <= 2 ? 4 : 5;
    case 'misconception':
      return 6;
    case 'real-life':
      return 7;
    case 'challenge':
      return 8;
  }
}

export const CARD_TYPE_LABEL: Record<CardType, string> = {
  concept: 'Concept',
  rule: 'Rule',
  visual: 'Picture It',
  solve: 'Solve',
  misconception: 'Spot the Trap',
  'real-life': 'Real Life',
  challenge: 'Challenge',
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  1: 'Recognition',
  2: 'Basic',
  3: 'Standard',
  4: 'Multi-step',
  5: 'Challenge',
};
