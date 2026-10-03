import type { ReactNode } from 'react';
import type { VisualSpec } from '@/domain/visual';
import { VisualRenderer } from '@/visuals/VisualRenderer';
import { MathText } from '../MathText';

/** A diagram that carries meaning, with a frame that keeps it readable on any card. */
export function VisualExplanation({ spec, caption }: { spec: VisualSpec; caption?: string }) {
  return (
    <figure className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50 px-3 py-4">
      <VisualRenderer spec={spec} />
      {caption && <figcaption className="text-sm text-slate-500">{caption}</figcaption>}
    </figure>
  );
}

const CALLOUT_STYLE = {
  rule: { icon: '📘', title: 'Rule', className: 'bg-indigo-50 text-indigo-950' },
  hook: { icon: '💡', title: 'Remember it', className: 'bg-amber-50 text-amber-950' },
  example: { icon: '✏️', title: 'Example', className: 'bg-slate-50 text-slate-900' },
  mistake: { icon: '⚠️', title: 'Watch out', className: 'bg-rose-50 text-rose-950' },
  why: { icon: '🤔', title: 'Why', className: 'bg-sky-50 text-sky-950' },
  hint: { icon: '🔎', title: 'Hint', className: 'bg-violet-50 text-violet-950' },
} as const;

export type CalloutKind = keyof typeof CALLOUT_STYLE;

export function Callout({ kind, children }: { kind: CalloutKind; children: ReactNode }) {
  const style = CALLOUT_STYLE[kind];
  return (
    <div className={`rounded-2xl px-4 py-3 ${style.className}`}>
      <p className="mb-0.5 text-xs font-semibold tracking-wide uppercase opacity-70">
        <span aria-hidden="true">{style.icon} </span>
        {style.title}
      </p>
      <div className="text-base leading-relaxed">{children}</div>
    </div>
  );
}

export function WorkedExample({ example }: { example: string }) {
  return (
    <Callout kind="example">
      <p className="text-lg font-medium">
        <MathText text={example} />
      </p>
    </Callout>
  );
}

export function HintPanel({ hint, open, onToggle }: { hint: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="rounded-full px-4 py-1.5 pointer-coarse:min-h-11 pointer-coarse:px-5 text-sm font-medium text-violet-700 ring-1 ring-violet-200 hover:bg-violet-50"
      >
        {open ? 'Hide hint' : 'Need a hint?'} <kbd className="ml-1 text-xs text-violet-400">H</kbd>
      </button>
      {open && (
        <div className="w-full">
          <Callout kind="hint">
            <MathText text={hint} />
          </Callout>
        </div>
      )}
    </div>
  );
}

export function StepsPanel({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-2" aria-label="Steps">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 rounded-2xl bg-emerald-50 px-4 py-2.5 text-emerald-950">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-sm font-semibold text-white">{i + 1}</span>
          <span className="leading-relaxed">
            <MathText text={step} compact />
          </span>
        </li>
      ))}
    </ol>
  );
}
