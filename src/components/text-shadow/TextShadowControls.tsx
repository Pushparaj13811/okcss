'use client';

import { Slider } from '@/src/components/ui/Slider';
import { ColorPicker } from '@/src/components/ui/ColorPicker';
import { ResetIcon } from '@/src/components/icons';
import {
  TextShadowState,
  TEXT_SHADOW_CONTROLS,
  DEFAULT_TEXT_SHADOW,
} from '@/src/lib/text-shadow';

type Props = {
  state: TextShadowState;
  onChange: <K extends keyof TextShadowState>(key: K, value: TextShadowState[K]) => void;
  onReset: () => void;
};

export function TextShadowControls({ state, onChange, onReset }: Props) {
  const isDirty = (Object.keys(DEFAULT_TEXT_SHADOW) as (keyof TextShadowState)[]).some(
    (k) => state[k] !== DEFAULT_TEXT_SHADOW[k],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-tight" style={{ color: 'var(--text-1)' }}>
          Text Shadow
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

      {/* Preview text input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>Preview text</label>
        <input
          type="text"
          value={state.previewText}
          onChange={(e) => onChange('previewText', e.target.value)}
          maxLength={20}
          className="font-mono text-sm px-3 py-2 rounded-lg outline-none"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
        />
      </div>

      <div className="flex flex-col gap-5">
        {TEXT_SHADOW_CONTROLS.map((ctrl) => (
          <Slider
            key={ctrl.key}
            id={`ts-${ctrl.key}`}
            label={ctrl.label}
            value={state[ctrl.key] as number}
            min={ctrl.min}
            max={ctrl.max}
            step={ctrl.step}
            unit={ctrl.unit}
            onChange={(val) => onChange(ctrl.key, val)}
          />
        ))}
      </div>

      <div className="h-px w-full" style={{ background: 'var(--border-subtle)' }} />
      <ColorPicker label="Colour" value={state.color} onChange={(hex) => onChange('color', hex)} />
    </div>
  );
}
