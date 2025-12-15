'use client';

import { BorderRadiusState, buildBorderRadiusValue } from '@/src/lib/border-radius';

export function BorderRadiusPreview({ state }: { state: BorderRadiusState }) {
  const value = buildBorderRadiusValue(state);
  const { topLeft: tl, topRight: tr, bottomRight: br, bottomLeft: bl } = state;
  const individual = state.mode === 'individual';

  return (
    <div
      className="w-full rounded-xl flex items-center justify-center relative"
      style={{ background: 'var(--preview-canvas)', minHeight: '260px', padding: '40px' }}
      aria-label="Border radius preview"
    >
      <div
        style={{
          width: '180px',
          height: '120px',
          background: 'var(--bg-surface)',
          border: '2px solid var(--border)',
          borderRadius: value,
        }}
        role="img"
        aria-label={`Element with border-radius: ${value}`}
      />

      {/* Corner labels (individual mode only) */}
      {individual && (
        <>
          <span className="absolute top-4 left-4 font-mono text-[9px]" style={{ color: 'var(--text-3)' }}>{tl}px</span>
          <span className="absolute top-4 right-4 font-mono text-[9px]" style={{ color: 'var(--text-3)' }}>{tr}px</span>
          <span className="absolute bottom-4 right-4 font-mono text-[9px]" style={{ color: 'var(--text-3)' }}>{br}px</span>
          <span className="absolute bottom-4 left-4 font-mono text-[9px]" style={{ color: 'var(--text-3)' }}>{bl}px</span>
        </>
      )}
    </div>
  );
}
