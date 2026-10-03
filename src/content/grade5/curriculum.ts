import type { Category, Concept, Unit } from '@/domain/curriculum';
import { TABLES } from '@/domain/timesTables';

/**
 * Grade 5 curriculum map. Pure metadata: which concepts exist, how they group, and
 * what each depends on. Flashcards live in ./cards and reference concepts by id.
 *
 * To add a concept: add a tuple to its unit below. To give it cards: add a module in
 * ./cards and register it in ./cards/index.ts.
 */

type ConceptExtras = Partial<Pick<Concept, 'summary' | 'memoryHook' | 'prerequisites'>>;
type ConceptDef = [id: string, title: string, extras?: ConceptExtras];

interface UnitDef {
  id: string;
  title: string;
  concepts: ConceptDef[];
}

interface CategoryDef extends Omit<Category, 'unitIds' | 'grade'> {
  units: UnitDef[];
}

const CATEGORY_DEFS: CategoryDef[] = [
  {
    id: 'number-sense',
    title: 'Number Sense',
    blurb: 'Place value, comparing and rounding',
    icon: '🔢',
    color: 'indigo',
    units: [
      {
        id: 'place-value',
        title: 'Place Value',
        concepts: [
          ['pv-whole', 'Place Value through Billions', { memoryHook: 'Each place is worth 10× the place to its right.' }],
          ['pv-decimal', 'Decimal Place Value to Thousandths', { prerequisites: ['pv-whole'] }],
          ['pv-powers-of-ten', 'Powers of 10', { prerequisites: ['pv-whole'] }],
          ['pv-multiply-10', 'Multiplying by 10, 100, 1,000', {
            prerequisites: ['pv-powers-of-ten'],
            memoryHook: 'Place Value Elevator: × 10 sends every digit up one floor (one place left).',
          }],
          ['pv-divide-10', 'Dividing by 10, 100, 1,000', {
            prerequisites: ['pv-powers-of-ten'],
            memoryHook: 'Place Value Elevator: ÷ 10 sends every digit down one floor (one place right).',
          }],
        ],
      },
      {
        id: 'number-sense',
        title: 'Number Sense',
        concepts: [
          ['ns-forms', 'Standard, Expanded & Word Form', { prerequisites: ['pv-whole'] }],
          ['ns-compare-whole', 'Comparing Whole Numbers', { prerequisites: ['pv-whole'] }],
          ['ns-compare-decimals', 'Comparing Decimals', { prerequisites: ['pv-decimal'] }],
          ['ns-ordering', 'Ordering Numbers', { prerequisites: ['ns-compare-whole', 'ns-compare-decimals'] }],
          ['ns-round-whole', 'Rounding Whole Numbers', { prerequisites: ['pv-whole'] }],
          ['ns-round-decimals', 'Rounding Decimals', { prerequisites: ['pv-decimal', 'ns-round-whole'] }],
        ],
      },
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    blurb: 'Multiplication, division, factors',
    icon: '✖️',
    color: 'sky',
    units: [
      {
        id: 'multiplication',
        title: 'Multiplication',
        concepts: [
          ['mul-estimation', 'Estimating Products', { prerequisites: ['ns-round-whole'] }],
          ['mul-area-model', 'Area Model'],
          ['mul-partial-products', 'Partial Products', { prerequisites: ['mul-area-model'] }],
          ['mul-2x2', '2-Digit × 2-Digit', { prerequisites: ['mul-partial-products'] }],
          ['mul-3x2', '3-Digit × 2-Digit', { prerequisites: ['mul-2x2'] }],
          ['mul-standard-algorithm', 'Standard Algorithm', { prerequisites: ['mul-partial-products'] }],
          ['mul-check-division', 'Checking with Division', { prerequisites: ['mul-standard-algorithm', 'div-meaning'] }],
        ],
      },
      {
        id: 'division',
        title: 'Division',
        concepts: [
          ['div-meaning', 'What Division Means', { memoryHook: 'Division asks: how many equal groups?' }],
          ['div-long-division', 'Long Division Steps', {
            prerequisites: ['div-meaning'],
            memoryHook: 'Divide → Multiply → Subtract → Bring Down → Repeat',
          }],
          ['div-remainders', 'Remainders', { prerequisites: ['div-long-division'] }],
          ['div-4digit-1digit', '4-Digit ÷ 1-Digit', { prerequisites: ['div-long-division'] }],
          ['div-estimate', 'Estimating Quotients', { prerequisites: ['ns-round-whole', 'div-meaning'] }],
          ['div-2digit-divisor', 'Dividing by 2-Digit Divisors', { prerequisites: ['div-4digit-1digit', 'div-estimate'] }],
          ['div-check-multiplication', 'Checking with Multiplication', { prerequisites: ['div-long-division'] }],
        ],
      },
      {
        id: 'factors-multiples',
        title: 'Factors & Multiples',
        concepts: [
          ['fm-factor-pairs', 'Factor Pairs'],
          ['fm-divisibility', 'Divisibility Rules'],
          ['fm-even-odd', 'Even & Odd Patterns'],
          ['fm-prime-composite', 'Prime & Composite Numbers', { prerequisites: ['fm-factor-pairs'] }],
          ['fm-prime-factorization', 'Prime Factorization', { prerequisites: ['fm-prime-composite'] }],
          ['fm-common-factors', 'Common Factors', { prerequisites: ['fm-factor-pairs'] }],
          ['fm-gcf', 'Greatest Common Factor (GCF)', {
            prerequisites: ['fm-common-factors'],
            memoryHook: 'GCF = the biggest building block both numbers share.',
          }],
          ['fm-multiples', 'Multiples'],
          ['fm-common-multiples', 'Common Multiples', { prerequisites: ['fm-multiples'] }],
          ['fm-lcm', 'Least Common Multiple (LCM)', {
            prerequisites: ['fm-common-multiples'],
            memoryHook: 'LCM = the first place two skip-counters meet.',
          }],
        ],
      },
    ],
  },
  {
    id: 'times-tables',
    title: 'Times Tables',
    blurb: 'Every fact up to 15 × 15',
    icon: '⚡',
    color: 'fuchsia',
    feature: { href: '/times-tables', label: 'Open the Times Table Lab' },
    units: [
      {
        id: 'times-tables',
        title: 'Times Tables 2–15',
        concepts: [
          ['tt-strategies', 'Times Table Tricks', {
            summary: 'Big facts are built from small, friendly ones.',
            memoryHook: 'Tens, doubles and halves unlock every table.',
            prerequisites: ['mul-area-model'],
          }],
          ...TABLES.map((n): ConceptDef => [`tt-${n}`, `× ${n} Table`, { prerequisites: ['tt-strategies'] }]),
        ],
      },
    ],
  },
  {
    id: 'fractions',
    title: 'Fractions',
    blurb: 'Parts of a whole and how to work with them',
    icon: '🍕',
    color: 'amber',
    units: [
      {
        id: 'fraction-basics',
        title: 'Fraction Basics',
        concepts: [
          ['fractions-parts', 'Numerator & Denominator', {
            summary: 'A fraction names some equal parts of one whole.',
            memoryHook: 'Numerator = slices you picked. Denominator = equal slices in the whole pizza.',
          }],
          ['fractions-number-line', 'Fractions on a Number Line', { prerequisites: ['fractions-parts'] }],
          ['fractions-as-division', 'Fractions as Division', { prerequisites: ['fractions-parts', 'div-meaning'] }],
          ['fractions-equivalent', 'Equivalent Fractions', {
            prerequisites: ['fractions-parts'],
            summary: 'Different-looking fractions that name the same amount.',
            memoryHook: 'Same pizza, different number of slices.',
          }],
          ['fractions-simplifying', 'Simplifying Fractions', { prerequisites: ['fractions-equivalent', 'fm-gcf'] }],
          ['fractions-compare', 'Comparing Fractions', { prerequisites: ['fractions-equivalent'] }],
          ['fractions-ordering', 'Ordering Fractions', { prerequisites: ['fractions-compare'] }],
          ['fractions-proper-improper', 'Proper & Improper Fractions', { prerequisites: ['fractions-parts'] }],
          ['fractions-mixed-numbers', 'Mixed Numbers', { prerequisites: ['fractions-proper-improper'] }],
          ['fractions-mixed-improper', 'Converting Mixed ↔ Improper', { prerequisites: ['fractions-mixed-numbers'] }],
        ],
      },
      {
        id: 'fraction-add-sub',
        title: 'Fraction Addition & Subtraction',
        concepts: [
          ['fas-like', 'Adding Like Denominators', { prerequisites: ['fractions-parts'] }],
          ['fas-subtract-like', 'Subtracting Like Denominators', { prerequisites: ['fas-like'] }],
          ['fas-unlike', 'Unlike Denominators', { prerequisites: ['fas-like', 'fractions-equivalent', 'fm-lcm'] }],
          ['fas-mixed-add', 'Adding Mixed Numbers', { prerequisites: ['fas-unlike', 'fractions-mixed-improper'] }],
          ['fas-mixed-subtract', 'Subtracting Mixed Numbers', { prerequisites: ['fas-mixed-add'] }],
          ['fas-borrowing', 'Borrowing with Mixed Numbers', { prerequisites: ['fas-mixed-subtract'] }],
        ],
      },
      {
        id: 'fraction-multiply',
        title: 'Fraction Multiplication',
        concepts: [
          ['fmul-whole', 'Fraction × Whole Number', { prerequisites: ['fractions-parts'] }],
          ['fmul-fraction', 'Fraction × Fraction', { prerequisites: ['fmul-whole'], memoryHook: '“of” means multiply: 1/2 of 1/3.' }],
          ['fmul-mixed', 'Mixed Number Multiplication', { prerequisites: ['fmul-fraction', 'fractions-mixed-improper'] }],
          ['fmul-scaling', 'Multiplying Can Make Smaller', { prerequisites: ['fmul-fraction'] }],
        ],
      },
      {
        id: 'fraction-divide',
        title: 'Fraction Division',
        concepts: [
          ['fdiv-whole-by-unit', 'Whole Number ÷ Unit Fraction', {
            prerequisites: ['fractions-parts', 'div-meaning'],
            memoryHook: 'Fraction division asks: how many pieces fit?',
          }],
          ['fdiv-unit-by-whole', 'Unit Fraction ÷ Whole Number', { prerequisites: ['fdiv-whole-by-unit'] }],
          ['fdiv-visual', 'Picturing Fraction Division', { prerequisites: ['fdiv-unit-by-whole'] }],
        ],
      },
    ],
  },
  {
    id: 'decimals',
    title: 'Decimals',
    blurb: 'Tenths, hundredths and fraction links',
    icon: '💲',
    color: 'emerald',
    units: [
      {
        id: 'decimals',
        title: 'Decimals',
        concepts: [
          ['dec-places', 'Tenths, Hundredths & Thousandths', { prerequisites: ['pv-decimal'] }],
          ['dec-read-write', 'Reading & Writing Decimals', { prerequisites: ['dec-places'] }],
          ['dec-compare', 'Comparing & Ordering Decimals', { prerequisites: ['dec-places'] }],
          ['dec-round', 'Rounding Decimals', { prerequisites: ['dec-places'] }],
          ['dec-add', 'Adding Decimals', { prerequisites: ['dec-places'], memoryHook: 'Line up the decimal points like buttons on a shirt.' }],
          ['dec-subtract', 'Subtracting Decimals', { prerequisites: ['dec-add'] }],
          ['dec-multiply', 'Multiplying Decimals', { prerequisites: ['dec-places', 'mul-standard-algorithm'] }],
          ['dec-multiply-smaller', 'Multiplying Doesn’t Always Make Bigger', {
            prerequisites: ['dec-multiply'],
            memoryHook: '8 × 0.5 is “half of 8” = 4.',
          }],
          ['dec-divide', 'Dividing Decimals', { prerequisites: ['dec-places', 'div-long-division'] }],
          ['dec-powers-of-ten', 'Decimals × and ÷ Powers of 10', { prerequisites: ['pv-multiply-10', 'pv-divide-10'] }],
        ],
      },
      {
        id: 'fractions-decimals',
        title: 'Fractions ↔ Decimals',
        concepts: [
          ['fd-benchmarks', 'Common Fraction–Decimal Pairs', { prerequisites: ['dec-places', 'fractions-equivalent'] }],
          ['fd-fraction-to-decimal', 'Fraction → Decimal', { prerequisites: ['fractions-as-division', 'dec-divide'] }],
          ['fd-decimal-to-fraction', 'Decimal → Fraction', { prerequisites: ['dec-places', 'fractions-simplifying'] }],
        ],
      },
    ],
  },
  {
    id: 'algebra',
    title: 'Algebra',
    blurb: 'Expressions, patterns and finding x',
    icon: '🧮',
    color: 'violet',
    units: [
      {
        id: 'expressions',
        title: 'Expressions & Order of Operations',
        concepts: [
          ['expr-parentheses', 'Parentheses First'],
          ['expr-order-of-operations', 'Order of Operations', { prerequisites: ['expr-parentheses'] }],
          ['expr-evaluate', 'Evaluating Expressions', { prerequisites: ['expr-order-of-operations'] }],
          ['expr-words-to-math', 'Words → Expressions', { prerequisites: ['expr-parentheses'] }],
          ['expr-vs-equation', 'Expression vs. Equation'],
        ],
      },
      {
        id: 'patterns-algebra',
        title: 'Patterns & Early Algebra',
        concepts: [
          ['alg-number-patterns', 'Number Patterns'],
          ['alg-input-output', 'Input/Output Tables', { prerequisites: ['alg-number-patterns'], memoryHook: 'Math Machine: Input → Rule → Output.' }],
          ['alg-two-rule-patterns', 'Two-Rule Patterns', { prerequisites: ['alg-input-output'] }],
          ['alg-variables', 'Variables', { prerequisites: ['expr-vs-equation'] }],
          ['alg-missing-numbers', 'Missing Numbers', { prerequisites: ['alg-variables'] }],
          ['alg-equations', 'Solving for x', { prerequisites: ['alg-missing-numbers'] }],
        ],
      },
    ],
  },
  {
    id: 'measurement',
    title: 'Measurement',
    blurb: 'Units, area, perimeter and volume',
    icon: '📏',
    color: 'rose',
    units: [
      {
        id: 'measurement',
        title: 'Measurement',
        concepts: [
          ['meas-convert-rule', 'Big ↔ Small Units', { memoryHook: 'Big → small: multiply. Small → big: divide.' }],
          ['meas-customary-length', 'Inches, Feet, Yards & Miles', { prerequisites: ['meas-convert-rule'] }],
          ['meas-metric-length', 'mm, cm, m & km', { prerequisites: ['meas-convert-rule', 'pv-multiply-10'] }],
          ['meas-customary-weight', 'Ounces, Pounds & Tons', { prerequisites: ['meas-convert-rule'] }],
          ['meas-metric-mass', 'Grams & Kilograms', { prerequisites: ['meas-convert-rule'] }],
          ['meas-customary-capacity', 'Cups, Pints, Quarts & Gallons', { prerequisites: ['meas-convert-rule'] }],
          ['meas-metric-capacity', 'Milliliters & Liters', { prerequisites: ['meas-convert-rule'] }],
          ['meas-elapsed-time', 'Elapsed Time'],
          ['meas-multi-step', 'Multi-Step Conversions', { prerequisites: ['meas-customary-length', 'meas-metric-length'] }],
        ],
      },
      {
        id: 'area-perimeter',
        title: 'Area & Perimeter',
        concepts: [
          ['ap-perimeter', 'Perimeter', { memoryHook: 'Perimeter = the fence around the yard.' }],
          ['ap-area-rectangle', 'Area of Rectangles & Squares', { memoryHook: 'Area = the floor inside the room.' }],
          ['ap-area-vs-perimeter', 'Area vs. Perimeter', { prerequisites: ['ap-perimeter', 'ap-area-rectangle'] }],
          ['ap-area-triangle', 'Area of Triangles', { prerequisites: ['ap-area-rectangle'] }],
          ['ap-missing-side', 'Missing Side Problems', { prerequisites: ['ap-area-vs-perimeter'] }],
          ['ap-word-problems', 'Area & Perimeter in Real Life', { prerequisites: ['ap-missing-side'] }],
        ],
      },
      {
        id: 'volume',
        title: 'Volume',
        concepts: [
          ['vol-cubic-units', 'Cubic Units', { prerequisites: ['ap-area-rectangle'], memoryHook: 'Area = floor. Volume = the whole room.' }],
          ['vol-lwh', 'V = l × w × h', { prerequisites: ['vol-cubic-units'] }],
          ['vol-base-height', 'V = Base Area × Height', { prerequisites: ['vol-lwh'] }],
          ['vol-missing-dimension', 'Missing Dimensions', { prerequisites: ['vol-lwh'] }],
          ['vol-composite', 'Composite Prisms', { prerequisites: ['vol-lwh'] }],
          ['vol-word-problems', 'Volume in Real Life', { prerequisites: ['vol-composite'] }],
        ],
      },
    ],
  },
  {
    id: 'geometry',
    title: 'Geometry',
    blurb: 'Lines, angles and shape families',
    icon: '📐',
    color: 'teal',
    units: [
      {
        id: 'geometry',
        title: 'Geometry',
        concepts: [
          ['geo-points-lines', 'Points, Lines, Rays & Segments'],
          ['geo-line-relationships', 'Parallel, Perpendicular & Intersecting', { prerequisites: ['geo-points-lines'] }],
          ['geo-angles', 'Acute, Right, Obtuse & Straight Angles', { prerequisites: ['geo-points-lines'] }],
          ['geo-triangles-sides', 'Equilateral, Isosceles & Scalene'],
          ['geo-triangles-angles', 'Triangles by Angles', { prerequisites: ['geo-angles'] }],
          ['geo-quadrilaterals', 'Quadrilaterals', { prerequisites: ['geo-line-relationships'] }],
          ['geo-shape-hierarchy', 'Shape Family Tree', {
            prerequisites: ['geo-quadrilaterals'],
            memoryHook: 'A square is a rectangle that also has equal sides — it belongs to both families.',
          }],
          ['geo-symmetry', 'Lines of Symmetry'],
        ],
      },
    ],
  },
  {
    id: 'coordinate-plane',
    title: 'Coordinate Plane',
    blurb: 'Plotting and reading points',
    icon: '📍',
    color: 'orange',
    units: [
      {
        id: 'coordinate-plane',
        title: 'Coordinate Plane',
        concepts: [
          ['cp-axes-origin', 'x-Axis, y-Axis & Origin'],
          ['cp-ordered-pairs', 'Ordered Pairs', { prerequisites: ['cp-axes-origin'], memoryHook: 'Walk first, then climb: (4, 3) = right 4, up 3.' }],
          ['cp-plotting', 'Plotting Points', { prerequisites: ['cp-ordered-pairs'] }],
          ['cp-reading', 'Reading Coordinates', { prerequisites: ['cp-ordered-pairs'] }],
          ['cp-problems', 'Coordinate Plane Problems', { prerequisites: ['cp-plotting', 'cp-reading'] }],
        ],
      },
    ],
  },
  {
    id: 'data',
    title: 'Data & Graphs',
    blurb: 'Tables, graphs and line plots',
    icon: '📊',
    color: 'cyan',
    units: [
      {
        id: 'data-graphs',
        title: 'Data & Graphs',
        concepts: [
          ['data-tables', 'Reading Tables'],
          ['data-scales', 'Graph Scales'],
          ['data-bar-graphs', 'Bar Graphs', { prerequisites: ['data-scales'] }],
          ['data-double-bar', 'Double Bar Graphs', { prerequisites: ['data-bar-graphs'] }],
          ['data-line-plots', 'Line Plots'],
          ['data-line-plot-fractions', 'Line Plots with Fractions', { prerequisites: ['data-line-plots', 'fas-unlike'] }],
          ['data-line-graphs', 'Line Graphs', { prerequisites: ['data-scales'] }],
          ['data-interpreting', 'Comparing & Interpreting Data', { prerequisites: ['data-bar-graphs', 'data-line-graphs'] }],
        ],
      },
    ],
  },
  {
    id: 'word-problems',
    title: 'Word Problems',
    blurb: 'Reasoning with R-U-N-C',
    icon: '🧠',
    color: 'lime',
    units: [
      {
        id: 'word-problems',
        title: 'Word Problems',
        concepts: [
          ['wp-runc', 'The R-U-N-C Method', { memoryHook: 'Read · Understand the question · Name what you know · Calculate — then CHECK.' }],
          ['wp-add-subtract', 'Addition & Subtraction Problems', { prerequisites: ['wp-runc'] }],
          ['wp-multiply-divide', 'Multiplication & Division Problems', { prerequisites: ['wp-runc'] }],
          ['wp-fractions', 'Fraction Problems', { prerequisites: ['wp-runc', 'fas-unlike'] }],
          ['wp-decimals', 'Decimal Problems', { prerequisites: ['wp-runc', 'dec-add'] }],
          ['wp-money', 'Money Problems', { prerequisites: ['wp-decimals'] }],
          ['wp-elapsed-time', 'Elapsed-Time Problems', { prerequisites: ['wp-runc', 'meas-elapsed-time'] }],
          ['wp-measurement', 'Measurement Problems', { prerequisites: ['wp-runc', 'meas-convert-rule'] }],
          ['wp-volume', 'Volume Problems', { prerequisites: ['wp-runc', 'vol-lwh'] }],
          ['wp-two-step', 'Two-Step Problems', { prerequisites: ['wp-add-subtract', 'wp-multiply-divide'] }],
          ['wp-multi-step', 'Multi-Step Problems', { prerequisites: ['wp-two-step'] }],
          ['wp-missing-info', 'Missing-Information Problems', { prerequisites: ['wp-runc'] }],
          ['wp-extra-info', 'Extra-Information Problems', { prerequisites: ['wp-runc'] }],
        ],
      },
      {
        id: 'math-reasoning',
        title: 'Math Reasoning & Problem-Solving',
        concepts: [
          ['mr-estimate-first', 'Estimate Before Solving'],
          ['mr-draw-picture', 'Draw a Picture'],
          ['mr-make-table', 'Make a Table'],
          ['mr-find-pattern', 'Find a Pattern'],
          ['mr-work-backwards', 'Work Backwards'],
          ['mr-eliminate', 'Eliminate Impossible Choices'],
          ['mr-inverse-check', 'Check with Inverse Operations'],
          ['mr-unnecessary-info', 'Spot Unnecessary Information'],
          ['mr-reasonable', 'Is My Answer Reasonable?', { prerequisites: ['mr-estimate-first'] }],
        ],
      },
    ],
  },
];

function build(): { categories: Category[]; units: Unit[]; concepts: Concept[] } {
  const categories: Category[] = [];
  const units: Unit[] = [];
  const concepts: Concept[] = [];

  for (const { units: unitDefs, ...category } of CATEGORY_DEFS) {
    categories.push({ ...category, grade: 5, unitIds: unitDefs.map((u) => u.id) });
    for (const unit of unitDefs) {
      units.push({ id: unit.id, categoryId: category.id, title: unit.title, conceptIds: unit.concepts.map(([id]) => id) });
      for (const [id, title, extras] of unit.concepts) {
        concepts.push({ id, unitId: unit.id, title, ...extras, prerequisites: extras?.prerequisites ?? [] });
      }
    }
  }
  return { categories, units, concepts };
}

export const grade5Curriculum = build();
