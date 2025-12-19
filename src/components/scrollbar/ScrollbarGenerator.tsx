'use client';

import {
  ScrollbarState,
  DEFAULT_SCROLLBAR,
  buildScrollbarCss,
  buildScrollbarCopyText,
  randomizeScrollbar,
} from '@/src/lib/scrollbar';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { ScrollbarControls } from './ScrollbarControls';
import { ScrollbarPreview } from './ScrollbarPreview';

export function ScrollbarGenerator() {
  const [state, setState] = useUrlState<ScrollbarState>(DEFAULT_SCROLLBAR, 's');

  const handleChange = <K extends keyof ScrollbarState>(key: K, value: ScrollbarState[K]) => {
    setState({ ...state, [key]: value });
  };

  const lines = buildScrollbarCss(state);
  const copyText = buildScrollbarCopyText(state);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setState(randomizeScrollbar())}
      controls={
        <>
          <ScrollbarControls
            state={state}
            onChange={handleChange}
            onReset={() => setState(DEFAULT_SCROLLBAR)}
          />
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<ScrollbarState> tool="scrollbar" currentState={state} onLoad={setState} />
          </div>
        </>
      }
      preview={<ScrollbarPreview state={state} />}
      output={<CssOutput lines={lines} copyText={copyText} rawCss={copyText} />}
    />
  );
}
