'use client';

import { KeyframesState, KeyframeStop, DEFAULT_KEYFRAMES } from '@/src/lib/keyframes';
import { Slider } from '@/src/components/ui/Slider';
import { ToggleGroup } from '@/src/components/ui/ToggleGroup';

type Props = {
  state: KeyframesState;
  onChange: <K extends keyof KeyframesState>(key: K, value: KeyframesState[K]) => void;
  onReset: () => void;
};

const EASING_OPTIONS = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'] as const;
const ITERATION_OPTIONS = ['1', '2', '3', 'infinite'] as const;
const DIRECTION_OPTIONS = ['normal', 'reverse', 'alternate', 'alternate-reverse'] as const;
const FILL_OPTIONS = ['none', 'forwards', 'backwards', 'both'] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>
      {children}
    </span>
  );
}

export function KeyframesControls({ state, onChange, onReset }: Props) {
  const updateStop = (id: string, key: keyof KeyframeStop, value: number | string) => {
    const updated = state.stops.map((stop) =>
      stop.id === id ? { ...stop, [key]: value } : stop,
    );
    // Keep stops sorted by offset after any offset edit
    const sorted = [...updated].sort((a, b) => a.offset - b.offset);
    onChange('stops', sorted);
  };

  const addStop = () => {
    const newId = `stop-${Date.now()}`;
    const newStop: KeyframeStop = {
      id: newId,
      offset: 50,
      opacity: 1,
      translateX: 0,
      translateY: 0,
      scale: 1,
      rotate: 0,
    };
    const updated = [...state.stops, newStop].sort((a, b) => a.offset - b.offset);
    onChange('stops', updated);
  };

  const removeStop = (id: string) => {
    onChange('stops', state.stops.filter((s) => s.id !== id));
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Animation name */}
      <div className="flex flex-col gap-2">
        <SectionLabel>Animation name</SectionLabel>
        <input
          type="text"
          value={state.name}
          onChange={(e) => onChange('name', e.target.value.replace(/\s+/g, '-').toLowerCase())}
          className="w-full rounded-lg px-3 py-2 font-mono text-xs"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            color: 'var(--text-1)',
            outline: 'none',
          }}
          spellCheck={false}
          aria-label="Animation name"
        />
      </div>

      {/* Duration */}
      <Slider
        id="kf-duration"
        label="Duration"
        value={state.duration}
        min={100}
        max={5000}
        step={50}
        unit="ms"
        onChange={(v) => onChange('duration', v)}
      />

      {/* Easing */}
      <div className="flex flex-col gap-2">
        <SectionLabel>Easing</SectionLabel>
        <ToggleGroup
          value={state.easing}
          options={[...EASING_OPTIONS]}
          onChange={(v) => onChange('easing', v)}
          layoutId="kf-easing"
        />
      </div>

      {/* Iterations */}
      <div className="flex flex-col gap-2">
        <SectionLabel>Iterations</SectionLabel>
        <ToggleGroup
          value={state.iterations}
          options={[...ITERATION_OPTIONS]}
          onChange={(v) => onChange('iterations', v)}
          layoutId="kf-iterations"
        />
      </div>

      {/* Direction */}
      <div className="flex flex-col gap-2">
        <SectionLabel>Direction</SectionLabel>
        <ToggleGroup
          value={state.direction}
          options={[...DIRECTION_OPTIONS]}
          onChange={(v) => onChange('direction', v)}
          layoutId="kf-direction"
        />
      </div>

      {/* Fill mode */}
      <div className="flex flex-col gap-2">
        <SectionLabel>Fill mode</SectionLabel>
        <ToggleGroup
          value={state.fillMode}
          options={[...FILL_OPTIONS]}
          onChange={(v) => onChange('fillMode', v)}
          layoutId="kf-fill"
        />
      </div>

      {/* Divider */}
      <div className="h-px w-full" style={{ background: 'var(--border)' }} />

      {/* Stops */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SectionLabel>Keyframe stops</SectionLabel>
          <button
            onClick={addStop}
            className="font-mono text-[10px] px-2 py-1 rounded-md transition-colors"
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text-2)',
              cursor: 'pointer',
            }}
          >
            + Add stop
          </button>
        </div>

        {state.stops.map((stop, index) => (
          <div
            key={stop.id}
            className="flex flex-col gap-3 rounded-lg p-3"
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
            }}
          >
            {/* Stop header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>
                Stop {index + 1}
              </span>
              {state.stops.length > 2 && (
                <button
                  onClick={() => removeStop(stop.id)}
                  className="font-mono text-[10px] px-1.5 py-0.5 rounded transition-colors"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text-3)',
                    cursor: 'pointer',
                  }}
                  aria-label={`Delete stop ${index + 1}`}
                >
                  Delete
                </button>
              )}
            </div>

            <Slider
              id={`kf-offset-${stop.id}`}
              label="Offset"
              value={stop.offset}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(v) => updateStop(stop.id, 'offset', v)}
            />
            <Slider
              id={`kf-opacity-${stop.id}`}
              label="Opacity"
              value={stop.opacity}
              min={0}
              max={1}
              step={0.01}
              unit=""
              onChange={(v) => updateStop(stop.id, 'opacity', v)}
            />
            <Slider
              id={`kf-tx-${stop.id}`}
              label="Translate X"
              value={stop.translateX}
              min={-100}
              max={100}
              step={1}
              unit="px"
              onChange={(v) => updateStop(stop.id, 'translateX', v)}
            />
            <Slider
              id={`kf-ty-${stop.id}`}
              label="Translate Y"
              value={stop.translateY}
              min={-100}
              max={100}
              step={1}
              unit="px"
              onChange={(v) => updateStop(stop.id, 'translateY', v)}
            />
            <Slider
              id={`kf-scale-${stop.id}`}
              label="Scale"
              value={stop.scale}
              min={0.5}
              max={2}
              step={0.05}
              unit=""
              onChange={(v) => updateStop(stop.id, 'scale', v)}
            />
            <Slider
              id={`kf-rotate-${stop.id}`}
              label="Rotate"
              value={stop.rotate}
              min={-180}
              max={180}
              step={1}
              unit="deg"
              onChange={(v) => updateStop(stop.id, 'rotate', v)}
            />
          </div>
        ))}
      </div>

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
