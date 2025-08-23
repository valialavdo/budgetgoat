import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Animated } from 'react-native';
import { Colors, Spacing, Radius, Shadows, Layout } from '../theme';

interface FABProps {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  position?: 'bottom-right' | 'bottom-left';
}

export default function FloatingActionButton({ 
  icon, 
  onPress, 
  accessibilityLabel,
  position = 'bottom-right' 
}: FABProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.fab,
        position === 'bottom-left' ? styles.bottomLeft : styles.bottomRight
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint="Opens the add new item form"
    >
      <Animated.View 
        style={[
          styles.iconContainer,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        {icon}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: Spacing.lg + Layout.tabBarHeight,
    width: 56,
    height: 56,
    borderRadius: Radius.round,
    backgroundColor: Colors.goatGreen,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.large,
    zIndex: 1000,
  },
  bottomRight: {
    right: Spacing.lg,
  },
  bottomLeft: {
    left: Spacing.lg,
  },
  iconContainer: {
    width: Layout.minTapArea,
    height: Layout.minTapArea,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
