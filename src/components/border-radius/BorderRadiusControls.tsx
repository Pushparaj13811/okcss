'use client';

import { Slider } from '@/src/components/ui/Slider';
import { ToggleGroup } from '@/src/components/ui/ToggleGroup';
import { ResetIcon } from '@/src/components/icons';
import {
  BorderRadiusState,
  RadiusMode,
  RADIUS_CONTROLS,
  DEFAULT_BORDER_RADIUS,
} from '@/src/lib/border-radius';

type Props = {
  state: BorderRadiusState;
  onChange: <K extends keyof BorderRadiusState>(key: K, value: BorderRadiusState[K]) => void;
  onReset: () => void;
};

export function BorderRadiusControls({ state, onChange, onReset }: Props) {
  const isDirty = (Object.keys(DEFAULT_BORDER_RADIUS) as (keyof BorderRadiusState)[]).some(
    (k) => state[k] !== DEFAULT_BORDER_RADIUS[k],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-tight" style={{ color: 'var(--text-1)' }}>
          Border Radius
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

      {/* Mode toggle */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>Mode</span>
        <ToggleGroup<RadiusMode>
          value={state.mode}
          options={['uniform', 'individual']}
          onChange={(m) => onChange('mode', m)}
          layoutId="radius-mode-toggle"
        />
      </div>

      {state.mode === 'uniform' ? (
        <Slider
          id="radius-uniform"
          label="Radius"
          value={state.uniform}
          min={0}
          max={200}
          step={1}
          unit="px"
          onChange={(v) => onChange('uniform', v)}
        />
      ) : (
        <div className="flex flex-col gap-5">
          {RADIUS_CONTROLS.map((ctrl) => (
            <Slider
              key={ctrl.key}
              id={`radius-${ctrl.key}`}
              label={ctrl.label}
              value={state[ctrl.key]}
              min={ctrl.min}
              max={ctrl.max}
              step={ctrl.step}
              unit={ctrl.unit}
              onChange={(v) => onChange(ctrl.key, v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
