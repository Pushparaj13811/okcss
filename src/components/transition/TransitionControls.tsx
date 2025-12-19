'use client';

import {
  TransitionState,
  TransitionLayer,
  TRANSITION_PROPERTIES,
  TRANSITION_EASINGS,
  addLayer,
  deleteLayer,
  updateLayer,
  DEFAULT_TRANSITION,
} from '@/src/lib/transition';
import { Slider } from '@/src/components/ui/Slider';
import { ToggleGroup } from '@/src/components/ui/ToggleGroup';

type Props = {
  state: TransitionState;
  onChange: (next: TransitionState) => void;
  onReset: () => void;
};

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const EASING_OPTIONS = TRANSITION_EASINGS as readonly string[];

type LayerCardProps = {
  layer: TransitionLayer;
  index: number;
  canDelete: boolean;
  onUpdate: (patch: Partial<TransitionLayer>) => void;
  onDelete: () => void;
};

function LayerCard({ layer, index, canDelete, onUpdate, onDelete }: LayerCardProps) {
  return (
    <div
      className="flex flex-col gap-4 p-3 rounded-lg"
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Layer header */}
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[10px] uppercase tracking-wide"
          style={{ color: 'var(--text-3)' }}
        >
          Layer {index + 1}
        </span>
        {canDelete && (
          <button
            onClick={onDelete}
            title="Remove layer"
            className="inline-flex items-center justify-center w-6 h-6 rounded-md transition-colors"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-3)',
              cursor: 'pointer',
            }}
            aria-label={`Remove layer ${index + 1}`}
          >
            <TrashIcon />
          </button>
        )}
      </div>

      {/* Property select */}
      <div className="flex flex-col gap-2">
        <span
          className="text-xs font-medium"
          style={{ color: 'var(--text-2)' }}
        >
          Property
        </span>
        <select
          value={layer.property}
          onChange={(e) => onUpdate({ property: e.target.value })}
          className="font-mono text-xs px-2.5 py-1.5 rounded-lg outline-none w-full"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            color: 'var(--text-1)',
            cursor: 'pointer',
          }}
        >
          {TRANSITION_PROPERTIES.map((prop) => (
            <option key={prop} value={prop}>
              {prop}
            </option>
          ))}
        </select>
      </div>

      {/* Duration slider */}
      <Slider
        id={`tr-duration-${layer.id}`}
        label="Duration"
        value={layer.duration}
        min={0}
        max={2000}
        step={10}
        unit="ms"
        onChange={(v) => onUpdate({ duration: v })}
      />

      {/* Easing toggle group */}
      <div className="flex flex-col gap-2">
        <span
          className="text-xs font-medium"
          style={{ color: 'var(--text-2)' }}
        >
          Easing
        </span>
        <ToggleGroup
          value={layer.easing}
          options={EASING_OPTIONS as string[]}
          onChange={(v) => onUpdate({ easing: v })}
          layoutId={`tr-easing-${layer.id}`}
        />
      </div>

      {/* Delay slider */}
      <Slider
        id={`tr-delay-${layer.id}`}
        label="Delay"
        value={layer.delay}
        min={0}
        max={1000}
        step={10}
        unit="ms"
        onChange={(v) => onUpdate({ delay: v })}
      />
    </div>
  );
}

export function TransitionControls({ state, onChange, onReset }: Props) {
  const canAddLayer = state.layers.length < 4;
  const canDeleteLayer = state.layers.length > 1;

  const handleUpdate = (id: string, patch: Partial<TransitionLayer>) => {
    onChange(updateLayer(state, id, patch));
  };

  const handleDelete = (id: string) => {
    onChange(deleteLayer(state, id));
  };

  const handleAddLayer = () => {
    onChange(addLayer(state));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Layer cards */}
      {state.layers.map((layer, index) => (
        <LayerCard
          key={layer.id}
          layer={layer}
          index={index}
          canDelete={canDeleteLayer}
          onUpdate={(patch) => handleUpdate(layer.id, patch)}
          onDelete={() => handleDelete(layer.id)}
        />
      ))}

      {/* Add layer button */}
      <button
        onClick={handleAddLayer}
        disabled={!canAddLayer}
        className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg font-mono text-xs transition-colors"
        style={{
          background: 'transparent',
          border: '1px dashed var(--border)',
          color: canAddLayer ? 'var(--text-2)' : 'var(--text-3)',
          cursor: canAddLayer ? 'pointer' : 'not-allowed',
          opacity: canAddLayer ? 1 : 0.5,
        }}
        aria-label="Add transition layer"
      >
        <PlusIcon />
        Add layer
        {!canAddLayer && (
          <span style={{ color: 'var(--text-3)' }}>(max 4)</span>
        )}
      </button>

      {/* Reset button */}
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

// Re-export for convenience
export { DEFAULT_TRANSITION };
