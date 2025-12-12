import { FilterGenerator } from '@/src/components/css-filter/FilterGenerator';

export const metadata = {
  title: 'CSS Filter — ok.css',
  description: 'Generate CSS filter declarations: blur, brightness, contrast, grayscale, hue-rotate, and more.',
};

export default function FilterPage() {
  return <FilterGenerator />;
}
