'use client';

import {
  TransitionState,
  DEFAULT_TRANSITION,
  buildTransitionCss,
  buildTransitionCopyText,
  buildTransitionTailwind,
  randomizeTransition,
} from '@/src/lib/transition';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { CssImportButton } from '@/src/components/ui/CssImportButton';
import { transitionFromCss } from '@/src/lib/css-import';
import { TransitionControls } from './TransitionControls';
import { TransitionPreview } from './TransitionPreview';

export function TransitionGenerator() {
  const [state, setState] = useUrlState<TransitionState>(DEFAULT_TRANSITION, 'tr');

  const lines = buildTransitionCss(state);
  const copyText = buildTransitionCopyText(state);
  const tailwindClasses = buildTransitionTailwind(state);

  const isTailwindSupported =
    state.layers.length === 1 && state.layers[0].property === 'all';

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setState(randomizeTransition())}
      controls={
        <>
          <TransitionControls
            state={state}
            onChange={setState}
            onReset={() => setState(DEFAULT_TRANSITION)}
          />
          <div className="mb-3">
            <CssImportButton onImport={(props) => { const partial = transitionFromCss(props); if (!partial) return false; setState({ ...state, ...partial }); }} />
          </div>
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<TransitionState> tool="transition" currentState={state} onLoad={setState} />
          </div>
        </>
      }
      preview={<TransitionPreview state={state} />}
      output={
        <CssOutput
          lines={lines}
          copyText={copyText}
          rawCss={copyText}
          tailwind={
            isTailwindSupported
              ? {
                  classes: tailwindClasses,
                  copyText: tailwindClasses,
                }
              : undefined
          }
        />
      }
    />
  );
}
