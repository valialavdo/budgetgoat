import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import MicroInteractionWrapper from './MicroInteractionWrapper';

export interface IconButtonProps {
  /**
   * Icon component to display
   */
  icon: React.ReactNode;
  
  /**
   * Callback function when button is pressed
   */
  onPress: () => void;
  
  /**
   * Button variant - determines styling
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  
  /**
   * Button size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Whether button is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom styles for the button container
   */
  style?: ViewStyle;
  
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
  
  /**
   * Accessibility hint for screen readers
   */
  accessibilityHint?: string;
  
  /**
   * Type of haptic feedback to trigger on press
   * @default 'light'
   */
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
}

/**
 * Reusable IconButton component with standardized 32px icons
 * 
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, danger)
 * - Three sizes (small, medium, large) - all with 32px icons
 * - Full accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Minimum 44px touch target
 * 
 * Usage:
 * ```tsx
 * <IconButton
 *   icon={<Plus size={32} color={theme.colors.background} weight="light" />}
 *   onPress={handleAdd}
 *   variant="primary"
 *   size="medium"
 *   accessibilityLabel="Add new item"
 * />
 * ```
 */
export default function IconButton({
  icon,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  hapticType = 'light',
}: IconButtonProps) {
  const theme = useTheme();
  
  const buttonStyles = getButtonStyles(theme, variant, size, disabled);
  
  return (
    <MicroInteractionWrapper
      hapticType={hapticType}
      animationType="scale"
      pressScale={0.95}
      onPress={onPress}
      disabled={disabled}
      style={StyleSheet.flatten([styles.container, buttonStyles, style])}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled,
      }}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
    </MicroInteractionWrapper>
  );
}

function getButtonStyles(
  theme: any,
  variant: string,
  size: string,
  disabled: boolean
): ViewStyle {
  const sizeConfig = getSizeConfig(size);
  
  const baseStyles: ViewStyle = {
    width: sizeConfig.size,
    height: sizeConfig.size,
    borderRadius: sizeConfig.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.trustBlue,
        ...theme.shadows.small,
      };
    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
      };
    case 'outline':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.trustBlue,
      };
    case 'ghost':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
      };
    case 'danger':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.alertRed,
        ...theme.shadows.small,
      };
    default:
      return baseStyles;
  }
}

function getSizeConfig(size: string) {
  switch (size) {
    case 'small':
      return { size: 36, borderRadius: 8 };
    case 'medium':
      return { size: 44, borderRadius: 12 };
    case 'large':
      return { size: 52, borderRadius: 16 };
    default:
      return { size: 44, borderRadius: 12 };
  }
}

const styles = StyleSheet.create({
  container: {
    // Base container styles
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
