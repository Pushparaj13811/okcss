import { lighten, darken } from './color';
import { ri, rPastel, rPick } from './rand';

export type NeuShape = 'flat' | 'concave' | 'convex' | 'pressed';

export type NeuState = {
  color: string;        // base hex — the background AND the panel colour
  distance: number;     // shadow offset distance, px
  blur: number;         // shadow blur radius, px
  intensity: number;    // 0–100 — how much lighter/darker the shadows are
  borderRadius: number; // px
  shape: NeuShape;
};

export const DEFAULT_NEU: NeuState = {
  color: '#e0e5ec',
  distance: 8,
  blur: 16,
  intensity: 15,
  borderRadius: 16,
  shape: 'flat',
};

export const NEU_CONTROLS = [
  { key: 'distance'     as const, label: 'Shadow distance', min: 1,  max: 50,  step: 1,  unit: 'px' },
  { key: 'blur'         as const, label: 'Shadow blur',     min: 2,  max: 100, step: 1,  unit: 'px' },
  { key: 'intensity'    as const, label: 'Intensity',       min: 1,  max: 40,  step: 1,  unit: ''   },
  { key: 'borderRadius' as const, label: 'Border radius',   min: 0,  max: 50,  step: 1,  unit: 'px' },
] as const;

export const NEU_SHAPES: { value: NeuShape; label: string }[] = [
  { value: 'flat',     label: 'Flat' },
  { value: 'concave',  label: 'Concave' },
  { value: 'convex',   label: 'Convex' },
  { value: 'pressed',  label: 'Pressed' },
];

/** Returns a randomised NeuState. */
export function randomizeNeu(): NeuState {
  return {
    color: rPastel(),
    distance: ri(4, 24),
    blur: ri(8, 40),
    intensity: ri(8, 30),
    borderRadius: ri(8, 48),
    shape: rPick(['flat', 'concave', 'convex', 'pressed'] as const),
  };
}

// ─── CSS builders ─────────────────────────────────────────────────────────────

/** Computes the two shadow colours based on the base colour and intensity. */
function shadowColors(color: string, intensity: number): { light: string; dark: string } {
  return {
    light: lighten(color, intensity),
    dark: darken(color, intensity),
  };
}

/** Returns the inner/face background based on shape. */
export function getFaceBackground(s: NeuState): string {
  const { light, dark } = shadowColors(s.color, s.intensity);
  if (s.shape === 'concave') {
    return `linear-gradient(145deg, ${dark}, ${light})`;
  }
  if (s.shape === 'convex') {
    return `linear-gradient(145deg, ${light}, ${dark})`;
  }
  // flat and pressed: same as base
  return s.color;
}

export function buildNeuCss(
  s: NeuState,
): Array<{ property: string; value: string }> {
  const { light, dark } = shadowColors(s.color, s.intensity);
  const { distance: d, blur, borderRadius } = s;

  let shadow: string;
  if (s.shape === 'pressed') {
    // Inset shadows give the "pushed in" feel
    shadow = `inset ${d}px ${d}px ${blur}px ${dark}, inset -${d}px -${d}px ${blur}px ${light}`;
  } else {
    // Standard dual shadow — light top-left, dark bottom-right
    shadow = `${d}px ${d}px ${blur}px ${dark}, -${d}px -${d}px ${blur}px ${light}`;
  }

  const lines: Array<{ property: string; value: string }> = [
    { property: 'background', value: getFaceBackground(s) },
    { property: 'border-radius', value: `${borderRadius}px` },
    { property: 'box-shadow', value: shadow },
  ];

  return lines;
}

export function buildNeuCopyText(s: NeuState): string {
  return buildNeuCss(s)
    .map((l) => `${l.property}: ${l.value};`)
    .join('\n');
}

export function buildNeuTailwind(s: NeuState): string {
  const { light, dark } = shadowColors(s.color, s.intensity);
  const { distance: d, blur, borderRadius } = s;

  const shadow =
    s.shape === 'pressed'
      ? `shadow-[inset_${d}px_${d}px_${blur}px_${dark},inset_-${d}px_-${d}px_${blur}px_${light}]`
      : `shadow-[${d}px_${d}px_${blur}px_${dark},-${d}px_-${d}px_${blur}px_${light}]`;

  return `bg-[${s.color}] rounded-[${borderRadius}px] ${shadow}`;
}
