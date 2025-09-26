import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import MicroInteractionWrapper from './MicroInteractionWrapper';

export interface FormInputProps {
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
  value: string;
  
  /**
   * Callback when the value changes
   */
  onChangeText: (text: string) => void;
  
  /**
   * Whether the field is required (shows asterisk)
   * @default false
   */
  required?: boolean;
  
  /**
   * Whether the input is secure (password)
   * @default false
   */
  secureTextEntry?: boolean;
  
  /**
   * Whether the input is multiline
   * @default false
   */
  multiline?: boolean;
  
  /**
   * Number of lines for multiline input
   * @default 1
   */
  numberOfLines?: number;
  
  /**
   * Keyboard type
   */
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  
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
   * Custom styles for the container
   */
  style?: any;
  
  /**
   * Custom styles for the input
   */
  inputStyle?: any;
}

/**
 * Reusable FormInput component for all form fields
 * 
 * Features:
 * - Consistent styling and spacing
 * - Required field indicators
 * - Password visibility toggle
 * - Error states with visual feedback
 * - Help text support
 * - Accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Microinteractions
 * 
 * Usage:
 * ```tsx
 * <FormInput
 *   label="Email Address"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChangeText={setEmail}
 *   keyboardType="email-address"
 *   required={true}
 *   error={emailError}
 * />
 * ```
 */
export default function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  required = false,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  disabled = false,
  error,
  helpText,
  style,
  inputStyle,
}: FormInputProps) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const styles = getStyles(theme, error, disabled);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={secureTextEntry && !showPassword}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          keyboardType={keyboardType}
          editable={!disabled}
          accessible={true}
          accessibilityLabel={`${label}${required ? ', required' : ''}`}
          accessibilityHint={placeholder}
          accessibilityState={{ disabled }}
        />
        
        {secureTextEntry && (
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
    inputContainer: {
      position: 'relative',
    },
    input: {
      ...theme.typography.body1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: error ? theme.colors.alertRed : theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      color: theme.colors.text,
      minHeight: 48,
      fontSize: 16, // Prevent zoom on iOS
    },
    multilineInput: {
      minHeight: 80,
      paddingTop: theme.spacing.sm,
      textAlignVertical: 'top',
    },
    eyeButton: {
      position: 'absolute',
      right: theme.spacing.md,
      top: '50%',
      transform: [{ translateY: -10 }],
      padding: theme.spacing.xs,
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
