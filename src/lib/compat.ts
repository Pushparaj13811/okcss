/*
 * compat.ts — static browser compatibility data for CSS properties.
 *
 * Data is intentionally conservative: only properties with meaningful
 * caveats or partial support are listed. Properties with full modern
 * browser support (border-radius, filter, transform, etc.) are omitted.
 */

export type CompatNote = {
  /** Short label shown in the badge: "Needs prefix", "Limited Safari", etc. */
  label: string;
  /** Longer explanation shown on hover. */
  detail: string;
  /** 'warn' = yellow, 'info' = blue, 'good' = green */
  level: 'warn' | 'info' | 'good';
  /** MDN or caniuse URL. */
  url: string;
};

/** Map of CSS property → compat note. Checked against generated line properties. */
export const COMPAT_MAP: Record<string, CompatNote> = {
  'backdrop-filter': {
    label: 'Needs -webkit- prefix',
    detail: 'backdrop-filter requires -webkit-backdrop-filter on Safari 15 and older. ok.css outputs both prefixes automatically.',
    level: 'info',
    url: 'https://caniuse.com/css-backdrop-filter',
  },
  '-webkit-backdrop-filter': {
    label: 'Safari prefix',
    detail: 'Generated automatically alongside backdrop-filter for Safari compatibility.',
    level: 'info',
    url: 'https://caniuse.com/css-backdrop-filter',
  },
  'clip-path': {
    label: 'Partial support',
    detail: 'clip-path is well supported in modern browsers. SVG-based paths have broader legacy support than polygon().',
    level: 'info',
    url: 'https://caniuse.com/css-clip-path',
  },
  'scrollbar-color': {
    label: 'Firefox only (standard)',
    detail: 'scrollbar-color is the W3C standard. Chrome/Safari use ::-webkit-scrollbar pseudo-elements instead.',
    level: 'warn',
    url: 'https://caniuse.com/mdn-css_properties_scrollbar-color',
  },
  'scrollbar-width': {
    label: 'Firefox only (standard)',
    detail: 'scrollbar-width is W3C standard but only supported in Firefox. Chrome/Safari use ::-webkit-scrollbar.',
    level: 'warn',
    url: 'https://caniuse.com/mdn-css_properties_scrollbar-width',
  },
  'outline-offset': {
    label: 'Full support',
    detail: 'outline-offset is supported in all modern browsers.',
    level: 'good',
    url: 'https://caniuse.com/mdn-css_properties_outline-offset',
  },
  'transition-timing-function': {
    label: 'Full support',
    detail: 'transition-timing-function including cubic-bezier() is fully supported in all modern browsers.',
    level: 'good',
    url: 'https://caniuse.com/css-transitions',
  },
  'text-stroke': {
    label: 'Needs -webkit- prefix',
    detail: '-webkit-text-stroke is widely supported but the unprefixed standard is not yet universal.',
    level: 'warn',
    url: 'https://caniuse.com/mdn-css_properties_-webkit-text-stroke',
  },
  'background-clip': {
    label: 'Needs -webkit- prefix for text clipping',
    detail: 'background-clip: text requires -webkit-background-clip: text on Safari and Chrome. ok.css outputs both.',
    level: 'info',
    url: 'https://caniuse.com/mdn-css_properties_background-clip_text',
  },
  '-webkit-background-clip': {
    label: 'Chrome/Safari prefix',
    detail: 'Generated automatically alongside background-clip for cross-browser text gradient support.',
    level: 'info',
    url: 'https://caniuse.com/mdn-css_properties_background-clip_text',
  },
};

/**
 * Given a list of CSS property names, returns all compat notes that apply.
 * Deduplicates by label so we don't show the same warning twice.
 */
export function getCompatNotes(properties: string[]): CompatNote[] {
  const seen = new Set<string>();
  const notes: CompatNote[] = [];
  for (const prop of properties) {
    const note = COMPAT_MAP[prop.toLowerCase()];
    if (note && !seen.has(note.label)) {
      seen.add(note.label);
      notes.push(note);
    }
  }
  return notes;
}
