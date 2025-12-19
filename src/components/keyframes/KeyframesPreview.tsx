'use client';

import { useState } from 'react';
import { KeyframesState, buildKeyframesCopyText } from '@/src/lib/keyframes';

type Props = { state: KeyframesState };

export function KeyframesPreview({ state }: Props) {
  const [replayCount, setReplayCount] = useState(0);

  // Use a unique animation name per replay so React sees a truly new style element
  // and the browser restarts the animation from scratch every time.
  const uniqueName = `${state.name}-r${replayCount}`;

  // Rebuild the copy text but substitute the unique animation name
  const patchedState: KeyframesState = { ...state, name: uniqueName };
  const rawBlock = buildKeyframesCopyText(patchedState);

  // Extract just the @keyframes block from the full copy text so we can
  // inject it into a <style> tag.  The animation shorthand is applied via
  // inline style on the element itself.
  const keyframesBlock = rawBlock.split('\n\n')[0] ?? rawBlock;

  const animationValue = `${uniqueName} ${state.duration}ms ${state.easing} 0ms ${state.iterations} ${state.direction} ${state.fillMode}`;

  return (
    <div className="flex flex-col gap-3">
      {/* Canvas */}
      <div
        className="w-full rounded-2xl flex items-center justify-center"
        style={{
          height: '220px',
          background: 'var(--preview-canvas)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        {/* Inject keyframes into DOM — unique key forces React to remount the
            style tag and the browser to recognise a brand-new @keyframes rule. */}
        <style key={replayCount} data-animation-key={replayCount}>
          {keyframesBlock}
        </style>

        {/* key={replayCount} remounts the element so the animation replays */}
        <div
          key={replayCount}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            animation: animationValue,
          }}
        />
      </div>

      {/* Replay button */}
      <div className="flex justify-center">
        <button
          onClick={() => setReplayCount((c) => c + 1)}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] px-3 py-1.5 rounded-lg transition-colors select-none"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-2)',
            cursor: 'pointer',
          }}
          aria-label="Replay animation"
        >
          {/* Replay icon (↺) */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M1 4v6h6M23 20v-6h-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Replay
        </button>
      </div>
    </div>
  );
}
