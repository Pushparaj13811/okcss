import { PaletteGenerator } from '@/src/components/color-palette/PaletteGenerator';

export const metadata = {
  title: 'Color Palette — ok.css',
  description: 'Generate harmonious CSS color palettes using color theory: complementary, triadic, analogous, and more. Outputs CSS custom properties.',
};

export default function ColorPalettePage() {
  return <PaletteGenerator />;
}
