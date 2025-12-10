/*
 * Shadow lib — multi-layer box-shadow with per-layer inset support.
 *
 * The state is now an array of ShadowLayer objects. Each layer can be
 * individually enabled/disabled, toggled between inset/outset, and deleted.
 * The final CSS value joins all enabled layers with commas.
 */

import { hexToRgb } from './color';
import { ri, rf, rVibrant, rPick } from './rand';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ShadowLayer = {
  id: string;
  x: number;        // horizontal offset, px
  y: number;        // vertical offset, px
  blur: number;     // blur radius, px (≥ 0)
  spread: number;   // spread radius, px (can be negative)
  color: string;    // hex, e.g. '#000000'
  opacity: number;  // 0–1
  inset: boolean;   // prepends 'inset ' to the value
  enabled: boolean; // excluded from output when false
};

export type ShadowState = {
  layers: ShadowLayer[];
};

// ─── Factory ───────────────────────────────────────────────────────────────────

let _layerCounter = 0;

/** Creates a new layer with sensible defaults, overridable by caller. */
export function makeLayer(overrides?: Partial<Omit<ShadowLayer, 'id'>>): ShadowLayer {
  return {
    id: `layer-${++_layerCounter}`,
    x: 4,
    y: 6,
    blur: 12,
    spread: 0,
    color: '#000000',
    opacity: 0.25,
    inset: false,
    enabled: true,
    ...overrides,
  };
}

// ─── Defaults ──────────────────────────────────────────────────────────────────

export const DEFAULT_SHADOW: ShadowState = {
  layers: [makeLayer()],
};

// ─── Controls config ───────────────────────────────────────────────────────────

export const SHADOW_CONTROLS = [
  { key: 'x'       as const, label: 'Horizontal',  min: -50, max: 50,  step: 1,    unit: 'px' },
  { key: 'y'       as const, label: 'Vertical',    min: -50, max: 50,  step: 1,    unit: 'px' },
  { key: 'blur'    as const, label: 'Blur',         min: 0,   max: 100, step: 1,    unit: 'px' },
  { key: 'spread'  as const, label: 'Spread',       min: -20, max: 30,  step: 1,    unit: 'px' },
  { key: 'opacity' as const, label: 'Opacity',      min: 0,   max: 1,   step: 0.01, unit: ''   },
] as const;

// ─── CSS builders ──────────────────────────────────────────────────────────────

/** Builds a single layer's shadow value string. */
export function buildLayerValue(l: ShadowLayer): string {
  const { r, g, b } = hexToRgb(l.color);
  const op = Math.round(l.opacity * 100) / 100;
  const inset = l.inset ? 'inset ' : '';
  return `${inset}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px rgba(${r}, ${g}, ${b}, ${op})`;
}

/**
 * Joins all enabled layers into a box-shadow value string.
 * Returns 'none' if no layers are enabled.
 */
export function buildShadowValue(state: ShadowState): string {
  const active = state.layers.filter((l) => l.enabled);
  if (active.length === 0) return 'none';
  return active.map(buildLayerValue).join(',\n  ');
}

/** Full CSS declaration, ready to paste into a stylesheet. */
export function buildShadowDeclaration(state: ShadowState): string {
  return `box-shadow: ${buildShadowValue(state)};`;
}

/** Returns a randomised ShadowState with 1–3 aesthetically-plausible layers. */
export function randomizeShadow(): ShadowState {
  const count = ri(1, 3);
  const colors = [rVibrant(), rVibrant(), '#000000'];
  const layers = Array.from({ length: count }, (_, i) =>
    makeLayer({
      x: ri(-20, 20),
      y: ri(2, 24),
      blur: ri(6, 48),
      spread: ri(-6, 6),
      color: rPick(colors),
      opacity: rf(0.1, 0.5, 2),
      inset: false,
    }),
  );
  return { layers };
}

/** Tailwind arbitrary value for all enabled layers. */
export function buildShadowTailwind(state: ShadowState): string {
  const active = state.layers.filter((l) => l.enabled);
  if (active.length === 0) return 'shadow-none';
  // Tailwind arbitrary value: underscores instead of spaces, no newlines
  const val = active
    .map((l) => {
      const { r, g, b } = hexToRgb(l.color);
      const op = Math.round(l.opacity * 100) / 100;
      const inset = l.inset ? 'inset_' : '';
      return `${inset}${l.x}px_${l.y}px_${l.blur}px_${l.spread}px_rgba(${r},${g},${b},${op})`;
    })
    .join(',');
  return `shadow-[${val}]`;
}
