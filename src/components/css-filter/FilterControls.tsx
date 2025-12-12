'use client';

import { Slider } from '@/src/components/ui/Slider';
import { ResetIcon } from '@/src/components/icons';
import { FilterState, FILTER_CONTROLS, DEFAULT_FILTER } from '@/src/lib/css-filter';

type Props = {
  state: FilterState;
  onChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
};

export function FilterControls({ state, onChange, onReset }: Props) {
  const isDirty = (Object.keys(DEFAULT_FILTER) as (keyof FilterState)[]).some(
    (k) => state[k] !== DEFAULT_FILTER[k],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-tight" style={{ color: 'var(--text-1)' }}>
          CSS Filter
        </h2>
        <button
          onClick={onReset}
          disabled={!isDirty}
          className="inline-flex items-center gap-1.5 font-mono text-xs px-2 py-1 rounded-md cursor-pointer"
          style={{ color: 'var(--text-3)', opacity: isDirty ? 1 : 0, pointerEvents: isDirty ? 'auto' : 'none' }}
        >
          <ResetIcon size={11} /> Reset
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {FILTER_CONTROLS.map((ctrl) => (
          <Slider
            key={ctrl.key}
            id={`filter-${ctrl.key}`}
            label={ctrl.label}
            value={state[ctrl.key]}
            min={ctrl.min}
            max={ctrl.max}
            step={ctrl.step}
            unit={ctrl.unit}
            onChange={(val) => onChange(ctrl.key, val)}
          />
        ))}
      </div>
    </div>
  );
}
