import type { CategoryColor } from '@/domain/curriculum';
import type { MasteryLevel } from '@/domain/review/types';

/** Full class strings (not interpolated) so Tailwind can see them at build time. */
export const CATEGORY_THEME: Record<CategoryColor, { tile: string; bar: string; text: string }> = {
  indigo: { tile: 'bg-indigo-50', bar: 'bg-indigo-500', text: 'text-indigo-700' },
  sky: { tile: 'bg-sky-50', bar: 'bg-sky-500', text: 'text-sky-700' },
  amber: { tile: 'bg-amber-50', bar: 'bg-amber-500', text: 'text-amber-700' },
  emerald: { tile: 'bg-emerald-50', bar: 'bg-emerald-500', text: 'text-emerald-700' },
  violet: { tile: 'bg-violet-50', bar: 'bg-violet-500', text: 'text-violet-700' },
  rose: { tile: 'bg-rose-50', bar: 'bg-rose-500', text: 'text-rose-700' },
  teal: { tile: 'bg-teal-50', bar: 'bg-teal-500', text: 'text-teal-700' },
  orange: { tile: 'bg-orange-50', bar: 'bg-orange-500', text: 'text-orange-700' },
  cyan: { tile: 'bg-cyan-50', bar: 'bg-cyan-500', text: 'text-cyan-700' },
  lime: { tile: 'bg-lime-50', bar: 'bg-lime-600', text: 'text-lime-800' },
  fuchsia: { tile: 'bg-fuchsia-50', bar: 'bg-fuchsia-500', text: 'text-fuchsia-700' },
  blue: { tile: 'bg-blue-50', bar: 'bg-blue-500', text: 'text-blue-700' },
};

export const MASTERY_THEME: Record<MasteryLevel, string> = {
  new: 'bg-slate-100 text-slate-600',
  learning: 'bg-rose-100 text-rose-800',
  familiar: 'bg-amber-100 text-amber-800',
  strong: 'bg-sky-100 text-sky-800',
  mastered: 'bg-emerald-100 text-emerald-800',
};
