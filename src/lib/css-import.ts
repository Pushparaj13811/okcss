/*
 * css-import.ts
 *
 * Shared CSS parser utilities. Paste any CSS snippet (bare declarations,
 * a selector block, a :root {} block, or a CSS variables block) and get
 * back a flat Record<property, value> that per-tool parsers can consume.
 *
 * Each exported `xxxFromCss(props)` function reads the relevant properties
 * and returns a partial state that can be spread into the generator's state.
 */

import type { ShadowState, ShadowLayer } from './shadow';
import type { GlassState } from './glass';
import type { GradientState, ColorStop } from './gradient';
import type { TextShadowState } from './text-shadow';
import type { BorderRadiusState } from './border-radius';
import type { FilterState } from './css-filter';
import type { TransformState } from './transform';
import type { ClipPathState, ClipPathType } from './clip-path';
import type { TransitionState, TransitionLayer } from './transition';
import type { OutlineState, OutlineStyle } from './outline';
import type { CubicBezierState } from './cubic-bezier';

// ─── Shared parser ────────────────────────────────────────────────────────────

/**
 * Parses a CSS snippet into a flat property→value map.
 * Handles: bare declarations, selector { ... }, :root { ... }, CSS vars (-- stripped).
 */
export function parseCssProps(css: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of css.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('@')) continue;
    if (trimmed.includes('{') || trimmed === '}') continue;
    const colon = trimmed.indexOf(':');
    if (colon === -1) continue;
    let prop = trimmed.slice(0, colon).trim().toLowerCase();
    const val = trimmed.slice(colon + 1).trim().replace(/;$/, '').trim();
    if (prop.startsWith('--')) prop = prop.slice(2);
    if (prop && val) result[prop] = val;
  }
  return result;
}

// ─── Color helpers ────────────────────────────────────────────────────────────

export function parseColor(val: string): { hex: string; opacity: number } | null {
  val = val.trim();
  if (val.startsWith('#')) {
    let hex = val;
    if (hex.length === 4) hex = '#' + hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
    return { hex: hex.slice(0, 7).toLowerCase(), opacity: 1 };
  }
  const rgba = val.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (rgba) {
    const [, r, g, b, a] = rgba;
    const hex = '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    return { hex, opacity: a !== undefined ? parseFloat(a) : 1 };
  }
  return null;
}

