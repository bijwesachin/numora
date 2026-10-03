import { MASTERY_LABEL } from '@/domain/review/mastery';
import type { MasteryLevel } from '@/domain/review/types';
import { MASTERY_THEME } from './theme';

const ICON: Record<MasteryLevel, string> = {
  new: '○',
  learning: '◔',
  familiar: '◑',
  strong: '◕',
  mastered: '●',
};

export function MasteryBadge({ level }: { level: MasteryLevel }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${MASTERY_THEME[level]}`}>
      <span aria-hidden="true">{ICON[level]}</span>
      {MASTERY_LABEL[level]}
    </span>
  );
}
