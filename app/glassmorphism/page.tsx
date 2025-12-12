import { GlassGenerator } from '@/src/components/glassmorphism/GlassGenerator';

export const metadata = {
  title: 'Glassmorphism — ok.css',
  description: 'Generate frosted glass CSS with live preview. Adjust blur, opacity, and border to copy production-ready code.',
};

export default function GlassmorphismPage() {
  return <GlassGenerator />;
}
