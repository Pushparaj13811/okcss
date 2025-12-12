'use client';

import {
  NeuState,
  DEFAULT_NEU,
  buildNeuCss,
  buildNeuCopyText,
  buildNeuTailwind,
  randomizeNeu,
} from '@/src/lib/neumorphism';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { NeuControls } from './NeuControls';
import { NeuPreview } from './NeuPreview';

export function NeuGenerator() {
  const [neu, setNeu] = useUrlState<NeuState>(DEFAULT_NEU, 's');

  const handleChange = <K extends keyof NeuState>(key: K, value: NeuState[K]) => {
    setNeu({ ...neu, [key]: value });
  };

  const handleReset = () => setNeu(DEFAULT_NEU);

  const lines = buildNeuCss(neu);
  const copyText = buildNeuCopyText(neu);
  const tailwindClasses = buildNeuTailwind(neu);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setNeu(randomizeNeu())}
      controls={
        <>
          <NeuControls state={neu} onChange={handleChange} onReset={handleReset} />
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<NeuState> tool="neumorphism" currentState={neu} onLoad={setNeu} />
          </div>
        </>
      }
      preview={<NeuPreview state={neu} />}
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
