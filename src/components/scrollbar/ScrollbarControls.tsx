'use client';

import { ScrollbarState } from '@/src/lib/scrollbar';
import { Slider } from '@/src/components/ui/Slider';
import { ColorPicker } from '@/src/components/ui/ColorPicker';
import { ToggleGroup } from '@/src/components/ui/ToggleGroup';

type Props = {
  state: ScrollbarState;
  onChange: <K extends keyof ScrollbarState>(key: K, value: ScrollbarState[K]) => void;
  onReset: () => void;
};

export function ScrollbarControls({ state, onChange, onReset }: Props) {
  // Distinguish between "pill" (9999) and a concrete px value.
  const isPill = state.thumbRadius >= 9999;
  // The last concrete radius before switching to pill — stored as a display value.
  const concreteRadius = isPill ? 6 : state.thumbRadius;

  return (
    <div className="flex flex-col gap-5">
      <Slider
        id="sb-width"
        label="Width"
        value={state.width}
        min={2}
        max={24}
        unit="px"
        onChange={(v) => onChange('width', v)}
      />

      {/* Thumb radius: slider + pill shortcut */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>
            Thumb radius
          </span>
          <ToggleGroup
            value={isPill ? 'Pill' : 'Custom'}
            options={['Custom', 'Pill']}
            onChange={(v) => {
              if (v === 'Pill') onChange('thumbRadius', 9999);
              else onChange('thumbRadius', concreteRadius);
            }}
            layoutId="sb-radius-mode"
          />
        </div>
        {!isPill && (
          <Slider
            id="sb-radius"
            label="Radius"
            value={state.thumbRadius}
            min={0}
            max={24}
            unit="px"
            onChange={(v) => onChange('thumbRadius', v)}
          />
        )}
      </div>

      <ColorPicker label="Thumb colour" value={state.thumbColor} onChange={(c) => onChange('thumbColor', c)} />
      <ColorPicker label="Thumb hover colour" value={state.thumbHoverColor} onChange={(c) => onChange('thumbHoverColor', c)} />
      <ColorPicker label="Track colour" value={state.trackColor} onChange={(c) => onChange('trackColor', c)} />

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
