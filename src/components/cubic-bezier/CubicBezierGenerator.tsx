'use client';

import {
  CubicBezierState,
  DEFAULT_CUBIC_BEZIER,
  buildBezierCss,
  buildBezierCopyText,
  randomizeBezier,
} from '@/src/lib/cubic-bezier';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { CssImportButton } from '@/src/components/ui/CssImportButton';
import { cubicBezierFromCss } from '@/src/lib/css-import';
import { CubicBezierControls } from './CubicBezierControls';
import { CubicBezierPreview } from './CubicBezierPreview';

export function CubicBezierGenerator() {
  const [state, setState] = useUrlState<CubicBezierState>(DEFAULT_CUBIC_BEZIER, 'cb');

  const handleChange = (patch: Partial<CubicBezierState>) => {
    setState({ ...state, ...patch });
  };

  const lines = buildBezierCss(state);
  const copyText = buildBezierCopyText(state);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setState(randomizeBezier())}
      controls={
        <>
          <CubicBezierControls
            state={state}
            onChange={handleChange}
            onReset={() => setState(DEFAULT_CUBIC_BEZIER)}
          />
          <div className="mb-3">
            <CssImportButton onImport={(props) => { const partial = cubicBezierFromCss(props); if (!partial) return false; setState({ ...state, ...partial }); }} />
          </div>
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<CubicBezierState> tool="cubic-bezier" currentState={state} onLoad={setState} />
          </div>
        </>
      }
      preview={<CubicBezierPreview state={state} onChange={handleChange} />}
      output={<CssOutput lines={lines} copyText={copyText} rawCss={copyText} />}
    />
  );
}
