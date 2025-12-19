import { TransitionGenerator } from '@/src/components/transition/TransitionGenerator';

export const metadata = {
  title: 'CSS Transition — ok.css',
  description:
    'Generate CSS transition values with live preview. Configure property, duration, easing, and delay — with multi-layer support.',
};

export default function TransitionPage() {
  return <TransitionGenerator />;
}
