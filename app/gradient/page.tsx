import { GradientGenerator } from '@/src/components/gradient/GradientGenerator';

export const metadata = {
  title: 'Gradient — ok.css',
  description: 'Build CSS gradients with custom colour stops. Switch between linear and radial. Copy the CSS or Tailwind classes.',
};

export default function GradientPage() {
  return <GradientGenerator />;
}
