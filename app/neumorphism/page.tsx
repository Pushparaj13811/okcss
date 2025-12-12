import { NeuGenerator } from '@/src/components/neumorphism/NeuGenerator';

export const metadata = {
  title: 'Neumorphism — ok.css',
  description: 'Generate soft-extrusion CSS with dual light and dark shadows. Pick a base colour and adjust depth.',
};

export default function NeumorphismPage() {
  return <NeuGenerator />;
}
