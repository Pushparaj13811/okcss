'use client';

/*
 * useUrlState
 *
 * Syncs a generator's state to/from the URL ?s= query parameter via
 * base64-encoded JSON. This gives every generator free shareable URLs
 * without any server-side state.
 *
 * Architecture decisions:
 * - Uses window.location / window.history directly instead of Next.js router
 *   to avoid the Suspense boundary requirement of useSearchParams.
 * - Reads from URL exactly once on mount (via useEffect + initialized ref).
 * - Writes with replaceState (not pushState) so the browser back button
 *   doesn't step through every slider drag.
 * - URL writes are debounced to 150ms so rapid slider drags don't flood
 *   history with hundreds of replaceState calls per second.
 * - Base64 is not encryption — it's just URL-safe serialisation.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const URL_DEBOUNCE_MS = 150;

export function useUrlState<T>(
  defaultState: T,
  paramKey = 's',
): [T, (next: T) => void] {
  const [state, setState] = useState<T>(defaultState);
  const initialized = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read from URL on first client render
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get(paramKey);
      if (encoded) {
        const decoded = JSON.parse(atob(encoded)) as T;
        setState(decoded);
      }
    } catch {
      // Malformed URL state — silently fall back to default
    }
  }, [paramKey]);

  // Write to URL debounced — state update is immediate, URL write is deferred.
  const update = useCallback(
    (next: T) => {
      setState(next);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        try {
          const encoded = btoa(JSON.stringify(next));
          const params = new URLSearchParams(window.location.search);
          params.set(paramKey, encoded);
          window.history.replaceState(null, '', `?${params.toString()}`);
        } catch {
          // Ignore serialisation errors (circular refs etc.)
        }
      }, URL_DEBOUNCE_MS);
    },
    [paramKey],
  );

  return [state, update];
}
