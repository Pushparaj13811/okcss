'use client';

import { OutlineState } from '@/src/lib/outline';

type Props = {
  state: OutlineState;
};

function hexToRgba(hex: string, opacity: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (opacity >= 1) return hex;
  return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
}

export function OutlinePreview({ state }: Props) {
  const outlineColor = hexToRgba(state.color, state.opacity);

  const outlineStyle: React.CSSProperties = {
    outline: `${state.width}px ${state.style} ${outlineColor}`,
    outlineOffset: `${state.offset}px`,
  };

  return (
    <div
      style={{
        height: '220px',
        background: 'var(--preview-canvas)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
      }}
    >
      {/* Button-like element */}
      <div
        style={{
          width: '120px',
          height: '40px',
          borderRadius: '8px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...outlineStyle,
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: 'var(--text-1)',
            userSelect: 'none',
          }}
        >
          Button
        </span>
      </div>

      {/* Text input-like element */}
      <div
        style={{
          width: '120px',
          height: '36px',
          borderRadius: '6px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '10px',
          ...outlineStyle,
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            color: 'var(--text-3)',
            userSelect: 'none',
          }}
        >
          Input
        </span>
      </div>
    </div>
  );
}
