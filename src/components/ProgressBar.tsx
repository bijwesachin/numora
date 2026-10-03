interface ProgressBarProps {
  value: number;
  label: string;
  /** Tailwind background class for the fill. */
  barClass?: string;
  showValue?: boolean;
}

export function ProgressBar({ value, label, barClass = 'bg-indigo-500', showValue = true }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm text-slate-600">
        <span>{label}</span>
        {showValue && <span className="font-semibold text-slate-800 tabular-nums">{pct}%</span>}
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label={label} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full transition-[width] duration-500 ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
