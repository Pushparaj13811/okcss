'use client';

/*
 * PresetThumbnail
 *
 * Renders a compact visual preview of a saved preset's CSS output.
 * Used in /explore cards and /dashboard rows.
 *
 * Each tool type gets a hand-crafted renderer that reads the state and
 * applies the generated CSS. All renderers are wrapped in try/catch so
 * a malformed state never crashes the page.
 */

import { buildShadowValue } from '@/src/lib/shadow';
import { buildGradientValue } from '@/src/lib/gradient';
import { buildNeuCss } from '@/src/lib/neumorphism';
import { buildTextShadowValue } from '@/src/lib/text-shadow';
import { buildTransformValue } from '@/src/lib/transform';
import { buildTextGradientValue } from '@/src/lib/text-gradient';
import { buildFilterValue } from '@/src/lib/css-filter';
import { buildGlassCss } from '@/src/lib/glass';
import { buildBorderRadiusValue } from '@/src/lib/border-radius';
import { computePalette } from '@/src/lib/color-palette';
import { buildBezierValue } from '@/src/lib/cubic-bezier';
import { buildOutlineCss } from '@/src/lib/outline';
import { buildClipPathValue } from '@/src/lib/clip-path';
import { buildTransitionCss } from '@/src/lib/transition';

// ─── Helper ───────────────────────────────────────────────────────────────────

function safe<T>(fn: () => T, fallback: T): T {
  try { return fn(); } catch { return fallback; }
}

function s(state: unknown): Record<string, unknown> {
  return (state && typeof state === 'object') ? state as Record<string, unknown> : {};
}

// ─── Per-tool renderers ───────────────────────────────────────────────────────

function ShadowThumb({ state }: { state: unknown }) {
  const boxShadow = safe(() => buildShadowValue(s(state) as never), '0 4px 12px rgba(0,0,0,0.2)');
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <div style={{ width: '72px', height: '48px', borderRadius: '10px', background: 'var(--bg-surface)', boxShadow }} />
    </div>
  );
}

function GlassThumb({ state }: { state: unknown }) {
  const lines = safe(() => buildGlassCss(s(state) as never), []);
  const css: Record<string, string> = {};
  lines.forEach((l: { property: string; value: string }) => { css[l.property] = l.value; });
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
      <div style={{
        width: '96px', height: '64px', borderRadius: '12px',
        background: css['background'] ?? 'rgba(255,255,255,0.15)',
        backdropFilter: css['backdrop-filter'] ?? 'blur(12px)',
        WebkitBackdropFilter: css['backdrop-filter'] ?? 'blur(12px)',
        border: css['border'] ?? '1px solid rgba(255,255,255,0.3)',
      }} />
    </div>
  );
}

function GradientThumb({ state }: { state: unknown }) {
  const background = safe(() => buildGradientValue(s(state) as never), 'linear-gradient(135deg, #6366f1, #ec4899)');
  return <div className="w-full h-full" style={{ background }} />;
}

function NeuThumb({ state }: { state: unknown }) {
  const st = s(state);
  const lines = safe(() => buildNeuCss(st as never), []);
  const boxShadow = (lines as { property: string; value: string }[]).find(l => l.property === 'box-shadow')?.value ?? 'none';
  const bg = (st.color as string) ?? '#e0e5ec';
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: bg }}>
      <div style={{ width: '64px', height: '64px', borderRadius: `${(st.borderRadius as number) ?? 16}px`, background: bg, boxShadow }} />
    </div>
  );
}

function TextShadowThumb({ state }: { state: unknown }) {
  const textShadow = safe(() => buildTextShadowValue(s(state) as never), '2px 2px 4px rgba(0,0,0,0.3)');
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <p className="font-mono font-bold select-none" style={{ fontSize: '48px', color: 'var(--text-1)', textShadow, lineHeight: 1 }} aria-hidden="true">Aa</p>
    </div>
  );
}

function BorderRadiusThumb({ state }: { state: unknown }) {
  const borderRadius = safe(() => buildBorderRadiusValue(s(state) as never), '12px');
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #6366f1, #ec4899)', borderRadius }} />
    </div>
  );
}

