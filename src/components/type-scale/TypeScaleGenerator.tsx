'use client';

import {
  TypeScaleState,
  DEFAULT_TYPE_SCALE,
  buildTypeScaleCss,
  buildTypeScaleCopyText,
  randomizeTypeScale,
} from '@/src/lib/type-scale';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { TypeScaleControls } from './TypeScaleControls';
import { TypeScalePreview } from './TypeScalePreview';

export function TypeScaleGenerator() {
  const [state, setState] = useUrlState<TypeScaleState>(DEFAULT_TYPE_SCALE, 'ts');

  const handleChange = <K extends keyof TypeScaleState>(key: K, value: TypeScaleState[K]) => {
    setState({ ...state, [key]: value });
  };

  const lines    = buildTypeScaleCss(state);
  const copyText = buildTypeScaleCopyText(state);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setState(randomizeTypeScale())}
      controls={
        <>
          <TypeScaleControls
            state={state}
            onChange={handleChange}
            onReset={() => setState(DEFAULT_TYPE_SCALE)}
          />
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<TypeScaleState> tool="type-scale" currentState={state} onLoad={setState} />
          </div>
        </>
      }
      preview={<TypeScalePreview state={state} />}
      output={<CssOutput lines={lines} copyText={copyText} rawCss={copyText} />}
    />
  );
}
