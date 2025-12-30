'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ThemeConfig } from '@/lib/dominanceDetector';

interface ThemeContextValue {
  theme: ThemeConfig | null;
  applyTheme: (theme: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: null,
  applyTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);

  const applyTheme = useCallback((newTheme: ThemeConfig) => {
    setTheme(newTheme);

    // Apply CSS variables to :root for global theme access
    const root = document.documentElement;
    root.style.setProperty('--color-primary', newTheme.colors.primary);
    root.style.setProperty('--color-secondary', newTheme.colors.secondary);
    root.style.setProperty('--color-accent', newTheme.colors.accent);
    root.style.setProperty('--color-background', newTheme.colors.background);
    root.style.setProperty('--gradient-main', newTheme.gradients.main);
    root.style.setProperty('--gradient-overlay', newTheme.gradients.overlay);

    console.log(`🎨 Theme Applied: ${newTheme.name}`, newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
