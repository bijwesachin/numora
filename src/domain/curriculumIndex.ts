import type { Category, Concept, Unit } from './curriculum';
import type { Flashcard } from './flashcard';

export interface CurriculumData {
  categories: Category[];
  units: Unit[];
  concepts: Concept[];
  cards: Flashcard[];
}

/**
 * Read-only lookups over curriculum content. Built once from plain data, so it works
 * the same whether content comes from TS modules, JSON files or a backend.
 */
export class CurriculumIndex {
  readonly categories: readonly Category[];
  readonly cards: readonly Flashcard[];
  private readonly categoryById = new Map<string, Category>();
  private readonly unitById = new Map<string, Unit>();
  private readonly conceptById = new Map<string, Concept>();
  private readonly cardById = new Map<string, Flashcard>();
  private readonly cardsByConcept = new Map<string, Flashcard[]>();
  /** concept id → concepts that list it as a prerequisite */
  private readonly dependents = new Map<string, string[]>();

  constructor(data: CurriculumData) {
    this.categories = data.categories;
    this.cards = data.cards;
    for (const c of data.categories) this.categoryById.set(c.id, c);
    for (const u of data.units) this.unitById.set(u.id, u);
    for (const c of data.concepts) {
      this.conceptById.set(c.id, c);
      for (const pre of c.prerequisites) {
        this.dependents.set(pre, [...(this.dependents.get(pre) ?? []), c.id]);
      }
    }
    for (const card of data.cards) {
      this.cardById.set(card.id, card);
      const list = this.cardsByConcept.get(card.conceptId) ?? [];
      list.push(card);
      this.cardsByConcept.set(card.conceptId, list);
    }
  }

  category(id: string): Category | undefined {
    return this.categoryById.get(id);
  }
  unit(id: string): Unit | undefined {
    return this.unitById.get(id);
  }
  concept(id: string): Concept | undefined {
    return this.conceptById.get(id);
  }
  card(id: string): Flashcard | undefined {
    return this.cardById.get(id);
  }

  unitsOf(categoryId: string): Unit[] {
    return (this.category(categoryId)?.unitIds ?? []).flatMap((id) => this.unit(id) ?? []);
  }
  conceptsOfUnit(unitId: string): Concept[] {
    return (this.unit(unitId)?.conceptIds ?? []).flatMap((id) => this.concept(id) ?? []);
  }
  conceptsOfCategory(categoryId: string): Concept[] {
    return this.unitsOf(categoryId).flatMap((u) => this.conceptsOfUnit(u.id));
  }

  cardsOfConcept(conceptId: string): Flashcard[] {
    return this.cardsByConcept.get(conceptId) ?? [];
  }
  cardsOfCategory(categoryId: string): Flashcard[] {
    return this.conceptsOfCategory(categoryId).flatMap((c) => this.cardsOfConcept(c.id));
  }

  /** Concepts that build directly on `conceptId`. */
  dependentsOf(conceptId: string): string[] {
    return this.dependents.get(conceptId) ?? [];
  }

  /** Breadcrumb data for a card. */
  locate(cardId: string): { card: Flashcard; concept: Concept; unit: Unit; category: Category } | undefined {
    const card = this.card(cardId);
    const concept = card && this.concept(card.conceptId);
    const unit = concept && this.unit(concept.unitId);
    const category = unit && this.category(unit.categoryId);
    if (!card || !concept || !unit || !category) return undefined;
    return { card, concept, unit, category };
  }
}
