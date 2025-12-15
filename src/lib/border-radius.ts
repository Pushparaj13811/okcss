import { ri, rPick } from './rand';

export type RadiusMode = 'uniform' | 'individual';

export type BorderRadiusState = {
  mode: RadiusMode;
  uniform: number;
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
};

export const DEFAULT_BORDER_RADIUS: BorderRadiusState = {
  mode: 'uniform',
  uniform: 16,
  topLeft: 16,
  topRight: 16,
  bottomRight: 16,
  bottomLeft: 16,
};

export const RADIUS_CONTROLS = [
  { key: 'topLeft'     as const, label: 'Top left',     min: 0, max: 200, step: 1, unit: 'px' },
  { key: 'topRight'    as const, label: 'Top right',    min: 0, max: 200, step: 1, unit: 'px' },
  { key: 'bottomRight' as const, label: 'Bottom right', min: 0, max: 200, step: 1, unit: 'px' },
  { key: 'bottomLeft'  as const, label: 'Bottom left',  min: 0, max: 200, step: 1, unit: 'px' },
] as const;

/** Returns a randomised BorderRadiusState. */
export function randomizeBorderRadius(): BorderRadiusState {
  const mode: RadiusMode = rPick(['uniform', 'individual']);
  if (mode === 'uniform') {
    return { ...DEFAULT_BORDER_RADIUS, mode: 'uniform', uniform: ri(0, 80) };
  }
  return {
    mode: 'individual',
    uniform: 16,
    topLeft: ri(0, 100),
    topRight: ri(0, 100),
    bottomRight: ri(0, 100),
    bottomLeft: ri(0, 100),
  };
}

export function buildBorderRadiusValue(s: BorderRadiusState): string {
  if (s.mode === 'uniform') return `${s.uniform}px`;
  const { topLeft: tl, topRight: tr, bottomRight: br, bottomLeft: bl } = s;
  // Compact form: if all pairs match, simplify
  if (tl === tr && tr === br && br === bl) return `${tl}px`;
  if (tl === br && tr === bl) return `${tl}px ${tr}px`;
  if (tr === bl) return `${tl}px ${tr}px ${br}px`;
  return `${tl}px ${tr}px ${br}px ${bl}px`;
}

export function buildBorderRadiusCss(
  s: BorderRadiusState,
): Array<{ property: string; value: string }> {
  return [{ property: 'border-radius', value: buildBorderRadiusValue(s) }];
}

export function buildBorderRadiusCopyText(s: BorderRadiusState): string {
  return `border-radius: ${buildBorderRadiusValue(s)};`;
}

export function buildBorderRadiusTailwind(s: BorderRadiusState): string {
  const v = buildBorderRadiusValue(s);
  const common: Record<string, string> = {
    '0px': 'rounded-none',
    '2px': 'rounded-sm',
    '4px': 'rounded',
    '6px': 'rounded-md',
    '8px': 'rounded-lg',
    '12px': 'rounded-xl',
    '16px': 'rounded-2xl',
    '24px': 'rounded-3xl',
    '9999px': 'rounded-full',
  };
  return common[v] ?? `rounded-[${v}]`;
}
