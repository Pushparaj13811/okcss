import { CubicBezierGenerator } from '@/src/components/cubic-bezier/CubicBezierGenerator';

export const metadata = {
  title: 'Cubic-Bezier — ok.css',
  description: 'Design custom CSS cubic-bezier() easing curves with a visual editor. Drag control points, pick presets, and copy timing-function CSS.',
};

export default function CubicBezierPage() {
  return <CubicBezierGenerator />;
}
