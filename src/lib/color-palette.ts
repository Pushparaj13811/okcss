/*
 * Color Palette lib.
 *
 * Generates harmonious color palettes from a base hue using classical
 * color theory (complementary, analogous, triadic, etc.).
 * Also generates tints/shades for each hue.
 *
 * All output colors are hex strings. The lib works entirely in HSL.
 */

import { hslToHex, ri } from './rand';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaletteHarmony =
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'split-complementary'
  | 'triadic'
  | 'tetradic';

export type ColorPaletteState = {
  baseHue: number;       // 0–359
  saturation: number;    // 0–100
  lightness: number;     // 0–100 (lightness of the "base" swatch)
  harmony: PaletteHarmony;
  shades: number;        // how many tint/shade steps per hue (0–4)
};

export type PaletteSwatch = {
  name: string;   // e.g. "primary", "secondary", "primary-100"
  hex: string;
};

// ─── Harmony label map ────────────────────────────────────────────────────────

export const HARMONY_LABELS: Record<PaletteHarmony, string> = {
  monochromatic:          'Monochromatic',
  analogous:              'Analogous',
  complementary:          'Complementary',
  'split-complementary':  'Split Compl.',
  triadic:                'Triadic',
  tetradic:               'Tetradic',
};

// ─── Default ──────────────────────────────────────────────────────────────────

export const DEFAULT_PALETTE: ColorPaletteState = {
  baseHue:    220,
  saturation: 75,
  lightness:  55,
  harmony:    'triadic',
  shades:     3,
};

// ─── Harmony hue offsets ──────────────────────────────────────────────────────

function harmonyHues(baseHue: number, harmony: PaletteHarmony): number[] {
  const h = baseHue;
  switch (harmony) {
    case 'monochromatic':         return [h];
    case 'analogous':             return [h, (h + 30) % 360, (h - 30 + 360) % 360];
    case 'complementary':         return [h, (h + 180) % 360];
    case 'split-complementary':   return [h, (h + 150) % 360, (h + 210) % 360];
    case 'triadic':               return [h, (h + 120) % 360, (h + 240) % 360];
    case 'tetradic':              return [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360];
  }
}

const HUE_NAMES = ['primary', 'secondary', 'tertiary', 'quaternary'];

// ─── Compute palette ──────────────────────────────────────────────────────────

export function computePalette(s: ColorPaletteState): PaletteSwatch[] {
  const hues  = harmonyHues(s.baseHue, s.harmony);
  const swatches: PaletteSwatch[] = [];

  if (s.shades === 0) {
    // No tints/shades — one swatch per hue
    hues.forEach((hue, i) => {
      swatches.push({
        name: HUE_NAMES[i] ?? `color-${i + 1}`,
        hex:  hslToHex(hue, s.saturation, s.lightness),
      });
    });
  } else {
    // Generate tint–shade steps for each hue
    const steps = s.shades; // e.g. 3 → 100, 300, 500(base), 700, 900

    hues.forEach((hue, hi) => {
      const prefix = HUE_NAMES[hi] ?? `color-${hi + 1}`;
      for (let step = 0; step < steps * 2 + 1; step++) {
        // step goes 0..2*steps. Middle step (= steps) is the base lightness.
        const lightnessDelta = (step - steps) * (40 / (steps * 2));
        // Lighter steps → higher lightness; darker → lower
        const l = Math.max(10, Math.min(95, s.lightness - lightnessDelta * 1.5));
        // Slightly desaturate at extremes for natural look
        const satMod = 1 - Math.abs(step - steps) * 0.06;
        const sat = Math.max(10, Math.min(100, s.saturation * satMod));

        const shade = 100 + step * Math.floor(800 / (steps * 2));
        swatches.push({
          name: `${prefix}-${shade}`,
          hex:  hslToHex(hue, sat, l),
        });
      }
    });
  }

  return swatches;
}

// ─── Build CSS ────────────────────────────────────────────────────────────────

export function buildPaletteCss(
  s: ColorPaletteState,
): Array<{ property: string; value: string }> {
  return computePalette(s).map((sw) => ({
    property: `--${sw.name}`,
    value: sw.hex,
  }));
}

export function buildPaletteCopyText(s: ColorPaletteState): string {
  const palette = computePalette(s);
  return [
    `:root {`,
    ...palette.map((sw) => `  --${sw.name}: ${sw.hex};`),
    `}`,
  ].join('\n');
}

// ─── Randomize ────────────────────────────────────────────────────────────────

const HARMONIES: PaletteHarmony[] = [
  'monochromatic', 'analogous', 'complementary',
  'split-complementary', 'triadic', 'tetradic',
];

export function randomizePalette(): ColorPaletteState {
  return {
    baseHue:    ri(0, 359),
    saturation: ri(55, 90),
    lightness:  ri(40, 65),
    harmony:    HARMONIES[ri(0, HARMONIES.length - 1)],
    shades:     ri(0, 4),
  };
}
