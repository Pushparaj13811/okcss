'use client';

/*
 * Slider
 *
 * A styled range input. The fill level is driven by a CSS variable (--fill)
 * set as an inline style, which is read by the .slider class in globals.css.
 *
 * Design decisions:
 * - Label and live value share the same line  avoids wasted vertical space.
 * - Value includes unit for readability (4px, 0.25, etc).
 * - Step is configurable because opacity needs 0.01 increments.
 */

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  id: string;
  onChange: (value: number) => void;
};

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = 'px',
  id,
  onChange,
}: SliderProps) {
  // Percentage of the way from min to max  drives the track fill colour.
  const fillPercent = ((value - min) / (max - min)) * 100;

  // Format the displayed value: show 2 decimal places for small steps (opacity),
  // no decimals otherwise.
  const displayValue = step < 1 ? value.toFixed(2) : String(value);

  return (
    <div className="flex flex-col gap-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs font-medium select-none"
          style={{ color: 'var(--text-2)' }}
        >
          {label}
        </label>
        <span
          className="font-mono text-xs tabular-nums"
          style={{ color: 'var(--text-1)' }}
          aria-live="polite"
          aria-atomic="true"
        >
          {displayValue}{unit}
        </span>
      </div>

      {/* Track */}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
        style={{ '--fill': `${fillPercent}%` }}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${displayValue}${unit}`}
      />
    </div>
  );
}