/** Split a CSS value by top-level commas (ignoring commas inside parens). */
function splitTopLevel(str: string, sep = ','): string[] {
  const parts: string[] = [];
  let depth = 0, current = '';
  for (const ch of str) {
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (ch === sep && depth === 0) { parts.push(current.trim()); current = ''; }
    else current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/** Split a string on spaces, but keep paren groups together. */
function splitSpaces(str: string): string[] {
  const parts: string[] = [];
  let depth = 0, current = '';
  for (const ch of str) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (ch === ' ' && depth === 0) {
      if (current.trim()) { parts.push(current.trim()); current = ''; }
    } else current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function parsePx(s: string): number | null {
  const m = s.match(/^([+-]?[\d.]+)(?:px)?$/);
  return m ? parseFloat(m[1]) : null;
}

function parsePct(s: string): number | null {
  const m = s.match(/^([+-]?[\d.]+)%?$/);
  return m ? parseFloat(m[1]) : null;
}

function parseDeg(s: string): number | null {
  const m = s.match(/^([+-]?[\d.]+)(?:deg)?$/);
  return m ? parseFloat(m[1]) : null;
}

function parseMs(s: string): number | null {
  const ms = s.match(/^([+-]?[\d.]+)ms$/);
  if (ms) return parseFloat(ms[1]);
  const sec = s.match(/^([+-]?[\d.]+)s$/);
  if (sec) return parseFloat(sec[1]) * 1000;
  return null;
}

// ─── Shadow ───────────────────────────────────────────────────────────────────

let _layerCounter = 10000;

function parseSingleShadow(token: string): ShadowLayer | null {
  token = token.trim();
  const inset = /^inset\s+/.test(token);
  if (inset) token = token.replace(/^inset\s+/, '');

  const parts = splitSpaces(token);
  // Find color: anything starting with # or rgb/hsl
  const colorIdx = parts.findIndex(p => p.startsWith('#') || p.startsWith('rgb') || p.startsWith('hsl'));
  const colorStr = colorIdx !== -1 ? parts[colorIdx] : parts[parts.length - 1];
  const numParts = colorIdx !== -1 ? parts.slice(0, colorIdx) : parts.slice(0, -1);

  const nums = numParts.map(p => parsePx(p) ?? parseFloat(p));
  if (nums.length < 2 || nums.some(isNaN)) return null;

  const [x = 0, y = 0, blur = 0, spread = 0] = nums;
  const colorParsed = parseColor(colorStr);
  if (!colorParsed) return null;

  return {
    id: `imported-${++_layerCounter}`,
    x, y, blur, spread,
    color: colorParsed.hex,
    opacity: colorParsed.opacity,
    inset,
    enabled: true,
  };
}

export function shadowFromCss(props: Record<string, string>): Partial<ShadowState> | null {
  const raw = props['box-shadow'];
  if (!raw || raw === 'none') return null;
  const layers = splitTopLevel(raw).map(parseSingleShadow).filter(Boolean) as ShadowLayer[];
  return layers.length ? { layers } : null;
}

// ─── Glassmorphism ────────────────────────────────────────────────────────────

export function glassFromCss(props: Record<string, string>): Partial<GlassState> | null {
  const result: Partial<GlassState> = {};
  let found = false;

  const bg = props['background'] ?? props['background-color'];
  if (bg) {
    const c = parseColor(bg);
    if (c) { result.bgColor = c.hex; result.bgOpacity = c.opacity; found = true; }
  }

  const bf = props['backdrop-filter'] ?? props['-webkit-backdrop-filter'];
  if (bf) {
    const m = bf.match(/blur\(([\d.]+)px\)/);
    if (m) { result.blur = parseFloat(m[1]); found = true; }
  }

  const border = props['border'];
  if (border) {
    // e.g. "1px solid rgba(255,255,255,0.3)"
    const colorPart = border.split(' ').find(p => p.startsWith('#') || p.startsWith('rgb'));
    if (colorPart) {
      const c = parseColor(colorPart);
      if (c) { result.borderColor = c.hex; result.borderOpacity = c.opacity; found = true; }
    }
  }

  const br = props['border-radius'];
  if (br) {
    const n = parsePx(br.split(' ')[0]);
    if (n !== null) { result.borderRadius = n; found = true; }
  }

  return found ? result : null;
}

// ─── Gradient ─────────────────────────────────────────────────────────────────

let _stopCounter = 10000;

function makeImportedStop(color: string, position: number): ColorStop {
  return { id: `import-stop-${++_stopCounter}`, color, position };
}

export function gradientFromCss(props: Record<string, string>): Partial<GradientState> | null {
  const raw = props['background'] ?? props['background-image'];
  if (!raw) return null;

  const linMatch = raw.match(/linear-gradient\((.+)\)/);
  const radMatch = raw.match(/radial-gradient\((.+)\)/);
  const conMatch = raw.match(/conic-gradient\((.+)\)/);

  const parseStops = (stopsStr: string): ColorStop[] => {
    const parts = splitTopLevel(stopsStr);
    const stops: ColorStop[] = [];
    parts.forEach((part, i) => {
      const tokens = part.trim().split(/\s+/);
      const colorToken = tokens.find(t => t.startsWith('#') || t.startsWith('rgb') || t.startsWith('hsl'));
      if (!colorToken) return;
      const c = parseColor(colorToken);
      if (!c) return;
      const posToken = tokens.find(t => t.endsWith('%'));
      const pos = posToken ? parseFloat(posToken) : Math.round((i / Math.max(parts.length - 1, 1)) * 100);
      stops.push(makeImportedStop(c.hex, pos));
    });
    return stops.length >= 2 ? stops : [];
  };

  if (linMatch) {
    const inner = linMatch[1];
    const parts = splitTopLevel(inner);
    let angle = 135;
    let stopsStart = 0;
    const firstPart = parts[0].trim();
    if (firstPart.endsWith('deg')) { angle = parseFloat(firstPart); stopsStart = 1; }
    else if (firstPart.startsWith('to ')) { stopsStart = 1; }
    const stops = parseStops(parts.slice(stopsStart).join(','));
    if (!stops.length) return null;
    return { type: 'linear', angle, stops };
  }
  if (radMatch) {
    const stops = parseStops(radMatch[1]);
    if (!stops.length) return null;
    return { type: 'radial', angle: 135, stops };
  }
  if (conMatch) {
    const stops = parseStops(conMatch[1]);
    if (!stops.length) return null;
    return { type: 'conic', angle: 0, stops };
  }
  return null;
}

// ─── Text Shadow ──────────────────────────────────────────────────────────────

export function textShadowFromCss(props: Record<string, string>): Partial<TextShadowState> | null {
  const raw = props['text-shadow'];
  if (!raw || raw === 'none') return null;
  // text-shadow has no spread, just: x y blur color
  const parts = splitSpaces(raw);
  const colorIdx = parts.findIndex(p => p.startsWith('#') || p.startsWith('rgb') || p.startsWith('hsl'));
  const colorStr = colorIdx !== -1 ? parts[colorIdx] : parts[parts.length - 1];
  const numParts = colorIdx !== -1 ? parts.slice(0, colorIdx) : parts.slice(0, -1);
  const nums = numParts.map(p => parsePx(p) ?? parseFloat(p));
  if (nums.length < 2) return null;
  const [x = 0, y = 0, blur = 0] = nums;
  const c = parseColor(colorStr);
  if (!c) return null;
  return { x, y, blur, color: c.hex, opacity: c.opacity };
}

// ─── Border Radius ────────────────────────────────────────────────────────────

export function borderRadiusFromCss(props: Record<string, string>): Partial<BorderRadiusState> | null {
  const raw = props['border-radius'];
  if (!raw) return null;
  const parts = raw.split(/\s+/);
  const nums = parts.map(p => parsePx(p)).filter((n): n is number => n !== null);
  if (!nums.length) return null;
  if (nums.length === 1) return { mode: 'uniform', uniform: nums[0], topLeft: nums[0], topRight: nums[0], bottomRight: nums[0], bottomLeft: nums[0] };
  if (nums.length >= 4) return { mode: 'individual', uniform: nums[0], topLeft: nums[0], topRight: nums[1], bottomRight: nums[2], bottomLeft: nums[3] };
  if (nums.length === 2) return { mode: 'individual', uniform: nums[0], topLeft: nums[0], topRight: nums[1], bottomRight: nums[0], bottomLeft: nums[1] };
  if (nums.length === 3) return { mode: 'individual', uniform: nums[0], topLeft: nums[0], topRight: nums[1], bottomRight: nums[2], bottomLeft: nums[1] };
  return null;
}

// ─── Filter ───────────────────────────────────────────────────────────────────

export function filterFromCss(props: Record<string, string>): Partial<FilterState> | null {
  const raw = props['filter'];
  if (!raw || raw === 'none') return null;
  const result: Partial<FilterState> = {};
  let found = false;
  const fns = raw.match(/\w[\w-]*\([^)]+\)/g) ?? [];
  for (const fn of fns) {
    const name = fn.match(/^([\w-]+)/)?.[1];
    const val = fn.match(/\(([^)]+)\)/)?.[1] ?? '';
    if (!name) continue;
    switch (name) {
      case 'blur':       { const n = parsePx(val); if (n !== null) { result.blur = n; found = true; } break; }
      case 'brightness': { const n = parsePct(val.replace('%','')); if (n !== null) { result.brightness = n; found = true; } break; }
      case 'contrast':   { const n = parsePct(val.replace('%','')); if (n !== null) { result.contrast = n; found = true; } break; }
      case 'grayscale':  { const n = parsePct(val.replace('%','')); if (n !== null) { result.grayscale = n; found = true; } break; }
      case 'hue-rotate': { const n = parseDeg(val.replace('deg','')); if (n !== null) { result.hueRotate = n; found = true; } break; }
      case 'invert':     { const n = parsePct(val.replace('%','')); if (n !== null) { result.invert = n; found = true; } break; }
      case 'saturate':   { const n = parsePct(val.replace('%','')); if (n !== null) { result.saturate = n; found = true; } break; }
      case 'sepia':      { const n = parsePct(val.replace('%','')); if (n !== null) { result.sepia = n; found = true; } break; }
    }
  }
  return found ? result : null;
}

// ─── Transform ────────────────────────────────────────────────────────────────

export function transformFromCss(props: Record<string, string>): Partial<TransformState> | null {
  const raw = props['transform'];
  if (!raw || raw === 'none') return null;
  const result: Partial<TransformState> = {};
  let found = false;
  const fns = raw.match(/\w[\w-]*\([^)]+\)/g) ?? [];
  for (const fn of fns) {
    const name = fn.match(/^([\w-]+)/)?.[1];
    const val = fn.match(/\(([^)]+)\)/)?.[1] ?? '';
    if (!name) continue;
    const parts = val.split(',').map(s => s.trim());
    switch (name) {
      case 'rotate':     { const n = parseDeg(val.replace('deg','')); if (n !== null) { result.rotate = n; found = true; } break; }
      case 'scale':      { const x = parseFloat(parts[0]); const y = parts[1] ? parseFloat(parts[1]) : x; result.scaleX = x; result.scaleY = y; found = true; break; }
      case 'scaleX':     { const n = parseFloat(val); result.scaleX = n; found = true; break; }
      case 'scaleY':     { const n = parseFloat(val); result.scaleY = n; found = true; break; }
      case 'translateX': { const n = parsePx(val); if (n !== null) { result.translateX = n; found = true; } break; }
      case 'translateY': { const n = parsePx(val); if (n !== null) { result.translateY = n; found = true; } break; }
      case 'translate':  { const x = parsePx(parts[0]); const y = parts[1] ? parsePx(parts[1]) : 0; if (x !== null) { result.translateX = x; result.translateY = y ?? 0; found = true; } break; }
      case 'skewX':     { const n = parseDeg(val.replace('deg','')); if (n !== null) { result.skewX = n; found = true; } break; }
      case 'skewY':     { const n = parseDeg(val.replace('deg','')); if (n !== null) { result.skewY = n; found = true; } break; }
      case 'skew':      { const x = parseDeg(parts[0].replace('deg','')); const y = parts[1] ? parseDeg(parts[1].replace('deg','')) : 0; if (x !== null) { result.skewX = x; result.skewY = y ?? 0; found = true; } break; }
    }
  }
  return found ? result : null;
}

