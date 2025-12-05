/*
 * Tool registry — the single list of all CSS generators in okcss.
 * Import this wherever you need tool metadata: navigation, page titles, etc.
 */

export type Tool = {
  label: string;
  href: string;
  description: string;
};

export const TOOLS: Tool[] = [
  {
    label: 'Shadow',
    href: '/shadow',
    description: 'Multi-layer box-shadow with inset, spread, and opacity controls.',
  },
  {
    label: 'Glassmorphism',
    href: '/glassmorphism',
    description: 'Frosted glass with backdrop-blur, transparency, and border tuning.',
  },
  {
    label: 'Gradient',
    href: '/gradient',
    description: 'Linear and radial gradients with variable colour stops.',
  },
  {
    label: 'Neumorphism',
    href: '/neumorphism',
    description: 'Soft extrusion via dual light and dark shadows.',
  },
  {
    label: 'Text Shadow',
    href: '/text-shadow',
    description: 'CSS text-shadow with font size and preview text controls.',
  },
  {
    label: 'Border Radius',
    href: '/border-radius',
    description: 'Uniform or per-corner border-radius with live preview.',
  },
  {
    label: 'Filter',
    href: '/filter',
    description: 'CSS filter: blur, brightness, contrast, grayscale, hue-rotate, and more.',
  },
  {
    label: 'Transform',
    href: '/transform',
    description: 'CSS transform: rotate, scale, translate, and skew with live preview.',
  },
  {
    label: 'Text Gradient',
    href: '/text-gradient',
    description: 'Gradient text using background-clip: text with multiple colour stops.',
  },
  {
    label: 'Scrollbar',
    href: '/scrollbar',
    description: 'Custom scrollbar styles: thumb, track, radius, and hover colours.',
  },
  {
    label: 'Clip-Path',
    href: '/clip-path',
    description: 'CSS clip-path shapes: polygon presets, circle, ellipse, and inset with live preview.',
  },
  {
    label: 'Cubic-Bezier',
    href: '/cubic-bezier',
    description: 'Design custom cubic-bezier() easing curves with a visual drag editor and animated preview.',
  },
  {
    label: 'Type Scale',
    href: '/type-scale',
    description: 'Modular CSS type scale with named ratio presets. Outputs CSS custom properties.',
  },
  {
    label: 'Color Palette',
    href: '/color-palette',
    description: 'Harmonious CSS color palettes using color theory: triadic, analogous, complementary, and more.',
  },
  {
    label: 'Transition',
    href: '/transition',
    description: 'CSS transition builder with multi-layer support, per-property timing, and hover preview.',
  },
  {
    label: 'Keyframes',
    href: '/keyframes',
    description: 'CSS @keyframes animation builder with stops, presets, and live animated preview.',
  },
  {
    label: 'Outline',
    href: '/outline',
    description: 'CSS outline and outline-offset generator with Tailwind ring-* output.',
  },
];
