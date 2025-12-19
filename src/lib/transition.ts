/*
 * Transition lib.
 *
 * Generates transition CSS for configurable layers, each with
 * property, duration, easing, and delay.
 */

import { ri, rPick } from './rand';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TransitionLayer = {
  id: string;
  property: string;
  duration: number; // ms, 0-2000
  easing: string;
  delay: number;    // ms, 0-1000
};

export type TransitionState = {
  layers: TransitionLayer[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const TRANSITION_PROPERTIES = [
  'all',
  'opacity',
  'transform',
  'color',
  'background-color',
  'border-color',
  'box-shadow',
  'width',
  'height',
  'margin',
  'padding',
] as const;

export const TRANSITION_EASINGS = [
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'linear',
] as const;

// ─── Tailwind mapping ─────────────────────────────────────────────────────────

const TAILWIND_PROPERTY_MAP: Record<string, string> = {
  all:              'transition-all',
  opacity:          'transition-opacity',
  transform:        'transition-transform',
  color:            'transition-colors',
  'background-color': 'transition-colors',
  'border-color':   'transition-colors',
  'box-shadow':     'transition-shadow',
};

const TAILWIND_DURATION_MAP: Record<number, string> = {
  0:    'duration-0',
  75:   'duration-75',
  100:  'duration-100',
  150:  'duration-150',
  200:  'duration-200',
  300:  'duration-300',
  500:  'duration-500',
  700:  'duration-700',
  1000: 'duration-1000',
};

const TAILWIND_EASING_MAP: Record<string, string> = {
  'ease':         'ease-in-out',
  'ease-in':      'ease-in',
  'ease-out':     'ease-out',
  'ease-in-out':  'ease-in-out',
  'linear':       'ease-linear',
};

const TAILWIND_DELAY_MAP: Record<number, string> = {
  0:    '',
  75:   'delay-75',
  100:  'delay-100',
  150:  'delay-150',
  200:  'delay-200',
  300:  'delay-300',
  500:  'delay-500',
  700:  'delay-700',
  1000: 'delay-1000',
};

function nearestKey(map: Record<number, string>, value: number): string {
  const keys = Object.keys(map).map(Number);
  const closest = keys.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
  );
  return map[closest];
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_TRANSITION: TransitionState = {
  layers: [
    {
      id: 'default-layer-1',
      property: 'all',
      duration: 300,
      easing: 'ease',
      delay: 0,
    },
  ],
};

// ─── Layer helpers ─────────────────────────────────────────────────────────────

export function addLayer(state: TransitionState): TransitionState {
  if (state.layers.length >= 4) return state;
  const newLayer: TransitionLayer = {
    id: crypto.randomUUID(),
    property: 'opacity',
    duration: 300,
    easing: 'ease',
    delay: 0,
  };
  return { ...state, layers: [...state.layers, newLayer] };
}

export function deleteLayer(state: TransitionState, id: string): TransitionState {
  if (state.layers.length <= 1) return state;
  return { ...state, layers: state.layers.filter((l) => l.id !== id) };
}

export function updateLayer(
  state: TransitionState,
  id: string,
  patch: Partial<TransitionLayer>,
): TransitionState {
  return {
    ...state,
    layers: state.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
  };
}

// ─── Build CSS ────────────────────────────────────────────────────────────────

function buildLayerValue(layer: TransitionLayer): string {
  return `${layer.property} ${layer.duration}ms ${layer.easing} ${layer.delay}ms`;
}

export function buildTransitionCss(
  s: TransitionState,
): Array<{ property: string; value: string }> {
  const value = s.layers.map(buildLayerValue).join(', ');
  return [{ property: 'transition', value }];
}

export function buildTransitionCopyText(s: TransitionState): string {
  const value = s.layers.map(buildLayerValue).join(', ');
  return `transition: ${value};`;
}

export function buildTransitionTailwind(s: TransitionState): string {
  const layer = s.layers[0];

  if (s.layers.length !== 1 || layer.property !== 'all') {
    return '/* Tailwind doesn\'t support multi-layer or property-specific transitions easily — use CSS output instead */';
  }

  const transitionClass = TAILWIND_PROPERTY_MAP[layer.property] ?? 'transition';
  const durationClass = nearestKey(TAILWIND_DURATION_MAP, layer.duration);
  const easingClass = TAILWIND_EASING_MAP[layer.easing] ?? 'ease-in-out';
  const delayClass = nearestKey(TAILWIND_DELAY_MAP, layer.delay);

  const classes = [transitionClass, durationClass, easingClass, delayClass]
    .filter(Boolean)
    .join(' ');

  return classes;
}

// ─── Randomize ────────────────────────────────────────────────────────────────

export function randomizeTransition(): TransitionState {
  const layerCount = ri(1, 3);
  const usedProperties = new Set<string>();

  const layers: TransitionLayer[] = Array.from({ length: layerCount }, () => {
    let property = rPick(TRANSITION_PROPERTIES as readonly string[]);
    // Avoid duplicate properties in the same transition
    let attempts = 0;
    while (usedProperties.has(property) && attempts < 10) {
      property = rPick(TRANSITION_PROPERTIES as readonly string[]);
      attempts++;
    }
    usedProperties.add(property);

    return {
      id: crypto.randomUUID(),
      property,
      duration: ri(100, 800),
      easing: rPick(TRANSITION_EASINGS as readonly string[]),
      delay: ri(0, 4) * 100, // 0, 100, 200, 300, or 400ms
    };
  });

  return { layers };
}
