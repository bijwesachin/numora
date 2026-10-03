import { describeNextInterval, newCardProgress } from '@/domain/review/scheduler';
import type { CardProgress, Rating } from '@/domain/review/types';

const BUTTONS: { rating: Rating; label: string; help: string; className: string }[] = [
  { rating: 'again', label: 'Again', help: 'I didn’t know it', className: 'bg-rose-50 text-rose-800 ring-rose-200 hover:bg-rose-100' },
  { rating: 'hard', label: 'Hard', help: 'Got it, with effort', className: 'bg-amber-50 text-amber-900 ring-amber-200 hover:bg-amber-100' },
  { rating: 'good', label: 'Good', help: 'I knew it', className: 'bg-emerald-50 text-emerald-800 ring-emerald-200 hover:bg-emerald-100' },
  { rating: 'easy', label: 'Easy', help: 'Too easy!', className: 'bg-sky-50 text-sky-800 ring-sky-200 hover:bg-sky-100' },
];

interface ReviewControlsProps {
  cardId: string;
  progress: CardProgress | undefined;
  enabled: boolean;
  onRate: (rating: Rating) => void;
}

export function ReviewControls({ cardId, progress, enabled, onRate }: ReviewControlsProps) {
  const now = new Date();
  const current = progress ?? newCardProgress(cardId);

  return (
    <div role="group" aria-label="How well did you know it?">
      <p className="mb-2 text-center text-sm text-slate-500">
        {enabled ? 'How well did you know it?' : 'Think of your answer, then flip the card.'}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BUTTONS.map((b, i) => (
          <button
            key={b.rating}
            type="button"
            disabled={!enabled}
            onClick={() => onRate(b.rating)}
            className={`flex flex-col items-center rounded-2xl px-3 py-2.5 ring-1 transition disabled:cursor-not-allowed disabled:opacity-40 ${b.className}`}
          >
            <span className="text-base font-semibold">
              {b.label} <kbd className="text-xs opacity-50">{i + 1}</kbd>
            </span>
            <span className="text-xs opacity-80">{enabled ? describeNextInterval(current, b.rating, now) : b.help}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
