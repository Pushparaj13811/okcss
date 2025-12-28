/*
 * Presets — localStorage-backed named preset system.
 *
 * Presets are namespaced per tool (e.g. 'shadow', 'glass') so each generator
 * has its own independent list. The API is synchronous since localStorage is
 * synchronous; always guard with typeof window checks for SSR safety.
 *
 * Max presets per tool: 20 (oldest are trimmed to prevent unbounded growth).
 */

export type Preset<T = unknown> = {
  id: string;
  name: string;
  state: T;
  createdAt: number; // Unix ms timestamp
};

const KEY_PREFIX = 'okcss-presets-';
const MAX_PRESETS = 20;

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getPresets<T>(tool: string): Preset<T>[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY_PREFIX + tool);
    return raw ? (JSON.parse(raw) as Preset<T>[]) : [];
  } catch {
    return [];
  }
}

// ─── Write ────────────────────────────────────────────────────────────────────

export function savePreset<T>(tool: string, name: string, state: T): Preset<T> {
  const existing = getPresets<T>(tool);
  const preset: Preset<T> = {
    id: crypto.randomUUID(),
    name: name.trim() || `Preset ${existing.length + 1}`,
    state,
    createdAt: Date.now(),
  };

  // Prepend newest, trim to max
  const updated = [preset, ...existing].slice(0, MAX_PRESETS);
  localStorage.setItem(KEY_PREFIX + tool, JSON.stringify(updated));
  return preset;
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export function deletePreset(tool: string, id: string): void {
  const existing = getPresets(tool);
  const updated = existing.filter((p) => p.id !== id);
  localStorage.setItem(KEY_PREFIX + tool, JSON.stringify(updated));
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Formats a createdAt timestamp as a short relative string (e.g. "2h ago"). */
export function formatPresetAge(createdAt: number): string {
  const diffMs = Date.now() - createdAt;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}
