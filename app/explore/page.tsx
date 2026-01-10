import type { Metadata } from 'next';
import { ExploreClient } from '@/src/components/explore/ExploreClient';

export const metadata: Metadata = {
  title: 'Explore — okcss',
  description: 'Browse community-shared CSS presets from all generators.',
};

export default function ExplorePage() {
  return <ExploreClient />;
}
