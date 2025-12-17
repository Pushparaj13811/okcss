'use client';

import { TextGradientState, buildTextGradientValue } from '@/src/lib/text-gradient';

type Props = { state: TextGradientState; previewText?: string };

export function TextGradientPreview({ state, previewText = 'Hello' }: Props) {
  const gradientValue = buildTextGradientValue(state);

  return (
    <div
      className="w-full rounded-2xl flex items-center justify-center"
      style={{
        height: '220px',
        background: 'var(--preview-canvas)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {/*
        key={gradientValue} forces React to recreate the element when the gradient
        changes — this triggers the browser to re-apply background-clip: text,
        which can otherwise get stuck on the old paint when only inline styles update.

        -webkit-text-fill-color is the correct cross-browser property for making
        text transparent in gradient-text patterns. `color: transparent` alone
        is not reliably applied by all engines when background-clip: text is active.
      */}
      <p
        key={gradientValue}
        className="font-mono font-bold select-none leading-none text-center px-6"
        style={{
          fontSize: 'clamp(48px, 10vw, 96px)',
          backgroundImage: gradientValue,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          display: 'inline-block',
        }}
      >
        {previewText || 'Hello'}
      </p>
    </div>
  );
}
