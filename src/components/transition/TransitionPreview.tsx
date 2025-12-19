'use client';

import { useState } from 'react';
import { TransitionState, buildTransitionCss } from '@/src/lib/transition';

type Props = { state: TransitionState };

export function TransitionPreview({ state }: Props) {
  const [hovered, setHovered] = useState(false);

  const cssLines = buildTransitionCss(state);
  const transitionValue = cssLines[0]?.value ?? 'all 300ms ease 0ms';

  return (
    <div
      className="w-full rounded-2xl flex flex-col items-center justify-center gap-4"
      style={{
        height: '220px',
        background: 'var(--preview-canvas)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1, #ec4899)',
          cursor: 'pointer',
          transition: transitionValue,
          transform: hovered ? 'scale(1.25) rotate(12deg)' : 'scale(1) rotate(0deg)',
          opacity: hovered ? 0.7 : 1,
          boxShadow: hovered
            ? '0 20px 40px rgba(99,102,241,0.4)'
            : '0 0 0 rgba(99,102,241,0)',
        }}
      />
      <span
        className="font-mono"
        style={{
          fontSize: '11px',
          color: 'var(--text-3)',
        }}
      >
        Hover to preview
      </span>
    </div>
  );
}
