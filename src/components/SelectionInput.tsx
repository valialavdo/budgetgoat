import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export interface SelectionInputProps {
  /**
   * Label for the input field
   */
  label: string;
  
  /**
   * Description text below the label
   */
  description?: string;
  
  /**
   * Placeholder text when no value is selected
   */
  placeholder: string;
  
  /**
   * Currently selected value
   */
  value?: string;
  
  /**
   * Icon to display on the left side
   */
  icon: React.ReactNode;
  
  /**
   * Callback when the input is pressed
   */
  onPress: () => void;
  
  /**
   * Whether the field is required (shows asterisk)
   * @default false
   */
  required?: boolean;
  
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Custom styles for the container
   */
  style?: any;
  
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
 * Reusable SelectionInput component for selecting options
 * 
 * Features:
 * - Consistent styling with other form inputs
 * - Required field indicators
 * - Error states with visual feedback
 * - Accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Icon support
 * 
 * Usage:
 * ```tsx
 * <SelectionInput
 *   label="Linked Pocket"
 *   description="Choose which pocket to link this transaction to"
 *   placeholder="Select a pocket"
 *   value={selectedPocket}
 *   icon={<Wallet />}
 *   onPress={handlePress}
 *   required={true}
 * />
 * ```
 */
export default function SelectionInput({
  label,
  description,
  placeholder,
  value,
  icon,
  onPress,
  required = false,
  disabled = false,
  error,
  style,
  accessibilityLabel,
  accessibilityHint,
}: SelectionInputProps) {
  const theme = useTheme();
  const styles = getStyles(theme, error, disabled);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.input,
          disabled && styles.disabled,
        ]}
        onPress={onPress}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `${label}, ${value || placeholder}`}
        accessibilityHint={accessibilityHint || 'Opens selection options'}
      >
        <View style={styles.iconContainer}>
          {React.cloneElement(icon as React.ReactElement, {
            size: 20,
            color: disabled ? theme.colors.textLight : theme.colors.textMuted,
            weight: 'light'
          })}
        </View>
        
        <Text
          style={[
            styles.inputText,
            {
              color: disabled 
                ? theme.colors.textLight 
                : value 
                  ? theme.colors.text 
                  : theme.colors.textMuted,
            },
          ]}
        >
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

function getStyles(theme: any, error?: string, disabled?: boolean) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      ...theme.typography.subtitle1,
      color: theme.colors.text,
      fontWeight: '500',
      marginBottom: theme.spacing.xs,
    },
    required: {
      color: theme.colors.alertRed,
    },
    description: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.sm,
    },
    input: {
      ...theme.typography.body1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: error ? theme.colors.alertRed : theme.colors.borderLight,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputText: {
      flex: 1,
      fontSize: 16, // Prevent zoom on iOS
    },
    disabled: {
      opacity: 0.6,
    },
    errorText: {
      ...theme.typography.caption,
      color: theme.colors.alertRed,
      marginTop: theme.spacing.xs,
    },
  });
}
