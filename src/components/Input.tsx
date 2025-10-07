import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import MicroInteractionWrapper from './MicroInteractionWrapper';

export interface InputProps {
  /**
   * Label for the input field
   */
  label: string;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Current value of the input
   */
  value: string | boolean;
  
  /**
   * Callback when the value changes
   */
  onChangeText?: (text: string) => void;
  onValueChange?: (value: boolean) => void; // For switches
  
  /**
   * Type of input
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'multiline' | 'switch' | 'selection';
  
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
   * Help text to display below input
   */
  helpText?: string;
  
  /**
   * For selection inputs - icon to display
   */
  icon?: React.ReactNode;
  
  /**
   * For selection inputs - callback when pressed
   */
  onPress?: () => void;
  
  /**
   * Number of lines for multiline input
   * @default 3
   */
  numberOfLines?: number;
  
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
  
  /**
   * Subtitle text for switches (shown below the switch)
   */
  subtitle?: string;
}

/**
 * Unified Input component for all form fields
 * 
 * Features:
 * - Consistent styling and spacing
 * - Multiple input types (text, password, switch, selection)
 * - Required field indicators
 * - Error states with visual feedback
 * - Help text support
 * - Accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Microinteractions
 * 
 * Usage:
 * ```tsx
 * <Input
 *   label="Email Address"
 *   type="email"
 *   value={email}
 *   onChangeText={setEmail}
 *   required={true}
 *   error={emailError}
 * />
 * ```
 */
export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  onValueChange,
  type = 'text',
  required = false,
  disabled = false,
  error,
  helpText,
  icon,
  onPress,
  numberOfLines = 3,
  style,
  accessibilityLabel,
  accessibilityHint,
  subtitle,
}: InputProps) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const styles = getStyles(theme, error, disabled);

  const renderInput = () => {
    switch (type) {
      case 'switch':
        return (
          <View style={styles.switchContainer}>
            <Switch
              value={value as boolean}
              onValueChange={onValueChange}
              disabled={disabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.trustBlue }}
              thumbColor={value ? theme.colors.background : theme.colors.surface}
              ios_backgroundColor={theme.colors.border}
              accessible={true}
              accessibilityRole="switch"
              accessibilityLabel={accessibilityLabel || label}
              accessibilityState={{ checked: value as boolean, disabled }}
            />
            {subtitle && (
              <Text style={styles.subtitle}>
                {subtitle}
              </Text>
            )}
          </View>
        );

      case 'selection':
        return (
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
              } as any)}
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
        );

      default:
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                type === 'multiline' && styles.multilineInput,
              ]}
              value={value as string}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.textLight}
              secureTextEntry={type === 'password' && !showPassword}
              multiline={type === 'multiline'}
              numberOfLines={type === 'multiline' ? numberOfLines : 1}
              keyboardType={
                type === 'email' ? 'email-address' :
                type === 'number' ? 'numeric' : 'default'
              }
              editable={!disabled}
              accessible={true}
              accessibilityLabel={accessibilityLabel || `${label}${required ? ', required' : ''}`}
              accessibilityHint={accessibilityHint || placeholder}
              accessibilityState={{ disabled }}
            />
            
            {type === 'password' && (
              <MicroInteractionWrapper
                style={styles.eyeButton}
                onPress={togglePasswordVisibility}
                hapticType="light"
                animationType="scale"
                pressScale={0.95}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                accessibilityHint="Toggles password visibility"
              >
                {showPassword ? (
                  <EyeSlash 
                    weight="light" 
                    size={20} 
                    color={theme.colors.textMuted} 
                  />
                ) : (
                  <Eye 
                    weight="light" 
                    size={20} 
                    color={theme.colors.textMuted} 
                  />
                )}
              </MicroInteractionWrapper>
            )}
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>
        {label}
      </Text>
      
      {renderInput()}
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {helpText && !error && (
        <Text style={styles.helpText}>{helpText}</Text>
      )}
    </View>
  );
}

function getStyles(theme: any, error?: string, disabled?: boolean) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg, // 24px spacing between inputs
    },
    label: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      fontWeight: '500',
      marginBottom: 8, // 8px spacing between title and input
    },
    required: {
      color: theme.colors.alertRed,
    },
    inputContainer: {
      position: 'relative',
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: error ? theme.colors.alertRed : theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      paddingRight: 60, // Extra padding on right for icon
      color: theme.colors.text,
      minHeight: 48,
      ...theme.typography.bodyLarge,
    },
    multilineInput: {
      minHeight: 80,
      textAlignVertical: 'top',
      paddingRight: 60, // Extra padding on right for icon
    },
    switchContainer: {
      alignItems: 'flex-start',
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputText: {
      flex: 1,
      ...theme.typography.bodyLarge,
    },
    disabled: {
      opacity: 0.6,
    },
    subtitle: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.xs,
      lineHeight: 18,
    },
    eyeButton: {
      position: 'absolute',
      right: theme.spacing.md,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
      minWidth: 44, // Minimum touch target size
      minHeight: 44,
    },
    errorText: {
      ...theme.typography.caption,
      color: theme.colors.alertRed,
      marginTop: theme.spacing.xs,
    },
    helpText: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.xs,
    },
  });
}
