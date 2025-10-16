import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Eye, EyeSlash, CaretDown } from 'phosphor-react-native';

interface UnifiedInputProps {
  label?: string;
  value: string | boolean;
  onChangeText?: (text: string) => void;
  onValueChange?: (value: boolean) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'multiline' | 'switch' | 'selection';
  multiline?: boolean;
  numberOfLines?: number;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  onPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  maxLength?: number;
  style?: any;
}

export default function UnifiedInput({
  label,
  value,
  onChangeText,
  onValueChange,
  placeholder,
  type = 'text',
  multiline = false,
  numberOfLines = 1,
  required = false,
  error,
  disabled = false,
  onPress,
  onFocus,
  onBlur,
  autoFocus = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  secureTextEntry = false,
  maxLength,
  style,
}: UnifiedInputProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderInput = () => {
    if (type === 'switch') {
      return (
        <Switch
          value={value as boolean}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{ false: theme.colors.border, true: theme.colors.trustBlue }}
          thumbColor={value ? theme.colors.background : theme.colors.textLight}
        />
      );
    }

    if (type === 'selection') {
      return (
        <TouchableOpacity
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            error && styles.inputError,
            disabled && styles.inputDisabled,
            style,
          ]}
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.inputText,
            !value && styles.placeholderText,
            disabled && styles.inputTextDisabled,
          ]}>
            {value || placeholder}
          </Text>
          <CaretDown size={20} color={theme.colors.textMuted} weight="regular" />
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            isFocused && styles.inputFocused,
            error && styles.inputError,
            disabled && styles.inputDisabled,
            style,
          ]}
          value={value as string}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textLight}
          multiline={multiline || type === 'multiline'}
          numberOfLines={numberOfLines}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          secureTextEntry={type === 'password' ? !showPassword : secureTextEntry}
          maxLength={maxLength}
        />
        
        {type === 'password' && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            {showPassword ? (
              <EyeSlash size={20} color={theme.colors.textMuted} weight="regular" />
            ) : (
              <Eye size={20} color={theme.colors.textMuted} weight="regular" />
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}
      
      {renderInput()}
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    labelContainer: {
      marginBottom: theme.spacing.sm,
    },
    label: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      fontWeight: '500',
    },
    required: {
      color: theme.colors.alertRed,
    },
    inputContainer: {
      position: 'relative',
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 2,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 56,
      ...theme.typography.body1, // 17px - ENFORCED BASE SIZE
      color: theme.colors.text,
    },
    inputMultiline: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    inputFocused: {
      borderColor: theme.colors.trustBlue,
      backgroundColor: theme.colors.background,
    },
    inputError: {
      borderColor: theme.colors.alertRed,
    },
    inputDisabled: {
      backgroundColor: theme.colors.borderLight,
      color: theme.colors.textLight,
    },
    inputText: {
      ...theme.typography.body1, // 17px - ENFORCED BASE SIZE
      color: theme.colors.text,
    },
    placeholderText: {
      color: theme.colors.textLight,
    },
    inputTextDisabled: {
      color: theme.colors.textLight,
    },
    passwordToggle: {
      position: 'absolute',
      right: theme.spacing.md,
      top: '50%',
      transform: [{ translateY: -10 }],
      padding: theme.spacing.xs,
    },
    errorText: {
      ...theme.typography.bodySmall,
      color: theme.colors.alertRed,
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.sm,
    },
  });
}
