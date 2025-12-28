'use client';

/*
 * PresetPanel
 *
 * A self-contained UI for saving and loading generator presets.
 *
 * - When the user is signed in → syncs with Supabase cloud (useCloudPresets).
 * - When not signed in → reads/writes localStorage (fallback path in same hook).
 *
 * Signed-in extra features:
 *  • "Share" toggle per preset (makes it public in the /explore gallery)
 *  • Unlimited presets (local cap is 20)
 *
 * Generic over T so it can be dropped into any generator without modification.
 */

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TrashIcon } from '@/src/components/icons';
import { useCloudPresets, formatPresetAge } from '@/src/hooks/useCloudPresets';
import type { CloudPreset } from '@/src/hooks/useCloudPresets';
import type { Preset } from '@/src/lib/presets';

// ─── Icons ────────────────────────────────────────────────────────────────────

function SaveIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M10 10H2C1.45 10 1 9.55 1 9V2L3 1H10C10.55 1 11 1.45 11 2V9C11 9.55 10.55 10 10 10Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <rect x="3.5" y="1" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="2.5" y="6.5" width="7" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}

function GlobeIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M7 1.5C7 1.5 4.5 4 4.5 7s2.5 5.5 2.5 5.5S9.5 10 9.5 7 7 1.5 7 1.5z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M1.5 7h11" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PresetPanelProps<T> = {
  tool: string;
  currentState: T;
  onLoad: (state: T) => void;
};

type AnyPreset<T> = CloudPreset<T> | Preset<T>;

function isCloudPreset<T>(p: AnyPreset<T>): p is CloudPreset<T> {
  return 'isPublic' in p;
}

function getPresetAge<T>(p: AnyPreset<T>): string {
  const ts = isCloudPreset(p) ? p.createdAt : p.createdAt;
  return formatPresetAge(ts);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PresetPanel<T>({ tool, currentState, onLoad }: PresetPanelProps<T>) {
  const { presets, loading, isCloud, save, remove, togglePublic } = useCloudPresets<T>(tool);
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    setSaveError(null);
    try {
      await save(trimmed, currentState);
      setName('');
    } catch {
      setSaveError('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  }, [name, currentState, save]);

  return (
    <div>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 font-mono text-xs w-full justify-between px-0 py-1 cursor-pointer"
        style={{ color: 'var(--text-3)', background: 'transparent', border: 'none' }}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5">
          Presets{presets.length > 0 ? ` (${presets.length})` : ''}
          {isCloud && (
            <span
              className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded font-mono text-[9px]"
              style={{ background: 'var(--bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-3)' }}
              title="Synced to cloud"
            >
              <GlobeIcon size={8} />
              cloud
            </span>
          )}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          style={{ display: 'flex' }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="flex flex-col gap-3 pt-3">
              {/* Save row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="Preset name…"
                  className="flex-1 font-mono text-xs px-2.5 py-1.5 rounded-lg outline-none min-w-0"
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-1)',
                  }}
                  maxLength={60}
                />
                <button
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1.5 rounded-lg cursor-pointer flex-shrink-0 disabled:opacity-50"
                  style={{
                    background: 'var(--text-1)',
                    color: 'var(--bg)',
                    border: 'none',
                  }}
                  aria-label="Save current state as preset"
                >
                  <SaveIcon />
                  {saving ? '…' : 'Save'}
                </button>
              </div>

              {/* Error */}
              {saveError && (
                <p className="font-mono text-[10px]" style={{ color: '#ef4444' }}>{saveError}</p>
              )}

              {/* Loading skeleton */}
              {loading && (
                <div className="flex flex-col gap-1.5">
                  {[1, 2].map((k) => (
                    <div key={k} className="h-9 rounded-lg animate-pulse" style={{ background: 'var(--border-subtle)' }} />
                  ))}
                </div>
              )}

              {/* Preset list */}
              {!loading && presets.length === 0 && (
                <p className="font-mono text-[10px] text-center py-3" style={{ color: 'var(--text-3)' }}>
                  No presets saved yet.
                </p>
              )}

              {!loading && presets.length > 0 && (
                <div className="flex flex-col gap-1">
                  <AnimatePresence initial={false}>
                    {(presets as AnyPreset<T>[]).map((preset) => (
                      <motion.div
                        key={preset.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, transition: { duration: 0.14 } }}
                        transition={{ duration: 0.18 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg group"
                          style={{ border: '1px solid var(--border-subtle)' }}
                        >
                          {/* Load button */}
                          <button
                            onClick={() => onLoad(preset.state as T)}
                            className="flex-1 text-left cursor-pointer min-w-0"
                            style={{ background: 'none', border: 'none' }}
                            aria-label={`Load preset: ${preset.name}`}
                          >
                            <p className="font-mono text-[11px] truncate" style={{ color: 'var(--text-2)' }}>
                              {preset.name}
                            </p>
                            <p className="font-mono text-[9px] mt-0.5" style={{ color: 'var(--text-3)' }}>
                              {getPresetAge(preset)}
                            </p>
                          </button>

                          {/* Share toggle (cloud only) */}
                          {isCloud && isCloudPreset(preset) && (
                            <button
                              onClick={() => togglePublic(preset.id, !preset.isPublic)}
                              className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded cursor-pointer transition-all duration-100"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: preset.isPublic ? '#6366f1' : 'var(--text-3)',
                                opacity: preset.isPublic ? 1 : 0,
                              }}
                              onMouseEnter={(e) => { if (!preset.isPublic) (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                              onMouseLeave={(e) => { if (!preset.isPublic) (e.currentTarget as HTMLButtonElement).style.opacity = '0'; }}
                              title={preset.isPublic ? 'Public — click to make private' : 'Private — click to share in /explore'}
                              aria-label={preset.isPublic ? 'Make private' : 'Share publicly'}
                            >
                              <GlobeIcon size={11} />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => remove(preset.id)}
                            className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-100"
                            style={{ background: 'none', border: 'none', color: 'var(--text-3)' }}
                            aria-label={`Delete preset: ${preset.name}`}
                          >
                            <TrashIcon size={11} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
