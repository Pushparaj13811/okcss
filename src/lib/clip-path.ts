/*
 * Clip-Path lib.
 *
 * Generates clip-path CSS for polygon presets, circle, ellipse, and inset shapes.
 * All percentage values keep the shape responsive.
 */

import { ri } from './rand';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ClipPathType = 'polygon' | 'circle' | 'ellipse' | 'inset';

export type PolygonPreset =
  | 'triangle'
  | 'triangle-right'
  | 'pentagon'
  | 'hexagon'
  | 'diamond'
  | 'arrow'
  | 'chevron'
  | 'parallelogram'
  | 'star';

export type ClipPathState = {
  type: ClipPathType;
  // polygon
  preset: PolygonPreset;
  // circle
  circleRadius: number; // %
  circleCx: number;     // %
  circleCy: number;     // %
  // ellipse
  ellipseRx: number;    // %
  ellipseRy: number;    // %
  ellipseCx: number;    // %
  ellipseCy: number;    // %
  // inset
  insetTop: number;     // %
  insetRight: number;   // %
  insetBottom: number;  // %
  insetLeft: number;    // %
  insetRadius: number;  // %
};

// ─── Polygon presets ──────────────────────────────────────────────────────────

export const POLYGON_PRESETS: Record<PolygonPreset, string> = {
  triangle:         'polygon(50% 0%, 0% 100%, 100% 100%)',
  'triangle-right': 'polygon(0% 0%, 100% 50%, 0% 100%)',
  pentagon:         'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
  hexagon:          'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  diamond:          'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  arrow:            'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
  chevron:          'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%)',
  parallelogram:    'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
  star:             'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
};

export const POLYGON_PRESET_LABELS: Record<PolygonPreset, string> = {
  triangle:         'Triangle',
  'triangle-right': 'Right Arrow',
  pentagon:         'Pentagon',
  hexagon:          'Hexagon',
  diamond:          'Diamond',
  arrow:            'Arrow',
  chevron:          'Chevron',
  parallelogram:    'Parallelogram',
  star:             'Star',
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_CLIP_PATH: ClipPathState = {
  type: 'polygon',
  preset: 'hexagon',
  circleRadius: 50,
  circleCx: 50,
  circleCy: 50,
  ellipseRx: 50,
  ellipseRy: 35,
  ellipseCx: 50,
  ellipseCy: 50,
  insetTop: 10,
  insetRight: 10,
  insetBottom: 10,
  insetLeft: 10,
  insetRadius: 0,
};

// ─── Build value ──────────────────────────────────────────────────────────────

export function buildClipPathValue(s: ClipPathState): string {
  switch (s.type) {
    case 'polygon':
      return POLYGON_PRESETS[s.preset];
    case 'circle':
      return `circle(${s.circleRadius}% at ${s.circleCx}% ${s.circleCy}%)`;
    case 'ellipse':
      return `ellipse(${s.ellipseRx}% ${s.ellipseRy}% at ${s.ellipseCx}% ${s.ellipseCy}%)`;
    case 'inset':
      return s.insetRadius > 0
        ? `inset(${s.insetTop}% ${s.insetRight}% ${s.insetBottom}% ${s.insetLeft}% round ${s.insetRadius}%)`
        : `inset(${s.insetTop}% ${s.insetRight}% ${s.insetBottom}% ${s.insetLeft}%)`;
  }
}

export function buildClipPathCss(
  s: ClipPathState,
): Array<{ property: string; value: string }> {
  return [{ property: 'clip-path', value: buildClipPathValue(s) }];
}

export function buildClipPathCopyText(s: ClipPathState): string {
  return `clip-path: ${buildClipPathValue(s)};`;
}

// ─── Randomize ────────────────────────────────────────────────────────────────

const PRESET_KEYS = Object.keys(POLYGON_PRESETS) as PolygonPreset[];

export function randomizeClipPath(): ClipPathState {
  const types: ClipPathType[] = ['polygon', 'circle', 'ellipse', 'inset'];
  const type = types[ri(0, types.length - 1)];
  const preset = PRESET_KEYS[ri(0, PRESET_KEYS.length - 1)];

  return {
    type,
    preset,
    circleRadius: ri(20, 70),
    circleCx: ri(30, 70),
    circleCy: ri(30, 70),
    ellipseRx: ri(20, 65),
    ellipseRy: ri(20, 55),
    ellipseCx: ri(30, 70),
    ellipseCy: ri(30, 70),
    insetTop: ri(5, 25),
    insetRight: ri(5, 25),
    insetBottom: ri(5, 25),
    insetLeft: ri(5, 25),
    insetRadius: ri(0, 30),
  };
}
