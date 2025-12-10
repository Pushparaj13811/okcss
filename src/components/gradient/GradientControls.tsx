'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Slider } from '@/src/components/ui/Slider';
import { ColorPicker } from '@/src/components/ui/ColorPicker';
import { ToggleGroup } from '@/src/components/ui/ToggleGroup';
import { PlusIcon, TrashIcon, ResetIcon } from '@/src/components/icons';
import {
  GradientState,
  GradientType,
  ColorStop,
  DEFAULT_GRADIENT,
  makeStop,
} from '@/src/lib/gradient';

const MAX_STOPS = 6;

type GradientControlsProps = {
  state: GradientState;
  onChange: <K extends keyof GradientState>(key: K, value: GradientState[K]) => void;
  onReset: () => void;
};

export function GradientControls({ state, onChange, onReset }: GradientControlsProps) {
  const prefersReducedMotion = useReducedMotion();

  const isDirty =
    state.type !== DEFAULT_GRADIENT.type ||
    state.angle !== DEFAULT_GRADIENT.angle ||
    state.stops.length !== DEFAULT_GRADIENT.stops.length;

  const updateStop = (id: string, patch: Partial<ColorStop>) => {
    onChange(
      'stops',
      state.stops.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  };

  const addStop = () => {
    if (state.stops.length >= MAX_STOPS) return;
    // Insert a new stop in the middle of the range
    const mid = 50;
    onChange('stops', [...state.stops, makeStop('#a78bfa', mid)]);
  };

  const removeStop = (id: string) => {
    if (state.stops.length <= 2) return;
    onChange('stops', state.stops.filter((s) => s.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-tight" style={{ color: 'var(--text-1)' }}>
          Gradient
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

      {/* Type toggle */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>
          Type
        </span>
        <ToggleGroup<GradientType>
          value={state.type}
          options={['linear', 'radial', 'conic']}
          onChange={(t) => onChange('type', t)}
          layoutId="gradient-type-toggle"
        />
      </div>

      {/* Angle slider — for linear and conic */}
      <AnimatePresence initial={false}>
        {(state.type === 'linear' || state.type === 'conic') && (
          <motion.div
            key="angle"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <Slider
              id="gradient-angle"
              label="Angle"
              value={state.angle}
              min={0}
              max={360}
              step={1}
              unit="°"
              onChange={(v) => onChange('angle', v)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-px w-full" style={{ background: 'var(--border-subtle)' }} aria-hidden="true" />

      {/* Color stops */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>
            Colour stops
          </span>
          <button
            onClick={addStop}
            disabled={state.stops.length >= MAX_STOPS}
            className="inline-flex items-center gap-1.5 font-mono text-xs px-2 py-1 rounded-md cursor-pointer disabled:opacity-30"
            style={{ color: 'var(--text-3)' }}
            aria-label="Add colour stop"
          >
            <PlusIcon size={11} />
            Add
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {state.stops.map((stop) => (
              <motion.div
                key={stop.id}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: 'easeOut' }}
                className="flex flex-col gap-3"
              >
                {/* Stop row: color swatch + position slider + remove */}
                <div className="flex items-end gap-3">
                  {/* Compact color swatch only — no hex text for stop colours (space limited) */}
                  <div className="flex-shrink-0 flex flex-col gap-1.5">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>
                      Colour
                    </span>
                    <label className="cursor-pointer">
                      <div
                        className="w-8 h-8 rounded-md"
                        style={{ background: stop.color, border: '1.5px solid var(--border)' }}
                      />
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  {/* Position slider */}
                  <div className="flex-1">
                    <Slider
                      id={`stop-pos-${stop.id}`}
                      label="Position"
                      value={stop.position}
                      min={0}
                      max={100}
                      step={1}
                      unit="%"
                      onChange={(v) => updateStop(stop.id, { position: v })}
                    />
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeStop(stop.id)}
                    disabled={state.stops.length <= 2}
                    className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md cursor-pointer disabled:opacity-20 mb-0.5"
                    style={{ color: 'var(--text-3)' }}
                    aria-label="Remove stop"
                  >
                    <TrashIcon size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
