'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Slider } from '@/src/components/ui/Slider';
import { ColorPicker } from '@/src/components/ui/ColorPicker';
import { PlusIcon, TrashIcon, ResetIcon } from '@/src/components/icons';
import {
  ShadowState,
  ShadowLayer,
  SHADOW_CONTROLS,
  DEFAULT_SHADOW,
} from '@/src/lib/shadow';

// ─── Inline icons ─────────────────────────────────────────────────────────────

function EyeOnIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M1 6.5C1 6.5 3 2.5 6.5 2.5C10 2.5 12 6.5 12 6.5C12 6.5 10 10.5 6.5 10.5C3 10.5 1 6.5 1 6.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M1.5 1.5L11.5 11.5M5.2 5.3A1.5 1.5 0 0 0 8 7.8M2 4C1.5 4.6 1 5.5 1 6.5C1 6.5 3 10.5 6.5 10.5C7.4 10.5 8.2 10.3 9 9.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M4 2.7C4.8 2.6 5.6 2.5 6.5 2.5C10 2.5 12 6.5 12 6.5C12 6.5 11.5 7.4 11 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M3 9H2C1.45 9 1 8.55 1 8V2C1 1.45 1.45 1 2 1H8C8.55 1 9 1.45 9 2V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ShadowControlsProps = {
  state: ShadowState;
  onUpdateLayer: <K extends keyof ShadowLayer>(id: string, key: K, value: ShadowLayer[K]) => void;
  onAddLayer: () => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onReset: () => void;
};

// ─── Per-layer panel ──────────────────────────────────────────────────────────

type LayerPanelProps = {
  layer: ShadowLayer;
  index: number;
  total: number;
  onUpdate: <K extends keyof ShadowLayer>(key: K, value: ShadowLayer[K]) => void;
  onDelete: () => void;
  onDuplicate: () => void;
};

const iconBtn: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '26px',
  height: '26px',
  borderRadius: '6px',
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  color: 'var(--text-3)',
  flexShrink: 0,
};

function LayerPanel({ layer, index, total, onUpdate, onDelete, onDuplicate }: LayerPanelProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: layer.enabled ? 1 : 0.5, y: 0 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}
    >
      {/* Layer header */}
      <div
        className="flex items-center gap-1.5 px-3 py-2"
        style={{
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {/* Enable toggle */}
        <button
          onClick={() => onUpdate('enabled', !layer.enabled)}
          style={{ ...iconBtn, color: layer.enabled ? 'var(--text-2)' : 'var(--text-3)' }}
          aria-label={layer.enabled ? `Hide layer ${index + 1}` : `Show layer ${index + 1}`}
        >
          {layer.enabled ? <EyeOnIcon /> : <EyeOffIcon />}
        </button>

        {/* Label */}
        <span className="font-mono text-[11px] flex-1" style={{ color: 'var(--text-3)' }}>
          Layer {index + 1}
        </span>

        {/* Inset pill */}
        <button
          onClick={() => onUpdate('inset', !layer.inset)}
          className="font-mono text-[10px] px-1.5 py-0.5 rounded cursor-pointer"
          style={{
            border: '1px solid',
            borderColor: layer.inset ? 'var(--text-2)' : 'var(--border)',
            color: layer.inset ? 'var(--text-1)' : 'var(--text-3)',
            background: 'transparent',
            transition: 'all 0.12s',
          }}
          aria-pressed={layer.inset}
          aria-label="Toggle inset shadow"
        >
          inset
        </button>

        {/* Duplicate */}
        <button onClick={onDuplicate} style={iconBtn} aria-label={`Duplicate layer ${index + 1}`}>
          <DuplicateIcon />
        </button>

        {/* Delete */}
        {total > 1 && (
          <button onClick={onDelete} style={iconBtn} aria-label={`Delete layer ${index + 1}`}>
            <TrashIcon size={12} />
          </button>
        )}
      </div>

      {/* Sliders + color picker */}
      <div className="flex flex-col gap-4 p-3" style={{ background: 'var(--bg-surface)' }}>
        {SHADOW_CONTROLS.map((ctrl) => (
          <Slider
            key={ctrl.key}
            id={`shadow-${layer.id}-${ctrl.key}`}
            label={ctrl.label}
            value={layer[ctrl.key] as number}
            min={ctrl.min}
            max={ctrl.max}
            step={ctrl.step}
            unit={ctrl.unit}
            onChange={(val) => onUpdate(ctrl.key, val)}
          />
        ))}

        <ColorPicker
          label="Colour"
          value={layer.color}
          onChange={(hex) => onUpdate('color', hex)}
        />
      </div>
    </motion.div>
  );
}

// ─── ShadowControls ───────────────────────────────────────────────────────────

export function ShadowControls({
  state,
  onUpdateLayer,
  onAddLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onReset,
}: ShadowControlsProps) {
  const isDirty =
    state.layers.length !== DEFAULT_SHADOW.layers.length ||
    state.layers.some((l, i) => {
      const def = DEFAULT_SHADOW.layers[i];
      if (!def) return true;
      return (Object.keys(def) as (keyof ShadowLayer)[]).some(
        (k) => k !== 'id' && l[k] !== def[k],
      );
    });

  const canAddMore = state.layers.length < 6;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-tight" style={{ color: 'var(--text-1)' }}>
          Shadow
        </h2>
        <button
          onClick={onReset}
          disabled={!isDirty}
          className="inline-flex items-center gap-1.5 font-mono text-xs px-2 py-1 rounded-md cursor-pointer"
          style={{
            color: 'var(--text-3)',
            opacity: isDirty ? 1 : 0,
            pointerEvents: isDirty ? 'auto' : 'none',
          }}
          aria-label="Reset to defaults"
        >
          <ResetIcon size={11} />
          Reset
        </button>
      </div>

      {/* Layers */}
      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {state.layers.map((layer, i) => (
            <LayerPanel
              key={layer.id}
              layer={layer}
              index={i}
              total={state.layers.length}
              onUpdate={(key, value) => onUpdateLayer(layer.id, key, value)}
              onDelete={() => onDeleteLayer(layer.id)}
              onDuplicate={() => onDuplicateLayer(layer.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add layer */}
      {canAddMore && (
        <button
          onClick={onAddLayer}
          className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-xl font-mono text-xs cursor-pointer"
          style={{
            border: '1px dashed var(--border)',
            color: 'var(--text-3)',
            background: 'transparent',
            transition: 'border-color 0.12s, color 0.12s',
          }}
          aria-label="Add shadow layer"
        >
          <PlusIcon size={12} />
          Add layer
        </button>
      )}
    </div>
  );
}
