/*
 * Separator
 *
 * An inline middle dot (·) for separating text fragments in a single line.
 * Purely decorative — hidden from screen readers.
 *
 * Usage:
 *   <p>ok.css <Separator /> v0.1 <Separator /> A visual CSS generator</p>
 *
 * The horizontal margin is intentionally generous so the dot doesn't crowd
 * the surrounding text. Adjust via the `mx` prop if needed.
 */

type SeparatorProps = {
  /** Tailwind mx class value, e.g. "2" for mx-2. Default: "2.5" */
  mx?: string;
};

export function Separator({ mx = '2.5' }: SeparatorProps) {
  return (
    <span
      className={`mx-${mx}`}
      aria-hidden="true"
      style={{ color: 'var(--border)' }}
    >
      ·
    </span>
  );
}
