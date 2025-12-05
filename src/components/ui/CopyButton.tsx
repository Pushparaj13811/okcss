'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CopyIcon, CheckIcon } from '@/src/components/icons';

/*
 * CopyButton
 *
 * Copies a string to the clipboard. Shows a brief "Copied!" state with
 * an icon swap via AnimatePresence, then resets after 1.5 seconds.
 *
 * Clipboard API notes:
 * - navigator.clipboard.writeText requires a secure context (HTTPS/localhost).
 * - Falls back to the older execCommand('copy') approach if unavailable.
 * - If both fail, the button does nothing (edge case: insecure iframes).
 */

type CopyButtonProps = {
  text: string;
  className?: string;
};

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleCopy = async () => {
    if (copied) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or insecure contexts
        const el = document.createElement('textarea');
        el.value = text;
        el.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silently fail  don't break the UI if clipboard is blocked.
    }
  };

  const iconTransition = {
    duration: prefersReducedMotion ? 0 : 0.15,
    ease: 'easeInOut' as const,
  };

  return (
    <button
      onClick={handleCopy}
      disabled={copied}
      className={`
        inline-flex items-center gap-2
        px-4 h-9 rounded-lg
        font-mono text-xs font-medium
        cursor-pointer select-none
        transition-colors duration-150
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        disabled:cursor-default
        ${className ?? ''}
      `}
      style={{
        background: copied ? 'var(--bg-surface)' : 'var(--text-1)',
        color: copied ? 'var(--text-2)' : 'var(--bg)',
        border: copied ? '1px solid var(--border)' : '1px solid transparent',
        outlineColor: 'var(--text-2)',
      }}
      aria-label={copied ? 'CSS copied to clipboard' : 'Copy CSS to clipboard'}
    >
      {/* Icon  swaps between Copy and Check */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'check' : 'copy'}
          className="flex items-center justify-center"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
          transition={iconTransition}
        >
          {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
        </motion.span>
      </AnimatePresence>

      {/* Label  swaps with a cross-fade */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'copied' : 'copy-label'}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={iconTransition}
        >
          {copied ? 'Copied!' : 'Copy CSS'}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
