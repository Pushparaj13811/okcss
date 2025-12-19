'use client';

import { useEffect, useRef, useCallback } from 'react';
import { CubicBezierState, buildBezierValue } from '@/src/lib/cubic-bezier';

type Props = {
  state: CubicBezierState;
  onChange: (patch: Partial<CubicBezierState>) => void;
};

/*
 * SVG coordinate system:
 *   The curve area is a 200×200 box (in SVG units).
 *   Bezier coordinate space: x ∈ [0,1], y ∈ [0,1] (0=start, 1=end).
 *   We map x → SVG x and y → SVG y with y-axis flipped (SVG y grows down).
 *
 *   toSVG(x, y) = (x * 200, (1 - y) * 200)
 *   fromSVG(sx, sy) = (sx / 200, 1 - sy / 200)
 */

const SIZE = 200;
const PAD  = 24; // padding around the curve area in the SVG viewport

function toSVG(x: number, y: number): [number, number] {
  return [PAD + x * SIZE, PAD + (1 - y) * SIZE];
}

export function CubicBezierPreview({ state, onChange }: Props) {
  const svgRef  = useRef<SVGSVGElement>(null);
  const dragRef = useRef<'p1' | 'p2' | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  // ── Control point screen coords ──────────────────────────────────────────
  const [p1x, p1y] = toSVG(state.x1, state.y1);
  const [p2x, p2y] = toSVG(state.x2, state.y2);
  const [s1x, s1y] = toSVG(0, 0); // curve start (fixed)
  const [s2x, s2y] = toSVG(1, 1); // curve end   (fixed)

  const TOTAL = SIZE + PAD * 2; // SVG viewBox size

  // ── SVG mouse → bezier coordinate ────────────────────────────────────────
  const svgToBezier = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const scaleX = TOTAL / rect.width;
    const scaleY = TOTAL / rect.height;
    const sx = (clientX - rect.left) * scaleX - PAD;
    const sy = (clientY - rect.top)  * scaleY - PAD;
    return {
      x: Math.max(0, Math.min(1, sx / SIZE)),
      y: 1 - sy / SIZE,  // y is unrestricted — allows overshoot
    };
  }, [TOTAL]);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const onMouseDown = useCallback((handle: 'p1' | 'p2') => (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = handle;
  }, []);

  const onTouchStart = useCallback((handle: 'p1' | 'p2') => (e: React.TouchEvent) => {
    e.preventDefault();
    dragRef.current = handle;
  }, []);

  useEffect(() => {
    const applyMove = (clientX: number, clientY: number) => {
      if (!dragRef.current) return;
      const { x, y } = svgToBezier(clientX, clientY);
      if (dragRef.current === 'p1') onChange({ x1: parseFloat(x.toFixed(2)), y1: parseFloat(y.toFixed(2)) });
      else                          onChange({ x2: parseFloat(x.toFixed(2)), y2: parseFloat(y.toFixed(2)) });
    };
    const onMouseMove = (e: MouseEvent) => applyMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // prevent page scroll while dragging
      const t = e.touches[0];
      if (t) applyMove(t.clientX, t.clientY);
    };
    const onUp = () => { dragRef.current = null; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [svgToBezier, onChange]);

  // ── Ball animation ────────────────────────────────────────────────────────
  const easing = buildBezierValue(state);
  const triggerAnim = useCallback(() => {
    const ball = ballRef.current;
    if (!ball) return;
    ball.style.transition = 'none';
    ball.style.transform = 'translateX(0)';
    void ball.offsetWidth; // force reflow
    ball.style.transition = `transform 1s ${easing}`;
    ball.style.transform = 'translateX(180px)';

    // bounce back
    if (animRef.current) clearTimeout(animRef.current);
    animRef.current = setTimeout(() => {
      if (!ball) return;
      ball.style.transition = `transform 1s ${easing}`;
      ball.style.transform = 'translateX(0)';
    }, 1200);
  }, [easing]);

  // Re-trigger animation whenever the easing changes
  useEffect(() => { triggerAnim(); }, [triggerAnim]);

  // ── Curve path ────────────────────────────────────────────────────────────
  const curvePath = `M ${s1x} ${s1y} C ${p1x} ${p1y}, ${p2x} ${p2y}, ${s2x} ${s2y}`;

  return (
    <div
      className="w-full rounded-2xl flex flex-col items-center gap-4 p-6"
      style={{ background: 'var(--preview-canvas)', border: '1px solid var(--border)' }}
    >
      {/* SVG curve editor */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${TOTAL} ${TOTAL}`}
        width="200"
        height="200"
        style={{ cursor: 'crosshair', userSelect: 'none', overflow: 'visible' }}
        aria-label="Cubic bezier curve editor"
      >
        {/* Grid */}
        <rect x={PAD} y={PAD} width={SIZE} height={SIZE} fill="none" stroke="var(--border)" strokeWidth="1" />
        {/* diagonal guide */}
        <line x1={s1x} y1={s1y} x2={s2x} y2={s2y} stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Handle lines */}
        <line x1={s1x} y1={s1y} x2={p1x} y2={p1y} stroke="var(--text-3)" strokeWidth="1" />
        <line x1={s2x} y1={s2y} x2={p2x} y2={p2y} stroke="var(--text-3)" strokeWidth="1" />

        {/* Curve */}
        <path d={curvePath} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />

        {/* Fixed endpoints */}
        <circle cx={s1x} cy={s1y} r="4" fill="var(--text-1)" />
        <circle cx={s2x} cy={s2y} r="4" fill="var(--text-1)" />

        {/* Handle P1 */}
        <circle
          cx={p1x} cy={p1y} r="7"
          fill="#6366f1"
          stroke="white" strokeWidth="1.5"
          style={{ cursor: 'grab', touchAction: 'none' }}
          onMouseDown={onMouseDown('p1')}
          onTouchStart={onTouchStart('p1')}
        />
        {/* Handle P2 */}
        <circle
          cx={p2x} cy={p2y} r="7"
          fill="#ec4899"
          stroke="white" strokeWidth="1.5"
          style={{ cursor: 'grab', touchAction: 'none' }}
          onMouseDown={onMouseDown('p2')}
          onTouchStart={onTouchStart('p2')}
        />
      </svg>

      {/* Ball animation */}
      <div
        className="relative w-full flex items-center"
        style={{ height: '28px', maxWidth: '240px' }}
        role="img"
        aria-label="Animation preview"
      >
        <div
          style={{
            width: '100%',
            height: '1px',
            background: 'var(--border)',
            position: 'absolute',
          }}
        />
        <div
          ref={ballRef}
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            position: 'absolute',
            left: 0,
            top: '50%',
            marginTop: '-10px',
          }}
        />
      </div>

      {/* Replay button */}
      <button
        onClick={triggerAnim}
        className="font-mono text-[11px] px-3 py-1 rounded-md"
        style={{
          border: '1px solid var(--border)',
          color: 'var(--text-3)',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        ↺ Replay
      </button>
    </div>
  );
}
