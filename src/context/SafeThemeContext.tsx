import React, { createContext, useContext, ReactNode } from 'react';
import { useSafeAsyncStorage } from '../hooks/useSafeAsyncStorage';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  loading: boolean;
  error: string | null;
  setTheme: (theme: Theme) => Promise<void>;
  toggleTheme: () => Promise<void>;
  refresh: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface SafeThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

/**
 * Safe theme context provider that handles AsyncStorage operations gracefully
 * Prevents white screen crashes by using safe AsyncStorage operations
 */
export function SafeThemeProvider({ 
  children, 
  defaultTheme = 'light' 
}: SafeThemeProviderProps) {
  const {
    value: theme,
    loading,
    error,
    setValue: setTheme,
    refresh,
  } = useSafeAsyncStorage<Theme>({
    key: 'theme_preference',
    defaultValue: defaultTheme,
  });

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    loading,
    error,
    setTheme,
    toggleTheme,
    refresh,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context safely
 * Returns default values if context is not available
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    console.warn('useTheme must be used within a SafeThemeProvider');
    return {
      theme: 'light',
      loading: false,
      error: 'Theme context not available',
      setTheme: async () => {},
      toggleTheme: async () => {},
      refresh: async () => {},
    };
  }
  
  return context;
}