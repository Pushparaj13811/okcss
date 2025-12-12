'use client';

import { hexToRgb } from '@/src/lib/color';
import { GlassState } from '@/src/lib/glass';

/*
 * GlassPreview
 *
 * Glassmorphism must be previewed against a vivid background — the effect
 * is invisible on a flat color. We use a fixed CSS gradient as the canvas
 * so the frosted glass panel is always readable.
 *
 * The panel itself uses inline styles derived from the current state.
 * backdrop-filter is the core of the effect.
 */

type GlassPreviewProps = {
  state: GlassState;
};

export function GlassPreview({ state }: GlassPreviewProps) {
  const { r: br, g: bg, b: bb } = hexToRgb(state.bgColor);
  const { r: er, g: eg, b: eb } = hexToRgb(state.borderColor);
  const bgOp = Math.round(state.bgOpacity * 100) / 100;
  const boOp = Math.round(state.borderOpacity * 100) / 100;

  return (
    <div
      className="w-full rounded-xl flex items-center justify-center"
      style={{
        minHeight: '280px',
        // Vivid gradient background makes the frosted glass visible
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 45%, #ec4899 100%)',
      }}
      aria-label="Glassmorphism preview"
    >
      {/* The glass panel */}
      <div
        className="flex items-center justify-center"
        style={{
          width: '180px',
          height: '120px',
          background: `rgba(${br}, ${bg}, ${bb}, ${bgOp})`,
          backdropFilter: `blur(${state.blur}px)`,
          WebkitBackdropFilter: `blur(${state.blur}px)`,
          border: `1px solid rgba(${er}, ${eg}, ${eb}, ${boOp})`,
          borderRadius: `${state.borderRadius}px`,
        }}
        role="img"
        aria-label="Frosted glass card"
      />
    </div>
  );
}
