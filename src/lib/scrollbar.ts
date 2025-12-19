/*
 * Custom Scrollbar lib.
 *
 * Generates -webkit-scrollbar pseudo-element CSS (Chromium/Safari)
 * + modern W3C scrollbar-color / scrollbar-width (Firefox/Chrome 121+).
 */

import { ri, rVibrant } from './rand';

export type ScrollbarState = {
  width: number;        // px — scrollbar width
  thumbColor: string;   // hex
  trackColor: string;   // hex
  thumbRadius: number;  // px — border-radius of the thumb
  thumbHoverColor: string; // hex — thumb on hover
};

export const DEFAULT_SCROLLBAR: ScrollbarState = {
  width: 8,
  thumbColor: '#a1a1aa',
  trackColor: '#f4f4f5',
  thumbRadius: 9999,
  thumbHoverColor: '#71717a',
};

export function buildScrollbarCss(
  s: ScrollbarState,
): Array<{ property: string; value: string }> {
  return [
    // scrollbar-width only accepts 'auto' | 'thin' | 'none' — no pixel values.
    // Use 'thin' for narrower scrollbars (≤6 px); actual px width is webkit-only.
    { property: 'scrollbar-width',  value: s.width <= 6 ? 'thin' : 'auto' },
    { property: 'scrollbar-color',  value: `${s.thumbColor} ${s.trackColor}` },
  ];
}

/** Full CSS block including webkit pseudo-elements. */
export function buildScrollbarCopyText(s: ScrollbarState): string {
  return [
    `/* Standard (Firefox / Chrome 121+) */`,
    `scrollbar-width: ${s.width <= 6 ? 'thin' : 'auto'};`,
    `scrollbar-color: ${s.thumbColor} ${s.trackColor};`,
    ``,
    `/* WebKit (Chrome, Safari, Edge) */`,
    `&::-webkit-scrollbar {`,
    `  width: ${s.width}px;`,
    `}`,
    `&::-webkit-scrollbar-track {`,
    `  background: ${s.trackColor};`,
    `}`,
    `&::-webkit-scrollbar-thumb {`,
    `  background: ${s.thumbColor};`,
    `  border-radius: ${s.thumbRadius}px;`,
    `}`,
    `&::-webkit-scrollbar-thumb:hover {`,
    `  background: ${s.thumbHoverColor};`,
    `}`,
  ].join('\n');
}

export function randomizeScrollbar(): ScrollbarState {
  const thumb = rVibrant();
  // Either a pill (9999) or a concrete 0–12px radius — no in-between absurd values
  const thumbRadius = ri(0, 1) === 0 ? 9999 : ri(0, 12);
  return {
    width: ri(4, 16),
    thumbColor: thumb,
    trackColor: '#f4f4f5',
    thumbRadius,
    thumbHoverColor: thumb,
  };
}
