'use client';

import {
  OutlineState,
  DEFAULT_OUTLINE,
  buildOutlineCss,
  buildOutlineCopyText,
  buildOutlineTailwind,
  randomizeOutline,
} from '@/src/lib/outline';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { CssImportButton } from '@/src/components/ui/CssImportButton';
import { outlineFromCss } from '@/src/lib/css-import';
import { OutlineControls } from './OutlineControls';
import { OutlinePreview } from './OutlinePreview';

export function OutlineGenerator() {
  const [state, setState] = useUrlState<OutlineState>(DEFAULT_OUTLINE, 'ol');

  const handleChange = <K extends keyof OutlineState>(key: K, value: OutlineState[K]) => {
    setState({ ...state, [key]: value });
  };

  const lines = buildOutlineCss(state);
  const copyText = buildOutlineCopyText(state);
  const tailwind = buildOutlineTailwind(state);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setState(randomizeOutline())}
      controls={
        <>
          <OutlineControls
            state={state}
            onChange={handleChange}
            onReset={() => setState(DEFAULT_OUTLINE)}
          />
          <div className="mb-3">
            <CssImportButton onImport={(props) => { const partial = outlineFromCss(props); if (!partial) return false; setState({ ...state, ...partial }); }} />
          </div>
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<OutlineState> tool="outline" currentState={state} onLoad={setState} />
          </div>
        </>
      }
      preview={<OutlinePreview state={state} />}
      output={<CssOutput lines={lines} copyText={copyText} tailwind={tailwind} />}
    />
  );
}
