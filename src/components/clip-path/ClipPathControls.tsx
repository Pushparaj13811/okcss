'use client';

import {
  ClipPathState,
  ClipPathType,
  POLYGON_PRESETS,
  POLYGON_PRESET_LABELS,
  PolygonPreset,
} from '@/src/lib/clip-path';
import { Slider } from '@/src/components/ui/Slider';
import { ToggleGroup } from '@/src/components/ui/ToggleGroup';

type Props = {
  state: ClipPathState;
  onChange: <K extends keyof ClipPathState>(key: K, value: ClipPathState[K]) => void;
  onReset: () => void;
};

const TYPE_OPTIONS: ClipPathType[] = ['polygon', 'circle', 'ellipse', 'inset'];
const PRESET_KEYS = Object.keys(POLYGON_PRESETS) as PolygonPreset[];

export function ClipPathControls({ state, onChange, onReset }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Shape type */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>Shape type</span>
        <ToggleGroup
          value={state.type}
          options={TYPE_OPTIONS}
          onChange={(v) => onChange('type', v as ClipPathType)}
          layoutId="cp-type"
        />
      </div>

      {/* Polygon preset grid */}
      {state.type === 'polygon' && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>Preset</span>
          <div className="grid grid-cols-3 gap-1.5">
            {PRESET_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => onChange('preset', key)}
                className="py-1.5 px-2 rounded-md font-mono text-[10px] transition-colors"
                style={{
                  background: state.preset === key ? 'var(--text-1)' : 'var(--bg)',
                  color: state.preset === key ? 'var(--bg)' : 'var(--text-2)',
                  border: `1px solid ${state.preset === key ? 'var(--text-1)' : 'var(--border)'}`,
                  cursor: 'pointer',
                }}
              >
                {POLYGON_PRESET_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Circle controls */}
      {state.type === 'circle' && (
        <>
          <Slider id="cp-cr"  label="Radius"   value={state.circleRadius} min={10} max={75} unit="%" onChange={(v) => onChange('circleRadius', v)} />
          <Slider id="cp-ccx" label="Center X"  value={state.circleCx}    min={10} max={90} unit="%" onChange={(v) => onChange('circleCx', v)} />
          <Slider id="cp-ccy" label="Center Y"  value={state.circleCy}    min={10} max={90} unit="%" onChange={(v) => onChange('circleCy', v)} />
        </>
      )}

      {/* Ellipse controls */}
      {state.type === 'ellipse' && (
        <>
          <Slider id="cp-erx" label="Radius X"  value={state.ellipseRx}  min={5}  max={75} unit="%" onChange={(v) => onChange('ellipseRx', v)} />
          <Slider id="cp-ery" label="Radius Y"  value={state.ellipseRy}  min={5}  max={75} unit="%" onChange={(v) => onChange('ellipseRy', v)} />
          <Slider id="cp-ecx" label="Center X"  value={state.ellipseCx}  min={10} max={90} unit="%" onChange={(v) => onChange('ellipseCx', v)} />
          <Slider id="cp-ecy" label="Center Y"  value={state.ellipseCy}  min={10} max={90} unit="%" onChange={(v) => onChange('ellipseCy', v)} />
        </>
      )}

      {/* Inset controls */}
      {state.type === 'inset' && (
        <>
          <Slider id="cp-it"  label="Top"           value={state.insetTop}    min={0} max={45} unit="%" onChange={(v) => onChange('insetTop', v)} />
          <Slider id="cp-ir"  label="Right"          value={state.insetRight}  min={0} max={45} unit="%" onChange={(v) => onChange('insetRight', v)} />
          <Slider id="cp-ib"  label="Bottom"         value={state.insetBottom} min={0} max={45} unit="%" onChange={(v) => onChange('insetBottom', v)} />
          <Slider id="cp-il"  label="Left"           value={state.insetLeft}   min={0} max={45} unit="%" onChange={(v) => onChange('insetLeft', v)} />
          <Slider id="cp-irad" label="Corner radius" value={state.insetRadius} min={0} max={50} unit="%" onChange={(v) => onChange('insetRadius', v)} />
        </>
      )}

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
