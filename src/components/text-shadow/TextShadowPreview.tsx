'use client';

import { TextShadowState, buildTextShadowValue } from '@/src/lib/text-shadow';

export function TextShadowPreview({ state }: { state: TextShadowState }) {
  const shadowValue = buildTextShadowValue(state);

  return (
    <div
      className="w-full rounded-xl flex items-center justify-center"
      style={{ background: 'var(--preview-canvas)', minHeight: '260px', padding: '40px' }}
      aria-label="Text shadow preview"
    >
      <p
        className="font-mono font-bold text-center select-none"
        style={{
          fontSize: `${state.fontSize}px`,
          color: 'var(--text-1)',
          textShadow: shadowValue,
          lineHeight: 1,
          transition: 'text-shadow 0s',
        }}
        aria-hidden="true"
      >
        {state.previewText || 'Aa'}
      </p>
    </div>
  );
}
