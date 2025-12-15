'use client';

import {
  BorderRadiusState,
  DEFAULT_BORDER_RADIUS,
  buildBorderRadiusCss,
  buildBorderRadiusCopyText,
  buildBorderRadiusTailwind,
  randomizeBorderRadius,
} from '@/src/lib/border-radius';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { CssImportButton } from '@/src/components/ui/CssImportButton';
import { borderRadiusFromCss } from '@/src/lib/css-import';
import { BorderRadiusControls } from './BorderRadiusControls';
import { BorderRadiusPreview } from './BorderRadiusPreview';

export function BorderRadiusGenerator() {
  const [state, setState] = useUrlState<BorderRadiusState>(DEFAULT_BORDER_RADIUS, 's');

  const handleChange = <K extends keyof BorderRadiusState>(key: K, value: BorderRadiusState[K]) => {
    setState({ ...state, [key]: value });
  };

  const lines = buildBorderRadiusCss(state);
  const copyText = buildBorderRadiusCopyText(state);
  const tailwindClasses = buildBorderRadiusTailwind(state);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setState(randomizeBorderRadius())}
      controls={
        <>
          <BorderRadiusControls state={state} onChange={handleChange} onReset={() => setState(DEFAULT_BORDER_RADIUS)} />
          <div className="mb-3">
            <CssImportButton onImport={(props) => { const partial = borderRadiusFromCss(props); if (!partial) return false; setState({ ...state, ...partial }); }} />
          </div>
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<BorderRadiusState> tool="border-radius" currentState={state} onLoad={setState} />
          </div>
        </>
      }
      preview={<BorderRadiusPreview state={state} />}
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
