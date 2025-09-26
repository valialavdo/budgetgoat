import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

/**
 * Simple SplashScreen component for BudgetGOAT app
 * 
 * Features:
 * - White background
 * - Centered 80x80px logo
 * - No shadows
 * - Simple fade-in animation
 * - Accessibility support
 * 
 * Usage:
 * ```tsx
 * <SplashScreen onFinish={() => setAppReady(true)} />
 * ```
 */
export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start logo fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Auto-finish after 2 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, onFinish]);

  const styles = getStyles();

  return (
    <View style={styles.container} accessible={true} accessibilityLabel="BudgetGOAT loading screen">
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Image
          source={require('../../assets/icon-80x80.png')}
          style={styles.logo}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel="BudgetGOAT logo"
        />
      </Animated.View>
    </View>
  );
}

function getStyles() {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF', // White background
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 80,
      height: 80,
    },
    logo: {
      width: 80,
      height: 80,
      // Complete shadow removal - all possible shadow properties
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: 0 },
      shadowColor: 'transparent',
      elevation: 0, // Remove Android shadow
      borderWidth: 0,
      // Additional shadow removal properties
      textShadowRadius: 0,
      textShadowOffset: { width: 0, height: 0 },
      textShadowColor: 'transparent',
      // Remove any glow effects
      tintColor: undefined,
      overlayColor: undefined,
      // Remove outline effects
      outlineWidth: 0,
      outlineColor: 'transparent',
    },
  });
}