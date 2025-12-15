import { ClipPathGenerator } from '@/src/components/clip-path/ClipPathGenerator';

export const metadata = {
  title: 'Clip-Path — ok.css',
  description: 'Generate CSS clip-path shapes: polygon presets (triangle, hexagon, star…), circle, ellipse, and inset with live preview.',
};

export default function ClipPathPage() {
  return <ClipPathGenerator />;
}
