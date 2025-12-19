/*
 * Keyframes lib.
 *
 * Generates CSS @keyframes animation blocks with configurable stops,
 * timing, easing, iteration, direction and fill-mode.
 */

import { ri, rf, rPick } from './rand';

// ─── Types ────────────────────────────────────────────────────────────────────

export type KeyframeStop = {
  id: string;
  offset: number;     // 0–100  (the percentage)
  opacity: number;    // 0–1
  translateX: number; // px, -100 to 100
  translateY: number; // px, -100 to 100
  scale: number;      // 0.5–2
  rotate: number;     // -180 to 180 deg
};

export type KeyframesState = {
  name: string;        // animation name, e.g. 'my-animation'
  stops: KeyframeStop[]; // always sorted by offset
  duration: number;    // ms, 100–5000
  easing: string;      // 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  iterations: string;  // '1' | '2' | '3' | 'infinite'
  direction: string;   // 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fillMode: string;    // 'none' | 'forwards' | 'backwards' | 'both'
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_KEYFRAMES: KeyframesState = {
  name: 'fadeIn',
  stops: [
    { id: 'stop-0', offset: 0,   opacity: 0, translateX: 0, translateY: -20, scale: 1, rotate: 0 },
    { id: 'stop-1', offset: 100, opacity: 1, translateX: 0, translateY: 0,   scale: 1, rotate: 0 },
  ],
  duration: 600,
  easing: 'ease-out',
  iterations: '1',
  direction: 'normal',
  fillMode: 'forwards',
};

// ─── Build helpers ────────────────────────────────────────────────────────────

/** Builds the transform string for a single keyframe stop. */
export function buildKeyframesValue(stop: KeyframeStop): string {
  return `translate(${stop.translateX}px, ${stop.translateY}px) scale(${stop.scale}) rotate(${stop.rotate}deg)`;
}

/** Returns the full @keyframes block + animation shorthand as a copy-ready string. */
export function buildKeyframesCopyText(s: KeyframesState): string {
  const sorted = [...s.stops].sort((a, b) => a.offset - b.offset);

  const stopLines = sorted
    .map((stop) => {
      const transform = buildKeyframesValue(stop);
      return `  ${stop.offset}% { opacity: ${stop.opacity}; transform: ${transform}; }`;
    })
    .join('\n');

  const animationValue = `${s.name} ${s.duration}ms ${s.easing} 0ms ${s.iterations} ${s.direction} ${s.fillMode}`;

  return `@keyframes ${s.name} {\n${stopLines}\n}\n\n.element {\n  animation: ${animationValue};\n}`;
}

/** Returns an array of {property, value} pairs for the CssOutput component. */
export function buildKeyframesCss(
  s: KeyframesState,
): Array<{ property: string; value: string }> {
  const animationValue = `${s.name} ${s.duration}ms ${s.easing} 0ms ${s.iterations} ${s.direction} ${s.fillMode}`;
  return [{ property: 'animation', value: animationValue }];
}

// ─── Randomize ────────────────────────────────────────────────────────────────

type PresetType = 'bounce' | 'spin' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'flip' | 'shake' | 'rubberBand' | 'pulse';

const PRESET_TYPES: PresetType[] = [
  'bounce', 'spin', 'slideLeft', 'slideRight', 'zoomIn', 'zoomOut', 'flip', 'shake', 'rubberBand', 'pulse',
];

const EASING_OPTIONS = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'] as const;
const ITERATION_OPTIONS = ['1', '2', '3', 'infinite'] as const;
const DIRECTION_OPTIONS = ['normal', 'reverse', 'alternate', 'alternate-reverse'] as const;
const FILL_OPTIONS = ['none', 'forwards', 'backwards', 'both'] as const;

function makeStop(id: string, offset: number, opacity: number, tx: number, ty: number, scale: number, rotate: number): KeyframeStop {
  return { id, offset, opacity, translateX: tx, translateY: ty, scale, rotate };
}

export function randomizeKeyframes(): KeyframesState {
  const preset = rPick(PRESET_TYPES);
  const duration = ri(300, 1200);
  const easing = rPick(EASING_OPTIONS);

  let name: string;
  let stops: KeyframeStop[];
  let iterations: string;
  let direction: string;
  let fillMode: string;

  switch (preset) {
    case 'bounce':
      name = 'bounce';
      stops = [
        makeStop('s0', 0,   1, 0, 0,   1,    0),
        makeStop('s1', 40,  1, 0, -ri(20, 60), rf(1.0, 1.3), 0),
        makeStop('s2', 60,  1, 0, ri(5, 20),  rf(0.85, 1.0), 0),
        makeStop('s3', 80,  1, 0, -ri(5, 20), rf(0.95, 1.1), 0),
        makeStop('s4', 100, 1, 0, 0,   1,    0),
      ];
      iterations = rPick(['1', '2', 'infinite']);
      direction = 'normal';
      fillMode = 'both';
      break;

    case 'spin':
      name = 'spin';
      stops = [
        makeStop('s0', 0,   1, 0, 0, 1, 0),
        makeStop('s1', 100, 1, 0, 0, 1, ri(1, 2) === 1 ? 360 : -360),
      ];
      iterations = rPick(['1', '2', '3', 'infinite']);
      direction = 'normal';
      fillMode = 'both';
      break;

    case 'slideLeft':
      name = 'slideLeft';
      stops = [
        makeStop('s0', 0,   0, ri(60, 120), 0, 1, 0),
        makeStop('s1', 100, 1, 0,           0, 1, 0),
      ];
      iterations = '1';
      direction = 'normal';
      fillMode = 'forwards';
      break;

    case 'slideRight':
      name = 'slideRight';
      stops = [
        makeStop('s0', 0,   0, -ri(60, 120), 0, 1, 0),
        makeStop('s1', 100, 1, 0,            0, 1, 0),
      ];
      iterations = '1';
      direction = 'normal';
      fillMode = 'forwards';
      break;

    case 'zoomIn':
      name = 'zoomIn';
      stops = [
        makeStop('s0', 0,   0, 0, 0, rf(0.3, 0.6), 0),
        makeStop('s1', 100, 1, 0, 0, 1,             0),
      ];
      iterations = '1';
      direction = 'normal';
      fillMode = 'forwards';
      break;

    case 'zoomOut':
      name = 'zoomOut';
      stops = [
        makeStop('s0', 0,   1, 0, 0, 1,             0),
        makeStop('s1', 100, 0, 0, 0, rf(0.3, 0.6),  0),
      ];
      iterations = '1';
      direction = 'normal';
      fillMode = 'forwards';
      break;

    case 'flip':
      name = 'flip';
      stops = [
        makeStop('s0', 0,   1, 0, 0, 1,          0),
        makeStop('s1', 50,  1, 0, 0, rf(1.2, 1.5), ri(80, 100)),
        makeStop('s2', 100, 1, 0, 0, 1,           180),
      ];
      iterations = rPick(['1', '2']);
      direction = 'normal';
      fillMode = 'both';
      break;

    case 'shake':
      name = 'shake';
      stops = [
        makeStop('s0', 0,   1, 0,          0, 1, 0),
        makeStop('s1', 20,  1, -ri(8, 15), 0, 1, 0),
        makeStop('s2', 40,  1, ri(8, 15),  0, 1, 0),
        makeStop('s3', 60,  1, -ri(5, 12), 0, 1, 0),
        makeStop('s4', 80,  1, ri(5, 12),  0, 1, 0),
        makeStop('s5', 100, 1, 0,          0, 1, 0),
      ];
      iterations = rPick(['1', '2']);
      direction = 'normal';
      fillMode = 'both';
      break;

    case 'rubberBand':
      name = 'rubberBand';
      stops = [
        makeStop('s0', 0,   1, 0, 0, 1,            0),
        makeStop('s1', 30,  1, 0, 0, rf(1.2, 1.5), 0),
        makeStop('s2', 60,  1, 0, 0, rf(0.7, 0.9), 0),
        makeStop('s3', 80,  1, 0, 0, rf(1.0, 1.2), 0),
        makeStop('s4', 100, 1, 0, 0, 1,            0),
      ];
      iterations = rPick(['1', '2']);
      direction = 'normal';
      fillMode = 'both';
      break;

    case 'pulse':
    default:
      name = 'pulse';
      stops = [
        makeStop('s0', 0,   1, 0, 0, 1,            0),
        makeStop('s1', 50,  1, 0, 0, rf(1.05, 1.2), 0),
        makeStop('s2', 100, 1, 0, 0, 1,            0),
      ];
      iterations = rPick(['2', '3', 'infinite']);
      direction = 'normal';
      fillMode = 'both';
      break;
  }

  return {
    name,
    stops,
    duration,
    easing,
    iterations,
    direction: direction ?? rPick(DIRECTION_OPTIONS),
    fillMode: fillMode ?? rPick(FILL_OPTIONS),
  };
}
