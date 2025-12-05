'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

/*
 * ToggleGroup
 *
 * A segmented control with 2–4 options. The active option is highlighted
 * with a sliding pill that uses Framer Motion's layoutId for smooth
 * position transitions.
 *
 * Usage:
 *   <ToggleGroup
 *     value={outputFormat}
 *     options={['CSS', 'Tailwind']}
 *     onChange={setOutputFormat}
 *   />
 */

type ToggleGroupProps<T extends string> = {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  /** Optional: provide a unique id so multiple ToggleGroups don't share layoutId */
  layoutId?: string;
};

export function ToggleGroup<T extends string>({
  value,
  options,
  onChange,
  layoutId = 'toggle-group-pill',
}: ToggleGroupProps<T>) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="inline-flex items-center gap-0.5 p-0.5 rounded-lg"
      role="radiogroup"
      aria-label="Options"
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
      }}
    >
      {options.map((option) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            role="radio"
            aria-checked={isActive}
            className="relative px-3 h-7 font-mono text-[11px] tracking-tight rounded-md select-none cursor-pointer transition-colors duration-100"
            style={{
              color: isActive ? 'var(--text-1)' : 'var(--text-3)',
              zIndex: 1,
            }}
          >
            {/* Sliding pill — sits behind the label via z-index */}
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-md"
                style={{ background: 'var(--bg-surface)' }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 400, damping: 30 }
                }
              />
            )}
            <span className="relative z-10">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