function FilterThumb({ state }: { state: unknown }) {
  const filter = safe(() => buildFilterValue(s(state) as never), 'none');
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <div style={{ width: '96px', height: '64px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #ec4899)', filter }} />
    </div>
  );
}

function TransformThumb({ state }: { state: unknown }) {
  const transform = safe(() => buildTransformValue(s(state) as never), 'none');
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <div style={{ width: '72px', height: '48px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', transform }} />
    </div>
  );
}

function TextGradientThumb({ state }: { state: unknown }) {
  const background = safe(() => buildTextGradientValue(s(state) as never), 'linear-gradient(135deg, #6366f1, #ec4899)');
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <p className="font-mono font-bold select-none" style={{
        fontSize: '48px', lineHeight: 1,
        background, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
      }} aria-hidden="true">Aa</p>
    </div>
  );
}

function ScrollbarThumb() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-3" style={{ background: 'var(--preview-canvas)' }}>
      {[['#6366f1', '#e0e7ff'], ['#ec4899', '#fce7f3'], ['#10b981', '#d1fae5']].map(([thumb, track], i) => (
        <div key={i} style={{ width: '10px', height: '56px', background: track, borderRadius: '9999px', position: 'relative' }}>
          <div style={{ width: '10px', height: '24px', background: thumb, borderRadius: '9999px', position: 'absolute', top: '6px' }} />
        </div>
      ))}
    </div>
  );
}

function ClipPathThumb({ state }: { state: unknown }) {
  const clipPath = safe(() => buildClipPathValue(s(state) as never), 'polygon(50% 0%, 0% 100%, 100% 100%)');
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #6366f1, #ec4899)', clipPath }} />
    </div>
  );
}

function CubicBezierThumb({ state }: { state: unknown }) {
  const st = s(state);
  const x1 = (st.x1 as number) ?? 0.42;
  const y1 = (st.y1 as number) ?? 0;
  const x2 = (st.x2 as number) ?? 0.58;
  const y2 = (st.y2 as number) ?? 1;
  const PAD = 10, SZ = 76;
  const p0 = { x: PAD, y: PAD + SZ };
  const p1 = { x: PAD + x1 * SZ, y: PAD + (1 - y1) * SZ };
  const p2 = { x: PAD + x2 * SZ, y: PAD + (1 - y2) * SZ };
  const p3 = { x: PAD + SZ, y: PAD };
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
        <rect x={PAD} y={PAD} width={SZ} height={SZ} fill="none" stroke="var(--border)" strokeWidth="1" />
        <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="var(--border)" strokeWidth="1" />
        <line x1={p3.x} y1={p3.y} x2={p2.x} y2={p2.y} stroke="var(--border)" strokeWidth="1" />
        <path d={`M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`}
          fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={p1.x} cy={p1.y} r="4" fill="#6366f1" />
        <circle cx={p2.x} cy={p2.y} r="4" fill="#ec4899" />
      </svg>
    </div>
  );
}

function TypeScaleThumb() {
  const sizes = ['10px', '13px', '17px', '22px', '30px'];
  return (
    <div className="w-full h-full flex flex-col items-start justify-center gap-0.5 px-5" style={{ background: 'var(--preview-canvas)' }}>
      {sizes.map((sz, i) => (
        <p key={i} className="font-mono font-medium leading-none select-none"
          style={{ fontSize: sz, color: 'var(--text-1)', lineHeight: 1.15, opacity: 0.35 + i * 0.16 }} aria-hidden="true">Aa</p>
      ))}
    </div>
  );
}

function ColorPaletteThumb({ state }: { state: unknown }) {
  const swatches = safe(() => computePalette(s(state) as never), []);
  if (!swatches.length) {
    return (
      <div className="w-full h-full flex" style={{ background: 'linear-gradient(90deg, #818cf8, #6366f1, #4f46e5)' }} />
    );
  }
  const maxSwatches = Math.min(swatches.length, 8);
  const visible = swatches.slice(0, maxSwatches);
  return (
    <div className="w-full h-full flex">
      {visible.map((sw: { hex: string; name: string }) => (
        <div key={sw.name} style={{ flex: 1, background: sw.hex }} />
      ))}
    </div>
  );
}

