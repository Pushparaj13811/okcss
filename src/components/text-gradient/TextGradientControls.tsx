'use client';

import {
  TextGradientState,
  makeTextGradStop,
} from '@/src/lib/text-gradient';
import { Slider } from '@/src/components/ui/Slider';
import { ColorPicker } from '@/src/components/ui/ColorPicker';
import { ToggleGroup } from '@/src/components/ui/ToggleGroup';

type Props = {
  state: TextGradientState;
  previewText: string;
  onPreviewTextChange: (v: string) => void;
  onChange: <K extends keyof TextGradientState>(key: K, value: TextGradientState[K]) => void;
  onReset: () => void;
};

export function TextGradientControls({ state, previewText, onPreviewTextChange, onChange, onReset }: Props) {
  const updateStop = (id: string, field: 'color' | 'position', value: string | number) => {
    onChange(
      'stops',
      state.stops.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  const addStop = () => {
    if (state.stops.length >= 6) return;
    onChange('stops', [...state.stops, makeTextGradStop('#ffffff', 50)]);
  };

  const removeStop = (id: string) => {
    if (state.stops.length <= 2) return;
    onChange('stops', state.stops.filter((s) => s.id !== id));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Preview text input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>
          Preview text
        </label>
        <input
          type="text"
          value={previewText}
          onChange={(e) => onPreviewTextChange(e.target.value)}
          maxLength={20}
          className="w-full font-mono text-sm px-3 py-1.5 rounded-lg"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            color: 'var(--text-1)',
            outline: 'none',
          }}
        />
      </div>

      {/* Gradient type */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>Type</span>
        <ToggleGroup
          value={state.type}
          options={['linear', 'radial'] as const}
          onChange={(v) => onChange('type', v)}
          layoutId="tg-type"
        />
      </div>

      {/* Angle (linear only) */}
      {state.type === 'linear' && (
        <Slider
          id="tg-angle"
          label="Angle"
          value={state.angle}
          min={0}
          max={360}
          unit="°"
          onChange={(v) => onChange('angle', v)}
        />
      )}

      {/* Colour stops */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>
          Colour stops
        </span>
        {state.stops.map((stop, i) => (
          <div key={stop.id} className="flex items-center gap-3">
            <ColorPicker
              label={`Stop ${i + 1}`}
              value={stop.color}
              onChange={(c) => updateStop(stop.id, 'color', c)}
            />
            <div className="flex-1">
              <Slider
                id={`tg-stop-pos-${i}`}
                label={`Stop ${i + 1}`}
                value={stop.position}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => updateStop(stop.id, 'position', v)}
              />
            </div>
            {state.stops.length > 2 && (
              <button
                onClick={() => removeStop(stop.id)}
                className="flex-shrink-0 text-xs font-mono px-2 py-1 rounded"
                style={{ color: 'var(--text-3)', cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg)' }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {state.stops.length < 6 && (
          <button
            onClick={addStop}
            className="w-full py-1.5 rounded-lg font-mono text-xs"
            style={{
              border: '1px dashed var(--border)',
              color: 'var(--text-3)',
              cursor: 'pointer',
              background: 'transparent',
            }}
          >
            + Add stop
          </button>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-1.5 rounded-lg font-mono text-xs mt-1"
        style={{ border: '1px solid var(--border)', color: 'var(--text-3)', cursor: 'pointer', background: 'transparent' }}
      >
        Reset
      </button>
    </div>
  );
}
