'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useGeneratorShortcuts } from '@/src/hooks/useGeneratorShortcuts';

/*
 * GeneratorLayout
 *
 * Consistent two-column layout used by every generator:
 *   Left column  — controls panel (fixed width on desktop, full-width on mobile)
 *   Right column — preview + output (flex-1)
 *
 * Props:
 *   onRandomize  — if provided, shows a Randomize button + registers `R` shortcut
 *   copyText     — if provided, registers `C` shortcut to copy to clipboard
 */

function DiceIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8"  cy="8"  r="1.5" fill="currentColor" />
      <circle cx="16" cy="8"  r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="8"  cy="16" r="1.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 7h1M7 7h1M10 7h1M4 10h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

type ShortcutRow = { key: string; description: string };

function ShortcutsPopover({ shortcuts }: { shortcuts: ShortcutRow[] }) {
  return (
    <div
      className="absolute right-0 mt-1.5 w-52 rounded-xl overflow-hidden z-50"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        top: '100%',
      }}
    >
      <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>
          Keyboard shortcuts
        </p>
      </div>
      <div className="px-3 py-2 flex flex-col gap-1.5">
        {shortcuts.map((s) => (
          <div key={s.key} className="flex items-center justify-between">
            <span className="font-mono text-[11px]" style={{ color: 'var(--text-2)' }}>{s.description}</span>
            <kbd
              className="font-mono text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-3)' }}
            >
              {s.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}

type GeneratorLayoutProps = {
  controls: ReactNode;
  preview: ReactNode;
  output: ReactNode;
  /** If provided, shows a Randomize button + registers `R` keyboard shortcut. */
  onRandomize?: () => void;
  /** If provided, registers `C` keyboard shortcut to copy to clipboard. */
  copyText?: string;
};

export function GeneratorLayout({ controls, preview, output, onRandomize, copyText }: GeneratorLayoutProps) {
  const prefersReducedMotion = useReducedMotion();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = copyText
    ? () => {
        navigator.clipboard.writeText(copyText).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }
    : undefined;

  useGeneratorShortcuts({ onRandomize, onCopy: handleCopy });

  const shortcuts: ShortcutRow[] = [
    ...(onRandomize ? [{ key: 'R', description: 'Randomize' }] : []),
    ...(copyText    ? [{ key: 'C', description: 'Copy CSS' }]  : []),
  ];

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: prefersReducedMotion ? 0 : 0.45,
      delay: prefersReducedMotion ? 0 : delay,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  });

  return (
    <div className="mx-auto max-w-5xl w-full px-6 py-10">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">

        {/* Controls panel */}
        <motion.div
          {...fadeUp(0.05)}
          className="w-full md:w-[340px] flex-shrink-0"
        >
          <div
            className="rounded-xl p-6"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
            }}
          >
            {/* Controls header: Randomize button + shortcuts hint */}
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[11px] tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
                Controls
              </span>
              <div className="flex items-center gap-1.5">
                {/* Keyboard shortcuts badge */}
                {shortcuts.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowShortcuts((v) => !v)}
                      title="Keyboard shortcuts"
                      className="inline-flex items-center justify-center w-6 h-6 rounded-md transition-colors"
                      style={{
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-3)',
                        cursor: 'pointer',
                      }}
                      aria-label="Show keyboard shortcuts"
                    >
                      <KeyboardIcon />
                    </button>
                    <AnimatePresence>
                      {showShortcuts && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.97 }}
                          transition={{ duration: 0.14 }}
                          onMouseLeave={() => setShowShortcuts(false)}
                        >
                          <ShortcutsPopover shortcuts={shortcuts} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Randomize button */}
                {onRandomize && (
                  <button
                    onClick={onRandomize}
                    title="Randomize (R)"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-md transition-colors select-none"
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-2)',
                      cursor: 'pointer',
                    }}
                  >
                    <DiceIcon />
                    Randomize
                  </button>
                )}
              </div>
            </div>
            {controls}
          </div>
        </motion.div>

        {/* Preview + output */}
        <motion.div
          {...fadeUp(0.12)}
          className="flex-1 flex flex-col gap-6 min-w-0"
        >
          {/* id="generator-preview" lets ShareBar capture this element as an image */}
          <div id="generator-preview">{preview}</div>
          {output}

          {/* Keyboard copy feedback */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs px-4 py-2 rounded-xl z-50"
                style={{ background: 'var(--text-1)', color: 'var(--bg)' }}
              >
                Copied! (C)
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}
