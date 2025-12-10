import { ShadowGenerator } from '@/src/components/shadow/ShadowGenerator';

export const metadata = {
  title: 'Box Shadow — ok.css',
  description: 'Generate CSS box-shadow declarations with live preview. Multi-layer, inset shadows, shareable URLs.',
};

export default function ShadowPage() {
  return <ShadowGenerator />;
}
