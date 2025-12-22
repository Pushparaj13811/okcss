import { TypeScaleGenerator } from '@/src/components/type-scale/TypeScaleGenerator';

export const metadata = {
  title: 'Type Scale — ok.css',
  description: 'Generate a modular CSS type scale with named ratio presets (Major Third, Perfect Fourth, Golden…). Output as CSS custom properties.',
};

export default function TypeScalePage() {
  return <TypeScaleGenerator />;
}
