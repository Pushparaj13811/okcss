import { ri, rVibrant } from './rand';

/*
 * Gradient generator lib.
 *
 * State is more complex here than other generators because colour stops
 * are a variable-length array. Min 2 stops, max 6.
 */

export type ColorStop = {
  id: string;       // stable React key — never changes after creation
  color: string;    // hex
  position: number; // 0–100
};

export type GradientType = 'linear' | 'radial' | 'conic';

export type GradientState = {
  type: GradientType;
  angle: number;        // degrees, only used for linear
  stops: ColorStop[];
};

let _stopCounter = 0;
/** Creates a new stop with a stable unique ID. */
export function makeStop(color: string, position: number): ColorStop {
  return { id: `stop-${++_stopCounter}`, color, position };
}

export const DEFAULT_GRADIENT: GradientState = {
  type: 'linear',
  angle: 135,
  stops: [
    makeStop('#6366f1', 0),
    makeStop('#ec4899', 100),
  ],
};

/** Returns a randomised GradientState with 2–4 vibrant colour stops. */
export function randomizeGradient(): GradientState {
  const count = ri(2, 4);
  const stops = Array.from({ length: count }, (_, i) => {
    const pos = count === 1 ? 0 : Math.round((i / (count - 1)) * 100);
    return makeStop(rVibrant(), pos);
  });
  return {
    type: ri(0, 1) === 0 ? 'linear' : 'radial',
    angle: ri(0, 359),
    stops,
  };
}

// ─── CSS builders ─────────────────────────────────────────────────────────────

function stopsToString(stops: ColorStop[]): string {
  return [...stops]
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ');
}

export function buildGradientValue(s: GradientState): string {
  const stopStr = stopsToString(s.stops);
  if (s.type === 'linear') return `linear-gradient(${s.angle}deg, ${stopStr})`;
  if (s.type === 'conic')  return `conic-gradient(from ${s.angle}deg, ${stopStr})`;
  return `radial-gradient(circle, ${stopStr})`;
}

export function buildGradientCss(
  s: GradientState,
): Array<{ property: string; value: string }> {
  return [{ property: 'background', value: buildGradientValue(s) }];
}

export function buildGradientCopyText(s: GradientState): string {
  return `background: ${buildGradientValue(s)};`;
}

// ─── Tailwind ────────────────────────────────────────────────────────────────

const ANGLE_TO_DIRECTION: Record<number, string> = {
  0: 'to-t',
  45: 'to-tr',
  90: 'to-r',
  135: 'to-br',
  180: 'to-b',
  225: 'to-bl',
  270: 'to-l',
  315: 'to-tl',
};

export function buildGradientTailwind(s: GradientState): string {
  if (s.type === 'radial') {
    return `bg-[radial-gradient(circle,${stopsToString(s.stops).replace(/ /g, '_')})]`;
  }
  if (s.type === 'conic') {
    return `bg-[conic-gradient(from_${s.angle}deg,${stopsToString(s.stops).replace(/ /g, '_')})]`;
  }

  const dir = ANGLE_TO_DIRECTION[s.angle];
  const sorted = [...s.stops].sort((a, b) => a.position - b.position);

  if (dir && sorted.length === 2) {
    // Simple 2-stop gradient with a standard direction — use named utilities.
    return `bg-gradient-${dir} from-[${sorted[0].color}] to-[${sorted[1].color}]`;
  }

  if (dir && sorted.length === 3) {
    return `bg-gradient-${dir} from-[${sorted[0].color}] via-[${sorted[1].color}] to-[${sorted[2].color}]`;
  }

  // Arbitrary value for everything else.
  const stopStr = stopsToString(s.stops).replace(/ /g, '_').replace(/,/g, ',');
  return `bg-[linear-gradient(${s.angle}deg,${stopStr})]`;
}
