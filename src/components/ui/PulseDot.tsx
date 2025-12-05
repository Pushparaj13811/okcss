/*
 * PulseDot
 *
 * A small animated indicator dot. Uses CSS animation so it runs
 * independently of React's render cycle.
 *
 * Usage:
 *   <PulseDot />                       — uses var(--text-3) by default
 *   <PulseDot color="var(--text-2)" /> — custom CSS color value
 *
 * Reduced motion: the ping ring animation is CSS-based and will be
 * killed by the `prefers-reduced-motion` rule in globals.css.
 */

type PulseDotProps = {
  /** Any valid CSS color string. Defaults to var(--text-3). */
  color?: string;
};

export function PulseDot({ color = 'var(--text-3)' }: PulseDotProps) {
  return (
    <span
      className="relative flex items-center justify-center w-2 h-2 flex-shrink-0"
      aria-hidden="true"
    >
      {/* Expanding ring */}
      <span
        className="absolute inline-flex w-full h-full rounded-full animate-ping"
        style={{ background: color, opacity: 0.45 }}
      />
      {/* Solid core */}
      <span
        className="relative inline-flex w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
      />
    </span>
  );
}
