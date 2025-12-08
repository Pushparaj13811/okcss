/*
 * Color utilities for okcss.
 * Kept pure — no side effects, no DOM access.
 */

// ─── Hex ↔ RGB ────────────────────────────────────────────────────────────────

/** Converts a 6-digit hex string (with or without #) to { r, g, b }. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

/** Converts { r, g, b } (0–255) to a '#rrggbb' hex string. */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0'))
      .join('')
  );
}

// ─── Hex ↔ HSL ────────────────────────────────────────────────────────────────

/** Converts a hex color to { h: 0–360, s: 0–100, l: 0–100 }. */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  h /= 6;

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/** Converts { h: 0–360, s: 0–100, l: 0–100 } to a '#rrggbb' hex string. */
export function hslToHex(h: number, s: number, l: number): string {
  const ln = l / 100;
  const sn = s / 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) =>
    ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return rgbToHex(
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  );
}

// ─── Lightness manipulation ───────────────────────────────────────────────────

/** Lightens a hex colour by `amount` (0–100 lightness units). */
export function lighten(hex: string, amount: number): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, s, Math.min(100, l + amount));
}

/** Darkens a hex colour by `amount` (0–100 lightness units). */
export function darken(hex: string, amount: number): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, l - amount));
}

// ─── Validation ───────────────────────────────────────────────────────────────

/** Returns true if the string is a valid 6-digit hex color (# optional). */
export function isValidHex(value: string): boolean {
  return /^#?[0-9a-fA-F]{6}$/.test(value);
}

/** Normalises any valid hex input to a '#xxxxxx' lowercase string. */
export function normaliseHex(value: string): string {
  const clean = value.startsWith('#') ? value : `#${value}`;
  return clean.toLowerCase();
}
