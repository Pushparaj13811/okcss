'use client';

import { useRef } from 'react';
import { isValidHex, normaliseHex } from '@/src/lib/color';

/*
 * ColorPicker
 *
 * A color input that shows:
 *   1. A clickable color swatch (opens the native OS color picker)
 *   2. An editable hex text field kept in sync with the swatch
 *
 * Why split them?
 * The native <input type="color"> is functional but visually ugly and
 * inconsistent across browsers. By hiding it behind a styled swatch and
 * rendering our own text input, we get consistent look + full editability.
 *
 * Hex validation: the text input accepts free typing, but only commits
 * a value to onChange when the input is a valid 6-digit hex.
 */

type ColorPickerProps = {
  label: string;
  value: string; // hex string, e.g. '#000000'
  onChange: (hex: string) => void;
};

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Handles text field changes.
  // We update the parent on every keystroke IF the hex is valid  this gives
  // live preview as they type a complete colour. If invalid (mid-typing),
  // we hold off.
  const handleTextChange = (raw: string) => {
    const withHash = raw.startsWith('#') ? raw : `#${raw}`;
    if (isValidHex(withHash)) {
      onChange(normaliseHex(withHash));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <span
        className="text-xs font-medium select-none"
        style={{ color: 'var(--text-2)' }}
      >
        {label}
      </span>

      {/* Control row */}
      <div className="flex items-center gap-3">

        {/* Swatch  clicking opens the hidden native color input */}
        <button
          type="button"
          onClick={() => colorInputRef.current?.click()}
          className="w-8 h-8 rounded-md flex-shrink-0 ring-offset-1 focus-visible:outline focus-visible:outline-2"
          style={{
            background: value,
            border: '1.5px solid var(--border)',
            outlineColor: 'var(--text-2)',
          }}
          aria-label={`Pick a colour, current: ${value}`}
        >
          {/* Hidden native color input  triggered by the button above */}
          <input
            ref={colorInputRef}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
          />
        </button>

        {/* Hex text input */}
        <input
          type="text"
          defaultValue={value}
          key={value} // re-mount when value changes from outside (e.g. reset)
          onChange={(e) => handleTextChange(e.target.value)}
          maxLength={7}
          spellCheck={false}
          className="flex-1 h-8 px-3 rounded-md font-mono text-xs"
          style={{
            background: 'var(--bg)',
            border: '1.5px solid var(--border)',
            color: 'var(--text-1)',
            outline: 'none',
          }}
          aria-label="Hex colour value"
          placeholder="#000000"
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--text-2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border)';
          }}
        />
      </div>
    </div>
  );
}
