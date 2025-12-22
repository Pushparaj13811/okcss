'use client';

import { OutlineState, OutlineStyle } from '@/src/lib/outline';
import { Slider } from '@/src/components/ui/Slider';
import { ToggleGroup } from '@/src/components/ui/ToggleGroup';
import { ColorPicker } from '@/src/components/ui/ColorPicker';

type Props = {
  state: OutlineState;
  onChange: <K extends keyof OutlineState>(key: K, value: OutlineState[K]) => void;
  onReset: () => void;
};

const STYLE_OPTIONS: OutlineStyle[] = ['solid', 'dashed', 'dotted', 'double'];

export function OutlineControls({ state, onChange, onReset }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Width */}
      <Slider
        id="ol-width"
        label="Width"
        value={state.width}
        min={0}
        max={16}
        unit="px"
        onChange={(v) => onChange('width', v)}
      />

      {/* Style */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>
          Style
        </span>
        <ToggleGroup
          value={state.style}
          options={STYLE_OPTIONS}
          onChange={(v) => onChange('style', v as OutlineStyle)}
          layoutId="ol-style"
        />
      </div>

      {/* Color */}
      <ColorPicker
        label="Color"
        value={state.color}
        onChange={(v) => onChange('color', v)}
      />

      {/* Offset */}
      <Slider
        id="ol-offset"
        label="Offset"
        value={state.offset}
        min={-8}
        max={16}
        unit="px"
        onChange={(v) => onChange('offset', v)}
      />

      {/* Opacity */}
      <Slider
        id="ol-opacity"
        label="Opacity"
        value={state.opacity}
        min={0}
        max={1}
        step={0.01}
        unit=""
        onChange={(v) => onChange('opacity', v)}
      />

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-1.5 rounded-lg font-mono text-xs mt-1"
        style={{
          border: '1px solid var(--border)',
          color: 'var(--text-3)',
          cursor: 'pointer',
          background: 'transparent',
        }}
      >
        Reset
      </button>
    </div>
  );
}
