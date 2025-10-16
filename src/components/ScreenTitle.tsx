import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Sun, Moon } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import MicroInteractionWrapper from './MicroInteractionWrapper';

export interface ScreenTitleProps {
  /**
   * The title text to display
   */
  title: string;
  
  /**
   * Optional subtitle or description
   */
  subtitle?: string;
  
  /**
   * Whether to show the theme toggle button
   * @default true
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
  
  /**
   * Custom styles for the subtitle text
   */
  subtitleStyle?: any;
}

/**
 * Reusable ScreenTitle component with integrated dark/light mode toggle
 * 
 * Features:
 * - Consistent title styling across all screens
 * - Integrated theme toggle button with animation
 * - Full accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Animated icon transitions
 * 
 * Usage:
 * ```tsx
 * <ScreenTitle
 *   title="Account"
 *   subtitle="Manage your account settings"
 *   showThemeToggle={true}
 * />
 * ```
 */
export default function ScreenTitle({
  title,
  subtitle,
  showThemeToggle = true,
  style,
  titleStyle,
  subtitleStyle,
}: ScreenTitleProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [iconAnimation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    // Animate icon when theme changes
    Animated.timing(iconAnimation, {
      toValue: theme.isDark ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [theme.isDark, iconAnimation]);

  const handleThemeToggle = () => {
    theme.toggleTheme();
  };

  const rotateInterpolation = iconAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const opacityInterpolation = iconAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const styles = getStyles(theme, insets);

  return (
    <View style={[styles.container, style]} accessible={true} accessibilityRole="header">
      <View style={styles.titleContainer}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
        )}
      </View>
      
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
          accessibilityHint={`Currently in ${theme.isDark ? 'dark' : 'light'} mode`}
        >
          <View style={styles.iconContainer}>
            <Animated.View
              style={[
                styles.iconWrapper,
                {
                  opacity: opacityInterpolation,
                  transform: [{ rotate: rotateInterpolation }],
                },
              ]}
            >
              <Sun 
                weight="light" 
                size={20} 
                color={theme.colors.text} 
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.iconWrapper,
                styles.iconAbsolute,
                {
                  opacity: theme.isDark ? 1 : 0,
                  transform: [{ rotate: rotateInterpolation }],
                },
              ]}
            >
              <Moon 
                weight="light" 
                size={20} 
                color={theme.colors.text} 
              />
            </Animated.View>
          </View>
        </MicroInteractionWrapper>
      )}
    </View>
  );
}

function getStyles(theme: any, insets: any) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.screenPadding,
      paddingTop: insets.top + theme.spacing.md, // Add safe area top padding
      paddingBottom: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '500',
    },
    subtitle: {
      ...theme.typography.body2,
      color: theme.colors.textMuted,
      marginTop: 2,
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
    iconContainer: {
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrapper: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconAbsolute: {
      opacity: 0,
    },
  });
}
