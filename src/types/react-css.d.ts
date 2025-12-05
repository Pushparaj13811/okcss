/*
 * Augments React's CSSProperties to accept CSS custom properties (--foo: bar).
 * Without this, TypeScript complains when you pass { '--fill': '50%' } as a style prop.
 */

import 'react';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
