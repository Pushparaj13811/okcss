/*
 * Cubic-Bezier lib.
 *
 * Generates cubic-bezier() CSS timing functions.
 * The four control values x1,y1,x2,y2 map to:
 *   P1 = (x1, y1)  — first handle (x clamped 0–1 by CSS spec)
 *   P2 = (x2, y2)  — second handle (x clamped 0–1 by CSS spec)
 * y values can exceed [0,1] to produce overshoot/spring effects.
 */

export type CubicBezierState = {
  x1: number; // 0–1
  y1: number; // unrestricted (bounce if outside 0–1)
  x2: number; // 0–1
  y2: number;
};

// ─── Named presets ────────────────────────────────────────────────────────────

export type BezierPresetName =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'bounce-out'
  | 'back-in-out'
  | 'snappy';

export const BEZIER_PRESETS: Record<BezierPresetName, CubicBezierState> = {
  'linear':      { x1: 0,    y1: 0,    x2: 1,    y2: 1 },
  'ease':        { x1: 0.25, y1: 0.1,  x2: 0.25, y2: 1 },
  'ease-in':     { x1: 0.42, y1: 0,    x2: 1,    y2: 1 },
  'ease-out':    { x1: 0,    y1: 0,    x2: 0.58, y2: 1 },
  'ease-in-out': { x1: 0.42, y1: 0,    x2: 0.58, y2: 1 },
  'bounce-out':  { x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 },
  'back-in-out': { x1: 0.68, y1:-0.55, x2: 0.27, y2: 1.55 },
  'snappy':      { x1: 0.1,  y1: 0.7,  x2: 0.1,  y2: 1 },
};

export const BEZIER_PRESET_LABELS: Record<BezierPresetName, string> = {
  'linear':      'Linear',
  'ease':        'Ease',
  'ease-in':     'Ease In',
  'ease-out':    'Ease Out',
  'ease-in-out': 'Ease In-Out',
  'bounce-out':  'Bounce',
  'back-in-out': 'Back',
  'snappy':      'Snappy',
};

// ─── Default ──────────────────────────────────────────────────────────────────

export const DEFAULT_CUBIC_BEZIER: CubicBezierState = BEZIER_PRESETS['ease-in-out'];

// ─── Build value ──────────────────────────────────────────────────────────────

function fmt(n: number): string {
  // trim trailing zeros: 0.50 → 0.5, 1.00 → 1, 0.00 → 0
  return parseFloat(n.toFixed(2)).toString();
}

export function buildBezierValue(s: CubicBezierState): string {
  return `cubic-bezier(${fmt(s.x1)}, ${fmt(s.y1)}, ${fmt(s.x2)}, ${fmt(s.y2)})`;
}

export function buildBezierCss(
  s: CubicBezierState,
): Array<{ property: string; value: string }> {
  const val = buildBezierValue(s);
  return [
    { property: 'transition-timing-function', value: val },
    { property: 'animation-timing-function',  value: val },
  ];
}

export function buildBezierCopyText(s: CubicBezierState): string {
  const val = buildBezierValue(s);
  return [
    `transition-timing-function: ${val};`,
    `animation-timing-function: ${val};`,
    ``,
    `/* Usage example */`,
    `transition: all 0.4s ${val};`,
  ].join('\n');
}

// ─── Randomize ────────────────────────────────────────────────────────────────

export function randomizeBezier(): CubicBezierState {
  const rand = (min: number, max: number) =>
    parseFloat((Math.random() * (max - min) + min).toFixed(2));
  return {
    x1: rand(0, 1),
    y1: rand(-0.5, 1.5),
    x2: rand(0, 1),
    y2: rand(-0.5, 1.5),
  };
}
