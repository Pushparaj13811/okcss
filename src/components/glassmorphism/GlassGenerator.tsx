'use client';

import { GlassState, DEFAULT_GLASS, buildGlassCss, buildGlassCopyText, buildGlassTailwind, randomizeGlass } from '@/src/lib/glass';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { CssImportButton } from '@/src/components/ui/CssImportButton';
import { glassFromCss } from '@/src/lib/css-import';
import { GlassControls } from './GlassControls';
import { GlassPreview } from './GlassPreview';

export function GlassGenerator() {
  const [glass, setGlass] = useUrlState<GlassState>(DEFAULT_GLASS, 's');

  const handleChange = <K extends keyof GlassState>(key: K, value: GlassState[K]) => {
    setGlass({ ...glass, [key]: value });
  };

  const handleReset = () => setGlass(DEFAULT_GLASS);

  const lines = buildGlassCss(glass);
  const copyText = buildGlassCopyText(glass);
  const tailwindClasses = buildGlassTailwind(glass);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setGlass(randomizeGlass())}
      controls={
        <>
          <GlassControls state={glass} onChange={handleChange} onReset={handleReset} />
          <div className="mb-3">
            <CssImportButton onImport={(props) => { const partial = glassFromCss(props); if (!partial) return false; setGlass({ ...glass, ...partial }); }} />
          </div>
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<GlassState> tool="glassmorphism" currentState={glass} onLoad={setGlass} />
          </div>
        </>
      }
      preview={<GlassPreview state={glass} />}
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
