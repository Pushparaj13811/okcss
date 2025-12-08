'use client';

import { useState } from 'react';
import { CopyButton } from './CopyButton';
import { ToggleGroup } from './ToggleGroup';
import { ShareBar } from './ShareBar';
import { getCompatNotes } from '@/src/lib/compat';

export type CssLine = {
  property: string;
  value: string;
};

type OutputFormat = 'CSS' | 'Tailwind' | 'SCSS' | 'React' | 'Variables';

type CssOutputProps = {
  lines: CssLine[];
  copyText: string;
  tailwind?: {
    classes: string;
    copyText: string;
  };
  /**
   * When provided, the CSS tab renders this raw pre-formatted text instead of
   * the structured `lines` array. Useful for generators whose output contains
   * nested blocks (e.g. -webkit-scrollbar rules) that don't fit the
   * property: value model.
   *
   * SCSS tab wraps this in `.element { }`.
   * React tab still uses `lines` (pseudo-elements can't be inline styles).
   */
  rawCss?: string;
};

// ─── Format converters ────────────────────────────────────────────────────────

/** CSS property (kebab-case) → React camelCase */
function toCamel(prop: string): string {
  return prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

/** Build React inline style object string from CSS copy text (plain property:value lines only). */
function cssToReact(css: string): string {
  const pairs = css
    .split('\n')
    .map((l) => l.trim())
    // Only lines with exactly one colon that aren't selectors or comments
    .filter((l) => l.includes(':') && !l.startsWith('/*') && !l.includes('{') && !l.includes('}'))
    .map((l) => {
      const colon = l.indexOf(':');
      const prop = l.slice(0, colon).trim();
      const val = l.slice(colon + 1).trim().replace(/;$/, '');
      return `  ${toCamel(prop)}: '${val}',`;
    });
  return `style={{\n${pairs.join('\n')}\n}}`;
}

/** Build React inline style object string from structured CssLine array. */
function linesToReact(lines: CssLine[]): string {
  const pairs = lines
    .filter((l) => l.property)
    .map((l) => `  ${toCamel(l.property)}: '${l.value}',`);
  return `style={{\n${pairs.join('\n')}\n}}`;
}

/** Convert lines to CSS custom properties inside :root {} */
function linesToVars(lines: CssLine[]): string {
  const vars = lines
    .filter((l) => l.property)
    .map((l) => `  --${l.property}: ${l.value};`)
    .join('\n');
  return `:root {\n${vars}\n}`;
}

/** Convert raw CSS string to CSS custom properties inside :root {} */
function rawCssToVars(raw: string): string {
  const vars = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.includes(':') && !l.startsWith('/*') && !l.includes('{') && !l.includes('}') && l.endsWith(';'))
    .map((l) => {
      const colon = l.indexOf(':');
      const prop = l.slice(0, colon).trim();
      const val = l.slice(colon + 1).trim().replace(/;$/, '');
      return `  --${prop}: ${val};`;
    })
    .join('\n');
  return `:root {\n${vars}\n}`;
}

