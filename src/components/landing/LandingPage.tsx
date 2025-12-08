'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { buildNeuCss, DEFAULT_NEU } from '@/src/lib/neumorphism';
import { buildGradientValue, DEFAULT_GRADIENT } from '@/src/lib/gradient';
import { buildShadowValue, DEFAULT_SHADOW } from '@/src/lib/shadow';
import { DEFAULT_TEXT_SHADOW, buildTextShadowValue } from '@/src/lib/text-shadow';
import { DEFAULT_TRANSFORM, buildTransformValue } from '@/src/lib/transform';
import { buildTextGradientValue } from '@/src/lib/text-gradient';

/* Compute default CSS values at module level — pure functions, no side effects. */
const DEFAULT_SHADOW_VALUE = buildShadowValue(DEFAULT_SHADOW);
const DEFAULT_GRADIENT_VALUE = buildGradientValue(DEFAULT_GRADIENT);
const DEFAULT_NEU_SHADOW = buildNeuCss(DEFAULT_NEU).find(l => l.property === 'box-shadow')?.value ?? 'none';
const DEFAULT_TEXT_SHADOW_VALUE = buildTextShadowValue(DEFAULT_TEXT_SHADOW);
const DEFAULT_TRANSFORM_VALUE = buildTransformValue({ ...DEFAULT_TRANSFORM, rotate: 12, scaleX: 1.1, scaleY: 1.1 });
const TEXT_GRADIENT_VALUE = buildTextGradientValue({ type: 'linear', angle: 135, stops: [{ id: '1', color: '#6366f1', position: 0 }, { id: '2', color: '#ec4899', position: 100 }] });

// ─── Arrow ────────────────────────────────────────────────────────────────────

function ArrowUpRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Effect previews ──────────────────────────────────────────────────────────

function ShadowPreviewCard() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <div style={{ width: '100px', height: '64px', borderRadius: '12px', background: 'var(--bg-surface)', boxShadow: DEFAULT_SHADOW_VALUE }} />
    </div>
  );
}

function GlassPreviewCard() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)' }}>
      <div style={{ width: '120px', height: '72px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.30)' }} />
    </div>
  );
}

function GradientPreviewCard() {
  return <div className="w-full h-full" style={{ background: DEFAULT_GRADIENT_VALUE }} />;
}

function NeuPreviewCard() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: DEFAULT_NEU.color }}>
      <div style={{ width: '80px', height: '80px', borderRadius: `${DEFAULT_NEU.borderRadius}px`, background: DEFAULT_NEU.color, boxShadow: DEFAULT_NEU_SHADOW }} />
    </div>
  );
}

function TextShadowPreviewCard() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <p className="font-mono font-bold select-none" style={{ fontSize: '52px', color: 'var(--text-1)', textShadow: DEFAULT_TEXT_SHADOW_VALUE, lineHeight: 1 }} aria-hidden="true">
        Aa
      </p>
    </div>
  );
}

function BorderRadiusPreviewCard() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)', gap: '12px' }}>
      {/* Three shapes with different radii to demo the tool */}
      {[4, 16, 9999].map((r) => (
        <div key={r} style={{ width: '52px', height: '52px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: `${r}px` }} />
      ))}
    </div>
  );
}

function FilterPreviewCard() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <div style={{ width: '120px', height: '80px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #ec4899)', filter: 'brightness(1.1) contrast(1.1) saturate(1.4)' }} />
    </div>
  );
}

function TransformPreviewCard() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <div style={{ width: '100px', height: '64px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', transform: DEFAULT_TRANSFORM_VALUE }} />
    </div>
  );
}

function TextGradientPreviewCard() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <p className="font-mono font-bold select-none" style={{ fontSize: '52px', background: TEXT_GRADIENT_VALUE, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', lineHeight: 1 }} aria-hidden="true">
        Aa
      </p>
    </div>
  );
}

