'use client';

import {
  ShadowState,
  ShadowLayer,
  DEFAULT_SHADOW,
  makeLayer,
  buildShadowValue,
  buildShadowDeclaration,
  buildShadowTailwind,
  buildLayerValue,
  randomizeShadow,
} from '@/src/lib/shadow';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { CssImportButton } from '@/src/components/ui/CssImportButton';
import { shadowFromCss } from '@/src/lib/css-import';
import { ShadowControls } from './ShadowControls';
import { ShadowPreview } from './ShadowPreview';

export function ShadowGenerator() {
  // URL-synced state — reads ?s= on mount, writes on every change
  const [state, setState] = useUrlState<ShadowState>(DEFAULT_SHADOW, 's');

  // ── Layer mutations ───────────────────────────────────────────────────────

  const updateLayer = <K extends keyof ShadowLayer>(
    id: string,
    key: K,
    value: ShadowLayer[K],
  ) => {
    setState({
      layers: state.layers.map((l) => (l.id === id ? { ...l, [key]: value } : l)),
    });
  };

  const addLayer = () => {
    setState({
      layers: [...state.layers, makeLayer({ x: 0, y: 8, blur: 24, spread: -4 })],
    });
  };

  const deleteLayer = (id: string) => {
    setState({
      layers: state.layers.length > 1 ? state.layers.filter((l) => l.id !== id) : state.layers,
    });
  };

  const duplicateLayer = (id: string) => {
    const src = state.layers.find((l) => l.id === id);
    if (!src) return;
    const dup = makeLayer({ ...src });
    const idx = state.layers.findIndex((l) => l.id === id);
    const next = [...state.layers];
    next.splice(idx + 1, 0, dup);
    setState({ layers: next });
  };

  const reorderLayers = (from: number, to: number) => {
    const next = [...state.layers];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setState({ layers: next });
  };

  const handleReset = () => setState(DEFAULT_SHADOW);

  // ── Derived CSS values ────────────────────────────────────────────────────

  const shadowValue = buildShadowValue(state);
  const declaration = buildShadowDeclaration(state);
  const tailwindClasses = buildShadowTailwind(state);

  // Build per-layer output lines for the CSS panel
  const activeLayerLines = state.layers.filter((l) => l.enabled);
  const cssLines =
    activeLayerLines.length > 0
      ? activeLayerLines.map((l, i, arr) => ({
          property: i === 0 ? 'box-shadow' : '',
          value: `${buildLayerValue(l)}${i < arr.length - 1 ? ',' : ''}`,
        }))
      : [{ property: 'box-shadow', value: 'none' }];

  return (
    <GeneratorLayout
      copyText={declaration}
      onRandomize={() => setState(randomizeShadow())}
      controls={
        <>
          <ShadowControls
            state={state}
            onUpdateLayer={updateLayer}
            onAddLayer={addLayer}
            onDeleteLayer={deleteLayer}
            onDuplicateLayer={duplicateLayer}
            onReorder={reorderLayers}
            onReset={handleReset}
          />
          {/* CSS Import */}
          <div className="mb-3">
            <CssImportButton onImport={(props) => { const partial = shadowFromCss(props); if (!partial) return false; setState({ ...state, ...partial }); }} />
          </div>
          {/* Separator */}
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          {/* Preset panel */}
          <div className="mt-4">
            <PresetPanel<ShadowState>
              tool="shadow"
              currentState={state}
              onLoad={(loaded) => setState(loaded)}
            />
          </div>
        </>
      }
      preview={<ShadowPreview shadowValue={shadowValue} />}
      output={
        <CssOutput
          lines={cssLines}
          copyText={declaration}
          tailwind={{ classes: tailwindClasses, copyText: tailwindClasses }}
        />
      }
    />
  );
}
