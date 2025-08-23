import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius, Shadows } from '../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  style,
}: CardProps) {
  const cardStyle = [
    styles.base,
    styles[variant],
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}` as keyof typeof styles],
    styles[`margin${margin.charAt(0).toUpperCase() + margin.slice(1)}` as keyof typeof styles],
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
  },
  
  // Variants
  default: {
    backgroundColor: Colors.surface,
  },
  elevated: {
    backgroundColor: Colors.surfaceElevated,
    ...Shadows.medium,
  },
  outlined: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  
  // Padding variants
  paddingNone: {},
  paddingSmall: {
    padding: Spacing.sm,
  },
  paddingMedium: {
    padding: Spacing.md,
  },
  paddingLarge: {
    padding: Spacing.lg,
  },
  
  // Margin variants
  marginNone: {},
  marginSmall: {
    margin: Spacing.sm,
  },
  marginMedium: {
    margin: Spacing.md,
  },
  marginLarge: {
    margin: Spacing.lg,
  },
});
