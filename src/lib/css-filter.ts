import { ri, rf } from './rand';

export type FilterState = {
  blur: number;       // px, 0-20
  brightness: number; // %, 0-200 (100 = normal)
  contrast: number;   // %, 0-200 (100 = normal)
  grayscale: number;  // %, 0-100
  hueRotate: number;  // deg, 0-360
  invert: number;     // %, 0-100
  saturate: number;   // %, 0-200 (100 = normal)
  sepia: number;      // %, 0-100
};

export const DEFAULT_FILTER: FilterState = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
  saturate: 100,
  sepia: 0,
};

export const FILTER_CONTROLS = [
  { key: 'blur'       as const, label: 'Blur',        min: 0,   max: 20,  step: 0.5, unit: 'px'  },
  { key: 'brightness' as const, label: 'Brightness',  min: 0,   max: 200, step: 1,   unit: '%'   },
  { key: 'contrast'   as const, label: 'Contrast',    min: 0,   max: 200, step: 1,   unit: '%'   },
  { key: 'grayscale'  as const, label: 'Grayscale',   min: 0,   max: 100, step: 1,   unit: '%'   },
  { key: 'hueRotate'  as const, label: 'Hue rotate',  min: 0,   max: 360, step: 1,   unit: '°'   },
  { key: 'invert'     as const, label: 'Invert',      min: 0,   max: 100, step: 1,   unit: '%'   },
  { key: 'saturate'   as const, label: 'Saturate',    min: 0,   max: 200, step: 1,   unit: '%'   },
  { key: 'sepia'      as const, label: 'Sepia',       min: 0,   max: 100, step: 1,   unit: '%'   },
] as const;

/** Returns a randomised FilterState with aesthetically safe bounds. */
export function randomizeFilter(): FilterState {
  return {
    blur: rf(0, 4, 1),
    brightness: ri(80, 140),
    contrast: ri(80, 130),
    grayscale: ri(0, 1) === 0 ? ri(0, 100) : 0,
    hueRotate: ri(0, 359),
    invert: 0,
    saturate: ri(60, 180),
    sepia: ri(0, 1) === 0 ? ri(0, 60) : 0,
  };
}

function isDefault(key: keyof FilterState, value: number): boolean {
  return DEFAULT_FILTER[key] === value;
}

export function buildFilterValue(s: FilterState): string {
  const parts: string[] = [];
  if (!isDefault('blur', s.blur))             parts.push(`blur(${s.blur}px)`);
  if (!isDefault('brightness', s.brightness)) parts.push(`brightness(${s.brightness}%)`);
  if (!isDefault('contrast', s.contrast))     parts.push(`contrast(${s.contrast}%)`);
  if (!isDefault('grayscale', s.grayscale))   parts.push(`grayscale(${s.grayscale}%)`);
  if (!isDefault('hueRotate', s.hueRotate))   parts.push(`hue-rotate(${s.hueRotate}deg)`);
  if (!isDefault('invert', s.invert))         parts.push(`invert(${s.invert}%)`);
  if (!isDefault('saturate', s.saturate))     parts.push(`saturate(${s.saturate}%)`);
  if (!isDefault('sepia', s.sepia))           parts.push(`sepia(${s.sepia}%)`);
  return parts.length > 0 ? parts.join(' ') : 'none';
}

export function buildFilterCss(
  s: FilterState,
): Array<{ property: string; value: string }> {
  return [{ property: 'filter', value: buildFilterValue(s) }];
}

export function buildFilterCopyText(s: FilterState): string {
  return `filter: ${buildFilterValue(s)};`;
}

export function buildFilterTailwind(s: FilterState): string {
  const parts: string[] = [];
  if (!isDefault('blur', s.blur))             parts.push(`blur-[${s.blur}px]`);
  if (!isDefault('brightness', s.brightness)) parts.push(`brightness-[${s.brightness}%]`);
  if (!isDefault('contrast', s.contrast))     parts.push(`contrast-[${s.contrast}%]`);
  if (!isDefault('grayscale', s.grayscale))   parts.push(`grayscale`);
  if (!isDefault('hueRotate', s.hueRotate))   parts.push(`hue-rotate-[${s.hueRotate}deg]`);
  if (!isDefault('invert', s.invert))         parts.push(`invert`);
  if (!isDefault('saturate', s.saturate))     parts.push(`saturate-[${s.saturate}%]`);
  if (!isDefault('sepia', s.sepia))           parts.push(`sepia`);
  return parts.length > 0 ? parts.join(' ') : 'filter-none';
}
