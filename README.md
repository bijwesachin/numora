# Numora — 5th Grade Math Flashcards

Flashcards designed for **understanding → remembering → retrieving → applying**. Each concept is taught
through a fixed learning path (concept → rule → visual → easy → normal → trap → real life → challenge),
with SVG diagrams, memory hooks, worked steps and spaced repetition.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit + component tests
npm run build      # type-check + production build
```

Stack: React 19 · TypeScript (strict) · Vite · React Router · Tailwind CSS 4 · Zustand · Vitest.

## Keeping the app out of search results

Numora is meant to be private, so it tells search engines and other crawlers to stay away:

| File | What it does |
| --- | --- |
| `public/robots.txt` | Asks every crawler not to visit any page |
| `index.html` | `noindex, nofollow, noarchive` meta tags |
| `public/_headers` | Adds an `X-Robots-Tag: noindex` header on Netlify and Cloudflare Pages |
| `vercel.json` | The same header on Vercel, plus a fallback to `index.html` so deep links work |

On other hosts, add the header yourself: nginx `add_header X-Robots-Tag "noindex, nofollow, noarchive" always;`
or Apache `Header set X-Robots-Tag "noindex, nofollow, noarchive"`.

These are requests that well-behaved crawlers honor. They do **not** stop anyone who has the link from opening the app.
For real privacy, put the site behind a login (Cloudflare Access, Vercel password protection, Netlify password, or an
identity-aware proxy). Student progress lives in each browser's localStorage and is never sent anywhere.

## Architecture

```
src/
  domain/                 Pure TypeScript, no React. All learning logic lives here.
    curriculum.ts         Category → Unit → Concept types
    flashcard.ts          Flashcard model, card types, difficulty, learning stages
    visual.ts             Declarative diagram specs (VisualSpec union)
    curriculumIndex.ts    Read-only lookups over content
    validateCurriculum.ts Structural content checks (ids, references, cycles, visuals)
    review/               Spaced-repetition scheduler + derived mastery
    progress/             Deck stats, weak concepts, "Practice What I Need", recommendations
    deck/                 Progression ordering, prerequisite-safe shuffle, session reducer
  content/                Curriculum data only — no UI
    grade5/curriculum.ts  All 21 units / ~145 micro-concepts with prerequisites & hooks
    grade5/cards/…        Card modules per concept
    defineCards.ts        Authoring helper (deterministic ids, in-concept prerequisites)
  storage/                ProgressRepository interface + localStorage / in-memory implementations
  state/                  Zustand progress store (applies domain logic, persists via repository)
  visuals/                SVG renderers: pizza, fraction strips, number line, grid
  components/             Flashcard, FlashcardDeck, ReviewControls, TopicCard, ProgressBar, …
  pages/ + app/           Routes and layout
```

Dependencies point one way: `pages → components → state → domain ← content`. The domain never imports React,
storage, or content.

### Routes

| Path | Screen |
| --- | --- |
| `/` | Dashboard: Daily Review, Practice What I Need, Up Next, 10 topic tiles |
| `/topics/:categoryId` | Units and concepts with completion, mastery, due, weak flags |
| `/concepts/:conceptId` | Concept overview: memory hook, prerequisites, learning path, reset |
| `/concepts/:conceptId/study` | Flashcard deck in learning-path order |
| `/review`, `/practice`, `/saved` | Due cards, prioritized weak cards, bookmarks |

### Review & mastery

- **Scheduler** (`domain/review/scheduler.ts`): Again → 10 min, Hard → 1 day, Good → 3 days, Easy → 7 days;
  later intervals grow by ×1.2 (Hard), ×ease (Good), ×ease×1.3 (Easy). Ease drops on Again/Hard.
  Correct answers within 12 h of the last review (cramming) are recorded but don't stretch the interval or streak.
- **Mastery** (`domain/review/mastery.ts`) is *derived* from history (interval strength 45%, streak 35%,
  accuracy 20%), so changing the formula re-scores existing data. "Mastered" also needs 3 spaced correct
  answers in a row, so one correct answer never counts as mastery.
- **Practice What I Need** (`domain/progress/weakAreas.ts`) is an additive priority score: missed, hard, low mastery,
  wrong ratio, overdue, stale, plus a boost for prerequisites of concepts the student is weak in.
- In a session, cards answered **Again** come back 3 cards later, at most twice per session.

### Persistence

The store only talks to `ProgressRepository` (`load / save / clear`, async). Snapshots are versioned
JSON and validated on load; bad records are dropped instead of crashing the app. To move to Supabase,
Firebase or a REST backend, implement the interface and pass it to `createProgressStore`.

## Adding content

1. **New concept:** add a tuple to its unit in `content/grade5/curriculum.ts`
   (`['concept-id', 'Title', { prerequisites, memoryHook, summary }]`).
2. **Cards:** create `content/grade5/cards/<area>/<concept>.ts` with `defineCards(conceptId, tags, drafts)`
   and register it in `content/grade5/cards/index.ts`.
   - `n` is the card's permanent number; the id becomes `<concept-id>-NNN`. **Never renumber**, because progress is keyed on ids.
   - `after: [n, …]` lists earlier cards in the same concept; `prerequisites` takes full ids from other concepts.
   - Use `visual` (question side) and `answerVisual` (answer side) with any `VisualSpec`.
   - Write fractions as `3/4`; they render as stacked fractions.
3. **New diagram type:** extend `VisualSpec` in `domain/visual.ts`, add a renderer in `visuals/`, register it
   in `VisualRenderer.tsx`, and add a case to `validateVisual`.
4. `npm test`: `content.test.ts` validates every id, reference, prerequisite cycle and visual.

A future grade is a sibling `content/grade6/` folder merged into the `CurriculumIndex`.

## Keyboard

`Space`/`Enter` flip · `1–4` Again/Hard/Good/Easy · `←`/`→` previous/next · `H` hint · `S` steps · `B` bookmark
