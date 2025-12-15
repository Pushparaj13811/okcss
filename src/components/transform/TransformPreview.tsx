'use client';

import { TransformState, buildTransformValue } from '@/src/lib/transform';

export function TransformPreview({ state }: { state: TransformState }) {
  const transformValue = buildTransformValue(state);

  return (
    <div
      className="w-full rounded-xl flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--preview-canvas)', minHeight: '300px', padding: '60px' }}
      aria-label="Transform preview"
    >
      <div
        style={{
          width: '140px',
          height: '90px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          transform: transformValue,
          transition: 'transform 0.05s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        role="img"
        aria-label={`Preview with transform: ${transformValue}`}
      >
        <p className="font-mono text-[11px]" style={{ color: 'var(--text-3)' }}>
          transform
        </p>
      </div>
    </div>
  );
}
