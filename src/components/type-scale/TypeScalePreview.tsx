'use client';

import { TypeScaleState, computeScale } from '@/src/lib/type-scale';

type Props = { state: TypeScaleState };

export function TypeScalePreview({ state }: Props) {
  const scale = computeScale(state);
  const unit = state.unit;

  return (
    <div
      className="w-full rounded-2xl p-6 overflow-y-auto"
      style={{
        maxHeight: '340px',
        background: 'var(--preview-canvas)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="flex flex-col gap-2">
        {[...scale].reverse().map((step) => {
          const size = unit === 'rem' ? `${step.rem}rem` : `${Math.round(step.px)}px`;
          return (
            <div
              key={step.name}
              className="flex items-baseline gap-4"
              style={{ minHeight: '1.2em' }}
            >
              <span
                className="font-mono shrink-0 tabular-nums"
                style={{
                  fontSize: '11px',
                  color: 'var(--text-3)',
                  width: '68px',
                  textAlign: 'right',
                }}
              >
                {size}
              </span>
              <p
                className="font-mono font-medium leading-none truncate select-none"
                style={{
                  fontSize: size,
                  color: 'var(--text-1)',
                  lineHeight: 1.1,
                }}
                aria-hidden="true"
              >
                Aa
              </p>
              <span
                className="font-mono shrink-0"
                style={{ fontSize: '11px', color: 'var(--text-3)' }}
              >
                --text-{step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
