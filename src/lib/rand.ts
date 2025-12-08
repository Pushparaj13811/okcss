/*
 * rand.ts — lightweight random utilities used by generator randomize() functions.
 * All functions are pure and rely only on Math.random().
 */

/** Random integer between min and max inclusive. */
export const ri = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Random float between min and max rounded to given decimal places. */
export const rf = (min: number, max: number, decimals = 2): number =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

/** Random item from an array. */
export const rPick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

/** Random vibrant hex color (high saturation, mid lightness). */
export const rVibrant = (): string => hslToHex(ri(0, 359), ri(60, 100), ri(40, 65));

/** Random pastel hex (low saturation, high lightness). */
export const rPastel = (): string => hslToHex(ri(0, 359), ri(20, 50), ri(68, 88));

/** Random dark neutral hex. */
export const rDark = (): string => hslToHex(ri(200, 260), ri(5, 20), ri(8, 25));

/** Converts HSL (0-360, 0-100, 0-100) to hex string. */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
