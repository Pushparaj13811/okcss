import type { MetadataRoute } from 'next';

const BASE_URL = 'https://okcss.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = [
    '/shadow',
    '/glassmorphism',
    '/gradient',
    '/neumorphism',
    '/text-shadow',
    '/border-radius',
    '/filter',
    '/transform',
    '/text-gradient',
    '/conic-gradient',
    '/scrollbar',
    '/clip-path',
    '/cubic-bezier',
    '/type-scale',
    '/color-palette',
    '/transition',
    '/keyframes',
    '/outline',
    '/combine',
  ];

  return [
    {
      url: BASE_URL,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...tools.map((tool) => ({
      url: `${BASE_URL}${tool}`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ];
}
