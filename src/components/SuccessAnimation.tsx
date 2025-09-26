import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { CheckCircle, Check } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';

export interface SuccessAnimationProps {
  /**
   * Whether the success animation is visible
   */
  visible: boolean;
  
  /**
   * Success message to display
   */
  message?: string;
  
  /**
   * Type of success animation
   * @default 'checkmark'
   */
  type?: 'checkmark' | 'circle' | 'simple';
  
  /**
   * Duration of the animation in milliseconds
   * @default 2000
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
 * Reusable SuccessAnimation component for positive feedback
 * 
 * Features:
 * - Multiple animation types (checkmark, circle, simple)
 * - Smooth scale and fade animations
 * - Respects user animation preferences
 * - Dark mode support
 * - Auto-dismiss with callback
 * 
 * Usage:
 * ```tsx
 * <SuccessAnimation
 *   visible={showSuccess}
 *   message="Transaction added successfully!"
 *   type="checkmark"
 *   duration={2000}
 *   onComplete={() => setShowSuccess(false)}
 * />
 * ```
 */
export default function SuccessAnimation({
  visible,
  message,
  type = 'checkmark',
  duration = 2000,
  onComplete,
  style,
  messageStyle,
}: SuccessAnimationProps) {
  const theme = useTheme();
  const { animationsEnabled, triggerHaptic } = useMicroInteractions();
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    // Trigger success haptic feedback
    triggerHaptic('success');

    if (!animationsEnabled) {
      scaleAnim.setValue(1);
      opacityAnim.setValue(1);
      if (type === 'checkmark') {
        checkmarkAnim.setValue(1);
      }
      return;
    }

    // Main animation sequence
    Animated.sequence([
      // Scale up with bounce
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      // Draw checkmark if applicable
      ...(type === 'checkmark' ? [
        Animated.timing(checkmarkAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ] : []),
    ]).start();

    // Fade in
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto-dismiss
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);
        checkmarkAnim.setValue(0);
        if (onComplete) {
          onComplete();
        }
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, animationsEnabled, duration, onComplete, scaleAnim, opacityAnim, checkmarkAnim, type, triggerHaptic]);

  if (!visible) return null;

  const styles = getStyles(theme);

  const renderIcon = () => {
    switch (type) {
      case 'checkmark':
        return (
          <View style={styles.iconContainer}>
            <CheckCircle
              weight="fill"
              size={48}
              color={theme.colors.success}
            />
            <Animated.View
              style={[
                styles.checkmarkOverlay,
                {
                  opacity: checkmarkAnim,
                  transform: [{ scale: checkmarkAnim }],
                },
              ]}
            >
              <Check
                weight="bold"
                size={24}
                color={theme.colors.background}
              />
            </Animated.View>
          </View>
        );
      case 'circle':
        return (
          <CheckCircle
            weight="fill"
            size={48}
            color={theme.colors.success}
          />
        );
      case 'simple':
        return (
          <Check
            weight="bold"
            size={32}
            color={theme.colors.success}
          />
        );
      default:
        return null;
    }
  };

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
      accessibilityRole="alert"
      accessibilityLabel={message || "Success"}
    >
      {renderIcon()}
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
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      ...theme.shadows.medium,
    },
    iconContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    checkmarkOverlay: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    message: {
      ...theme.typography.subtitle1,
      textAlign: 'center',
      color: theme.colors.text,
      fontWeight: '500',
    },
  });
}
