/*
 * Text Gradient lib.
 *
 * Generates the CSS pattern for gradient text:
 *   background-image: <gradient>;
 *   -webkit-background-clip: text;
 *   background-clip: text;
 *   -webkit-text-fill-color: transparent;
 *   color: transparent;
 *
 * Uses background-image (not shorthand `background`) so it doesn't reset
 * background-clip in the same declaration block. Uses -webkit-text-fill-color
 * for cross-browser compatibility with WebKit/Blink engines.
 */

import { ri, rVibrant } from './rand';

export type TextGradientState = {
  type: 'linear' | 'radial';
  angle: number;        // degrees — only for linear
  stops: Array<{ id: string; color: string; position: number }>;
};

let _stopCounter = 0;
export function makeTextGradStop(color: string, position: number) {
  return { id: `tg-${++_stopCounter}`, color, position };
}

export const DEFAULT_TEXT_GRADIENT: TextGradientState = {
  type: 'linear',
  angle: 135,
  stops: [
    makeTextGradStop('#6366f1', 0),
    makeTextGradStop('#ec4899', 100),
  ],
};

function stopsString(stops: TextGradientState['stops']): string {
  return [...stops]
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ');
}

export function buildTextGradientValue(s: TextGradientState): string {
  const stopStr = stopsString(s.stops);
  return s.type === 'linear'
    ? `linear-gradient(${s.angle}deg, ${stopStr})`
    : `radial-gradient(circle, ${stopStr})`;
}

export function buildTextGradientCss(
  s: TextGradientState,
): Array<{ property: string; value: string }> {
  return [
    // Use background-image (not the shorthand `background`) so it doesn't
    // reset background-clip when the browser processes the declaration block.
    { property: 'background-image',        value: buildTextGradientValue(s) },
    { property: '-webkit-background-clip', value: 'text' },
    { property: 'background-clip',         value: 'text' },
    // -webkit-text-fill-color is more reliable than color: transparent
    // for gradient-text in WebKit / Blink engines.
    { property: '-webkit-text-fill-color', value: 'transparent' },
    { property: 'color',                   value: 'transparent' },
  ];
}

export function buildTextGradientCopyText(s: TextGradientState): string {
  return buildTextGradientCss(s)
    .map((l) => `${l.property}: ${l.value};`)
    .join('\n');
}

export function buildTextGradientTailwind(s: TextGradientState): string {
  const stopStr = stopsString(s.stops).replace(/ /g, '_');
  const grad =
    s.type === 'linear'
      ? `linear-gradient(${s.angle}deg,${stopStr})`
      : `radial-gradient(circle,${stopStr})`;
  return `bg-[${grad}] bg-clip-text text-transparent`;
}

export function randomizeTextGradient(): TextGradientState {
  const count = ri(2, 4);
  const stops = Array.from({ length: count }, (_, i) => ({
    id: `tg-r${i}`,
    color: rVibrant(),
    position: Math.round((i / (count - 1)) * 100),
  }));
  return {
    type: ri(0, 1) === 0 ? 'linear' : 'radial',
    angle: ri(0, 359),
    stops,
  };
}
