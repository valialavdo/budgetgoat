import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '../theme';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  marginBottom?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export default function Section({
  title,
  children,
  marginBottom = 'medium',
  style,
}: SectionProps) {
  const sectionStyle = [
    styles.base,
    styles[`marginBottom${marginBottom.charAt(0).toUpperCase() + marginBottom.slice(1)}` as keyof typeof styles],
    style,
  ];

  return (
    <View style={sectionStyle}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
  title: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  marginBottomNone: {},
  marginBottomSmall: {
    marginBottom: Spacing.sm,
  },
  marginBottomMedium: {
    marginBottom: Spacing.md,
  },
  marginBottomLarge: {
    marginBottom: Spacing.lg,
  },
});
