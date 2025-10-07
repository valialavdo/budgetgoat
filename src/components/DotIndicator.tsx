import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface DotIndicatorProps {
  count: number;
  activeIndex: number;
  color?: string;
  activeColor?: string;
  size?: number;
  activeSize?: number;
  spacing?: number;
  style?: any;
}

/**
 * Reusable DotIndicator component
 * 
 * Features:
 * - Animated dot transitions
 * - Customizable colors and sizes
 * - Smooth active state changes
 * - Accessibility support
 * - Reusable across different flows
 * 
 * Usage:
 * ```tsx
 * <DotIndicator
 *   count={3}
 *   activeIndex={currentStep}
 *   color="#CCCCCC"
 *   activeColor="#007AFF"
 *   size={8}
 *   activeSize={24}
 * />
 * ```
 */
export default function DotIndicator({
  count,
  activeIndex,
  color,
  activeColor,
  size = 8,
  activeSize = 24,
  spacing = 8,
  style,
}: DotIndicatorProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  
  // Use theme colors as defaults
  const dotColor = color || theme.colors.textMuted;
  const dotActiveColor = activeColor || theme.colors.trustBlue;
  
  // Create animated values for each dot
  const animatedValues = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current;

  // Animate dots when activeIndex changes
  useEffect(() => {
    animatedValues.forEach((animValue, index) => {
      Animated.timing(animValue, {
        toValue: index === activeIndex ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [activeIndex, animatedValues]);

  return (
    <View 
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="tablist"
      accessibilityLabel={`Page ${activeIndex + 1} of ${count}`}
    >
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;
        
        // Animate width and opacity
        const animatedWidth = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [size, activeSize],
        });
        
        const animatedOpacity = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: animatedWidth,
                height: size,
                backgroundColor: isActive ? dotActiveColor : dotColor,
                opacity: animatedOpacity,
                marginHorizontal: spacing / 2,
              },
            ]}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Page ${index + 1}`}
          />
        );
      })}
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
    },
    dot: {
      borderRadius: 4,
    },
  });
}
