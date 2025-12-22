'use client';

import { useState } from 'react';
import { ColorPaletteState, computePalette, HARMONY_LABELS } from '@/src/lib/color-palette';

type Props = { state: ColorPaletteState };

function useCopyHex() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (hex: string) => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(hex);
      setTimeout(() => setCopied(null), 1400);
    });
  };
  return { copied, copy };
}

function luminance(hex: string): number {
  const clean = hex.replace('#', '');
  if (clean.length < 6) return 0;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

type WcagLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail';

function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

const LEVEL_COLOR: Record<WcagLevel, string> = {
  'AAA':      '#10b981',
  'AA':       '#6366f1',
  'AA Large': '#f59e0b',
  'Fail':     '#ef4444',
};

function labelColor(hex: string): string {
  return luminance(hex) > 0.35 ? '#1a1a1a' : '#ffffff';
}

export function PalettePreview({ state }: Props) {
  const swatches = computePalette(state);
  const hasShades = state.shades > 0;
  const { copied, copy } = useCopyHex();

  // Group by hue name prefix for shaded mode
  let groups: Array<{ label: string; swatches: typeof swatches }> = [];

  if (hasShades) {
    const seen = new Map<string, typeof swatches>();
    for (const sw of swatches) {
      // "primary-100" → prefix "primary"
      const prefix = sw.name.replace(/-\d+$/, '');
      if (!seen.has(prefix)) seen.set(prefix, []);
      seen.get(prefix)!.push(sw);
    }
    groups = Array.from(seen.entries()).map(([label, s]) => ({ label, swatches: s }));
  } else {
    groups = [{ label: HARMONY_LABELS[state.harmony], swatches }];
  }

  return (
    <div
      className="w-full rounded-2xl p-6 flex flex-col gap-4"
      style={{ background: 'var(--preview-canvas)', border: '1px solid var(--border)', minHeight: '220px' }}
    >
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1.5">
          {hasShades && (
            <span className="font-mono text-[10px] capitalize" style={{ color: 'var(--text-3)' }}>
              {group.label}
            </span>
          )}
          <div className="flex w-full rounded-xl overflow-hidden" style={{ height: '56px' }}>
            {group.swatches.map((sw) => (
              <button
                key={sw.name}
                onClick={() => copy(sw.hex)}
                className="flex-1 flex items-end pb-1 px-1 relative transition-opacity hover:opacity-90 active:opacity-75"
                style={{ background: sw.hex, border: 'none', cursor: 'pointer' }}
                title={`Click to copy ${sw.hex}`}
                aria-label={`Copy ${sw.hex}`}
              >
                <span
                  className="font-mono text-[8px] leading-none select-none"
                  style={{ color: labelColor(sw.hex) }}
                  aria-hidden="true"
                >
                  {copied === sw.hex ? '✓' : sw.hex}
                </span>
              </button>
            ))}
          </div>
          {/* Hex labels row */}
          <div className="flex w-full">
            {group.swatches.map((sw) => (
              <div key={sw.name} className="flex-1 flex justify-center">
                <span
                  className="font-mono text-[9px] tabular-nums"
                  style={{ color: copied === sw.hex ? 'var(--text-1)' : 'var(--text-3)' }}
                >
                  {copied === sw.hex ? 'copied!' : sw.hex}
                </span>
              </div>
            ))}
          </div>

          {/* WCAG contrast badges */}
          <div className="flex w-full gap-px">
            {group.swatches.map((sw) => {
              // Pick whichever text colour (white or black) gives better contrast
              const onWhite = contrastRatio(sw.hex, '#ffffff');
              const onBlack = contrastRatio(sw.hex, '#000000');
              const best = Math.max(onWhite, onBlack);
              const level = wcagLevel(best);
              return (
                <div key={sw.name} className="flex-1 flex justify-center" title={`${best.toFixed(1)}:1 contrast — WCAG ${level}`}>
                  <span
                    className="font-mono text-[8px] px-1 rounded"
                    style={{ color: LEVEL_COLOR[level], background: LEVEL_COLOR[level] + '18' }}
                  >
                    {level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
