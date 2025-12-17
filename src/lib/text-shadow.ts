import { hexToRgb } from './color';
import { ri, rf, rVibrant } from './rand';

export type TextShadowState = {
  x: number;
  y: number;
  blur: number;
  color: string;
  opacity: number;
  previewText: string;
  fontSize: number;
};

export const DEFAULT_TEXT_SHADOW: TextShadowState = {
  x: 2,
  y: 2,
  blur: 8,
  color: '#000000',
  opacity: 0.35,
  previewText: 'Hello',
  fontSize: 64,
};

export const TEXT_SHADOW_CONTROLS = [
  { key: 'x'         as const, label: 'Horizontal',  min: -40, max: 40,  step: 1,    unit: 'px' },
  { key: 'y'         as const, label: 'Vertical',    min: -40, max: 40,  step: 1,    unit: 'px' },
  { key: 'blur'      as const, label: 'Blur',        min: 0,   max: 80,  step: 1,    unit: 'px' },
  { key: 'opacity'   as const, label: 'Opacity',     min: 0,   max: 1,   step: 0.01, unit: ''   },
  { key: 'fontSize'  as const, label: 'Font size',   min: 24,  max: 120, step: 1,    unit: 'px' },
] as const;

/** Returns a randomised TextShadowState. */
export function randomizeTextShadow(): TextShadowState {
  return {
    ...DEFAULT_TEXT_SHADOW,
    x: ri(-20, 20),
    y: ri(-20, 20),
    blur: ri(0, 40),
    color: rVibrant(),
    opacity: rf(0.2, 0.9, 2),
  };
}

export function buildTextShadowValue(s: TextShadowState): string {
  const { r, g, b } = hexToRgb(s.color);
  const op = Math.round(s.opacity * 100) / 100;
  return `${s.x}px ${s.y}px ${s.blur}px rgba(${r}, ${g}, ${b}, ${op})`;
}

export function buildTextShadowDeclaration(s: TextShadowState): string {
  return `text-shadow: ${buildTextShadowValue(s)};`;
}

export function buildTextShadowTailwind(s: TextShadowState): string {
  const { r, g, b } = hexToRgb(s.color);
  const op = Math.round(s.opacity * 100) / 100;
  return `[text-shadow:${s.x}px_${s.y}px_${s.blur}px_rgba(${r},${g},${b},${op})]`;
}
