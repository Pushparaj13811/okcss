import { TransformGenerator } from '@/src/components/transform/TransformGenerator';

export const metadata = {
  title: 'CSS Transform — ok.css',
  description: 'Generate CSS transform declarations: rotate, scale, translate, and skew with live preview.',
};

export default function TransformPage() {
  return <TransformGenerator />;
}
