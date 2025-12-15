'use client';

import {
  TransformState,
  DEFAULT_TRANSFORM,
  buildTransformCss,
  buildTransformCopyText,
  buildTransformTailwind,
  randomizeTransform,
} from '@/src/lib/transform';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { CssImportButton } from '@/src/components/ui/CssImportButton';
import { transformFromCss } from '@/src/lib/css-import';
import { TransformControls } from './TransformControls';
import { TransformPreview } from './TransformPreview';

export function TransformGenerator() {
  const [state, setState] = useUrlState<TransformState>(DEFAULT_TRANSFORM, 's');

  const handleChange = <K extends keyof TransformState>(key: K, value: TransformState[K]) => {
    setState({ ...state, [key]: value });
  };

  const lines = buildTransformCss(state);
  const copyText = buildTransformCopyText(state);
  const tailwindClasses = buildTransformTailwind(state);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setState(randomizeTransform())}
      controls={
        <>
          <TransformControls state={state} onChange={handleChange} onReset={() => setState(DEFAULT_TRANSFORM)} />
          <div className="mb-3">
            <CssImportButton onImport={(props) => { const partial = transformFromCss(props); if (!partial) return false; setState({ ...state, ...partial }); }} />
          </div>
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<TransformState> tool="transform" currentState={state} onLoad={setState} />
          </div>
        </>
      }
      preview={<TransformPreview state={state} />}
      output={
        <CssOutput
          lines={lines}
          copyText={copyText}
          tailwind={{ classes: tailwindClasses, copyText: tailwindClasses }}
        />
      }
    />
  );
}
