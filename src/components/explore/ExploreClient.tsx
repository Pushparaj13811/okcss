'use client';

/*
 * ExploreClient — community gallery of public presets.
 *
 * Features:
 *   - Filter by tool (pill tabs)
 *   - "Liked" filter — shows only locally-liked presets
 *   - Search by name (client-side)
 *   - Heart/bookmark on each card (persisted to localStorage)
 *   - "Open" link → generator pre-loaded with that preset's state
 *   - Load more (pagination)
 *   - Empty state with link to sign in and publish
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TOOLS } from '@/src/lib/tools';
import { formatPresetAge } from '@/src/hooks/useCloudPresets';
import { PresetThumbnail } from '@/src/components/ui/PresetThumbnail';
import { getLikes, toggleLike } from '@/src/lib/likes';
import {
  ArrowUpRightIcon,
  HeartIcon,
  SearchIcon,
} from '@/src/components/icons';

// ─── Types ────────────────────────────────────────────────────────────────────

type PublicPreset = {
  id: string;
  tool: string;
  name: string;
  state: unknown;
  created_at: string;
};

// ─── Card ─────────────────────────────────────────────────────────────────────

function ExploreCard({
  preset,
  liked,
  onLike,
}: {
  preset: PublicPreset;
  liked: boolean;
  onLike: (id: string) => void;
}) {
  const router = useRouter();
  const toolMeta = TOOLS.find((t) => t.href === `/${preset.tool}`);
  const toolLabel = toolMeta?.label ?? preset.tool;

  const open = () => {
    try {
      const encoded = btoa(JSON.stringify(preset.state));
      router.push(`/${preset.tool}?s=${encoded}`);
    } catch {
      router.push(`/${preset.tool}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="flex flex-col rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
      >
        {/* CSS preview thumbnail */}
        <div className="relative">
          <PresetThumbnail tool={preset.tool} state={preset.state} height={120} />
          {/* Heart button overlay */}
          <button
            onClick={(e) => { e.stopPropagation(); onLike(preset.id); }}
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110 active:scale-95"
            style={{
              background: liked ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.35)',
              border: liked ? '1px solid rgba(239,68,68,0.4)' : '1px solid transparent',
              color: liked ? '#ef4444' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(4px)',
            }}
            aria-label={liked ? 'Unlike preset' : 'Like preset'}
            title={liked ? 'Unlike' : 'Like'}
          >
            <HeartIcon size={12} filled={liked} />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-4">
          {/* Tool chip */}
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/${preset.tool}`}
              className="font-mono text-[10px] px-2 py-0.5 rounded-md"
              style={{ background: 'var(--bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-3)', textDecoration: 'none' }}
            >
              {toolLabel}
            </Link>
            <span className="font-mono text-[9px]" style={{ color: 'var(--text-3)' }}>
              {formatPresetAge(preset.created_at)}
            </span>
          </div>

          {/* Name */}
          <p className="font-mono text-[13px] font-medium truncate" style={{ color: 'var(--text-1)' }}>
            {preset.name}
          </p>

          {/* Open button */}
          <button
            onClick={open}
            className="w-full inline-flex items-center justify-center gap-1.5 font-mono text-[11px] py-1.5 rounded-lg cursor-pointer"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
          >
            Open in {toolLabel} <ArrowUpRightIcon />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 24;

export function ExploreClient() {
  const [presets, setPresets] = useState<PublicPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Search
  const [search, setSearch] = useState('');

  // Likes (persisted in localStorage)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [showLiked, setShowLiked] = useState(false);

  // Load likes from localStorage on mount
  useEffect(() => {
    setLikedIds(getLikes());
  }, []);

  const handleLike = useCallback((id: string) => {
    const nowLiked = toggleLike(id);
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (nowLiked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const fetchPresets = useCallback(async (tool: string | null, off: number, replace: boolean) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(off) });
      if (tool) params.set('tool', tool);
      const res = await fetch(`/api/explore?${params.toString()}`);
      if (!res.ok) throw new Error('Failed');
      const rows: PublicPreset[] = await res.json();
      setPresets((prev) => replace ? rows : [...prev, ...rows]);
      setHasMore(rows.length === PAGE_SIZE);
    } catch {
      setPresets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load — re-fetch when tool filter changes
  useEffect(() => {
    // Don't fetch when showing liked (all presets already loaded or use existing)
    if (!showLiked) {
      fetchPresets(activeTool, 0, true);
      setOffset(0);
    }
  }, [activeTool, fetchPresets, showLiked]);

  // When switching to liked view, fetch all presets if we haven't yet
  useEffect(() => {
    if (showLiked && presets.length === 0) {
      fetchPresets(null, 0, true);
      setOffset(0);
    }
  }, [showLiked, presets.length, fetchPresets]);

  const loadMore = () => {
    const next = offset + PAGE_SIZE;
    setOffset(next);
    fetchPresets(activeTool, next, false);
  };

  // Client-side filter by search + liked
  const displayed = useMemo(() => {
    let list = presets;
    if (showLiked) {
      list = list.filter((p) => likedIds.has(p.id));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tool.toLowerCase().includes(q),
      );
    }
    return list;
  }, [presets, showLiked, likedIds, search]);

  // Unique tools seen in results
  const allToolSlugs = [...new Set(TOOLS.map((t) => t.href.slice(1)))];

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-mono text-2xl font-medium tracking-tight mb-2" style={{ color: 'var(--text-1)' }}>
          Explore
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-3)', maxWidth: '480px' }}>
          Community-shared presets. Sign in on any generator to publish your own.
        </p>
      </div>

      {/* Search bar */}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2 mb-5 w-full max-w-sm"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <span style={{ color: 'var(--text-3)', flexShrink: 0 }}>
          <SearchIcon size={13} />
        </span>
        <input
          type="text"
          placeholder="Search presets…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none font-mono text-[12px]"
          style={{ color: 'var(--text-1)', caretColor: 'var(--text-1)' }}
          aria-label="Search presets"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="font-mono text-[10px] cursor-pointer"
            style={{ color: 'var(--text-3)' }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tool filter pills + Liked */}
      <div className="flex flex-wrap gap-2 mb-8">
        {/* Liked filter */}
        <button
          onClick={() => { setShowLiked(!showLiked); setActiveTool(null); setSearch(''); }}
          className="inline-flex items-center gap-1 font-mono text-[11px] px-3 py-1 rounded-full cursor-pointer"
          style={{
            background: showLiked ? 'rgba(239,68,68,0.12)' : 'var(--bg-surface)',
            color: showLiked ? '#ef4444' : 'var(--text-3)',
            border: showLiked ? '1px solid rgba(239,68,68,0.35)' : '1px solid var(--border)',
          }}
        >
          <HeartIcon size={10} filled={showLiked} />
          Liked{likedIds.size > 0 ? ` (${likedIds.size})` : ''}
        </button>

        {!showLiked && (
          <>
            <button
              onClick={() => setActiveTool(null)}
              className="font-mono text-[11px] px-3 py-1 rounded-full cursor-pointer"
              style={{
                background: activeTool === null ? 'var(--text-1)' : 'var(--bg-surface)',
                color: activeTool === null ? 'var(--bg)' : 'var(--text-3)',
                border: '1px solid var(--border)',
              }}
            >
              All
            </button>
            {allToolSlugs.map((slug) => {
              const label = TOOLS.find((t) => t.href === `/${slug}`)?.label ?? slug;
              return (
                <button
                  key={slug}
                  onClick={() => setActiveTool(slug)}
                  className="font-mono text-[11px] px-3 py-1 rounded-full cursor-pointer"
                  style={{
                    background: activeTool === slug ? 'var(--text-1)' : 'var(--bg-surface)',
                    color: activeTool === slug ? 'var(--bg)' : 'var(--text-3)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </>
        )}
      </div>

      {/* Loading skeletons */}
      {loading && presets.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <div key={k} className="h-48 rounded-xl animate-pulse" style={{ background: 'var(--border-subtle)' }} />
          ))}
        </div>
      )}

      {/* Liked empty state */}
      {showLiked && !loading && displayed.length === 0 && (
        <div className="text-center py-20">
          <p className="font-mono text-sm mb-2" style={{ color: 'var(--text-3)' }}>No liked presets yet.</p>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            Click the heart on any preset card to save it here.
          </p>
        </div>
      )}

      {/* Search empty state */}
      {!showLiked && search.trim() && !loading && displayed.length === 0 && (
        <div className="text-center py-20">
          <p className="font-mono text-sm mb-2" style={{ color: 'var(--text-3)' }}>
            No presets matching &ldquo;{search}&rdquo;
          </p>
          <button
            onClick={() => setSearch('')}
            className="font-mono text-xs mt-2 cursor-pointer"
            style={{ color: '#6366f1' }}
          >
            Clear search
          </button>
        </div>
      )}

      {/* Global empty state */}
      {!loading && presets.length === 0 && !search && !showLiked && (
        <div className="text-center py-20">
          <p className="font-mono text-sm mb-3" style={{ color: 'var(--text-3)' }}>
            No public presets yet.
          </p>
          <p className="text-xs mb-6" style={{ color: 'var(--text-3)' }}>
            Sign in on any generator, save a preset, then click the globe icon to share it here.
          </p>
          <Link
            href="/"
            className="font-mono text-xs px-3 py-1.5 rounded-lg inline-block"
            style={{ background: 'var(--text-1)', color: 'var(--bg)', textDecoration: 'none' }}
          >
            Browse generators
          </Link>
        </div>
      )}

      <AnimatePresence mode="wait">
        {displayed.length > 0 && (
          <motion.div
            key={`${activeTool ?? 'all'}-${showLiked}-${search}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {displayed.map((p) => (
              <ExploreCard
                key={p.id}
                preset={p}
                liked={likedIds.has(p.id)}
                onLike={handleLike}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load more — only in normal (non-liked, non-search) mode */}
      {!showLiked && !search && hasMore && presets.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="font-mono text-xs px-4 py-2 rounded-lg cursor-pointer disabled:opacity-50"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}
