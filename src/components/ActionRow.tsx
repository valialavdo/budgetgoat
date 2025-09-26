import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import ActionButton from './ActionButton';

export interface ActionConfig {
  /**
   * Button text
   */
  title: string;
  
  /**
   * Callback when button is pressed
   */
  onPress: () => void;
  
  /**
   * Button variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  
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
   * Icon for the button
   */
  icon?: React.ReactNode;
  
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

export interface ActionRowProps {
  /**
   * Array of action configurations
   */
  actions: ActionConfig[];
  
  /**
   * Layout direction
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';
  
  /**
   * Whether buttons should take full width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Custom styles for the container
   */
  style?: ViewStyle;
  
  /**
   * Spacing between buttons
   * @default theme.spacing.md
   */
  spacing?: number;
}

/**
 * Reusable ActionRow component for modal and form actions
 * 
 * Features:
 * - Configurable action buttons
 * - Horizontal or vertical layout
 * - Consistent spacing and styling
 * - Loading states
 * - Accessibility support
 * 
 * Usage:
 * ```tsx
 * <ActionRow
 *   actions={[
 *     { title: 'Cancel', onPress: handleCancel, variant: 'ghost' },
 *     { title: 'Save', onPress: handleSave, variant: 'primary' }
 *   ]}
 *   direction="horizontal"
 * />
 * ```
 */
export default function ActionRow({
  actions,
  direction = 'horizontal',
  fullWidth = false,
  style,
  spacing,
}: ActionRowProps) {
  const theme = useTheme();
  
  const styles = getStyles(theme, direction, spacing);
  
  return (
    <View style={[styles.container, style]}>
      {actions.map((action, index) => (
        <View
          key={index}
          style={[
            styles.actionWrapper,
            fullWidth && styles.fullWidth,
            index > 0 && styles.spaced,
          ]}
        >
          <ActionButton
            title={action.title}
            onPress={action.onPress}
            variant={action.variant || 'primary'}
            size="medium"
            disabled={action.disabled}
            loading={action.loading}
            icon={action.icon}
            fullWidth={fullWidth}
            accessibilityLabel={action.accessibilityLabel || action.title}
          />
        </View>
      ))}
    </View>
  );
}

function getStyles(theme: any, direction: string, spacing?: number) {
  return StyleSheet.create({
    container: {
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      alignItems: 'center',
    },
    actionWrapper: {
      flex: direction === 'horizontal' ? 1 : undefined,
    },
    fullWidth: {
      flex: 1,
    },
    spaced: {
      marginLeft: direction === 'horizontal' ? (spacing || theme.spacing.md) : 0,
      marginTop: direction === 'vertical' ? (spacing || theme.spacing.md) : 0,
    },
  });
}
