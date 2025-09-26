import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import MicroInteractionWrapper from './MicroInteractionWrapper';

export interface ActionButtonProps {
  /**
   * Button text content
   */
  title: string;
  
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
   * Whether button is in loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Custom icon component to display before text
   */
  icon?: React.ReactNode;
  
  /**
   * Whether button should take full width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Custom styles for the button container
   */
  style?: ViewStyle;
  
  /**
   * Custom styles for the button text
   */
  textStyle?: TextStyle;
  
  /**
   * Accessibility label for screen readers
   * If not provided, will use title
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
 * Reusable ActionButton component with multiple variants and accessibility support
 * 
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, danger)
 * - Three sizes (small, medium, large)
 * - Loading state with spinner
 * - Icon support
 * - Full accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Minimum 44px touch target
 * 
 * Usage:
 * ```tsx
 * <ActionButton
 *   title="Save Changes"
 *   onPress={handleSave}
 *   variant="primary"
 *   size="medium"
 *   icon={<SaveIcon />}
 *   accessibilityLabel="Save your changes"
 *   accessibilityHint="Saves the current form data"
 * />
 * ```
 */
export default function ActionButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  hapticType = 'light',
}: ActionButtonProps) {
  const theme = useTheme();
  
  const buttonStyles = getButtonStyles(theme, variant, size, disabled, fullWidth);
  const textStyles = getTextStyles(theme, variant, size, disabled);
  
  const isDisabled = disabled || loading;
  
  return (
    <MicroInteractionWrapper
      hapticType={hapticType}
      animationType="scale"
      pressScale={0.95}
      onPress={onPress}
      disabled={isDisabled}
      style={StyleSheet.flatten([styles.container, buttonStyles, style])}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={getSpinnerColor(theme, variant)}
            style={styles.spinner}
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[textStyles, textStyle]}>{title}</Text>
          </>
        )}
      </View>
    </MicroInteractionWrapper>
  );
}

function getButtonStyles(
  theme: any,
  variant: string,
  size: string,
  disabled: boolean,
  fullWidth: boolean
): ViewStyle {
  const sizeConfig = getSizeConfig(size);
  
  const baseStyles: ViewStyle = {
    height: sizeConfig.height, // Fixed height for all buttons
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: getHorizontalPadding(size),
    opacity: disabled ? 0.6 : 1,
  };

  if (fullWidth) {
    baseStyles.width = '100%';
  }

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

function getTextStyles(theme: any, variant: string, size: string, disabled: boolean): TextStyle {
  const baseStyles: TextStyle = {
    fontWeight: '600',
    textAlign: 'center',
  };

  // Size-based styles
  switch (size) {
    case 'small':
      baseStyles.fontSize = 14;
      break;
    case 'medium':
      baseStyles.fontSize = 16;
      break;
    case 'large':
      baseStyles.fontSize = 18;
      break;
  }

  // Variant-based styles
  switch (variant) {
    case 'primary':
      return { ...baseStyles, color: theme.colors.background };
    case 'secondary':
      return { ...baseStyles, color: theme.colors.text };
    case 'outline':
      return { ...baseStyles, color: theme.colors.trustBlue };
    case 'ghost':
      return { ...baseStyles, color: theme.colors.trustBlue };
    case 'danger':
      return { ...baseStyles, color: theme.colors.background };
    default:
      return { ...baseStyles, color: theme.colors.text };
  }
}

function getHorizontalPadding(size: string): number {
  const sizeConfig = getSizeConfig(size);
  return sizeConfig.horizontalPadding;
}

function getSizeConfig(size: string) {
  switch (size) {
    case 'small':
      return { height: 36, horizontalPadding: 12 };
    case 'medium':
      return { height: 44, horizontalPadding: 16 };
    case 'large':
      return { height: 52, horizontalPadding: 20 };
    default:
      return { height: 44, horizontalPadding: 16 };
  }
}

function getVerticalPadding(size: string): number {
  // No longer needed since we use fixed height
  return 0;
}

function getSpinnerColor(theme: any, variant: string): string {
  switch (variant) {
    case 'primary':
    case 'danger':
      return theme.colors.background;
    case 'secondary':
      return theme.colors.text;
    case 'outline':
    case 'ghost':
      return theme.colors.trustBlue;
    default:
      return theme.colors.text;
  }
}

const styles = StyleSheet.create({
  container: {
    // Base container styles
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  spinner: {
    marginRight: 8,
  },
});
