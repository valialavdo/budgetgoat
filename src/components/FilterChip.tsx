import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  color?: string;
}

export default function FilterChip({ label, onRemove, color = Colors.text }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={styles.filterChip}
      onPress={onRemove}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterText: {
    ...Typography.bodyMedium,
    fontWeight: '500',
  },
});