// ─── Clip Path ────────────────────────────────────────────────────────────────

export function clipPathFromCss(props: Record<string, string>): Partial<ClipPathState> | null {
  const raw = props['clip-path'];
  if (!raw || raw === 'none') return null;

  if (raw.startsWith('circle(')) {
    const m = raw.match(/circle\(\s*([\d.]+)%?\s+at\s+([\d.]+)%?\s+([\d.]+)%?\s*\)/);
    if (m) return { type: 'circle' as ClipPathType, circleRadius: parseFloat(m[1]), circleCx: parseFloat(m[2]), circleCy: parseFloat(m[3]) };
    const m2 = raw.match(/circle\(\s*([\d.]+)%?\s*\)/);
    if (m2) return { type: 'circle' as ClipPathType, circleRadius: parseFloat(m2[1]) };
  }
  if (raw.startsWith('ellipse(')) {
    const m = raw.match(/ellipse\(\s*([\d.]+)%?\s+([\d.]+)%?\s+at\s+([\d.]+)%?\s+([\d.]+)%?\s*\)/);
    if (m) return { type: 'ellipse' as ClipPathType, ellipseRx: parseFloat(m[1]), ellipseRy: parseFloat(m[2]), ellipseCx: parseFloat(m[3]), ellipseCy: parseFloat(m[4]) };
  }
  if (raw.startsWith('inset(')) {
    const inner = raw.replace(/^inset\(|\)$/g, '').trim();
    const nums = inner.split(/\s+/).map(p => parsePct(p.replace('%','')) ?? parseFloat(p));
    if (nums.length >= 4) return { type: 'inset' as ClipPathType, insetTop: nums[0], insetRight: nums[1], insetBottom: nums[2], insetLeft: nums[3] };
  }
  if (raw.startsWith('polygon(')) {
    return { type: 'polygon' as ClipPathType };
  }
  return null;
}

