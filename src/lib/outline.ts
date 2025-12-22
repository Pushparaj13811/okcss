/*
 * Outline lib.
 *
 * Generates CSS outline and outline-offset properties.
 * Useful for focus-visible styles and accessible interactive element design.
 */

import { ri, rVibrant, rPick } from './rand';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OutlineStyle =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'inset'
  | 'outset'
  | 'none';

export type OutlineState = {
  width: number;    // px, 0-16
  style: OutlineStyle;
  color: string;    // hex
  offset: number;   // px, -8 to 16 (outline-offset)
  opacity: number;  // 0-1
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_OUTLINE: OutlineState = {
  width: 2,
  style: 'solid',
  color: '#6366f1',
  offset: 2,
  opacity: 1,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a hex color + opacity to an rgba string. */
function hexToRgba(hex: string, opacity: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (opacity >= 1) return hex;
  return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
}

// ─── Build CSS ────────────────────────────────────────────────────────────────

export function buildOutlineCss(
  s: OutlineState,
): Array<{ property: string; value: string }> {
  const color = hexToRgba(s.color, s.opacity);
  return [
    { property: 'outline', value: `${s.width}px ${s.style} ${color}` },
    { property: 'outline-offset', value: `${s.offset}px` },
  ];
}

export function buildOutlineCopyText(s: OutlineState): string {
  const color = hexToRgba(s.color, s.opacity);
  return `outline: ${s.width}px ${s.style} ${color};\noutline-offset: ${s.offset}px;`;
}

// ─── Build Tailwind ────────────────────────────────────────────────────────────

/**
 * Maps outline state to Tailwind ring utilities.
 * Tailwind uses `ring-*` classes for outlines (they use box-shadow under the hood).
 * For non-standard values we use arbitrary value syntax: ring-[2px].
 */
export function buildOutlineTailwind(s: OutlineState): {
  classes: string;
  copyText: string;
} {
  const parts: string[] = [];

  // Ring width
  const ringWidthMap: Record<number, string> = {
    0: 'ring-0',
    1: 'ring-1',
    2: 'ring-2',
    4: 'ring-4',
    8: 'ring-8',
  };
  parts.push(ringWidthMap[s.width] ?? `ring-[${s.width}px]`);

  // Ring color (arbitrary value always, since we support any hex)
  const color = hexToRgba(s.color, s.opacity);
  parts.push(`ring-[${color}]`);

  // Ring offset
  const ringOffsetMap: Record<number, string> = {
    0: 'ring-offset-0',
    1: 'ring-offset-1',
    2: 'ring-offset-2',
    4: 'ring-offset-4',
    8: 'ring-offset-8',
  };
  if (s.offset >= 0) {
    parts.push(ringOffsetMap[s.offset] ?? `ring-offset-[${s.offset}px]`);
  } else {
    // Negative offsets have no Tailwind equivalent, use arbitrary
    parts.push(`ring-offset-[${s.offset}px]`);
  }

  // Ring style — only dashed/dotted have direct equivalents via ring utilities
  // For non-solid: note in classes
  if (s.style !== 'solid') {
    parts.push(`[outline-style:${s.style}]`);
  }

  const classes = parts.join(' ');
  return { classes, copyText: classes };
}

// ─── Randomize ────────────────────────────────────────────────────────────────

const OUTLINE_STYLES: OutlineStyle[] = [
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
];

export function randomizeOutline(): OutlineState {
  return {
    color: rVibrant(),
    width: ri(1, 8),
    style: rPick(OUTLINE_STYLES),
    offset: ri(0, 8),
    opacity: 1,
  };
}