function ScrollbarPreviewCard() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {[['#6366f1', '#e0e7ff'], ['#ec4899', '#fce7f3'], ['#10b981', '#d1fae5']].map(([thumb, track], i) => (
          <div key={i} style={{ width: '10px', height: '64px', background: track, borderRadius: '9999px', position: 'relative' }}>
            <div style={{ width: '10px', height: '28px', background: thumb, borderRadius: '9999px', position: 'absolute', top: '6px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ClipPathPreviewCard() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {[
          'polygon(50% 0%, 0% 100%, 100% 100%)',
          'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        ].map((cp, i) => (
          <div
            key={i}
            style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              clipPath: cp,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CubicBezierPreviewCard() {
  // Static SVG showing an ease-in-out curve
  const PAD = 10, SZ = 80;
  const p0 = { x: PAD, y: PAD + SZ };
  const p1 = { x: PAD + SZ * 0.42, y: PAD + SZ };
  const p2 = { x: PAD + SZ * 0.58, y: PAD };
  const p3 = { x: PAD + SZ, y: PAD };
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
        <rect x={PAD} y={PAD} width={SZ} height={SZ} fill="none" stroke="var(--border)" strokeWidth="1" />
        <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="var(--border)" strokeWidth="1" />
        <line x1={p3.x} y1={p3.y} x2={p2.x} y2={p2.y} stroke="var(--border)" strokeWidth="1" />
        <path
          d={`M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`}
          fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"
        />
        <circle cx={p1.x} cy={p1.y} r="4" fill="#6366f1" />
        <circle cx={p2.x} cy={p2.y} r="4" fill="#ec4899" />
      </svg>
    </div>
  );
}

function TypeScalePreviewCard() {
  const sizes = ['12px', '16px', '21px', '28px', '37px'];
  return (
    <div className="w-full h-full flex flex-col items-start justify-center gap-0.5 px-6" style={{ background: 'var(--preview-canvas)' }}>
      {sizes.map((sz, i) => (
        <p
          key={i}
          className="font-mono font-medium leading-none select-none"
          style={{ fontSize: sz, color: 'var(--text-1)', lineHeight: 1.15, opacity: 0.4 + i * 0.15 }}
          aria-hidden="true"
        >
          Aa
        </p>
      ))}
    </div>
  );
}

function TransitionPreviewCard() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <style>{`
        @keyframes lp-slide {
          0%, 100% { transform: translateX(-36px); opacity: 0.4; }
          50% { transform: translateX(36px); opacity: 1; }
        }
        .lp-transition-ball {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          animation: lp-slide 2s cubic-bezier(0.4,0,0.2,1) infinite;
        }
      `}</style>
      <div className="lp-transition-ball" />
    </div>
  );
}

function KeyframesPreviewCard() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <style>{`
        @keyframes lp-bounce {
          0%, 100% { transform: translateY(0) scaleY(1); }
          40% { transform: translateY(-32px) scaleY(1.1); }
          60% { transform: translateY(-20px) scaleY(0.95); }
        }
        .lp-bounce-ball {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #6366f1);
          animation: lp-bounce 1.4s ease-in-out infinite;
        }
      `}</style>
      <div className="lp-bounce-ball" />
    </div>
  );
}

function OutlinePreviewCard() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-4" style={{ background: 'var(--preview-canvas)' }}>
      <div style={{ width: '80px', height: '36px', borderRadius: '8px', background: '#6366f1', outline: '2px solid #6366f1', outlineOffset: '3px' }} />
      <div style={{ width: '80px', height: '36px', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border)', outline: '2px dashed #ec4899', outlineOffset: '3px' }} />
    </div>
  );
}

