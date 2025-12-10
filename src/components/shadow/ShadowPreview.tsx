'use client';

/*
 * ShadowPreview
 *
 * Renders a neutral canvas with a white card floating above it.
 * The card has the current box-shadow applied as an inline style.
 *
 * Design decisions:
 * - The canvas background is --preview-canvas (mid-gray), making shadows
 *   visible regardless of the shadow's darkness or lightness.
 * - No transition on the shadow  it updates synchronously with the sliders,
 *   which IS the UX. Adding a CSS transition would delay feedback.
 * - No content inside the card  it exists purely to show the shadow.
 *   Adding dummy content (text, an avatar) would mislead users about context.
 */

type ShadowPreviewProps = {
  /** The value portion of box-shadow (no property name, no semicolon). */
  shadowValue: string;
};

export function ShadowPreview({ shadowValue }: ShadowPreviewProps) {
  return (
    <div
      className="w-full rounded-xl flex items-center justify-center"
      style={{
        background: 'var(--preview-canvas)',
        minHeight: '260px',
      }}
      aria-label="Shadow preview canvas"
    >
      {/* The preview card  box-shadow is applied here */}
      <div
        className="w-40 h-24 rounded-xl"
        style={{
          background: 'var(--bg-surface)',
          boxShadow: shadowValue,
        }}
        aria-label={`Preview card with shadow: ${shadowValue}`}
        role="img"
      />
    </div>
  );
}
