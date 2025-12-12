'use client';

import { Slider } from '@/src/components/ui/Slider';
import { ColorPicker } from '@/src/components/ui/ColorPicker';
import { ToggleGroup } from '@/src/components/ui/ToggleGroup';
import { ResetIcon } from '@/src/components/icons';
import {
  NeuState,
  NeuShape,
  NEU_CONTROLS,
  NEU_SHAPES,
  DEFAULT_NEU,
} from '@/src/lib/neumorphism';

type NeuControlsProps = {
  state: NeuState;
  onChange: <K extends keyof NeuState>(key: K, value: NeuState[K]) => void;
  onReset: () => void;
};

export function NeuControls({ state, onChange, onReset }: NeuControlsProps) {
  const isDirty = Object.keys(DEFAULT_NEU).some(
    (k) => state[k as keyof NeuState] !== DEFAULT_NEU[k as keyof NeuState],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-tight" style={{ color: 'var(--text-1)' }}>
          Neumorphism
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

      {/* Shape selector */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>Shape</span>
        <ToggleGroup<NeuShape>
          value={state.shape}
          options={NEU_SHAPES.map((s) => s.value)}
          onChange={(shape) => onChange('shape', shape)}
          layoutId="neu-shape-toggle"
        />
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-5">
        {NEU_CONTROLS.map((ctrl) => (
          <Slider
            key={ctrl.key}
            id={`neu-${ctrl.key}`}
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

      {/*
        Base colour — critical for neumorphism. The shadow colours are derived
        from this, so the preview background and the card are the same colour.
        Warn the user subtly if they pick a very dark or very saturated colour.
      */}
      <ColorPicker
        label="Base colour"
        value={state.color}
        onChange={(hex) => onChange('color', hex)}
      />
    </div>
  );
}
