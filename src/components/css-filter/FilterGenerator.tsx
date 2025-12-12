'use client';

import {
  FilterState,
  DEFAULT_FILTER,
  buildFilterCss,
  buildFilterCopyText,
  buildFilterTailwind,
  randomizeFilter,
} from '@/src/lib/css-filter';
import { useUrlState } from '@/src/hooks/useUrlState';
import { GeneratorLayout } from '@/src/components/ui/GeneratorLayout';
import { CssOutput } from '@/src/components/ui/CssOutput';
import { PresetPanel } from '@/src/components/ui/PresetPanel';
import { CssImportButton } from '@/src/components/ui/CssImportButton';
import { filterFromCss } from '@/src/lib/css-import';
import { FilterControls } from './FilterControls';
import { FilterPreview } from './FilterPreview';

export function FilterGenerator() {
  const [state, setState] = useUrlState<FilterState>(DEFAULT_FILTER, 's');

  const handleChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setState({ ...state, [key]: value });
  };

  const lines = buildFilterCss(state);
  const copyText = buildFilterCopyText(state);
  const tailwindClasses = buildFilterTailwind(state);

  return (
    <GeneratorLayout
      copyText={copyText}
      onRandomize={() => setState(randomizeFilter())}
      controls={
        <>
          <FilterControls state={state} onChange={handleChange} onReset={() => setState(DEFAULT_FILTER)} />
          <div className="mb-3 mt-4">
            <CssImportButton onImport={(props) => { const partial = filterFromCss(props); if (!partial) return false; setState({ ...state, ...partial }); }} />
          </div>
          <div className="h-px w-full mt-2" style={{ background: 'var(--border-subtle)' }} />
          <div className="mt-4">
            <PresetPanel<FilterState> tool="filter" currentState={state} onLoad={setState} />
          </div>
        </>
      }
      preview={<FilterPreview state={state} />}
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