function TransitionThumb({ state }: { state: unknown }) {
  const lines = safe(() => buildTransitionCss(s(state) as never), []);
  const transition = (lines as { property: string; value: string }[]).find(l => l.property === 'transition')?.value ?? 'all 300ms ease';
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <style>{`
        @keyframes thumb-slide-${encodeURIComponent(transition).slice(0, 8)} {
          0%, 100% { transform: translateX(-28px); opacity: 0.5; }
          50% { transform: translateX(28px); opacity: 1; }
        }
      `}</style>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
        animation: `thumb-slide-${encodeURIComponent(transition).slice(0, 8)} 2s ${transition.split(' ').slice(2).join(' ') || 'ease'} infinite`,
      }} />
    </div>
  );
}

function KeyframesThumb() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <style>{`
        @keyframes thumb-kf-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        .thumb-kf-ball { animation: thumb-kf-bounce 1.2s ease-in-out infinite; }
      `}</style>
      <div className="thumb-kf-ball" style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #6366f1)',
      }} />
    </div>
  );
}

function OutlineThumb({ state }: { state: unknown }) {
  const lines = safe(() => buildOutlineCss(s(state) as never), []);
  const css: Record<string, string> = {};
  (lines as { property: string; value: string }[]).forEach(l => { css[l.property] = l.value; });
  return (
    <div className="w-full h-full flex items-center justify-center gap-4" style={{ background: 'var(--preview-canvas)' }}>
      <div style={{
        width: '72px', height: '32px', borderRadius: '8px',
        background: '#6366f1',
        outline: css['outline'] ?? '2px solid #6366f1',
        outlineOffset: css['outline-offset'] ?? '2px',
        opacity: css['opacity'] ? parseFloat(css['opacity']) : 1,
      }} />
    </div>
  );
}

function FallbackThumb({ tool }: { tool: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--preview-canvas)' }}>
      <span className="font-mono text-[10px]" style={{ color: 'var(--text-3)' }}>{tool}</span>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

type Props = {
  tool: string;
  state: unknown;
  height?: number;
};

export function PresetThumbnail({ tool, state, height = 120 }: Props) {
  let inner: React.ReactNode;

  switch (tool) {
    case 'shadow':        inner = <ShadowThumb state={state} />; break;
    case 'glassmorphism': inner = <GlassThumb state={state} />; break;
    case 'gradient':      inner = <GradientThumb state={state} />; break;
    case 'neumorphism':   inner = <NeuThumb state={state} />; break;
    case 'text-shadow':   inner = <TextShadowThumb state={state} />; break;
    case 'border-radius': inner = <BorderRadiusThumb state={state} />; break;
    case 'filter':        inner = <FilterThumb state={state} />; break;
    case 'transform':     inner = <TransformThumb state={state} />; break;
    case 'text-gradient': inner = <TextGradientThumb state={state} />; break;
    case 'scrollbar':     inner = <ScrollbarThumb />; break;
    case 'clip-path':     inner = <ClipPathThumb state={state} />; break;
    case 'cubic-bezier':  inner = <CubicBezierThumb state={state} />; break;
    case 'type-scale':    inner = <TypeScaleThumb />; break;
    case 'color-palette': inner = <ColorPaletteThumb state={state} />; break;
    case 'transition':    inner = <TransitionThumb state={state} />; break;
    case 'keyframes':     inner = <KeyframesThumb />; break;
    case 'outline':       inner = <OutlineThumb state={state} />; break;
    default:              inner = <FallbackThumb tool={tool} />; break;
  }

  return (
    <div
      className="w-full overflow-hidden rounded-lg"
      style={{ height: `${height}px`, flexShrink: 0 }}
    >
      {inner}
    </div>
  );
}
