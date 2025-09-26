import React, { useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';

export interface LoadingSpinnerProps {
  /**
   * Whether the spinner is visible
   */
  visible: boolean;
  
  /**
   * Loading message to display
   */
  message?: string;
  
  /**
   * Size of the spinner
   * @default 'small'
   */
  size?: 'small' | 'large';
  
  /**
   * Color of the spinner
   */
  color?: string;
  
  /**
   * Whether to show fade animation
   * @default true
   */
  animated?: boolean;
  
  /**
   * Custom styles for the container
   */
  style?: any;
  
  /**
   * Custom styles for the message text
   */
  messageStyle?: any;
}

/**
 * Reusable LoadingSpinner component with smooth animations
 * 
 * Features:
 * - Smooth fade in/out animations
 * - Customizable size and color
 * - Loading message support
 * - Respects user animation preferences
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <LoadingSpinner
 *   visible={isLoading}
 *   message="Loading transactions..."
 *   size="large"
 *   animated={true}
 * />
 * ```
 */
export default function LoadingSpinner({
  visible,
  message,
  size = 'small',
  color,
  animated = true,
  style,
  messageStyle,
}: LoadingSpinnerProps) {
  const theme = useTheme();
  const { animationsEnabled } = useMicroInteractions();
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (!animationsEnabled || !animated) {
      opacityAnim.setValue(visible ? 1 : 0);
      scaleAnim.setValue(visible ? 1 : 0.8);
      return;
    }

    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, animated, animationsEnabled, opacityAnim, scaleAnim]);

  if (!visible) return null;

  const spinnerColor = color || theme.colors.trustBlue;
  const styles = getStyles(theme);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={message || "Loading"}
    >
      <ActivityIndicator
        size={size}
        color={spinnerColor}
        style={styles.spinner}
      />
      {message && (
        <Text style={[styles.message, messageStyle, { color: theme.colors.text }]}>
          {message}
        </Text>
      )}
    </Animated.View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.md,
    },
    spinner: {
      marginBottom: theme.spacing.sm,
    },
    message: {
      ...theme.typography.body2,
      textAlign: 'center',
      color: theme.colors.textMuted,
    },
  });
}
