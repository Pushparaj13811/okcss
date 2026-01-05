'use client';

/*
 * useCloudPresets
 *
 * Manages cloud preset CRUD for a single tool when the user is signed in.
 * Falls back to localStorage (via src/lib/presets.ts) when unauthenticated.
 *
 * This hook is the single source of truth for PresetPanel — it transparently
 * switches between cloud and local storage based on auth state.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getPresets, savePreset, deletePreset, Preset } from '@/src/lib/presets';

export type CloudPreset<T = unknown> = {
  id: string;
  tool: string;
  name: string;
  state: T;
  isPublic: boolean;
  createdAt: string;
};

// Re-export for PresetPanel to use a unified type
export type AnyPreset<T> = CloudPreset<T> | Preset<T>;

// Map a raw API response row to our typed CloudPreset
function toCloudPreset<T>(row: {
  id: string;
  tool: string;
  name: string;
  state: unknown;
  is_public: boolean;
  created_at: string;
}): CloudPreset<T> {
  return {
    id: row.id,
    tool: row.tool,
    name: row.name,
    state: row.state as T,
    isPublic: row.is_public,
    createdAt: row.created_at,
  };
}

export function useCloudPresets<T>(tool: string) {
  const { data: session, status } = useSession();
  const isSignedIn = status === 'authenticated' && !!session?.user?.email;

  const [presets, setPresets] = useState<AnyPreset<T>[]>([]);
  const [loading, setLoading] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchPresets = useCallback(async () => {
    if (status === 'loading') return;

    if (!isSignedIn) {
      // Local storage path
      setPresets(getPresets<T>(tool));
      return;
    }

    // Cloud path
    setLoading(true);
    try {
      const res = await fetch(`/api/presets?tool=${encodeURIComponent(tool)}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const rows = await res.json() as Array<{
        id: string; tool: string; name: string;
        state: unknown; is_public: boolean; created_at: string;
      }>;
      setPresets(rows.map((r) => toCloudPreset<T>(r)));
    } catch {
      // Gracefully fall back to localStorage on network failure
      setPresets(getPresets<T>(tool));
    } finally {
      setLoading(false);
    }
  }, [tool, isSignedIn, status]);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  // ── Save ─────────────────────────────────────────────────────────────────
  const save = useCallback(async (name: string, state: T, isPublic = false) => {
    if (!isSignedIn) {
      savePreset<T>(tool, name, state);
      setPresets(getPresets<T>(tool));
      return;
    }

    const res = await fetch('/api/presets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool, name, state, isPublic }),
    });

    if (!res.ok) {
      // Cloud unavailable — fall back to localStorage so the save is never lost
      savePreset<T>(tool, name, state);
      setPresets(getPresets<T>(tool));
      const { error } = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error ?? 'Failed to save to cloud');
    }

    await fetchPresets();
  }, [tool, isSignedIn, fetchPresets]);

  // ── Toggle public ────────────────────────────────────────────────────────
  const togglePublic = useCallback(async (id: string, isPublic: boolean) => {
    if (!isSignedIn) return;
    const res = await fetch(`/api/presets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic }),
    });
    if (!res.ok) throw new Error('Failed to update');
    await fetchPresets();
  }, [isSignedIn, fetchPresets]);

  // ── Delete ───────────────────────────────────────────────────────────────
  const remove = useCallback(async (id: string) => {
    if (!isSignedIn) {
      deletePreset(tool, id);
      setPresets(getPresets<T>(tool));
      return;
    }

    const res = await fetch(`/api/presets/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    await fetchPresets();
  }, [tool, isSignedIn, fetchPresets]);

  return {
    presets,
    loading,
    isCloud: isSignedIn,
    save,
    remove,
    togglePublic,
    refresh: fetchPresets,
  };
}

// ── Utility: unified age formatter (works for both cloud and local presets) ───
// Local presets store createdAt as Unix ms (number).
// Cloud presets store createdAt as ISO string. This wrapper handles both.
export function formatPresetAge(createdAt: number | string): string {
  const ms = typeof createdAt === 'string' ? Date.parse(createdAt) : createdAt;
  const diffMs = Date.now() - ms;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD}d ago`;
  const diffMo = Math.floor(diffD / 30);
  return `${diffMo}mo ago`;
}
