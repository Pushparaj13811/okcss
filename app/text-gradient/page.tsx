import { TextGradientGenerator } from '@/src/components/text-gradient/TextGradientGenerator';

export const metadata = {
  title: 'Text Gradient — ok.css',
  description: 'Generate CSS gradient text with background-clip: text. Supports linear and radial gradients with multiple colour stops.',
};

export default function TextGradientPage() {
  return <TextGradientGenerator />;
}
