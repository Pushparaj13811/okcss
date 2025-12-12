'use client';

import { Slider } from '@/src/components/ui/Slider';
import { ColorPicker } from '@/src/components/ui/ColorPicker';
import { ResetIcon } from '@/src/components/icons';
import { GlassState, GLASS_CONTROLS, DEFAULT_GLASS } from '@/src/lib/glass';

type GlassControlsProps = {
  state: GlassState;
  onChange: <K extends keyof GlassState>(key: K, value: GlassState[K]) => void;
  onReset: () => void;
};

export function GlassControls({ state, onChange, onReset }: GlassControlsProps) {
  const isDirty = Object.keys(DEFAULT_GLASS).some(
    (k) => state[k as keyof GlassState] !== DEFAULT_GLASS[k as keyof GlassState],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-tight" style={{ color: 'var(--text-1)' }}>
          Glassmorphism
        </h2>
        <button
          onClick={onReset}
          disabled={!isDirty}
          className="inline-flex items-center gap-1.5 font-mono text-xs px-2 py-1 rounded-md cursor-pointer"
          style={{ color: 'var(--text-3)', opacity: isDirty ? 1 : 0, pointerEvents: isDirty ? 'auto' : 'none' }}
        >
          <ResetIcon size={11} />
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {GLASS_CONTROLS.map((ctrl) => (
          <Slider
            key={ctrl.key}
            id={`glass-${ctrl.key}`}
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

      <div className="h-px w-full" style={{ background: 'var(--border-subtle)' }} aria-hidden="true" />

      <div className="flex flex-col gap-5">
        <ColorPicker
          label="Background colour"
          value={state.bgColor}
          onChange={(hex) => onChange('bgColor', hex)}
        />
        <ColorPicker
          label="Border colour"
          value={state.borderColor}
          onChange={(hex) => onChange('borderColor', hex)}
        />
      </div>
    </div>
  );
}
