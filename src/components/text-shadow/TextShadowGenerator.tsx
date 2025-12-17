'use client';

import {
  TextShadowState,
  DEFAULT_TEXT_SHADOW,
  buildTextShadowValue,
  buildTextShadowDeclaration,
  buildTextShadowTailwind,
  randomizeTextShadow,
} from '@/src/lib/text-shadow';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { CssImportButton } from '@/src/components/ui/CssImportButton';
import { textShadowFromCss } from '@/src/lib/css-import';
import { TextShadowControls } from './TextShadowControls';
import { TextShadowPreview } from './TextShadowPreview';

export function TextShadowGenerator() {
  const [state, setState] = useUrlState<TextShadowState>(DEFAULT_TEXT_SHADOW, 's');

  const handleChange = <K extends keyof TextShadowState>(key: K, value: TextShadowState[K]) => {
    setState({ ...state, [key]: value });
  };

  const shadowValue = buildTextShadowValue(state);
  const declaration = buildTextShadowDeclaration(state);
  const tailwindClasses = buildTextShadowTailwind(state);

  return (
    <GeneratorLayout
      copyText={declaration}
      onRandomize={() => setState(randomizeTextShadow())}
      controls={
        <>
          <TextShadowControls state={state} onChange={handleChange} onReset={() => setState(DEFAULT_TEXT_SHADOW)} />
          <div className="mb-3">
            <CssImportButton onImport={(props) => { const partial = textShadowFromCss(props); if (!partial) return false; setState({ ...state, ...partial }); }} />
          </div>
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<TextShadowState> tool="text-shadow" currentState={state} onLoad={setState} />
          </div>
        </>
      }
      preview={<TextShadowPreview state={state} />}
      output={
        <CssOutput
          lines={[{ property: 'text-shadow', value: shadowValue }]}
          copyText={declaration}
          tailwind={{ classes: tailwindClasses, copyText: tailwindClasses }}
        />
      }
    />
  );
}
