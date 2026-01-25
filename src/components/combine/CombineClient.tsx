'use client';

/*
 * CombineClient — multi-generator element builder.
 *
 * Pick any mix of CSS tools and see their output applied to one element.
 * Copy the merged CSS in one click.
 */

import { useState, useMemo, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopyButton } from '@/src/components/ui/CopyButton';

// ── Lib builders ──────────────────────────────────────────────────────────────
import {
  buildShadowValue, DEFAULT_SHADOW, makeLayer,
  type ShadowState, type ShadowLayer,
} from '@/src/lib/shadow';
import { buildBorderRadiusValue, DEFAULT_BORDER_RADIUS, type BorderRadiusState } from '@/src/lib/border-radius';
import { buildFilterValue, DEFAULT_FILTER, type FilterState } from '@/src/lib/css-filter';
import { buildTransformValue, DEFAULT_TRANSFORM, type TransformState } from '@/src/lib/transform';
import { buildGradientValue, DEFAULT_GRADIENT, type GradientState } from '@/src/lib/gradient';
import { buildGlassCss, DEFAULT_GLASS, type GlassState } from '@/src/lib/glass';
import { buildOutlineCss, DEFAULT_OUTLINE, type OutlineState } from '@/src/lib/outline';
import { buildClipPathValue, DEFAULT_CLIP_PATH, type ClipPathState } from '@/src/lib/clip-path';
import { buildTransitionCss, DEFAULT_TRANSITION, type TransitionState } from '@/src/lib/transition';

// ── Controls ──────────────────────────────────────────────────────────────────
import { ShadowControls } from '@/src/components/shadow/ShadowControls';
import { BorderRadiusControls } from '@/src/components/border-radius/BorderRadiusControls';
import { FilterControls } from '@/src/components/css-filter/FilterControls';
import { TransformControls } from '@/src/components/transform/TransformControls';
import { GradientControls } from '@/src/components/gradient/GradientControls';
import { GlassControls } from '@/src/components/glassmorphism/GlassControls';
import { OutlineControls } from '@/src/components/outline/OutlineControls';
import { ClipPathControls } from '@/src/components/clip-path/ClipPathControls';
import { TransitionControls } from '@/src/components/transition/TransitionControls';

// ─── Tool registry ────────────────────────────────────────────────────────────

const TOOLS = [
  { slug: 'shadow',        label: 'Shadow',       color: '#6366f1' },
  { slug: 'border-radius', label: 'Border Radius', color: '#8b5cf6' },
  { slug: 'gradient',      label: 'Gradient',      color: '#ec4899' },
  { slug: 'glassmorphism', label: 'Glass',         color: '#06b6d4' },
  { slug: 'filter',        label: 'Filter',        color: '#f59e0b' },
  { slug: 'transform',     label: 'Transform',     color: '#10b981' },
  { slug: 'clip-path',     label: 'Clip-Path',     color: '#ef4444' },
  { slug: 'outline',       label: 'Outline',       color: '#3b82f6' },
  { slug: 'transition',    label: 'Transition',    color: '#a78bfa' },
] as const;

type ToolSlug = typeof TOOLS[number]['slug'];

// ─── Combined CSS builder ─────────────────────────────────────────────────────

type CombineState = {
  shadow:         ShadowState;
  'border-radius': BorderRadiusState;
  gradient:       GradientState;
  glassmorphism:  GlassState;
  filter:         FilterState;
  transform:      TransformState;
  'clip-path':    ClipPathState;
  outline:        OutlineState;
  transition:     TransitionState;
};

type CssLine = { property: string; value: string };

function buildCombinedLines(enabled: Set<ToolSlug>, s: CombineState): CssLine[] {
  const lines: CssLine[] = [];

  if (enabled.has('shadow')) {
    const v = buildShadowValue(s.shadow);
    if (v !== 'none') lines.push({ property: 'box-shadow', value: v });
  }
  if (enabled.has('border-radius')) {
    lines.push({ property: 'border-radius', value: buildBorderRadiusValue(s['border-radius']) });
  }
  if (enabled.has('gradient') && !enabled.has('glassmorphism')) {
    lines.push({ property: 'background', value: buildGradientValue(s.gradient) });
  }
  if (enabled.has('glassmorphism')) {
    buildGlassCss(s.glassmorphism).forEach(l => lines.push(l));
  }
  if (enabled.has('filter')) {
    const v = buildFilterValue(s.filter);
    if (v !== 'none') lines.push({ property: 'filter', value: v });
  }
  if (enabled.has('transform')) {
    const v = buildTransformValue(s.transform);
    if (v !== 'none') lines.push({ property: 'transform', value: v });
  }
  if (enabled.has('clip-path')) {
    lines.push({ property: 'clip-path', value: buildClipPathValue(s['clip-path']) });
  }
  if (enabled.has('outline')) {
    buildOutlineCss(s.outline).forEach(l => lines.push(l));
  }
  if (enabled.has('transition')) {
    buildTransitionCss(s.transition).forEach(l => lines.push(l));
  }

  return lines;
}

function linesToCopyText(lines: CssLine[]): string {
  return lines.map(l => `${l.property}: ${l.value};`).join('\n');
}

