import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import MicroInteractionWrapper from './MicroInteractionWrapper';
import { Sun, Moon } from 'phosphor-react-native';

export interface SectionHeaderProps {
  /**
   * The title text to display
   */
  title: string;
  
  /**
   * Whether to show the theme toggle button
   * @default false
   */
  showThemeToggle?: boolean;
  
  /**
   * Custom styles for the container
   */
  style?: any;
  
  /**
   * Custom styles for the title text
   */
  titleStyle?: any;
}

/**
 * Reusable SectionHeader component for section titles with optional theme toggle
 * 
 * Features:
 * - Consistent section title styling
 * - Optional theme toggle button on the right
 * - Theme-aware colors and spacing
 * - Accessibility compliance (WCAG AA)
 * - Microinteractions for theme toggle
 * 
 * Usage:
 * ```tsx
 * <SectionHeader title="Settings" showThemeToggle={true} />
 * <SectionHeader title="About Us" />
 * ```
 */
export default function SectionHeader({
  title,
  showThemeToggle = false,
  style,
  titleStyle,
}: SectionHeaderProps) {
  const theme = useTheme();

  const handleThemeToggle = () => {
    theme.toggleTheme();
  };

  const styles = getStyles(theme);

  return (
    <View style={[styles.container, style]} accessible={true} accessibilityRole="header">
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      
      {showThemeToggle && (
        <MicroInteractionWrapper
          style={styles.themeToggle}
          onPress={handleThemeToggle}
          hapticType="light"
          animationType="scale"
          pressScale={0.9}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={theme.isDark ? "Switch to light mode" : "Switch to dark mode"}
          accessibilityHint="Toggles between light and dark theme"
        >
          {theme.isDark ? (
            <Sun 
              weight="light" 
              size={20} 
              color={theme.colors.text} 
            />
          ) : (
            <Moon 
              weight="light" 
              size={20} 
              color={theme.colors.text} 
            />
          )}
        </MicroInteractionWrapper>
      )}
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 20,
      marginBottom: 16, // Gap between section title and content (design system rule)
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '600',
      flex: 1,
    },
    themeToggle: {
      width: theme.layout.minTouchTarget,
      height: theme.layout.minTouchTarget,
      borderRadius: theme.radius.round,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      ...theme.shadows.small,
    },
  });
}
