import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import MicroInteractionWrapper from './MicroInteractionWrapper';

export interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;
  
  /**
   * Whether the card is pressable
   * @default false
   */
  pressable?: boolean;
  
  /**
   * Callback when card is pressed (when pressable is true)
   */
  onPress?: () => void;
  
  /**
   * Card variant/style
   * @default 'default'
   */
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  
  /**
   * Custom styles for the card container
   */
  style?: ViewStyle;
  
  /**
   * Padding inside the card
   * @default theme.spacing.md
   */
  padding?: number;
  
  /**
   * Margin around the card
   * @default theme.spacing.sm
   */
  margin?: number;
  
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
  
  /**
   * Accessibility hint for screen readers
   */
  accessibilityHint?: string;
}

/**
 * Reusable Card component for consistent card layouts
 * 
 * Features:
 * - Multiple variants (default, elevated, outlined, flat)
 * - Pressable support with microinteractions
 * - Consistent spacing and shadows
 * - Theme integration
 * - Accessibility support
 * 
 * Usage:
 * ```tsx
 * <Card variant="elevated" pressable onPress={handlePress}>
 *   <Text>Card content</Text>
 * </Card>
 * ```
 */
export default function Card({
  children,
  pressable = false,
  onPress,
  variant = 'default',
  style,
  padding,
  margin,
  accessibilityLabel,
  accessibilityHint,
}: CardProps) {
  const theme = useTheme();
  
  const styles = getStyles(theme, padding, margin);
  const cardStyle = StyleSheet.flatten([styles.card, styles[variant], style]);
  
  if (pressable && onPress) {
    return (
      <MicroInteractionWrapper
        style={cardStyle}
        onPress={onPress}
        hapticType="light"
        animationType="scale"
        pressScale={0.98}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        {children}
      </MicroInteractionWrapper>
    );
  }
  
  return (
    <View
      style={cardStyle}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      {children}
    </View>
  );
}

function getStyles(theme: any, padding?: number, margin?: number) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: padding || theme.spacing.md,
      margin: margin || theme.spacing.sm,
    },
    default: {
      ...theme.shadows.small,
    },
    elevated: {
      ...theme.shadows.medium,
      elevation: 4,
    },
    outlined: {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    flat: {
      // No shadow, no border - flat appearance
    },
  });
}