function linesToStyle(lines: CssLine[]): CSSProperties {
  const style: Record<string, string> = {};
  const camel = (s: string) => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
  for (const l of lines) {
    if (!l.property.startsWith('-webkit-') && !l.property.startsWith('-moz-')) {
      style[camel(l.property)] = l.value;
    }
    if (l.property === 'backdrop-filter') style['WebkitBackdropFilter'] = l.value;
  }
  return style as CSSProperties;
}

// ─── ChevronIcon ──────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
    >
      <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CombineClient() {
  const [enabled, setEnabled] = useState<Set<ToolSlug>>(new Set(['shadow', 'border-radius']));
  const [expanded, setExpanded] = useState<Set<ToolSlug>>(new Set(['shadow', 'border-radius']));

  // Per-tool state
  const [shadowState, setShadow] = useState<ShadowState>(DEFAULT_SHADOW);
  const [brState, setBr]         = useState<BorderRadiusState>(DEFAULT_BORDER_RADIUS);
  const [gradState, setGrad]     = useState<GradientState>(DEFAULT_GRADIENT);
  const [glassState, setGlass]   = useState<GlassState>(DEFAULT_GLASS);
  const [filterState, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [transState, setTransform] = useState<TransformState>(DEFAULT_TRANSFORM);
  const [clipState, setClip]     = useState<ClipPathState>(DEFAULT_CLIP_PATH);
  const [outlineState, setOutline] = useState<OutlineState>(DEFAULT_OUTLINE);
  const [transitionState, setTransition] = useState<TransitionState>(DEFAULT_TRANSITION);

  // ── Shadow layer handlers (mirrors ShadowGenerator) ──────────────────────
  const updateShadowLayer = <K extends keyof ShadowLayer>(id: string, key: K, value: ShadowLayer[K]) =>
    setShadow(s => ({ layers: s.layers.map(l => l.id === id ? { ...l, [key]: value } : l) }));
  const addShadowLayer    = () => setShadow(s => ({ layers: [...s.layers, makeLayer({ x: 0, y: 8, blur: 24, spread: -4 })] }));
  const deleteShadowLayer = (id: string) => setShadow(s => ({ layers: s.layers.length > 1 ? s.layers.filter(l => l.id !== id) : s.layers }));
  const dupShadowLayer    = (id: string) => setShadow(s => {
    const src = s.layers.find(l => l.id === id);
    if (!src) return s;
    const dup = makeLayer({ ...src });
    const idx = s.layers.findIndex(l => l.id === id);
    const next = [...s.layers];
    next.splice(idx + 1, 0, dup);
    return { layers: next };
  });
  const reorderShadow = (from: number, to: number) => setShadow(s => {
    const next = [...s.layers];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return { layers: next };
  });

  const combineState: CombineState = {
    shadow: shadowState, 'border-radius': brState, gradient: gradState,
    glassmorphism: glassState, filter: filterState, transform: transState,
    'clip-path': clipState, outline: outlineState, transition: transitionState,
  };

  const lines      = useMemo(() => buildCombinedLines(enabled, combineState), [enabled, combineState]);
  const copyText   = linesToCopyText(lines);
  const previewStyle = useMemo(() => linesToStyle(lines), [lines]);

  const toggleTool = (slug: ToolSlug) => {
    setEnabled(prev => {
      const next = new Set(prev);
      if (next.has(slug)) { next.delete(slug); }
      else { next.add(slug); setExpanded(e => new Set([...e, slug])); }
      return next;
    });
  };

  const toggleExpand = (slug: ToolSlug) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-medium tracking-tight mb-1" style={{ color: 'var(--text-1)' }}>
          Combine
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-3)', maxWidth: '520px' }}>
          Stack multiple CSS properties onto one element. Toggle tools, tweak values, copy the merged output.
        </p>
      </div>

      {/* Tool picker */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TOOLS.map(tool => {
          const active = enabled.has(tool.slug);
          return (
            <button
              key={tool.slug}
              onClick={() => toggleTool(tool.slug)}
              className="font-mono text-[11px] px-3 py-1 rounded-full cursor-pointer transition-all duration-150"
              style={{
                background: active ? tool.color : 'var(--bg-surface)',
                color: active ? '#fff' : 'var(--text-3)',
                border: `1px solid ${active ? tool.color : 'var(--border)'}`,
              }}
            >
              {active ? '✓ ' : '+ '}{tool.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── Left: Controls panels ── */}
        <div className="flex flex-col gap-3">
          {enabled.size === 0 && (
            <div className="text-center py-16">
              <p className="font-mono text-sm" style={{ color: 'var(--text-3)' }}>
                Select tools above to start combining.
              </p>
            </div>
          )}

          <AnimatePresence>
            {TOOLS.filter(t => enabled.has(t.slug)).map(tool => (
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
              >
                {/* Panel header */}
                <button
                  onClick={() => toggleExpand(tool.slug)}
                  className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
                  style={{ background: 'none', border: 'none' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tool.color }} />
                    <span className="font-mono text-[12px] font-medium" style={{ color: 'var(--text-1)' }}>
                      {tool.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleTool(tool.slug); }}
                      className="font-mono text-[10px] px-2 py-0.5 rounded cursor-pointer"
                      style={{ color: '#ef4444', background: 'none', border: 'none' }}
                    >
                      remove
                    </button>
                    <span style={{ color: 'var(--text-3)' }}><ChevronIcon open={expanded.has(tool.slug)} /></span>
                  </div>
                </button>

                {/* Panel body */}
                <AnimatePresence initial={false}>
                  {expanded.has(tool.slug) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-4 pb-4 pt-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        {tool.slug === 'shadow' && (
                          <ShadowControls
                            state={shadowState}
                            onUpdateLayer={updateShadowLayer}
                            onAddLayer={addShadowLayer}
                            onDeleteLayer={deleteShadowLayer}
                            onDuplicateLayer={dupShadowLayer}
                            onReorder={reorderShadow}
                            onReset={() => setShadow(DEFAULT_SHADOW)}
                          />
                        )}
                        {tool.slug === 'border-radius' && (
                          <BorderRadiusControls
                            state={brState}
                            onChange={(key, val) => setBr(s => ({ ...s, [key]: val }))}
                            onReset={() => setBr(DEFAULT_BORDER_RADIUS)}
                          />
                        )}
                        {tool.slug === 'gradient' && (
                          <GradientControls
                            state={gradState}
                            onChange={(key, val) => setGrad(s => ({ ...s, [key]: val }))}
                            onReset={() => setGrad(DEFAULT_GRADIENT)}
                          />
                        )}
                        {tool.slug === 'glassmorphism' && (
                          <GlassControls
                            state={glassState}
                            onChange={(key, val) => setGlass(s => ({ ...s, [key]: val }))}
                            onReset={() => setGlass(DEFAULT_GLASS)}
                          />
                        )}
                        {tool.slug === 'filter' && (
                          <FilterControls
                            state={filterState}
                            onChange={(key, val) => setFilter(s => ({ ...s, [key]: val }))}
                            onReset={() => setFilter(DEFAULT_FILTER)}
                          />
                        )}
                        {tool.slug === 'transform' && (
                          <TransformControls
                            state={transState}
                            onChange={(key, val) => setTransform(s => ({ ...s, [key]: val }))}
                            onReset={() => setTransform(DEFAULT_TRANSFORM)}
                          />
                        )}
                        {tool.slug === 'clip-path' && (
                          <ClipPathControls
                            state={clipState}
                            onChange={(key, val) => setClip(s => ({ ...s, [key]: val }))}
                            onReset={() => setClip(DEFAULT_CLIP_PATH)}
                          />
                        )}
                        {tool.slug === 'outline' && (
                          <OutlineControls
                            state={outlineState}
                            onChange={(key, val) => setOutline(s => ({ ...s, [key]: val }))}
                            onReset={() => setOutline(DEFAULT_OUTLINE)}
                          />
                        )}
                        {tool.slug === 'transition' && (
                          <TransitionControls
                            state={transitionState}
                            onChange={setTransition}
                            onReset={() => setTransition(DEFAULT_TRANSITION)}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Right: Preview + Output ── */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-20">
          {/* Preview */}
          <div
            className="w-full rounded-xl overflow-hidden flex items-center justify-center"
            style={{ height: '240px', border: '1px solid var(--border)' }}
          >
            {enabled.has('glassmorphism') ? (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
              >
                <div style={{ width: '140px', height: '90px', ...previewStyle,
                  background: enabled.has('gradient') ? buildGradientValue(gradState) : (previewStyle as Record<string, string>)['background'] ?? undefined,
                }} />
              </div>
            ) : (
              <div style={{ background: 'var(--preview-canvas)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '140px', height: '90px',
                  background: enabled.has('gradient')
                    ? buildGradientValue(gradState)
                    : 'linear-gradient(135deg, #6366f1, #ec4899)',
                  ...previewStyle,
                }} />
              </div>
            )}
          </div>

          {/* CSS output */}
          <div className="rounded-xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px]" style={{ color: 'var(--text-3)' }}>
                {lines.length} propert{lines.length === 1 ? 'y' : 'ies'} combined
              </span>
              <CopyButton text={copyText} />
            </div>
            {lines.length === 0 ? (
              <p className="font-mono text-[12px]" style={{ color: 'var(--text-3)' }}>Enable tools above to see output.</p>
            ) : (
              <div className="flex flex-col gap-0.5">
                {lines.map((line, i) => (
                  <p key={`${line.property}-${i}`} className="font-mono text-[12px] leading-relaxed break-all">
                    <span style={{ color: 'var(--text-3)' }}>{line.property}</span>
                    <span style={{ color: 'var(--text-2)' }}>: </span>
                    <span style={{ color: 'var(--text-1)' }}>{line.value}</span>
                    <span style={{ color: 'var(--text-3)' }}>;</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {enabled.has('gradient') && enabled.has('glassmorphism') && (
            <p className="font-mono text-[10px] px-1" style={{ color: '#f59e0b' }}>
              ⚠ Gradient background is overridden by Glassmorphism when both are active.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
