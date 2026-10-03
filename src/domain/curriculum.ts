/**
 * Curriculum hierarchy:
 *
 *   Grade → Category (dashboard group) → Unit (curriculum section) → Concept (micro-concept) → Flashcards
 *
 * e.g. 5 → "Fractions" → "Fraction Basics" → "Equivalent Fractions" → 20 cards
 *
 * Categories, units and concepts are pure metadata. Cards live in separate content
 * modules and point at a concept by id, so content can grow without touching UI code.
 */

export type Grade = 5;

export interface Category {
  id: string;
  grade: Grade;
  title: string;
  /** Short line shown under the title on the dashboard. */
  blurb: string;
  /** Emoji used as a simple, dependency-free icon. */
  icon: string;
  /** Key into the UI color palette; keeps presentation out of content. */
  color: CategoryColor;
  unitIds: string[];
}

export type CategoryColor =
  | 'indigo'
  | 'sky'
  | 'amber'
  | 'emerald'
  | 'violet'
  | 'rose'
  | 'teal'
  | 'orange'
  | 'cyan'
  | 'lime';

export interface Unit {
  id: string;
  categoryId: string;
  title: string;
  conceptIds: string[];
}

export interface Concept {
  id: string;
  unitId: string;
  title: string;
  /** One-sentence summary of the big idea. */
  summary?: string;
  /** Memorable analogy for the whole concept. */
  memoryHook?: string;
  /** Concept ids the student should understand first. */
  prerequisites: string[];
}
