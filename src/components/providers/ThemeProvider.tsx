'use client';

import { createContext, useContext, useLayoutEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with 'light' — matches server render, avoids hydration mismatch.
  // The inline script in layout.tsx has already set .dark on <html> if needed,
  // so colors are correct from first paint. We just sync React state here.
  const [theme, setTheme] = useState<Theme>('light');

  useLayoutEffect(() => {
    // Read what the inline script already applied to the DOM.
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';

      // Apply to DOM immediately — no re-render lag on the class.
      document.documentElement.classList.toggle('dark', next === 'dark');
      localStorage.setItem('okcss-theme', next);

      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
