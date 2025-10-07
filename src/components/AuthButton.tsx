import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import ActionButton from './ActionButton';

interface AuthButtonProps {
  provider: 'google' | 'apple' | 'email';
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Reusable AuthButton component for different authentication providers
 * 
 * Features:
 * - Pre-configured for Google, Apple, and Email providers
 * - Proper icons and styling for each provider
 * - Loading and disabled states
 * - Accessibility support
 * - Consistent theming
 * 
 * Usage:
 * ```tsx
 * <AuthButton
 *   provider="google"
 *   onPress={handleGoogleSignIn}
 *   loading={isLoading}
 * />
 * ```
 */
export default function AuthButton({
  provider,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
}: AuthButtonProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          title: 'Continue with Google',
          icon: '🔍', // You can replace with proper Google icon
          variant: 'secondary' as const,
        };
      case 'apple':
        return {
          title: 'Continue with Apple',
          icon: '🍎', // You can replace with proper Apple icon
          variant: 'secondary' as const,
        };
      case 'email':
        return {
          title: 'Continue with email',
          icon: '✉️', // You can replace with proper email icon
          variant: 'secondary' as const,
        };
      default:
        return {
          title: 'Continue',
          icon: '→',
          variant: 'secondary' as const,
        };
    }
  };

  const config = getProviderConfig();

  return (
    <ActionButton
      title={config.title}
      variant={config.variant}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={
        <Text style={[styles.icon, textStyle]}>{config.icon}</Text>
      }
      style={[styles.button, style]}
      accessibilityLabel={`Sign in with ${provider}`}
      accessibilityHint={`Tap to sign in using your ${provider} account`}
    />
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    button: {
      width: '100%',
      marginBottom: theme.spacing.md,
    },
    icon: {
      fontSize: 20,
      marginRight: theme.spacing.sm,
    },
  });
}
