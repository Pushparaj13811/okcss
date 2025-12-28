'use client';

/*
 * useGeneratorShortcuts
 *
 * Registers keyboard shortcuts for generator pages:
 *   R           — randomize (calls onRandomize if provided)
 *   C           — copy the current CSS output to clipboard
 *   Escape      — blur any focused input
 *
 * Guards against firing when the user is typing in an input/textarea.
 */

import { useEffect } from 'react';

type Options = {
  onRandomize?: () => void;
  onCopy?: () => void;
};

export function useGeneratorShortcuts({ onRandomize, onCopy }: Options) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return;
      // Don't fire with modifiers (let browser/OS handle Cmd+C etc.)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onRandomize?.();
      }
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        onCopy?.();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onRandomize, onCopy]);
}
