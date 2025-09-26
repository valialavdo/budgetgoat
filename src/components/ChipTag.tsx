import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export interface ChipTagProps {
  /**
   * Text content of the chip
   */
  text: string;
  
  /**
   * Background color for the chip
   * @default theme.colors.surface
   */
  backgroundColor?: string;
  
  /**
   * Text color for the chip
   * @default theme.colors.text
   */
  textColor?: string;
  
  /**
   * Chip size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Icon to display before text
   */
  icon?: React.ReactNode;
  
  /**
   * Custom styles for the chip container
   */
  style?: ViewStyle;
  
  /**
   * Custom styles for the chip text
   */
  textStyle?: TextStyle;
  
  /**
   * Accessibility label for screen readers
   * If not provided, will use text
   */
  accessibilityLabel?: string;
  
  /**
   * Accessibility hint for screen readers
   */
  accessibilityHint?: string;
}

/**
 * Reusable ChipTag component for displaying categorized information
 * 
 * Features:
 * - Multiple sizes and color variants
 * - Icon support
 * - Full accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Consistent with design system
 * 
 * Usage:
 * ```tsx
 * <ChipTag
 *   text="Expense"
 *   backgroundColor="#FF4D4F"
 *   textColor="#FFFFFF"
 *   size="medium"
 *   icon={<TrendingDown weight="light" size={12} />}
 *   accessibilityLabel="Expense category"
 * />
 * ```
 */
export default function ChipTag({
  text,
  backgroundColor,
  textColor,
  size = 'medium',
  icon,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}: ChipTagProps) {
  const theme = useTheme();
  
  const chipStyles = getChipStyles(theme, size, backgroundColor);
  const chipTextStyles = getChipTextStyles(theme, size, textColor);
  
  return (
    <View
      style={[styles.container, chipStyles, style]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel || text}
      accessibilityHint={accessibilityHint}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[chipTextStyles, textStyle]}>{text}</Text>
    </View>
  );
}

function getChipStyles(theme: any, size: string, backgroundColor?: string): ViewStyle {
  const baseStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.round,
    backgroundColor: backgroundColor || theme.colors.surface,
  };

  switch (size) {
    case 'small':
      return {
        ...baseStyles,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minHeight: 24,
      };
    case 'medium':
      return {
        ...baseStyles,
        paddingHorizontal: 12,
        paddingVertical: 6,
        minHeight: 28,
      };
    case 'large':
      return {
        ...baseStyles,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 32,
      };
    default:
      return {
        ...baseStyles,
        paddingHorizontal: 12,
        paddingVertical: 6,
        minHeight: 28,
      };
  }
}

function getChipTextStyles(theme: any, size: string, textColor?: string): TextStyle {
  const baseStyles: TextStyle = {
    fontWeight: '500',
    color: textColor || theme.colors.text,
  };

  switch (size) {
    case 'small':
      return {
        ...baseStyles,
        fontSize: 10,
        lineHeight: 14,
      };
    case 'medium':
      return {
        ...baseStyles,
        fontSize: 12,
        lineHeight: 16,
      };
    case 'large':
      return {
        ...baseStyles,
        fontSize: 14,
        lineHeight: 20,
      };
    default:
      return {
        ...baseStyles,
        fontSize: 12,
        lineHeight: 16,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    // Base container styles
  },
  iconContainer: {
    marginRight: 4,
  },
});
