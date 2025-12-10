'use client';

import { GradientState, buildGradientValue } from '@/src/lib/gradient';

type GradientPreviewProps = {
  state: GradientState;
};

export function GradientPreview({ state }: GradientPreviewProps) {
  const gradient = buildGradientValue(state);

  return (
    <div
      className="w-full rounded-xl"
      style={{
        background: gradient,
        minHeight: '200px',
      }}
      role="img"
      aria-label={`Gradient preview: ${gradient}`}
    />
  );
}
