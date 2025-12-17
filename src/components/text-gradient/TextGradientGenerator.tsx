'use client';

import { useState } from 'react';
import {
  TextGradientState,
  DEFAULT_TEXT_GRADIENT,
  buildTextGradientCss,
  buildTextGradientCopyText,
  buildTextGradientTailwind,
  randomizeTextGradient,
} from '@/src/lib/text-gradient';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { TextGradientControls } from './TextGradientControls';
import { TextGradientPreview } from './TextGradientPreview';

export function TextGradientGenerator() {
  const [state, setState] = useUrlState<TextGradientState>(DEFAULT_TEXT_GRADIENT, 's');
  const [previewText, setPreviewText] = useState('Hello');

  const handleChange = <K extends keyof TextGradientState>(key: K, value: TextGradientState[K]) => {
    setState({ ...state, [key]: value });
  };

  const lines = buildTextGradientCss(state);
  const copyText = buildTextGradientCopyText(state);
  const tailwindClasses = buildTextGradientTailwind(state);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setState(randomizeTextGradient())}
      controls={
        <>
          <TextGradientControls
            state={state}
            previewText={previewText}
            onPreviewTextChange={setPreviewText}
            onChange={handleChange}
            onReset={() => setState(DEFAULT_TEXT_GRADIENT)}
          />
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<TextGradientState> tool="text-gradient" currentState={state} onLoad={setState} />
          </div>
        </>
      }
      preview={<TextGradientPreview state={state} previewText={previewText} />}
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
