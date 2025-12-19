import { ScrollbarGenerator } from '@/src/components/scrollbar/ScrollbarGenerator';

export const metadata = {
  title: 'Custom Scrollbar — ok.css',
  description: 'Generate custom CSS scrollbar styles using -webkit-scrollbar and the modern scrollbar-color / scrollbar-width properties.',
};

export default function ScrollbarPage() {
  return <ScrollbarGenerator />;
}
