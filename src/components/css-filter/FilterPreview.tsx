'use client';

import { FilterState, buildFilterValue } from '@/src/lib/css-filter';

export function FilterPreview({ state }: { state: FilterState }) {
  const filterValue = buildFilterValue(state);

  return (
    <div
      className="w-full rounded-xl flex items-center justify-center"
      style={{ background: 'var(--preview-canvas)', minHeight: '260px', padding: '40px' }}
      aria-label="CSS filter preview"
    >
      {/* Colorful subject that benefits from filter effects */}
      <div
        style={{
          width: '200px',
          height: '140px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #ec4899 100%)',
          filter: filterValue,
          transition: 'filter 0.05s',
          position: 'relative',
          overflow: 'hidden',
        }}
        role="img"
        aria-label={`Preview with filter: ${filterValue}`}
      >
        {/* Pattern overlay for grayscale/contrast visibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          height: '4px',
          borderRadius: '2px',
          background: 'rgba(255,255,255,0.5)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '28px',
          left: '16px',
          width: '60%',
          height: '4px',
          borderRadius: '2px',
          background: 'rgba(255,255,255,0.35)',
        }} />
      </div>
    </div>
  );
}
