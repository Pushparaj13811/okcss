'use client';

import {
  CubicBezierState,
  BEZIER_PRESETS,
  BEZIER_PRESET_LABELS,
  BezierPresetName,
} from '@/src/lib/cubic-bezier';
import { Slider } from '@/src/components/ui/Slider';

type Props = {
  state: CubicBezierState;
  onChange: (patch: Partial<CubicBezierState>) => void;
  onReset: () => void;
};

const PRESET_KEYS = Object.keys(BEZIER_PRESETS) as BezierPresetName[];

function matchesPreset(state: CubicBezierState): BezierPresetName | null {
  for (const key of PRESET_KEYS) {
    const p = BEZIER_PRESETS[key];
    if (
      Math.abs(p.x1 - state.x1) < 0.01 &&
      Math.abs(p.y1 - state.y1) < 0.01 &&
      Math.abs(p.x2 - state.x2) < 0.01 &&
      Math.abs(p.y2 - state.y2) < 0.01
    ) {
      return key;
    }
  }
  return null;
}

export function CubicBezierControls({ state, onChange, onReset }: Props) {
  const activePreset = matchesPreset(state);

  return (
    <div className="flex flex-col gap-5">
      {/* Presets */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>Presets</span>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESET_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => onChange(BEZIER_PRESETS[key])}
              className="py-1.5 px-2 rounded-md font-mono text-[10px] transition-colors text-left"
              style={{
                background: activePreset === key ? 'var(--text-1)' : 'var(--bg)',
                color: activePreset === key ? 'var(--bg)' : 'var(--text-2)',
                border: `1px solid ${activePreset === key ? 'var(--text-1)' : 'var(--border)'}`,
                cursor: 'pointer',
              }}
            >
              {BEZIER_PRESET_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px w-full" style={{ background: 'var(--border-subtle)' }} />

      {/* Fine-tune sliders */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium mb-2" style={{ color: 'var(--text-2)' }}>Fine-tune</span>
        <Slider id="cb-x1" label="X1" value={state.x1} min={0} max={1} step={0.01} unit="" onChange={(v) => onChange({ x1: v })} />
        <Slider id="cb-y1" label="Y1" value={state.y1} min={-1} max={2} step={0.01} unit="" onChange={(v) => onChange({ y1: v })} />
        <Slider id="cb-x2" label="X2" value={state.x2} min={0} max={1} step={0.01} unit="" onChange={(v) => onChange({ x2: v })} />
        <Slider id="cb-y2" label="Y2" value={state.y2} min={-1} max={2} step={0.01} unit="" onChange={(v) => onChange({ y2: v })} />
      </div>

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
