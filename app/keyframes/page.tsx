import { KeyframesGenerator } from '@/src/components/keyframes/KeyframesGenerator';

export const metadata = {
  title: 'Keyframes — ok.css',
  description:
    'Build CSS @keyframes animations with live preview. Configure stops, timing, and copy the full animation block.',
};

export default function KeyframesPage() {
  return <KeyframesGenerator />;
}