// ─── Transition ───────────────────────────────────────────────────────────────

let _transCounter = 10000;

export function transitionFromCss(props: Record<string, string>): Partial<TransitionState> | null {
  const raw = props['transition'];
  if (!raw || raw === 'none') return null;
  const layers: TransitionLayer[] = splitTopLevel(raw).map(token => {
    const parts = splitSpaces(token.trim());
    const property = parts[0] ?? 'all';
    const duration = parts[1] ? (parseMs(parts[1]) ?? 300) : 300;
    const easing = parts[2] ?? 'ease';
    const delay = parts[3] ? (parseMs(parts[3]) ?? 0) : 0;
    return { id: `import-tl-${++_transCounter}`, property, duration, easing, delay };
  }).filter(l => l.property);
  return layers.length ? { layers } : null;
}

// ─── Outline ─────────────────────────────────────────────────────────────────

export function outlineFromCss(props: Record<string, string>): Partial<OutlineState> | null {
  const result: Partial<OutlineState> = {};
  let found = false;

  const outline = props['outline'];
  if (outline && outline !== 'none') {
    const parts = outline.split(/\s+/);
    for (const part of parts) {
      const px = parsePx(part);
      if (px !== null) { result.width = px; found = true; continue; }
      const c = parseColor(part);
      if (c) { result.color = c.hex; result.opacity = c.opacity; found = true; continue; }
      const styles: OutlineStyle[] = ['solid','dashed','dotted','double','groove','ridge','inset','outset','none'];
      if (styles.includes(part as OutlineStyle)) { result.style = part as OutlineStyle; found = true; }
    }
  }
  const offset = props['outline-offset'];
  if (offset) {
    const n = parsePx(offset);
    if (n !== null) { result.offset = n; found = true; }
  }
  return found ? result : null;
}

