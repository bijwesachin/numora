import type { CurriculumIndex } from './curriculumIndex';
import type { Flashcard } from './flashcard';

/**
 * Client-side search over topics and cards. The index is built once from curriculum data,
 * with every field pre-normalized, so each keystroke is a quick scan (~2,000 documents).
 */

export interface SearchResult {
  kind: 'concept' | 'card';
  id: string;
  conceptId: string;
  title: string;
  subtitle: string;
  score: number;
  card?: Flashcard;
}

interface Field {
  text: string;
  weight: number;
}

interface SearchDoc {
  kind: 'concept' | 'card';
  id: string;
  conceptId: string;
  title: string;
  subtitle: string;
  normTitle: string;
  fields: Field[];
  card?: Flashcard;
}

export interface SearchIndex {
  docs: SearchDoc[];
}

const WEIGHTS = {
  conceptTitle: 10,
  unitOrCategory: 4,
  conceptText: 3,
  cardFront: 5,
  cardTags: 3,
  cardBack: 3,
  cardOther: 1,
} as const;

/** Lowercase, strip accents, unify math symbols: "7 x 8", "7*8" and "7 × 8" all become "7×8". */
export function normalize(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[−–—]/g, '-')
    .replace(/(\d)\s*[x×*]\s*(?=\d)/g, '$1×')
    .replace(/(\d)\s*÷\s*(?=\d)/g, '$1÷')
    .replace(/[“”"‘’'`?!,;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOPWORDS = new Set(['a', 'an', 'the', 'of', 'to', 'is', 'are', 'what', 'how', 'and', 'in', 'on', 'do', 'i', 'you', 'with', 'for']);

/** Everyday words a 5th grader might type, mapped to words the content uses. */
const SYNONYMS: Record<string, string[]> = {
  times: ['multipl', '×'],
  multiply: ['times', '×'],
  multiplication: ['times', '×'],
  divide: ['divi', '÷'],
  division: ['divi', '÷'],
  plus: ['add', 'sum'],
  add: ['plus', 'sum'],
  addition: ['add', 'sum'],
  minus: ['subtract', 'negative'],
  subtract: ['minus', 'difference'],
  subtraction: ['subtract', 'minus'],
  negative: ['minus', 'below zero'],
  gcf: ['greatest common factor'],
  lcm: ['least common multiple'],
  pemdas: ['order of operations'],
  table: ['tables'],
  tables: ['table'],
};

function tokenize(query: string): string[] {
  const words = normalize(query)
    .split(' ')
    .map((w) => w.replace(/^[.(]+|[.)]+$/g, ''))
    .filter(Boolean);
  const meaningful = words.filter((w) => !STOPWORDS.has(w));
  return meaningful.length > 0 ? meaningful : words;
}

function cardText(card: Flashcard): string {
  return [card.rule, card.explanation, card.example, card.memoryHook, card.commonMistake, card.hint, ...(card.steps ?? [])].filter(Boolean).join(' ');
}

export function buildSearchIndex(index: CurriculumIndex): SearchIndex {
  const docs: SearchDoc[] = [];
  for (const category of index.categories) {
    for (const unit of index.unitsOf(category.id)) {
      for (const concept of index.conceptsOfUnit(unit.id)) {
        const place = `${category.title} › ${unit.title}`;
        docs.push({
          kind: 'concept',
          id: concept.id,
          conceptId: concept.id,
          title: concept.title,
          subtitle: place,
          normTitle: normalize(concept.title),
          fields: [
            { text: normalize(concept.title), weight: WEIGHTS.conceptTitle },
            { text: normalize(`${unit.title} ${category.title}`), weight: WEIGHTS.unitOrCategory },
            { text: normalize(`${concept.summary ?? ''} ${concept.memoryHook ?? ''}`), weight: WEIGHTS.conceptText },
          ],
        });
        for (const card of index.cardsOfConcept(concept.id)) {
          docs.push({
            kind: 'card',
            id: card.id,
            conceptId: concept.id,
            title: card.front,
            subtitle: `${category.title} › ${concept.title}`,
            normTitle: normalize(card.front),
            card,
            fields: [
              { text: normalize(card.front), weight: WEIGHTS.cardFront },
              { text: normalize(card.tags.join(' ').replace(/-/g, ' ')), weight: WEIGHTS.cardTags },
              { text: normalize(card.back), weight: WEIGHTS.cardBack },
              { text: normalize(`${concept.title} ${cardText(card)}`), weight: WEIGHTS.cardOther },
            ],
          });
        }
      }
    }
  }
  return { docs };
}

function matchScore(field: string, alternatives: string[]): number {
  let best = 0;
  for (const alt of alternatives) {
    const at = field.indexOf(alt);
    if (at === -1) continue;
    const startsWord = at === 0 || /[\s(›>-]/.test(field[at - 1]!);
    best = Math.max(best, startsWord ? 1.5 : 1);
  }
  return best;
}

/**
 * Every word in the query must match somewhere in a document (synonyms count). Matches in
 * titles and at the start of words score higher; topics get a small boost over cards.
 */
export function search(idx: SearchIndex, query: string, limits = { concepts: 8, cards: 30 }): { concepts: SearchResult[]; cards: SearchResult[] } {
  const tokens = tokenize(query);
  if (tokens.length === 0) return { concepts: [], cards: [] };
  const phrase = normalize(query);
  const groups = tokens.map((t) => [t, ...(SYNONYMS[t] ?? [])]);

  const scored: SearchResult[] = [];
  for (const doc of idx.docs) {
    let score = 0;
    let matchedAll = true;
    for (const alternatives of groups) {
      let best = 0;
      for (const field of doc.fields) best = Math.max(best, field.weight * matchScore(field.text, alternatives));
      if (best === 0) {
        matchedAll = false;
        break;
      }
      score += best;
    }
    if (!matchedAll) continue;
    if (phrase.length >= 3) {
      if (doc.normTitle.includes(phrase)) score += 20;
      else if (doc.fields.some((f) => f.text.includes(phrase))) score += 5;
    }
    if (doc.kind === 'concept') score += 5;
    scored.push({ kind: doc.kind, id: doc.id, conceptId: doc.conceptId, title: doc.title, subtitle: doc.subtitle, score, card: doc.card });
  }

  scored.sort((a, b) => b.score - a.score || a.title.length - b.title.length || a.id.localeCompare(b.id));
  return {
    concepts: scored.filter((r) => r.kind === 'concept').slice(0, limits.concepts),
    cards: scored.filter((r) => r.kind === 'card').slice(0, limits.cards),
  };
}
