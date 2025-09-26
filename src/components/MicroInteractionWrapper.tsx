import React, { useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useMicroInteractions } from '../context/MicroInteractionsContext';

export interface MicroInteractionWrapperProps extends TouchableOpacityProps {
  /**
   * Type of haptic feedback to trigger on press
   * @default 'light'
   */
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
  
  /**
   * Animation type for press feedback
   * @default 'scale'
   */
  animationType?: 'scale' | 'ripple' | 'none';
  
  /**
   * Scale value when pressed (for scale animation)
   * @default 0.95
   */
  pressScale?: number;
  
  /**
   * Duration of the press animation in milliseconds
   * @default 150
   */
  animationDuration?: number;
  
  /**
   * Whether to show a ripple effect (for ripple animation)
   * @default false
   */
  showRipple?: boolean;
  
  /**
   * Custom styles for the container
   */
  style?: ViewStyle;
  
  /**
   * Custom styles for the ripple effect
   */
  rippleStyle?: ViewStyle;
}

/**
 * Reusable MicroInteractionWrapper component for enhanced button interactions
 * 
 * Features:
 * - Haptic feedback on press
 * - Scale or ripple animations
 * - Respects user preferences for animations and haptics
 * - Accessibility compliant
 * - Smooth 60fps animations
 * 
 * Usage:
 * ```tsx
 * <MicroInteractionWrapper
 *   hapticType="light"
 *   animationType="scale"
 *   pressScale={0.95}
 *   onPress={handlePress}
 * >
 *   <YourButtonContent />
 * </MicroInteractionWrapper>
 * ```
 */
export default function MicroInteractionWrapper({
  children,
  hapticType = 'light',
  animationType = 'scale',
  pressScale = 0.95,
  animationDuration = 150,
  showRipple = false,
  style,
  rippleStyle,
  onPress,
  ...props
}: MicroInteractionWrapperProps) {
  const { triggerHaptic, animationsEnabled } = useMicroInteractions();
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;

  const handlePressIn = useCallback(() => {
    if (!animationsEnabled) return;

    switch (animationType) {
      case 'scale':
        Animated.timing(scaleAnim, {
          toValue: pressScale,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();
        break;
      case 'ripple':
        if (showRipple) {
          rippleOpacity.setValue(0.3);
          Animated.timing(rippleAnim, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
          }).start();
        }
        break;
    }
  }, [animationsEnabled, animationType, pressScale, animationDuration, showRipple, scaleAnim, rippleAnim, rippleOpacity]);

  const handlePressOut = useCallback(() => {
    if (!animationsEnabled) return;

    switch (animationType) {
      case 'scale':
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();
        break;
      case 'ripple':
        if (showRipple) {
          Animated.parallel([
            Animated.timing(rippleOpacity, {
              toValue: 0,
              duration: animationDuration,
              useNativeDriver: true,
            }),
            Animated.timing(rippleAnim, {
              toValue: 1.5,
              duration: animationDuration,
              useNativeDriver: true,
            }),
          ]).start(() => {
            rippleAnim.setValue(0);
          });
        }
        break;
    }
  }, [animationsEnabled, animationType, animationDuration, showRipple, scaleAnim, rippleAnim, rippleOpacity]);

  const handlePress = useCallback((event: any) => {
    // Trigger haptic feedback
    triggerHaptic(hapticType);
    
    // Call original onPress
    if (onPress) {
      onPress(event);
    }
  }, [triggerHaptic, hapticType, onPress]);

  const getAnimatedStyle = () => {
    const animatedStyle: any = {};
    
    if (animationsEnabled) {
      switch (animationType) {
        case 'scale':
          animatedStyle.transform = [{ scale: scaleAnim }];
          break;
      }
    }
    
    return animatedStyle;
  };

  return (
    <TouchableOpacity
      {...props}
      style={[style, getAnimatedStyle()]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={animationsEnabled ? 1 : 0.7}
    >
      {children}
      
      {animationType === 'ripple' && showRipple && animationsEnabled && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 999,
              backgroundColor: 'rgba(0, 123, 255, 0.3)',
              opacity: rippleOpacity,
              transform: [{ scale: rippleAnim }],
            },
            rippleStyle,
          ]}
          pointerEvents="none"
        />
      )}
    </TouchableOpacity>
  );
}
