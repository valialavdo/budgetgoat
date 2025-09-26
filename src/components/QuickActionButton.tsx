import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Typography, Shadows } from '../theme';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}

export default function QuickActionButton({ 
  icon, 
  title, 
  onPress 
}: QuickActionButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  iconContainer: {
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.bodySmall,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});
