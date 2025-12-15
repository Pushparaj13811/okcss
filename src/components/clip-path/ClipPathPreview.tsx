'use client';

import { ClipPathState, buildClipPathValue } from '@/src/lib/clip-path';

type Props = { state: ClipPathState };

export function ClipPathPreview({ state }: Props) {
  const clipPath = buildClipPathValue(state);

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
      <div
        style={{
          width: '160px',
          height: '160px',
          background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
          clipPath,
          transition: 'clip-path 0.25s ease',
        }}
      />
    </div>
  );
}
