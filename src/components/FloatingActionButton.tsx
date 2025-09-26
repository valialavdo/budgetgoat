import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export interface FloatingActionButtonProps {
  /**
   * Icon component to display in the FAB
   */
  icon: React.ReactNode;
  
  /**
   * Callback function when FAB is pressed
   */
  onPress: () => void;
  
  /**
   * FAB variant - determines styling
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
  
  /**
   * FAB size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Whether FAB is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom styles for the FAB container
   */
  style?: ViewStyle;
  
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel: string;
  
  /**
   * Accessibility hint for screen readers
   */
  accessibilityHint?: string;
  
  /**
   * Position of the FAB on screen
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

/**
 * Reusable FloatingActionButton (FAB) component
 * 
 * Features:
 * - Multiple variants and sizes
 * - Customizable positioning
 * - Full accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Minimum 44px touch target
 * - Shadow and elevation support
 * 
 * Usage:
 * ```tsx
 * <FloatingActionButton
 *   icon={<Plus weight="light" size={24} color="#FFFFFF" />}
 *   onPress={handleAdd}
 *   variant="primary"
 *   size="medium"
 *   position="bottom-right"
 *   accessibilityLabel="Add new item"
 *   accessibilityHint="Opens the add new item screen"
 * />
 * ```
 */
export default function FloatingActionButton({
  icon,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  position = 'bottom-right',
}: FloatingActionButtonProps) {
  const theme = useTheme();
  
  const fabStyles = getFabStyles(theme, variant, size, disabled);
  const positionStyles = getPositionStyles(position);
  
  return (
    <TouchableOpacity
      style={[styles.container, fabStyles, positionStyles, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled,
      }}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
    </TouchableOpacity>
  );
}

function getFabStyles(
  theme: any,
  variant: string,
  size: string,
  disabled: boolean
): ViewStyle {
  const sizeValue = getSizeValue(size);
  
  const baseStyles: ViewStyle = {
    width: sizeValue,
    height: sizeValue,
    borderRadius: sizeValue / 2,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
    elevation: 6,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.trustBlue,
      };
    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
      };
    default:
      return baseStyles;
  }
}

function getSizeValue(size: string): number {
  switch (size) {
    case 'small':
      return 48;
    case 'medium':
      return 56;
    case 'large':
      return 64;
    default:
      return 56;
  }
}

function getPositionStyles(position: string): ViewStyle {
  const baseStyles: ViewStyle = {
    position: 'absolute',
    bottom: 100, // Above tab bar
  };

  switch (position) {
    case 'bottom-right':
      return { ...baseStyles, right: 20 };
    case 'bottom-left':
      return { ...baseStyles, left: 20 };
    case 'bottom-center':
      return { ...baseStyles, alignSelf: 'center' };
    default:
      return { ...baseStyles, right: 20 };
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});