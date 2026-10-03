import type { VisualSpec } from '@/domain/visual';
import { AreaModel } from './AreaModel';
import { BarModel } from './BarModel';
import { FractionCircle } from './FractionCircle';
import { FractionStrip, FractionStripStack } from './FractionStrips';
import { PlaceValueChart } from './PlaceValueChart';
import { RoundingLine } from './RoundingLine';
import { FactorTree } from './FactorTree';
import { FractionAreaModel } from './FractionAreaModel';
import { LongDivision } from './LongDivision';
import { NumberGrid } from './NumberGrid';
import { NumberLine } from './NumberLine';
import { ShadedGrid } from './ShadedGrid';

/** Maps a declarative {@link VisualSpec} to its SVG renderer. Add new diagram kinds here. */
export function VisualRenderer({ spec }: { spec: VisualSpec }) {
  switch (spec.kind) {
    case 'fraction-circle':
      return <FractionCircle {...spec} />;
    case 'fraction-strip':
      return <FractionStrip {...spec} />;
    case 'fraction-strip-stack':
      return <FractionStripStack {...spec} />;
    case 'number-line':
      return <NumberLine {...spec} />;
    case 'shaded-grid':
      return <ShadedGrid {...spec} />;
    case 'place-value-chart':
      return <PlaceValueChart {...spec} />;
    case 'rounding-line':
      return <RoundingLine {...spec} />;
    case 'bar-model':
      return <BarModel {...spec} />;
    case 'area-model':
      return <AreaModel {...spec} />;
    case 'long-division':
      return <LongDivision {...spec} />;
    case 'number-grid':
      return <NumberGrid {...spec} />;
    case 'factor-tree':
      return <FactorTree {...spec} />;
    case 'fraction-area-model':
      return <FractionAreaModel {...spec} />;
    case 'row':
      return (
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {spec.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-6">
              {i > 0 && spec.separator && (
                <span className="text-2xl font-bold text-slate-400" aria-label={SEPARATOR_LABEL[spec.separator]}>
                  {spec.separator}
                </span>
              )}
              <VisualRenderer spec={item} />
            </div>
          ))}
        </div>
      );
  }
}

const SEPARATOR_LABEL = { '=': 'equals', '≠': 'does not equal', '→': 'becomes', vs: 'compared with' } as const;
