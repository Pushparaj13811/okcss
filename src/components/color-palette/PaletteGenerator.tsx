'use client';

import {
  ColorPaletteState,
  DEFAULT_PALETTE,
  buildPaletteCss,
  buildPaletteCopyText,
  randomizePalette,
} from '@/src/lib/color-palette';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { PaletteControls } from './PaletteControls';
import { PalettePreview } from './PalettePreview';

export function PaletteGenerator() {
  const [state, setState] = useUrlState<ColorPaletteState>(DEFAULT_PALETTE, 'pal');

  const handleChange = <K extends keyof ColorPaletteState>(key: K, value: ColorPaletteState[K]) => {
    setState({ ...state, [key]: value });
  };

  const lines    = buildPaletteCss(state);
  const copyText = buildPaletteCopyText(state);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setState(randomizePalette())}
      controls={
        <>
          <PaletteControls
            state={state}
            onChange={handleChange}
            onReset={() => setState(DEFAULT_PALETTE)}
          />
          <div className="h-px w-full mt-5" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<ColorPaletteState> tool="color-palette" currentState={state} onLoad={setState} />
          </div>
        </>
      }
      preview={<PalettePreview state={state} />}
      output={<CssOutput lines={lines} copyText={copyText} rawCss={copyText} />}
    />
  );
}