function ColorPalettePreviewCard() {
  // Static triadic palette swatches
  const groups = [
    ['#818cf8', '#6366f1', '#4f46e5', '#4338ca'],
    ['#34d399', '#10b981', '#059669', '#047857'],
    ['#f472b6', '#ec4899', '#db2777', '#be185d'],
  ];
  return (
    <div className="w-full h-full flex flex-col justify-center gap-2 px-5" style={{ background: 'var(--preview-canvas)' }}>
      {groups.map((group, gi) => (
        <div key={gi} className="flex rounded-lg overflow-hidden" style={{ height: '28px' }}>
          {group.map((hex, i) => (
            <div key={i} style={{ flex: 1, background: hex }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Card config ──────────────────────────────────────────────────────────────

type CardConfig = {
  href: string;
  label: string;
  description: string;
  preview: React.ReactNode;
};

const CARDS: CardConfig[] = [
  { href: '/shadow',        label: 'Shadow',        description: 'Multi-layer box-shadow with inset, spread, and opacity controls.',          preview: <ShadowPreviewCard /> },
  { href: '/glassmorphism', label: 'Glassmorphism',  description: 'Frosted glass with backdrop-blur, transparency, and border tuning.',         preview: <GlassPreviewCard /> },
  { href: '/gradient',      label: 'Gradient',       description: 'Linear, radial, and conic gradients with variable colour stops.',            preview: <GradientPreviewCard /> },
  { href: '/neumorphism',   label: 'Neumorphism',    description: 'Soft extrusion via dual light and dark shadows.',                            preview: <NeuPreviewCard /> },
  { href: '/text-shadow',   label: 'Text Shadow',    description: 'CSS text-shadow with font size and preview text controls.',                  preview: <TextShadowPreviewCard /> },
  { href: '/border-radius', label: 'Border Radius',  description: 'Uniform or per-corner border-radius with live preview.',                     preview: <BorderRadiusPreviewCard /> },
  { href: '/filter',        label: 'Filter',         description: 'CSS filter: blur, brightness, contrast, grayscale, hue-rotate, and more.',   preview: <FilterPreviewCard /> },
  { href: '/transform',     label: 'Transform',      description: 'CSS transform: rotate, scale, translate, and skew with live preview.',       preview: <TransformPreviewCard /> },
  { href: '/text-gradient', label: 'Text Gradient',  description: 'Gradient text via background-clip: text — linear and radial.',               preview: <TextGradientPreviewCard /> },
  { href: '/scrollbar',     label: 'Scrollbar',      description: 'Custom scrollbar: thumb, track, radius, and hover colours.',                 preview: <ScrollbarPreviewCard /> },
  { href: '/clip-path',     label: 'Clip-Path',      description: 'Polygon presets, circle, ellipse, and inset shapes with live preview.',       preview: <ClipPathPreviewCard /> },
  { href: '/cubic-bezier',  label: 'Cubic-Bezier',   description: 'Visual easing curve editor — drag handles, 8 presets, animated ball.',        preview: <CubicBezierPreviewCard /> },
  { href: '/type-scale',    label: 'Type Scale',     description: 'Modular font-size scale with 8 named ratios. Outputs CSS custom properties.', preview: <TypeScalePreviewCard /> },
  { href: '/color-palette', label: 'Color Palette',  description: 'Harmonious palettes via color theory: triadic, analogous, complementary.',    preview: <ColorPalettePreviewCard /> },
  { href: '/transition',    label: 'Transition',     description: 'Multi-layer CSS transition builder with per-property timing and hover preview.',  preview: <TransitionPreviewCard /> },
  { href: '/keyframes',     label: 'Keyframes',      description: 'CSS @keyframes animation builder — stops, presets, and animated preview.',         preview: <KeyframesPreviewCard /> },
  { href: '/outline',       label: 'Outline',        description: 'CSS outline and outline-offset generator with Tailwind ring-* output.',            preview: <OutlinePreviewCard /> },
];

// ─── Tool card ────────────────────────────────────────────────────────────────

function ToolCard({ href, label, description, preview, index, reduced }: CardConfig & { index: number; reduced: boolean }) {
  const delay = reduced ? 0 : 0.08 + index * 0.06;

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={reduced ? {} : { y: -3 }}
      className="group"
    >
      <Link
        href={href}
        className="block rounded-2xl overflow-hidden"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        {/* Effect preview */}
        <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
          {preview}
        </div>

        {/* Footer */}
        <div className="flex items-start justify-between gap-4 px-4 py-3.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="min-w-0">
            <p className="font-mono text-[12px] font-medium mb-0.5 tracking-tight" style={{ color: 'var(--text-1)' }}>{label}</p>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-3)' }}>{description}</p>
          </div>
          <span className="mt-0.5 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" style={{ color: 'var(--text-3)' }}>
            <ArrowUpRight />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Landing page ─────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function LandingPage() {
  const reduced = useReducedMotion() ?? false;
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' focuses the search box
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
      e.preventDefault();
      searchRef.current?.focus();
    }
    if (e.key === 'Escape') {
      setQuery('');
      searchRef.current?.blur();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const filtered = query.trim()
    ? CARDS.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase()),
      )
    : CARDS;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      {/* Hero */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: reduced ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h1 className="font-mono text-2xl font-medium tracking-tight mb-2" style={{ color: 'var(--text-1)' }}>
          CSS effects, without the guesswork.
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-3)', maxWidth: '480px' }}>
          Seventeen precision generators. Tweak in real-time, copy CSS, Tailwind, SCSS, or React — share with a link.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: reduced ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="relative max-w-xs">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-3)' }}
          >
            <SearchIcon />
          </span>
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search tools…`}
            className="w-full font-mono text-xs pl-8 pr-10 py-2 rounded-lg outline-none"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-1)',
            }}
            aria-label="Search tools"
          />
          {/* Keyboard hint / clear */}
          {query ? (
            <button
              onClick={() => { setQuery(''); searchRef.current?.focus(); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] px-1.5 py-0.5 rounded cursor-pointer"
              style={{ color: 'var(--text-3)', background: 'var(--border-subtle)', border: 'none' }}
              aria-label="Clear search"
            >
              esc
            </button>
          ) : (
            <span
              className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] px-1.5 py-0.5 rounded pointer-events-none"
              style={{ color: 'var(--text-3)', background: 'var(--border-subtle)' }}
            >
              /
            </span>
          )}
        </div>
      </motion.div>

      {/* Results count when filtering */}
      <AnimatePresence>
        {query.trim() && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="font-mono text-[11px] mb-4"
            style={{ color: 'var(--text-3)' }}
          >
            {filtered.length === 0
              ? 'No tools match.'
              : `${filtered.length} of ${CARDS.length} tools`}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Tool grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((card, i) => (
            <ToolCard key={card.href} {...card} index={i} reduced={reduced} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && query.trim() && (
        <div className="flex flex-col items-center py-20 gap-3">
          <p className="font-mono text-sm" style={{ color: 'var(--text-3)' }}>No generators found for &ldquo;{query}&rdquo;</p>
          <button
            onClick={() => setQuery('')}
            className="font-mono text-xs px-3 py-1.5 rounded-lg cursor-pointer"
            style={{ border: '1px solid var(--border)', color: 'var(--text-2)', background: 'transparent' }}
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
