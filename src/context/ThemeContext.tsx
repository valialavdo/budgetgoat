import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import designSystem from '../design-system';

// Fonts configuration
const Fonts = {
  dmSans: {
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    semiBold: 'DMSans_600SemiBold',
    bold: 'DMSans_700Bold',
  },
};

// Define color schemes for light and dark modes
const lightColors = designSystem.colors;

const darkColors = {
  // Primary colors - Dark mode
  background: '#0F172A',
  surface: '#1E293B',
  surfaceElevated: '#334155',
  
  // Text colors - Dark mode
  text: '#F8FAFC',
  textMuted: '#CBD5E1',
  textLight: '#94A3B8',
  
  // Brand colors - Same as light mode for consistency
  goatGreen: '#059669',
  trustBlue: '#0052CC',
  alertRed: '#DC2626',
  warningOrange: '#D97706',
  
  // UI colors - Dark mode
  border: '#334155',
  borderLight: '#475569',
  divider: '#334155',
  shadow: '#000000',
  
  // Status colors - Same as light mode
  success: '#059669',
  error: '#DC2626',
  warning: '#D97706',
  info: '#0052CC',
  
  // Category type colors - Same as light mode
  income: '#059669',
  expense: '#DC2626',
  pocket: '#0052CC',
  
  // Pocket type colors - Same as light mode
  standardPocket: '#7C3AED',
  goalPocket: '#D97706',
  
  // Numeric label color
  numericLabel: '#06B6D6',
  
  // Transaction status colors
  linkedPocket: '#3B82F6',
  unlinked: '#6B7280',
  
  // Label severity colors - Same as light mode
  labelExpense: '#DC2626',
  labelIncome: '#059669',
  labelRecurring: '#D97706',
  labelStandard: '#7C3AED',
  labelGoal: '#D97706',
};

// Theme interface
interface ThemeContextType {
  isDark: boolean;
  colors: typeof lightColors;
  fonts: typeof Fonts;
  spacing: typeof designSystem.spacing;
  radius: typeof designSystem.radius;
  shadows: typeof designSystem.shadows;
  typography: typeof designSystem.typography;
  layout: typeof designSystem.layout;
  componentStyles: typeof designSystem.componentStyles;
  toggleTheme: () => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference
  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const theme: ThemeContextType = {
    isDark,
    colors: isDark ? darkColors : lightColors,
    fonts: Fonts,
    spacing: designSystem.spacing,
    radius: designSystem.radius,
    shadows: designSystem.shadows,
    typography: designSystem.typography,
    layout: designSystem.layout,
    componentStyles: designSystem.componentStyles,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;