'use client';

/*
 * DashboardClient
 *
 * Shows all cloud presets for the signed-in user, grouped by tool.
 * Features:
 *   - Load → opens the generator with the preset's URL state
 *   - Delete → removes from cloud
 *   - Public toggle → share/unshare in /explore
 *   - Multi-select mode → checkbox each preset, then export selected subset
 *   - Export → download selected (or all) presets as CSS variables or tokens.json
 *   - Usage stats bar → visual breakdown of preset distribution by tool
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TOOLS } from '@/src/lib/tools';
import {
  TrashIcon,
  GlobeIcon,
  DownloadIcon,
  ArrowUpRightIcon,
  CheckIcon,
} from '@/src/components/icons';
import { formatPresetAge, type CloudPreset } from '@/src/hooks/useCloudPresets';
import { PresetThumbnail } from '@/src/components/ui/PresetThumbnail';

// ─── Types ────────────────────────────────────────────────────────────────────

type RawPreset = {
  id: string;
  tool: string;
  name: string;
  state: unknown;
  is_public: boolean;
  created_at: string;
};

type UIPreset = CloudPreset<unknown>;

function toUI(r: RawPreset): UIPreset {
  return {
    id: r.id,
    tool: r.tool,
    name: r.name,
    state: r.state,
    isPublic: r.is_public,
    createdAt: r.created_at,
  };
}

// ─── Export helpers ───────────────────────────────────────────────────────────

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Slugify a string for use as a CSS custom property name.
 * e.g. "Stripe card" → "stripe-card"
 */
function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Flatten a preset state object into CSS property → value pairs.
 * Works generically: iterates shallow keys, converts camelCase to kebab-case.
 */
function stateToProps(state: unknown): Array<[string, string]> {
  if (!state || typeof state !== 'object') return [];
  const pairs: Array<[string, string]> = [];
  for (const [k, v] of Object.entries(state as Record<string, unknown>)) {
    if (v === null || v === undefined) continue;
    // Skip nested objects and arrays (they're tool-specific sub-structures)
    if (typeof v === 'object') continue;
    const prop = k.replace(/([A-Z])/g, '-$1').toLowerCase();
    pairs.push([prop, String(v)]);
  }
  return pairs;
}

/**
 * Export presets as CSS custom properties inside :root {}.
 * Each preset gets a namespace: --tool--preset-name--property.
 */
function exportAsCss(presets: UIPreset[]) {
  const lines: string[] = ['/* ok.css — exported presets */\n', ':root {'];
  for (const p of presets) {
    const ns = `${toSlug(p.tool)}--${toSlug(p.name)}`;
    lines.push(`\n  /* ${p.tool}: ${p.name} */`);
    const props = stateToProps(p.state);
    if (props.length === 0) {
      lines.push(`  /* state: ${JSON.stringify(p.state)} */`);
    } else {
      for (const [prop, val] of props) {
        lines.push(`  --${ns}--${prop}: ${val};`);
      }
    }
  }
  lines.push('\n}');
  downloadFile('okcss-presets.css', lines.join('\n'), 'text/css');
}

/**
 * Export presets as a Style Dictionary–compatible tokens.json.
 * Shape: { tool: { presetName: { property: { value } } } }
 */
function exportAsTokens(presets: UIPreset[]) {
  const tokens: Record<string, Record<string, Record<string, { value: string | number | boolean }>>> = {};

  for (const p of presets) {
    if (!tokens[p.tool]) tokens[p.tool] = {};
    const state = p.state as Record<string, unknown>;
    const tokenGroup: Record<string, { value: string | number | boolean }> = {};

    if (state && typeof state === 'object') {
      for (const [k, v] of Object.entries(state)) {
        if (v === null || v === undefined || typeof v === 'object') continue;
        tokenGroup[k] = { value: v as string | number | boolean };
      }
    }

    if (Object.keys(tokenGroup).length === 0) {
      tokenGroup['_raw'] = { value: JSON.stringify(p.state) };
    }

    tokens[p.tool][p.name] = tokenGroup;
  }

  downloadFile('okcss-tokens.json', JSON.stringify(tokens, null, 2), 'application/json');
}

// ─── Stats bar (Tier 3.4) ─────────────────────────────────────────────────────

