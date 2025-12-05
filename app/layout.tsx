import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/src/components/providers/ThemeProvider';
import { AuthProvider } from '@/src/components/providers/AuthProvider';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ok.css — Visual CSS Generator',
  description:
    'Generate box shadows, gradients, and glassmorphism effects with live preview. Copy production-ready CSS instantly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*
     * suppressHydrationWarning is required here because the inline script
     * below modifies the `class` attribute on <html> before React hydrates.
     * Without it, React would log a hydration mismatch warning when a user
     * is in dark mode (server renders without .dark, script adds .dark).
     */
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
         * FOUC prevention — runs synchronously before the browser paints.
         * This is the only reliable way to avoid a flash of light mode for
         * users who prefer dark. No useState, no useEffect, no async — just
         * a tiny script that reads localStorage and sets the class immediately.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('okcss-theme');if(!t){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';}document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <ThemeProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