// ─── Cubic Bezier ─────────────────────────────────────────────────────────────

export function cubicBezierFromCss(props: Record<string, string>): Partial<CubicBezierState> | null {
  const raw = props['transition-timing-function'] ?? props['animation-timing-function'] ?? props['transition'];
  if (!raw) return null;
  const m = raw.match(/cubic-bezier\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
  if (!m) return null;
  return { x1: parseFloat(m[1]), y1: parseFloat(m[2]), x2: parseFloat(m[3]), y2: parseFloat(m[4]) };
}

// ─── Detect which tool a CSS snippet is for ───────────────────────────────────

/**
 * Given parsed props, returns the most likely tool slug.
 * Used to auto-suggest which generator to open.
 */
export function detectTool(props: Record<string, string>): string | null {
  if (props['box-shadow']) return 'shadow';
  if (props['backdrop-filter'] || props['-webkit-backdrop-filter']) return 'glassmorphism';
  if (props['text-shadow']) return 'text-shadow';
  if (props['clip-path']) return 'clip-path';
  if (props['outline']) return 'outline';
  if (props['filter']) return 'filter';
  if (props['transform']) return 'transform';
  if (props['transition']) return 'transition';
  if (props['border-radius']) return 'border-radius';
  const bg = props['background'] ?? props['background-image'] ?? '';
  if (bg.includes('gradient')) {
    if (bg.includes('-webkit-background-clip') || props['-webkit-background-clip'] === 'text') return 'text-gradient';
    return 'gradient';
  }
  if (props['transition-timing-function']?.includes('cubic-bezier') || props['animation-timing-function']?.includes('cubic-bezier')) return 'cubic-bezier';
  return null;
}