/** Wrap CSS in a .element {} SCSS block. */
function cssToScss(css: string): string {
  const indented = css
    .split('\n')
    .map((l) => `  ${l}`)
    .join('\n');
  return `.element {\n${indented}\n}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CssOutput({ lines, copyText, tailwind, rawCss }: CssOutputProps) {
  const [format, setFormat] = useState<OutputFormat>('CSS');
  const compatNotes = getCompatNotes(lines.map(l => l.property));

  const formats: OutputFormat[] = tailwind
    ? ['CSS', 'Tailwind', 'SCSS', 'React', 'Variables']
    : ['CSS', 'SCSS', 'React', 'Variables'];

  // For SCSS, wrap rawCss if present (it may already contain &:: nesting), else wrap copyText.
  const scssSource = rawCss ?? copyText;

  const activeCopyText = (() => {
    if (format === 'Tailwind' && tailwind) return tailwind.copyText;
    if (format === 'SCSS') return cssToScss(scssSource);
    if (format === 'React') return rawCss ? linesToReact(lines) : cssToReact(copyText);
    if (format === 'Variables') return rawCss ? rawCssToVars(rawCss) : linesToVars(lines);
    return rawCss ?? copyText;
  })();

  return (
    <div className="flex flex-col gap-3">
      {/* Header: label + format toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>
          Output
        </span>
        <ToggleGroup
          value={format}
          options={formats}
          onChange={setFormat}
          layoutId="output-format-toggle"
        />
      </div>

      {/* Browser compat notes */}
      {compatNotes.filter(n => n.level !== 'good').map((note) => (
        <a
          key={note.label}
          href={note.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2 px-3 py-2 rounded-lg no-underline"
          style={{
            background: note.level === 'warn' ? 'rgba(245,158,11,0.08)' : 'rgba(99,102,241,0.08)',
            border: `1px solid ${note.level === 'warn' ? 'rgba(245,158,11,0.25)' : 'rgba(99,102,241,0.2)'}`,
          }}
        >
          <span style={{ fontSize: '11px', marginTop: '1px', flexShrink: 0 }}>
            {note.level === 'warn' ? '⚠' : 'ℹ'}
          </span>
          <span>
            <span className="font-mono text-[11px] font-medium" style={{ color: note.level === 'warn' ? '#d97706' : '#6366f1' }}>
              {note.label}
            </span>
            <span className="font-mono text-[10px] ml-1.5" style={{ color: 'var(--text-3)' }}>
              {note.detail}
            </span>
          </span>
        </a>
      ))}

      {/* Code block */}
      <div
        className="w-full rounded-lg px-4 py-3 overflow-x-auto"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        {format === 'Tailwind' && tailwind ? (
          <p className="font-mono text-[13px] leading-relaxed break-all" style={{ color: 'var(--text-1)' }}>
            {tailwind.classes}
          </p>
        ) : format === 'CSS' && rawCss ? (
          // Raw pre-formatted display for generators with nested block structure
          <pre className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-1)', margin: 0 }}>
            {rawCss.split('\n').map((line, i) => {
              const isComment = line.trim().startsWith('/*');
              const isSelector = line.trim().endsWith('{') || line.trim() === '}';
              return (
                <span
                  key={i}
                  style={{
                    color: isComment
                      ? 'var(--text-3)'
                      : isSelector
                      ? 'var(--text-2)'
                      : 'var(--text-1)',
                  }}
                >
                  {line}
                  {'\n'}
                </span>
              );
            })}
          </pre>
        ) : format === 'SCSS' && rawCss ? (
          // When rawCss is provided, wrap the full raw block in .element {}
          <pre className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-1)', margin: 0 }}>
            <span style={{ color: 'var(--text-3)' }}>.element</span>
            <span style={{ color: 'var(--text-2)' }}>{' {'}</span>
            {'\n'}
            {rawCss.split('\n').map((line, i) => {
              const isComment = line.trim().startsWith('/*');
              const isSelector = line.trim().endsWith('{') || line.trim() === '}';
              return (
                <span
                  key={i}
                  style={{
                    color: isComment
                      ? 'var(--text-3)'
                      : isSelector
                      ? 'var(--text-2)'
                      : 'var(--text-1)',
                  }}
                >
                  {'  '}{line}
                  {'\n'}
                </span>
              );
            })}
            <span style={{ color: 'var(--text-2)' }}>{'}'}</span>
          </pre>
        ) : format === 'SCSS' ? (
          <pre className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-1)', margin: 0 }}>
            <span style={{ color: 'var(--text-3)' }}>.element</span>
            <span style={{ color: 'var(--text-2)' }}>{' {'}</span>
            {'\n'}
            {lines.map((line, i) => (
              <span key={`${line.property}-${i}`}>
                {line.property && (
                  <>
                    {'  '}
                    <span style={{ color: 'var(--text-3)' }}>{line.property}</span>
                    <span style={{ color: 'var(--text-2)' }}>: </span>
                    <span style={{ color: 'var(--text-1)' }}>{line.value}</span>
                    <span style={{ color: 'var(--text-3)' }}>;</span>
                  </>
                )}
                {'\n'}
              </span>
            ))}
            <span style={{ color: 'var(--text-2)' }}>{'}'}</span>
          </pre>
        ) : format === 'React' ? (
          <div className="flex flex-col gap-2">
            {rawCss && (
              <p className="font-mono text-[10px] px-1" style={{ color: 'var(--text-3)' }}>
                {/* Pseudo-element rules (::webkit-scrollbar etc.) cannot be inline styles — showing inline-styleable properties only. Use CSS or SCSS tab for the full output. */}
                ⚠ Pseudo-element rules omitted — use CSS tab for full output.
              </p>
            )}
            <pre className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-1)', margin: 0 }}>
              <span style={{ color: 'var(--text-3)' }}>style</span>
              <span style={{ color: 'var(--text-2)' }}>={'{{'}</span>
              {'\n'}
              {lines.map((line, i) =>
                line.property ? (
                  <span key={`${line.property}-${i}`}>
                    {'  '}
                    <span style={{ color: 'var(--text-3)' }}>{toCamel(line.property)}</span>
                    <span style={{ color: 'var(--text-2)' }}>: </span>
                    <span style={{ color: 'var(--text-1)' }}>&apos;{line.value}&apos;</span>
                    <span style={{ color: 'var(--text-3)' }}>,</span>
                    {'\n'}
                  </span>
                ) : null,
              )}
              <span style={{ color: 'var(--text-2)' }}>{'}}'}</span>
            </pre>
          </div>
        ) : format === 'Variables' ? (
          <pre className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-1)', margin: 0 }}>
            <span style={{ color: 'var(--text-3)' }}>:root</span>
            <span style={{ color: 'var(--text-2)' }}>{' {'}</span>
            {'\n'}
            {(rawCss ? rawCssToVars(rawCss) : linesToVars(lines))
              .split('\n')
              .slice(1, -1)
              .map((line, i) => {
                const colon = line.indexOf(':');
                if (colon === -1) return <span key={i}>{line}{'\n'}</span>;
                const varName = line.slice(0, colon).trim();
                const val = line.slice(colon + 1).trim().replace(/;$/, '');
                return (
                  <span key={i}>
                    {'  '}
                    <span style={{ color: '#10b981' }}>{varName}</span>
                    <span style={{ color: 'var(--text-2)' }}>: </span>
                    <span style={{ color: 'var(--text-1)' }}>{val}</span>
                    <span style={{ color: 'var(--text-3)' }}>;</span>
                    {'\n'}
                  </span>
                );
              })}
            <span style={{ color: 'var(--text-2)' }}>{'}'}</span>
          </pre>
        ) : (
          <div className="flex flex-col gap-1">
            {lines.map((line, i) => (
              <p key={`${line.property}-${i}`} className="font-mono text-[13px] leading-relaxed break-all">
                {line.property ? (
                  <>
                    <span style={{ color: 'var(--text-3)' }}>{line.property}</span>
                    <span style={{ color: 'var(--text-2)' }}>: </span>
                  </>
                ) : (
                  <span style={{ color: 'var(--text-3)' }}>&nbsp;&nbsp;</span>
                )}
                <span style={{ color: 'var(--text-1)' }}>{line.value}</span>
                {line.property && <span style={{ color: 'var(--text-3)' }}>;</span>}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Action row: share actions left, copy button right */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <ShareBar cssText={copyText} />
        <CopyButton text={activeCopyText} />
      </div>
    </div>
  );
}
