'use client';

import { ScrollbarState } from '@/src/lib/scrollbar';

type Props = { state: ScrollbarState };

/*
 * Why CSS custom properties instead of a dynamic <style> string?
 *
 * React 19 (used by Next.js App Router) hoists <style> tags to <head> and
 * deduplicates them — so re-rendering with new dangerouslySetInnerHTML content
 * has no effect; the browser keeps the first version.
 *
 * The solution: keep ONE static <style> block whose rules reference CSS custom
 * properties (--sb-*). The custom properties are set as inline styles on the
 * wrapper div, which React updates on every render. CSS custom properties
 * cascade into -webkit-scrollbar pseudo-elements just like any other element.
 */
const STATIC_SCROLLBAR_CSS = `
  .scrollbar-preview-box::-webkit-scrollbar {
    width: var(--sb-width);
    height: var(--sb-width);
  }
  .scrollbar-preview-box::-webkit-scrollbar-track {
    background: var(--sb-track);
    border-radius: 9999px;
  }
  .scrollbar-preview-box::-webkit-scrollbar-thumb {
    background: var(--sb-thumb);
    border-radius: var(--sb-radius);
  }
  .scrollbar-preview-box::-webkit-scrollbar-thumb:hover {
    background: var(--sb-thumb-hover);
  }
`;

export function ScrollbarPreview({ state }: Props) {
  const thumbRadius =
    state.thumbRadius >= 9999 ? '9999px' : `${state.thumbRadius}px`;

  return (
    <div
      className="w-full rounded-2xl flex items-center justify-center p-8"
      style={
        {
          height: '220px',
          background: 'var(--preview-canvas)',
          border: '1px solid var(--border)',
          // CSS custom properties — cascades into the pseudo-element rules below
          '--sb-width': `${state.width}px`,
          '--sb-thumb': state.thumbColor,
          '--sb-track': state.trackColor,
          '--sb-radius': thumbRadius,
          '--sb-thumb-hover': state.thumbHoverColor,
        } as React.CSSProperties
      }
    >
      {/* Static — content never changes, so React never re-hoists it */}
      <style>{STATIC_SCROLLBAR_CSS}</style>

      <div
        className="scrollbar-preview-box rounded-xl p-4"
        style={{
          width: '260px',
          height: '140px',
          overflowY: 'scroll',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          // Firefox / Chrome 121+ standard properties (these ARE inline, so React updates fine)
          scrollbarWidth: state.width <= 6 ? 'thin' : 'auto', // mirrors buildScrollbarCss threshold
          scrollbarColor: `${state.thumbColor} ${state.trackColor}`,
        }}
      >
        {Array.from({ length: 16 }, (_, i) => (
          <p
            key={i}
            className="font-mono text-[11px] leading-6 whitespace-nowrap"
            style={{ color: 'var(--text-3)' }}
          >
            Line {i + 1} — scroll to preview your scrollbar
          </p>
        ))}
      </div>
    </div>
  );
}
