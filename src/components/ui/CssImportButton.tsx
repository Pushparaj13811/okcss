'use client';

/*
 * CssImportButton
 *
 * A small button that opens a modal where the user can paste any CSS snippet.
 * The paste is parsed and the result is passed to `onImport(parsed)`.
 *
 * Usage:
 *   <CssImportButton onImport={(props) => {
 *     const partial = shadowFromCss(props);
 *     if (partial) setState(s => ({ ...s, ...partial }));
 *   }} />
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseCssProps } from '@/src/lib/css-import';

type Props = {
  /** Called with the parsed property map. Return false to signal parse failure. */
  onImport: (props: Record<string, string>) => boolean | void;
  /** Label shown on the trigger button. Default: "Import CSS" */
  label?: string;
};

export function CssImportButton({ onImport, label = 'Import CSS' }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 60);
    else { setText(''); setStatus('idle'); }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleImport = () => {
    if (!text.trim()) return;
    const props = parseCssProps(text);
    const result = onImport(props);
    if (result === false) {
      setStatus('err');
      setTimeout(() => setStatus('idle'), 2000);
    } else {
      setStatus('ok');
      setTimeout(() => { setOpen(false); }, 600);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-md cursor-pointer"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-3)' }}
        title="Paste existing CSS to auto-populate controls"
      >
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 2h6l3 3v7H2V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M8 2v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M5 7h4M5 9.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        {label}
      </button>

      {/* Modal backdrop + dialog */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="css-import-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-lg rounded-2xl p-5 flex flex-col gap-4"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-mono text-sm font-medium" style={{ color: 'var(--text-1)' }}>
                    Import CSS
                  </h2>
                  <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>
                    Paste any CSS — bare declarations, a selector block, or CSS variables
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-7 h-7 rounded-md cursor-pointer"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-3)' }}
                  aria-label="Close"
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => { setText(e.target.value); setStatus('idle'); }}
                placeholder={`box-shadow: 0 4px 24px rgba(0,0,0,0.2);\n/* or */\n.card {\n  box-shadow: 0 4px 24px rgba(0,0,0,0.2);\n}\n/* or */\n:root {\n  --box-shadow: 0 4px 24px rgba(0,0,0,0.2);\n}`}
                rows={8}
                className="w-full font-mono text-[12px] rounded-lg px-3 py-2.5 resize-none outline-none"
                style={{
                  background: 'var(--bg)',
                  border: `1px solid ${status === 'err' ? '#f87171' : status === 'ok' ? '#10b981' : 'var(--border)'}`,
                  color: 'var(--text-1)',
                  lineHeight: 1.6,
                  transition: 'border-color 0.15s',
                }}
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleImport(); }}
              />

              {/* Status */}
              {status === 'err' && (
                <p className="font-mono text-[11px]" style={{ color: '#f87171', marginTop: '-8px' }}>
                  No matching CSS properties found for this generator.
                </p>
              )}
              {status === 'ok' && (
                <p className="font-mono text-[11px]" style={{ color: '#10b981', marginTop: '-8px' }}>
                  Controls updated.
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px]" style={{ color: 'var(--text-3)' }}>
                  ⌘↵ to import
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="font-mono text-[11px] px-3 py-1.5 rounded-lg cursor-pointer"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!text.trim()}
                    className="font-mono text-[11px] px-3 py-1.5 rounded-lg cursor-pointer disabled:opacity-40"
                    style={{ background: 'var(--text-1)', color: 'var(--bg)', border: 'none' }}
                  >
                    Import
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
