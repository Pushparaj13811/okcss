'use client';

import {
  ColorPaletteState,
  PaletteHarmony,
  HARMONY_LABELS,
} from '@/src/lib/color-palette';
import { Slider } from '@/src/components/ui/Slider';

type Props = {
  state: ColorPaletteState;
  onChange: <K extends keyof ColorPaletteState>(key: K, value: ColorPaletteState[K]) => void;
  onReset: () => void;
};

const HARMONIES = Object.keys(HARMONY_LABELS) as PaletteHarmony[];

export function PaletteControls({ state, onChange, onReset }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Hue wheel — using a gradient input trick */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>Base hue</span>
          <span className="font-mono text-xs tabular-nums" style={{ color: 'var(--text-1)' }}>{state.baseHue}°</span>
        </div>
        <input
          type="range"
          min={0}
          max={359}
          value={state.baseHue}
          onChange={(e) => onChange('baseHue', Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
            outline: 'none',
            border: 'none',
          }}
          aria-label="Base hue"
        />
      </div>

      <Slider id="pal-sat"  label="Saturation" value={state.saturation} min={0} max={100} unit="%" onChange={(v) => onChange('saturation', v)} />
      <Slider id="pal-lig"  label="Lightness"  value={state.lightness}  min={20} max={80} unit="%" onChange={(v) => onChange('lightness', v)} />
      <Slider id="pal-shd"  label="Shades"     value={state.shades}     min={0}  max={4}  unit=""  onChange={(v) => onChange('shades', v)} />

      {/* Harmony picker */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>Harmony</span>
        <div className="grid grid-cols-2 gap-1.5">
          {HARMONIES.map((h) => (
            <button
              key={h}
              onClick={() => onChange('harmony', h)}
              className="py-1.5 px-2 rounded-md font-mono text-[10px] transition-colors text-left"
              style={{
                background: state.harmony === h ? 'var(--text-1)' : 'var(--bg)',
                color: state.harmony === h ? 'var(--bg)' : 'var(--text-2)',
                border: `1px solid ${state.harmony === h ? 'var(--text-1)' : 'var(--border)'}`,
                cursor: 'pointer',
              }}
            >
              {HARMONY_LABELS[h]}
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
