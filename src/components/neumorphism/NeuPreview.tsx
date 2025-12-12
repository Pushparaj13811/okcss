'use client';

import { NeuState, buildNeuCss, getFaceBackground } from '@/src/lib/neumorphism';
import { lighten, darken } from '@/src/lib/color';

/*
 * NeuPreview
 *
 * Neumorphism is unique: the preview canvas MUST match the base colour.
 * The entire effect depends on the card appearing to emerge from or sink into
 * a surface of the same colour. A mismatched background breaks the illusion.
 */

type NeuPreviewProps = {
  state: NeuState;
};

export function NeuPreview({ state }: NeuPreviewProps) {
  const cssLines = buildNeuCss(state);
  const shadowLine = cssLines.find((l) => l.property === 'box-shadow');
  const faceBackground = getFaceBackground(state);

  // Canvas: same base colour, slightly lightened on edges for depth context
  const canvasBg = state.color;

  return (
    <div
      className="w-full rounded-xl flex flex-col items-center justify-center gap-6"
      style={{
        background: canvasBg,
        minHeight: '260px',
        padding: '40px',
      }}
      aria-label="Neumorphism preview"
    >
      {/* The neumorphic card */}
      <div
        style={{
          width: '160px',
          height: '100px',
          background: faceBackground,
          borderRadius: `${state.borderRadius}px`,
          boxShadow: shadowLine?.value ?? 'none',
        }}
        role="img"
        aria-label="Neumorphic card"
      />

      {/* Shadow colour reference — helps understand light/dark derivation */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-full"
            style={{
              background: lighten(state.color, state.intensity),
              border: '1px solid var(--border)',
            }}
          />
          <span className="font-mono text-[10px]" style={{ color: 'var(--text-3)' }}>
            light
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-full"
            style={{
              background: darken(state.color, state.intensity),
              border: '1px solid var(--border)',
            }}
          />
          <span className="font-mono text-[10px]" style={{ color: 'var(--text-3)' }}>
            dark
          </span>
        </div>
      </div>
    </div>
  );
}
