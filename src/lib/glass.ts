import { hexToRgb } from './color';
import { ri, rf, rVibrant } from './rand';

export type GlassState = {
  bgColor: string;       // hex — base tint of the glass panel
  bgOpacity: number;     // 0–1 — how opaque the background is
  blur: number;          // px — backdrop blur amount
  borderColor: string;   // hex — border tint
  borderOpacity: number; // 0–1 — border transparency
  borderRadius: number;  // px
};

export const DEFAULT_GLASS: GlassState = {
  bgColor: '#ffffff',
  bgOpacity: 0.15,
  blur: 12,
  borderColor: '#ffffff',
  borderOpacity: 0.3,
  borderRadius: 16,
};

export const GLASS_CONTROLS = [
  { key: 'bgOpacity'     as const, label: 'Background opacity', min: 0,  max: 1,   step: 0.01, unit: ''   },
  { key: 'blur'          as const, label: 'Blur intensity',     min: 0,  max: 40,  step: 1,    unit: 'px' },
  { key: 'borderOpacity' as const, label: 'Border opacity',     min: 0,  max: 1,   step: 0.01, unit: ''   },
  { key: 'borderRadius'  as const, label: 'Border radius',      min: 0,  max: 48,  step: 1,    unit: 'px' },
] as const;

/** Returns the CSS lines that produce the glassmorphism effect. */
export function buildGlassCss(s: GlassState): Array<{ property: string; value: string }> {
  const { r: br, g: bg, b: bb } = hexToRgb(s.bgColor);
  const { r: er, g: eg, b: eb } = hexToRgb(s.borderColor);
  const bgOp = Math.round(s.bgOpacity * 100) / 100;
  const boOp = Math.round(s.borderOpacity * 100) / 100;

  return [
    { property: 'background',           value: `rgba(${br}, ${bg}, ${bb}, ${bgOp})` },
    { property: 'backdrop-filter',       value: `blur(${s.blur}px)` },
    { property: '-webkit-backdrop-filter', value: `blur(${s.blur}px)` },
    { property: 'border',               value: `1px solid rgba(${er}, ${eg}, ${eb}, ${boOp})` },
    { property: 'border-radius',        value: `${s.borderRadius}px` },
  ];
}

/** Tailwind approximation of the glassmorphism effect. */
export function buildGlassTailwind(s: GlassState): string {
  const bgPct = Math.round(s.bgOpacity * 100);
  const borderPct = Math.round(s.borderOpacity * 100);
  // backdrop-blur-sm=4px, md=12px, lg=16px, xl=24px, 2xl=40px
  const blurMap: Record<number, string> = { 4: 'sm', 12: 'md', 16: 'lg', 24: 'xl', 40: '2xl' };
  const blurClass = blurMap[s.blur] ?? `[${s.blur}px]`;
  const bgColor = s.bgColor === '#ffffff' ? 'white' : `[${s.bgColor}]`;
  const borderColor = s.borderColor === '#ffffff' ? 'white' : `[${s.borderColor}]`;

  return [
    `bg-${bgColor}/${bgPct}`,
    `backdrop-blur-${blurClass}`,
    `border`,
    `border-${borderColor}/${borderPct}`,
    `rounded-[${s.borderRadius}px]`,
  ].join(' ');
}

/** Returns a randomised GlassState. */
export function randomizeGlass(): GlassState {
  return {
    bgColor: rVibrant(),
    bgOpacity: rf(0.05, 0.35, 2),
    blur: ri(4, 32),
    borderColor: '#ffffff',
    borderOpacity: rf(0.1, 0.6, 2),
    borderRadius: ri(8, 32),
  };
}

/** Full CSS block as a single string for copying. */
export function buildGlassCopyText(s: GlassState): string {
  return buildGlassCss(s)
    .map((l) => `${l.property}: ${l.value};`)
    .join('\n');
}
