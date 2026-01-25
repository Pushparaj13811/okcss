import type { Metadata } from 'next';
import { CombineClient } from '@/src/components/combine/CombineClient';

export const metadata: Metadata = {
  title: 'Combine — ok.css',
  description: 'Apply multiple CSS generators to a single element and copy the combined output.',
};

export default function CombinePage() {
  return <CombineClient />;
}
