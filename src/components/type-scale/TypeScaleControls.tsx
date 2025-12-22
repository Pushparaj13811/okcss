'use client';

import {
  TypeScaleState,
  ScaleUnit,
  SCALE_RATIOS,
  SCALE_RATIO_LABELS,
  ScaleRatioName,
} from '@/src/lib/type-scale';
import { Slider } from '@/src/components/ui/Slider';
import { ToggleGroup } from '@/src/components/ui/ToggleGroup';

type Props = {
  state: TypeScaleState;
  onChange: <K extends keyof TypeScaleState>(key: K, value: TypeScaleState[K]) => void;
  onReset: () => void;
};

const RATIO_KEYS = Object.keys(SCALE_RATIOS) as ScaleRatioName[];

function matchRatio(ratio: number): ScaleRatioName | null {
  for (const key of RATIO_KEYS) {
    if (Math.abs(SCALE_RATIOS[key] - ratio) < 0.001) return key;
  }
  return null;
}

export function TypeScaleControls({ state, onChange, onReset }: Props) {
  const activeRatio = matchRatio(state.ratio);

  return (
    <div className="flex flex-col gap-5">
      {/* Unit toggle */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>Unit</span>
        <ToggleGroup
          value={state.unit}
          options={['rem', 'px'] as ScaleUnit[]}
          onChange={(v) => onChange('unit', v as ScaleUnit)}
          layoutId="ts-unit"
        />
      </div>

      {/* Base size */}
      <Slider
        id="ts-base"
        label="Base size"
        value={state.baseSize}
        min={12}
        max={24}
        unit="px"
        onChange={(v) => onChange('baseSize', v)}
      />

      {/* Steps up / down */}
      <Slider
        id="ts-up"
        label="Steps up"
        value={state.stepsUp}
        min={1}
        max={6}
        unit=""
        onChange={(v) => onChange('stepsUp', v)}
      />
      <Slider
        id="ts-down"
        label="Steps down"
        value={state.stepsDown}
        min={0}
        max={3}
        unit=""
        onChange={(v) => onChange('stepsDown', v)}
      />

      {/* Scale ratio presets */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>Scale ratio</span>
        <div className="flex flex-col gap-1">
          {RATIO_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => onChange('ratio', SCALE_RATIOS[key])}
              className="py-1.5 px-3 rounded-md font-mono text-[10px] text-left transition-colors"
              style={{
                background: activeRatio === key ? 'var(--text-1)' : 'var(--bg)',
                color: activeRatio === key ? 'var(--bg)' : 'var(--text-2)',
                border: `1px solid ${activeRatio === key ? 'var(--text-1)' : 'var(--border)'}`,
                cursor: 'pointer',
              }}
            >
              {SCALE_RATIO_LABELS[key]}
            </button>
          ))}
        </div>
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
