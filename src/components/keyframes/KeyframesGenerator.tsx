'use client';

import {
  KeyframesState,
  DEFAULT_KEYFRAMES,
  buildKeyframesCss,
  buildKeyframesCopyText,
  randomizeKeyframes,
} from '@/src/lib/keyframes';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { KeyframesControls } from './KeyframesControls';
import { KeyframesPreview } from './KeyframesPreview';

export function KeyframesGenerator() {
  const [state, setState] = useUrlState<KeyframesState>(DEFAULT_KEYFRAMES, 'kf');

  const handleChange = <K extends keyof KeyframesState>(key: K, value: KeyframesState[K]) => {
    setState({ ...state, [key]: value });
  };

  const lines = buildKeyframesCss(state);
  const copyText = buildKeyframesCopyText(state);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setState(randomizeKeyframes())}
      controls={
        <>
          <KeyframesControls
            state={state}
            onChange={handleChange}
            onReset={() => setState(DEFAULT_KEYFRAMES)}
          />
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<KeyframesState> tool="keyframes" currentState={state} onLoad={setState} />
          </div>
        </>
      }
      preview={<KeyframesPreview state={state} />}
      output={<CssOutput lines={lines} copyText={copyText} rawCss={copyText} />}
    />
  );
}
