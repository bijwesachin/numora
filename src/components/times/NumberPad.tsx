/** Large on-screen number pad for typing answers on a tablet. */
export function NumberPad({
  disabled,
  canSubmit,
  onDigit,
  onDelete,
  onSubmit,
}: {
  disabled: boolean;
  canSubmit: boolean;
  onDigit: (d: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
}) {
  const key = 'flex h-16 items-center justify-center rounded-2xl text-2xl font-bold ring-1 disabled:opacity-40';
  return (
    <div className="mx-auto grid w-full max-w-sm grid-cols-3 gap-2" role="group" aria-label="Number pad">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
        <button key={d} type="button" disabled={disabled} onClick={() => onDigit(d)} className={`${key} bg-white text-slate-800 ring-slate-300 hover:bg-slate-50`}>
          {d}
        </button>
      ))}
      <button type="button" disabled={disabled} onClick={onDelete} aria-label="Delete" className={`${key} bg-slate-100 text-slate-600 ring-slate-300`}>
        ⌫
      </button>
      <button type="button" disabled={disabled} onClick={() => onDigit('0')} className={`${key} bg-white text-slate-800 ring-slate-300 hover:bg-slate-50`}>
        0
      </button>
      <button type="button" disabled={disabled || !canSubmit} onClick={onSubmit} aria-label="Check answer" className={`${key} bg-indigo-600 text-white ring-indigo-700`}>
        ✓
      </button>
    </div>
  );
}
