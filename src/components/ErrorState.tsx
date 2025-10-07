import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Warning, WifiSlash, AlertTriangle, XCircle } from 'phosphor-react-native';

interface ErrorStateProps {
  type?: 'network' | 'error' | 'warning' | 'generic';
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryText?: string;
}

export default function ErrorState({ 
  type = 'generic',
  title,
  description,
  onRetry,
  retryText = 'Try Again'
}: ErrorStateProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: <WifiSlash size={64} color={theme.colors.textMuted} weight="light" />,
          defaultTitle: 'No Internet Connection',
          defaultDescription: 'Please check your internet connection and try again later.',
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={64} color={theme.colors.warning} weight="light" />,
          defaultTitle: 'Something Went Wrong',
          defaultDescription: 'We encountered an issue. Please try again.',
        };
      case 'error':
        return {
          icon: <XCircle size={64} color={theme.colors.error} weight="light" />,
          defaultTitle: 'Error',
          defaultDescription: 'Something went wrong. Please try again.',
        };
      default:
        return {
          icon: <Warning size={64} color={theme.colors.textMuted} weight="light" />,
          defaultTitle: 'Oops!',
          defaultDescription: 'Something went wrong. Please try again later.',
        };
    }
  };

  const config = getErrorConfig();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {config.icon}
      </View>
      <Text style={styles.title}>{title || config.defaultTitle}</Text>
      <Text style={styles.description}>{description || config.defaultDescription}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xxl,
    },
    iconContainer: {
      marginBottom: theme.spacing.xl,
      opacity: 0.6,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    description: {
      ...theme.typography.bodyLarge,
      color: theme.colors.textMuted,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: theme.spacing.xl,
    },
    retryButton: {
      backgroundColor: theme.colors.trustBlue,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      marginTop: theme.spacing.lg,
    },
    retryText: {
      ...theme.typography.bodyLarge,
      color: theme.colors.background,
      fontWeight: '600',
    },
  });
}
