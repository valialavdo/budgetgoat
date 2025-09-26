import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { XCircle, Warning } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';

export interface ErrorFeedbackProps {
  /**
   * Whether the error feedback is visible
   */
  visible: boolean;
  
  /**
   * Error message to display
   */
  message?: string;
  
  /**
   * Type of error animation
   * @default 'shake'
   */
  type?: 'shake' | 'flash' | 'bounce';
  
  /**
   * Duration of the animation in milliseconds
   * @default 1500
   */
  duration?: number;
  
  /**
   * Callback when animation completes
   */
  onComplete?: () => void;
  
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
 * Reusable ErrorFeedback component for validation errors
 * 
 * Features:
 * - Multiple animation types (shake, flash, bounce)
 * - Smooth error animations
 * - Respects user animation preferences
 * - Dark mode support
 * - Auto-dismiss with callback
 * 
 * Usage:
 * ```tsx
 * <ErrorFeedback
 *   visible={showError}
 *   message="Please enter a valid amount"
 *   type="shake"
 *   duration={1500}
 *   onComplete={() => setShowError(false)}
 * />
 * ```
 */
export default function ErrorFeedback({
  visible,
  message,
  type = 'shake',
  duration = 1500,
  onComplete,
  style,
  messageStyle,
}: ErrorFeedbackProps) {
  const theme = useTheme();
  const { animationsEnabled, triggerHaptic } = useMicroInteractions();
  
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;

    // Trigger error haptic feedback
    triggerHaptic('error');

    if (!animationsEnabled) {
      opacityAnim.setValue(1);
      return;
    }

    // Fade in
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Animation based on type
    switch (type) {
      case 'shake':
        Animated.sequence([
          Animated.timing(translateXAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(translateXAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(translateXAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(translateXAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(translateXAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
        break;
      case 'flash':
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
        break;
      case 'bounce':
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 0.95, duration: 150, useNativeDriver: true }),
          Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 8 }),
        ]).start();
        break;
    }

    // Auto-dismiss
    const timer = setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        translateXAnim.setValue(0);
        scaleAnim.setValue(1);
        if (onComplete) {
          onComplete();
        }
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, animationsEnabled, duration, onComplete, translateXAnim, opacityAnim, scaleAnim, type, triggerHaptic]);

  if (!visible) return null;

  const styles = getStyles(theme);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: opacityAnim,
          transform: [
            { translateX: translateXAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={message || "Error"}
    >
      <XCircle
        weight="fill"
        size={24}
        color={theme.colors.error}
        style={styles.icon}
      />
      {message && (
        <Text style={[styles.message, messageStyle, { color: theme.colors.error }]}>
          {message}
        </Text>
      )}
    </Animated.View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.error,
      ...theme.shadows.small,
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    message: {
      ...theme.typography.body2,
      flex: 1,
      color: theme.colors.error,
      fontWeight: '500',
    },
  });
}