function StatsBar({ presets }: { presets: UIPreset[] }) {
  const toolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of presets) {
      counts[p.tool] = (counts[p.tool] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [presets]);

  if (presets.length === 0 || toolCounts.length < 2) return null;

  const max = toolCounts[0][1];

  return (
    <div
      className="rounded-xl p-4 mb-6"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <p className="font-mono text-[10px] mb-3" style={{ color: 'var(--text-3)' }}>
        Preset distribution
      </p>
      <div className="flex flex-col gap-2">
        {toolCounts.map(([tool, count]) => {
          const label = TOOLS.find((t) => t.href === `/${tool}`)?.label ?? tool;
          const pct = Math.round((count / max) * 100);
          return (
            <div key={tool} className="flex items-center gap-2">
              <span
                className="font-mono text-[9px] w-20 flex-shrink-0 truncate"
                style={{ color: 'var(--text-3)' }}
              >
                {label}
              </span>
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{ height: '5px', background: 'var(--border-subtle)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: '#6366f1' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <span
                className="font-mono text-[9px] w-4 text-right flex-shrink-0"
                style={{ color: 'var(--text-3)' }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Preset row ───────────────────────────────────────────────────────────────

function PresetRow({
  preset,
  toolHref,
  onDelete,
  onTogglePublic,
  selectMode,
  selected,
  onSelect,
}: {
  preset: UIPreset;
  toolHref: string;
  onDelete: (id: string) => void;
  onTogglePublic: (id: string, pub: boolean) => void;
  selectMode: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const router = useRouter();

  const loadInTool = () => {
    try {
      const encoded = btoa(JSON.stringify(preset.state));
      router.push(`${toolHref}?s=${encoded}`);
    } catch {
      router.push(toolHref);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
      transition={{ duration: 0.18 }}
    >
      <div
        className="flex items-center gap-3 rounded-xl overflow-hidden group"
        style={{
          border: `1px solid ${selected ? 'rgba(99,102,241,0.5)' : 'var(--border-subtle)'}`,
          background: selected ? 'rgba(99,102,241,0.05)' : 'var(--bg-surface)',
          transition: 'border-color 0.12s, background 0.12s',
        }}
      >
        {/* Select checkbox (shown in select mode) */}
        {selectMode && (
          <button
            onClick={() => onSelect(preset.id)}
            className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded cursor-pointer ml-3"
            style={{
              background: selected ? '#6366f1' : 'var(--bg)',
              border: `1.5px solid ${selected ? '#6366f1' : 'var(--border)'}`,
              color: '#fff',
              transition: 'background 0.12s, border-color 0.12s',
            }}
            aria-label={selected ? 'Deselect' : 'Select'}
          >
            {selected && <CheckIcon size={9} />}
          </button>
        )}

        {/* Thumbnail */}
        <div
          className="flex-shrink-0"
          style={{ width: '64px', cursor: selectMode ? 'pointer' : 'default' }}
          onClick={selectMode ? () => onSelect(preset.id) : undefined}
        >
          <PresetThumbnail tool={preset.tool} state={preset.state} height={56} />
        </div>

        {/* Name + meta + actions */}
        <div className="flex flex-1 min-w-0 items-center gap-3 pr-3 py-2.5">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[12px] font-medium truncate" style={{ color: 'var(--text-1)' }}>
              {preset.name}
            </p>
            <p className="font-mono text-[9px] mt-0.5" style={{ color: 'var(--text-3)' }}>
              {formatPresetAge(preset.createdAt)}
              {preset.isPublic && (
                <span className="ml-2 text-[#6366f1]">public</span>
              )}
            </p>
          </div>

          {/* Actions — hidden in select mode */}
          {!selectMode && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Open in tool */}
              <button
                onClick={loadInTool}
                className="flex items-center gap-1 font-mono text-[10px] px-2 py-1 rounded-md cursor-pointer transition-colors duration-100"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
                aria-label={`Open in ${preset.tool}`}
              >
                Open <ArrowUpRightIcon />
              </button>

              {/* Public toggle */}
              <button
                onClick={() => onTogglePublic(preset.id, !preset.isPublic)}
                className="flex items-center justify-center w-7 h-7 rounded-md cursor-pointer transition-colors duration-100"
                style={{
                  background: preset.isPublic ? 'rgba(99,102,241,0.1)' : 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: preset.isPublic ? '#6366f1' : 'var(--text-3)',
                }}
                title={preset.isPublic ? 'Make private' : 'Share in /explore'}
                aria-label={preset.isPublic ? 'Make private' : 'Share publicly'}
              >
                <GlobeIcon size={12} />
              </button>

              {/* Delete */}
              <button
                onClick={() => onDelete(preset.id)}
                className="flex items-center justify-center w-7 h-7 rounded-md cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-100"
                style={{ background: 'none', border: 'none', color: 'var(--text-3)' }}
                aria-label={`Delete ${preset.name}`}
              >
                <TrashIcon size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DashboardClient() {
  const [presets, setPresets] = useState<UIPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // Multi-select mode (Tier 3.1)
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/presets');
      if (!res.ok) throw new Error('Failed to fetch');
      const rows: RawPreset[] = await res.json();
      setPresets(rows.map(toUI));
    } catch {
      setPresets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = useCallback(async (id: string) => {
    await fetch(`/api/presets/${id}`, { method: 'DELETE' });
    setPresets((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleTogglePublic = useCallback(async (id: string, pub: boolean) => {
    await fetch(`/api/presets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic: pub }),
    });
    setPresets((prev) => prev.map((p) => p.id === id ? { ...p, isPublic: pub } : p));
  }, []);

  // Select helpers
  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelected(new Set());
  };

  // Group by tool, show active filter or all
  const toolsWithPresets = [...new Set(presets.map((p) => p.tool))];
  const displayed = activeTool ? presets.filter((p) => p.tool === activeTool) : presets;

  const selectAll = () => {
    setSelected(new Set(displayed.map((p) => p.id)));
  };

  // Presets targeted by current export action (selected subset or all displayed)
  const exportTargets = selected.size > 0
    ? displayed.filter((p) => selected.has(p.id))
    : displayed;

  // Tool name lookup
  const toolLabel = (slug: string) => TOOLS.find((t) => t.href === `/${slug}`)?.label ?? slug;
  const toolHref = (slug: string) => `/${slug}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-mono text-2xl font-medium tracking-tight mb-1" style={{ color: 'var(--text-1)' }}>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            {presets.length} preset{presets.length !== 1 ? 's' : ''} across {toolsWithPresets.length} tool{toolsWithPresets.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Action buttons */}
        {presets.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {!selectMode ? (
              <>
                <button
                  onClick={() => setSelectMode(true)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
                >
                  Select
                </button>
                <button
                  onClick={() => exportAsCss(displayed)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
                >
                  <DownloadIcon size={12} />
                  CSS
                </button>
                <button
                  onClick={() => exportAsTokens(displayed)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
                >
                  <DownloadIcon size={12} />
                  Tokens
                </button>
              </>
            ) : (
              <>
                <span className="font-mono text-[11px] self-center" style={{ color: 'var(--text-3)' }}>
                  {selected.size} selected
                </span>
                <button
                  onClick={selectAll}
                  className="font-mono text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
                >
                  All
                </button>
                {selected.size > 0 && (
                  <>
                    <button
                      onClick={() => exportAsCss(exportTargets)}
                      className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                      style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.3)', color: '#6366f1' }}
                    >
                      <DownloadIcon size={12} />
                      CSS
                    </button>
                    <button
                      onClick={() => exportAsTokens(exportTargets)}
                      className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                      style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.3)', color: '#6366f1' }}
                    >
                      <DownloadIcon size={12} />
                      Tokens
                    </button>
                  </>
                )}
                <button
                  onClick={exitSelectMode}
                  className="font-mono text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-3)' }}
                >
                  Done
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Usage stats (Tier 3.4) — visible when ≥ 2 tools used */}
      {!loading && <StatsBar presets={presets} />}

      {/* Tool filter pills */}
      {toolsWithPresets.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
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
          {toolsWithPresets.map((slug) => (
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
              {toolLabel(slug)}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((k) => (
            <div key={k} className="h-14 rounded-xl animate-pulse" style={{ background: 'var(--border-subtle)' }} />
          ))}
        </div>
      )}

      {!loading && presets.length === 0 && (
        <div className="text-center py-20">
          <p className="font-mono text-sm mb-3" style={{ color: 'var(--text-3)' }}>No presets saved yet.</p>
          <Link
            href="/"
            className="font-mono text-xs px-3 py-1.5 rounded-lg inline-block"
            style={{ background: 'var(--text-1)', color: 'var(--bg)', textDecoration: 'none' }}
          >
            Browse generators
          </Link>
        </div>
      )}

      {!loading && displayed.length > 0 && (
        <div className="flex flex-col gap-6">
          {activeTool === null ? (
            toolsWithPresets.map((slug) => {
              const toolPresets = displayed.filter((p) => p.tool === slug);
              if (toolPresets.length === 0) return null;
              return (
                <div key={slug}>
                  <div className="flex items-center gap-2 mb-2">
                    <Link
                      href={toolHref(slug)}
                      className="font-mono text-[11px] font-medium hover:underline"
                      style={{ color: 'var(--text-2)', textDecoration: 'none' }}
                    >
                      {toolLabel(slug)}
                    </Link>
                    <span className="font-mono text-[9px]" style={{ color: 'var(--text-3)' }}>
                      {toolPresets.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <AnimatePresence>
                      {toolPresets.map((p) => (
                        <PresetRow
                          key={p.id}
                          preset={p}
                          toolHref={toolHref(slug)}
                          onDelete={handleDelete}
                          onTogglePublic={handleTogglePublic}
                          selectMode={selectMode}
                          selected={selected.has(p.id)}
                          onSelect={toggleSelect}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col gap-1.5">
              <AnimatePresence>
                {displayed.map((p) => (
                  <PresetRow
                    key={p.id}
                    preset={p}
                    toolHref={toolHref(p.tool)}
                    onDelete={handleDelete}
                    onTogglePublic={handleTogglePublic}
                    selectMode={selectMode}
                    selected={selected.has(p.id)}
                    onSelect={toggleSelect}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Select mode help text */}
      {selectMode && (
        <p className="font-mono text-[10px] text-center mt-6" style={{ color: 'var(--text-3)' }}>
          Click presets to select them, then export as CSS variables or design tokens.
        </p>
      )}
    </div>
  );
}
