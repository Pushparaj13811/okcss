'use client';

import {
  GradientState,
  DEFAULT_GRADIENT,
  buildGradientCss,
  buildGradientCopyText,
  buildGradientTailwind,
  randomizeGradient,
} from '@/src/lib/gradient';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { CssImportButton } from '@/src/components/ui/CssImportButton';
import { gradientFromCss } from '@/src/lib/css-import';
import { GradientControls } from './GradientControls';
import { GradientPreview } from './GradientPreview';

export function GradientGenerator() {
  const [gradient, setGradient] = useUrlState<GradientState>(DEFAULT_GRADIENT, 's');

  const handleChange = <K extends keyof GradientState>(key: K, value: GradientState[K]) => {
    setGradient({ ...gradient, [key]: value });
  };

  const handleReset = () => setGradient(DEFAULT_GRADIENT);

  const lines = buildGradientCss(gradient);
  const copyText = buildGradientCopyText(gradient);
  const tailwindClasses = buildGradientTailwind(gradient);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setGradient(randomizeGradient())}
      controls={
        <>
          <GradientControls state={gradient} onChange={handleChange} onReset={handleReset} />
          <div className="mb-3">
            <CssImportButton onImport={(props) => { const partial = gradientFromCss(props); if (!partial) return false; setGradient({ ...gradient, ...partial }); }} />
          </div>
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<GradientState> tool="gradient" currentState={gradient} onLoad={setGradient} />
          </div>
        </>
      }
      preview={<GradientPreview state={gradient} />}
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
