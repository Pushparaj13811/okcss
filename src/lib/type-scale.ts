/*
 * Type Scale lib.
 *
 * Generates a modular type scale — a set of font sizes derived from a base
 * size multiplied/divided by a fixed ratio. Output is CSS custom properties
 * so the scale integrates into any design system.
 *
 * Named ratios come from the classic "Musical Scale" / Modular Scale tradition:
 *   https://every-layout.dev/rudiments/modular-scale/
 */

import { rf } from './rand';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScaleUnit = 'rem' | 'px';

export type TypeScaleState = {
  baseSize: number;    // px (root font size for the base step)
  ratio: number;       // multiplier between steps
  stepsUp: number;     // steps above base (xs, sm, base, lg, xl, …)
  stepsDown: number;   // steps below base
  unit: ScaleUnit;
  rootSize: number;    // px — only used when unit === 'rem', for px→rem conversion
};

// ─── Named ratios ─────────────────────────────────────────────────────────────

export type ScaleRatioName =
  | 'minor-second'
  | 'major-second'
  | 'minor-third'
  | 'major-third'
  | 'perfect-fourth'
  | 'augmented-fourth'
  | 'perfect-fifth'
  | 'golden';

export const SCALE_RATIOS: Record<ScaleRatioName, number> = {
  'minor-second':     1.067,
  'major-second':     1.125,
  'minor-third':      1.200,
  'major-third':      1.250,
  'perfect-fourth':   1.333,
  'augmented-fourth': 1.414,
  'perfect-fifth':    1.500,
  'golden':           1.618,
};

export const SCALE_RATIO_LABELS: Record<ScaleRatioName, string> = {
  'minor-second':     'Minor 2nd — 1.067',
  'major-second':     'Major 2nd — 1.125',
  'minor-third':      'Minor 3rd — 1.200',
  'major-third':      'Major 3rd — 1.250',
  'perfect-fourth':   'Perfect 4th — 1.333',
  'augmented-fourth': 'Aug. 4th — 1.414',
  'perfect-fifth':    'Perfect 5th — 1.500',
  'golden':           'Golden — 1.618',
};

// ─── Step labels ──────────────────────────────────────────────────────────────

// Names for steps relative to base (index 0 = base)
const STEP_NAMES_UP   = ['base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
const STEP_NAMES_DOWN = ['sm', 'xs', '2xs'];

export type ScaleStep = {
  name: string;
  px: number;
  rem: number;
};

// ─── Default ──────────────────────────────────────────────────────────────────

export const DEFAULT_TYPE_SCALE: TypeScaleState = {
  baseSize:  16,
  ratio:     SCALE_RATIOS['perfect-fourth'],
  stepsUp:   5,
  stepsDown: 2,
  unit:      'rem',
  rootSize:  16,
};

// ─── Compute scale ────────────────────────────────────────────────────────────

export function computeScale(s: TypeScaleState): ScaleStep[] {
  const steps: ScaleStep[] = [];

  // Steps below base (smallest first)
  for (let i = s.stepsDown; i >= 1; i--) {
    const px = s.baseSize / Math.pow(s.ratio, i);
    steps.push({
      name: STEP_NAMES_DOWN[i - 1] ?? `step-${-i}`,
      px: parseFloat(px.toFixed(3)),
      rem: parseFloat((px / s.rootSize).toFixed(4)),
    });
  }

  // Base + steps above
  for (let i = 0; i <= s.stepsUp; i++) {
    const px = s.baseSize * Math.pow(s.ratio, i);
    steps.push({
      name: STEP_NAMES_UP[i] ?? `step-${i}`,
      px: parseFloat(px.toFixed(3)),
      rem: parseFloat((px / s.rootSize).toFixed(4)),
    });
  }

  return steps;
}

// ─── Build CSS ────────────────────────────────────────────────────────────────

function formatValue(step: ScaleStep, unit: ScaleUnit): string {
  if (unit === 'rem') return `${step.rem}rem`;
  return `${Math.round(step.px)}px`;
}

export function buildTypeScaleCss(
  s: TypeScaleState,
): Array<{ property: string; value: string }> {
  return computeScale(s).map((step) => ({
    property: `--text-${step.name}`,
    value: formatValue(step, s.unit),
  }));
}

export function buildTypeScaleCopyText(s: TypeScaleState): string {
  const scale = computeScale(s);
  return [
    `:root {`,
    ...scale.map((step) => `  --text-${step.name}: ${formatValue(step, s.unit)};`),
    `}`,
  ].join('\n');
}

// ─── Randomize ────────────────────────────────────────────────────────────────

const RATIO_KEYS = Object.keys(SCALE_RATIOS) as ScaleRatioName[];

export function randomizeTypeScale(): TypeScaleState {
  const ratioKey = RATIO_KEYS[Math.floor(Math.random() * RATIO_KEYS.length)];
  return {
    baseSize:  [14, 16, 18][Math.floor(Math.random() * 3)],
    ratio:     SCALE_RATIOS[ratioKey],
    stepsUp:   Math.floor(Math.random() * 4) + 3,   // 3–6
    stepsDown: Math.floor(Math.random() * 2) + 1,   // 1–2
    unit:      Math.random() > 0.5 ? 'rem' : 'px',
    rootSize:  16,
  };
}
