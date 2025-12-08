'use client';

/*
 * ShareBar
 *
 * Three sharing actions for every generator:
 *   1. Share URL   — opens a mini popover with the current URL + copy button
 *   2. Copy Image  — captures the preview element as PNG and writes to clipboard
 *   3. CodePen     — POSTs CSS to codepen.io/pen/define and opens a new tab
 *
 * The component identifies the preview element by the id "generator-preview"
 * which GeneratorLayout stamps onto its preview container div.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, CopyIcon } from '@/src/components/icons';

// ─── Icon atoms ───────────────────────────────────────────────────────────────

function ShareIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M9 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM4 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM9 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M7.5 5L5.5 6M7.5 8L5.5 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="4.5" cy="5" r="1" stroke="currentColor" strokeWidth="1"/>
      <path d="M1 8.5l3-2.5 2.5 2.5 2-1.5L12 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CodePenIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M6.5 1L12 4.5V8.5L6.5 12L1 8.5V4.5L6.5 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M6.5 1V12M1 4.5L12 8.5M12 4.5L1 8.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Action button ────────────────────────────────────────────────────────────

type ActionBtnProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  success?: boolean;
  loading?: boolean;
};

function ActionBtn({ label, icon, onClick, success, loading }: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-mono text-[11px] cursor-pointer transition-colors duration-100"
      style={{
        background: success ? 'var(--text-1)' : 'var(--bg)',
        border: '1px solid var(--border)',
        color: success ? 'var(--bg)' : 'var(--text-2)',
        opacity: loading ? 0.5 : 1,
      }}
      aria-label={label}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={success ? 'check' : 'icon'}
          className="flex items-center"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.14 }}
        >
          {success ? <CheckIcon size={12} /> : icon}
        </motion.span>
      </AnimatePresence>
      {label}
    </button>
  );
}

// ─── Share URL popover ────────────────────────────────────────────────────────

function ShareUrlPopover({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.select();
    const handler = (e: MouseEvent) => {
      if (!popoverRef.current?.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 50);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      inputRef.current?.select();
      document.execCommand('copy');
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      ref={popoverRef}
      initial={{ opacity: 0, y: 4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full mb-2 left-0 w-80 rounded-xl z-50 p-3"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}
    >
      <p className="font-mono text-[10px] mb-2" style={{ color: 'var(--text-3)' }}>
        Shareable URL — anyone with this link gets your exact settings
      </p>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={url}
          readOnly
          className="flex-1 font-mono text-[11px] px-2.5 py-1.5 rounded-lg min-w-0 outline-none"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            color: 'var(--text-2)',
          }}
        />
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-mono text-[11px] cursor-pointer flex-shrink-0"
          style={{
            background: copied ? 'var(--text-1)' : 'var(--bg)',
            border: '1px solid var(--border)',
            color: copied ? 'var(--bg)' : 'var(--text-2)',
            transition: 'background 0.15s, color 0.15s',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? 'check' : 'copy'}
              className="flex items-center"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.12 }}
            >
              {copied ? <CheckIcon size={11} /> : <CopyIcon size={11} />}
            </motion.span>
          </AnimatePresence>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </motion.div>
  );
}

// ─── ShareBar ─────────────────────────────────────────────────────────────────

type ShareBarProps = {
  /** Full CSS block for CodePen export (with property names and semicolons). */
  cssText: string;
  /** Optional title for the CodePen pen. */
  title?: string;
};

export function ShareBar({ cssText, title = 'ok.css export' }: ShareBarProps) {
  const [showSharePopover, setShowSharePopover] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ── Copy image ────────────────────────────────────────────────────────────

  const handleCopyImage = useCallback(async () => {
    const previewEl = document.getElementById('generator-preview');
    if (!previewEl) return;
    setImageLoading(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(previewEl, { pixelRatio: 2 });
      // Convert data URL to Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 1800);
    } catch {
      // Fallback: download the image
      try {
        const { toPng } = await import('html-to-image');
        const dataUrl = await toPng(previewEl, { pixelRatio: 2 });
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'okcss-preview.png';
        a.click();
        setImageCopied(true);
        setTimeout(() => setImageCopied(false), 1800);
      } catch {
        // Silent fail
      }
    } finally {
      setImageLoading(false);
    }
  }, []);

  // ── CodePen export ────────────────────────────────────────────────────────

  const handleCodePen = useCallback(() => {
    const data = {
      title,
      css: cssText,
      html: '<div class="element">Element</div>',
      editors: '010', // CSS editor open
    };
    const form = document.createElement('form');
    form.action = 'https://codepen.io/pen/define';
    form.method = 'POST';
    form.target = '_blank';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'data';
    input.value = JSON.stringify(data);
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }, [cssText, title]);

  return (
    <div ref={wrapperRef} className="relative flex items-center gap-2">
      {/* Share URL */}
      <div className="relative">
        <ActionBtn
          label="Share"
          icon={<ShareIcon />}
          onClick={() => setShowSharePopover((v) => !v)}
        />
        <AnimatePresence>
          {showSharePopover && (
            <ShareUrlPopover onClose={() => setShowSharePopover(false)} />
          )}
        </AnimatePresence>
      </div>

      {/* Copy as image */}
      <ActionBtn
        label={imageCopied ? 'Copied!' : 'Copy image'}
        icon={<ImageIcon />}
        onClick={handleCopyImage}
        success={imageCopied}
        loading={imageLoading}
      />

      {/* CodePen */}
      <ActionBtn
        label="CodePen"
        icon={<CodePenIcon />}
        onClick={handleCodePen}
      />
    </div>
  );
}
