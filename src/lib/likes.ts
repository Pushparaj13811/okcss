/*
 * likes.ts — localStorage-backed liked presets.
 *
 * Stores a set of liked preset IDs so users can heart community presets
 * on the /explore page without needing to sign in.
 *
 * All operations are synchronous and SSR-safe (guarded by typeof window).
 */

const LIKES_KEY = 'okcss-likes';

/** Returns the full Set of liked preset IDs from localStorage. */
export function getLikes(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

/** Returns true if a given preset ID is liked. */
export function isLiked(presetId: string): boolean {
  return getLikes().has(presetId);
}

/**
 * Toggles the liked state of a preset.
 * Returns the new liked state (true = now liked).
 */
export function toggleLike(presetId: string): boolean {
  const likes = getLikes();
  if (likes.has(presetId)) {
    likes.delete(presetId);
  } else {
    likes.add(presetId);
  }
  localStorage.setItem(LIKES_KEY, JSON.stringify([...likes]));
  return likes.has(presetId);
}

/** Clears all likes. */
export function clearLikes(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LIKES_KEY);
}
