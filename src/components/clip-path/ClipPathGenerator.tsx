'use client';

import {
  ClipPathState,
  DEFAULT_CLIP_PATH,
  buildClipPathCss,
  buildClipPathCopyText,
  randomizeClipPath,
} from '@/src/lib/clip-path';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { CssImportButton } from '@/src/components/ui/CssImportButton';
import { clipPathFromCss } from '@/src/lib/css-import';
import { ClipPathControls } from './ClipPathControls';
import { ClipPathPreview } from './ClipPathPreview';

export function ClipPathGenerator() {
  const [state, setState] = useUrlState<ClipPathState>(DEFAULT_CLIP_PATH, 'cp');

  const handleChange = <K extends keyof ClipPathState>(key: K, value: ClipPathState[K]) => {
    setState({ ...state, [key]: value });
  };

  const lines = buildClipPathCss(state);
  const copyText = buildClipPathCopyText(state);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setState(randomizeClipPath())}
      controls={
        <>
          <ClipPathControls
            state={state}
            onChange={handleChange}
            onReset={() => setState(DEFAULT_CLIP_PATH)}
          />
          <div className="mb-3">
            <CssImportButton onImport={(props) => { const partial = clipPathFromCss(props); if (!partial) return false; setState({ ...state, ...partial }); }} />
          </div>
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<ClipPathState> tool="clip-path" currentState={state} onLoad={setState} />
          </div>
        </>
      }
      preview={<ClipPathPreview state={state} />}
      output={<CssOutput lines={lines} copyText={copyText} />}
    />
  );
}
