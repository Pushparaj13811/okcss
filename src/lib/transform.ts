import { ri, rf } from './rand';

export type TransformState = {
  rotate: number;     // deg
  scaleX: number;     // multiplier
  scaleY: number;     // multiplier
  translateX: number; // px
  translateY: number; // px
  skewX: number;      // deg
  skewY: number;      // deg
};

export const DEFAULT_TRANSFORM: TransformState = {
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  skewX: 0,
  skewY: 0,
};

export const TRANSFORM_CONTROLS = [
  { key: 'rotate'     as const, label: 'Rotate',      min: -180, max: 180,  step: 1,   unit: '°'  },
  { key: 'scaleX'     as const, label: 'Scale X',     min: 0.1,  max: 3,    step: 0.05, unit: 'x' },
  { key: 'scaleY'     as const, label: 'Scale Y',     min: 0.1,  max: 3,    step: 0.05, unit: 'x' },
  { key: 'translateX' as const, label: 'Translate X', min: -120, max: 120,  step: 1,   unit: 'px' },
  { key: 'translateY' as const, label: 'Translate Y', min: -120, max: 120,  step: 1,   unit: 'px' },
  { key: 'skewX'      as const, label: 'Skew X',      min: -45,  max: 45,   step: 1,   unit: '°'  },
  { key: 'skewY'      as const, label: 'Skew Y',      min: -45,  max: 45,   step: 1,   unit: '°'  },
] as const;

/** Returns a randomised TransformState with plausible values. */
export function randomizeTransform(): TransformState {
  return {
    rotate: ri(-45, 45),
    scaleX: rf(0.6, 1.6, 2),
    scaleY: rf(0.6, 1.6, 2),
    translateX: ri(-60, 60),
    translateY: ri(-60, 60),
    skewX: ri(-20, 20),
    skewY: ri(-20, 20),
  };
}

function round(n: number, d = 3) {
  return parseFloat(n.toFixed(d));
}

function isDefault(key: keyof TransformState, value: number): boolean {
  return DEFAULT_TRANSFORM[key] === value;
}

export function buildTransformValue(s: TransformState): string {
  const parts: string[] = [];
  if (!isDefault('rotate', s.rotate))         parts.push(`rotate(${s.rotate}deg)`);
  if (!isDefault('scaleX', s.scaleX) || !isDefault('scaleY', s.scaleY)) {
    if (s.scaleX === s.scaleY) parts.push(`scale(${round(s.scaleX)})`);
    else parts.push(`scaleX(${round(s.scaleX)}) scaleY(${round(s.scaleY)})`);
  }
  if (!isDefault('translateX', s.translateX) || !isDefault('translateY', s.translateY)) {
    parts.push(`translate(${s.translateX}px, ${s.translateY}px)`);
  }
  if (!isDefault('skewX', s.skewX) || !isDefault('skewY', s.skewY)) {
    parts.push(`skew(${s.skewX}deg, ${s.skewY}deg)`);
  }
  return parts.length > 0 ? parts.join(' ') : 'none';
}

export function buildTransformCss(
  s: TransformState,
): Array<{ property: string; value: string }> {
  return [{ property: 'transform', value: buildTransformValue(s) }];
}

export function buildTransformCopyText(s: TransformState): string {
  return `transform: ${buildTransformValue(s)};`;
}

export function buildTransformTailwind(s: TransformState): string {
  const parts: string[] = [];
  if (!isDefault('rotate', s.rotate))         parts.push(`rotate-[${s.rotate}deg]`);
  if (!isDefault('scaleX', s.scaleX))         parts.push(`scale-x-[${round(s.scaleX)}]`);
  if (!isDefault('scaleY', s.scaleY))         parts.push(`scale-y-[${round(s.scaleY)}]`);
  if (!isDefault('translateX', s.translateX)) parts.push(`translate-x-[${s.translateX}px]`);
  if (!isDefault('translateY', s.translateY)) parts.push(`translate-y-[${s.translateY}px]`);
  if (!isDefault('skewX', s.skewX))           parts.push(`skew-x-[${s.skewX}deg]`);
  if (!isDefault('skewY', s.skewY))           parts.push(`skew-y-[${s.skewY}deg]`);
  return parts.length > 0 ? parts.join(' ') : '';
}
