import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

interface MonthHeaderProps {
  month: string;
  subtotal: number;
  formatMonth: (monthString: string) => string;
}

export default function MonthHeader({ month, subtotal, formatMonth }: MonthHeaderProps) {
  return (
    <View style={styles.monthHeader}>
      <Text style={styles.monthTitle}>{formatMonth(month)}</Text>
      <Text style={styles.monthSubtotal}>
        {subtotal >= 0 ? '+' : ''}€{subtotal.toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  monthTitle: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '600',
  },
  monthSubtotal: {
    ...Typography.h4,
    fontWeight: '700',
    color: Colors.textMuted, // Dark gray color
  },
});
