import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Wallet, ChartLine, Target, Crown } from 'phosphor-react-native';
import { Colors, Spacing, Radius, Typography, Shadows } from '../theme';

const { width: screenWidth } = Dimensions.get('window');

interface StatItem {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statCard}>
          <View style={[styles.iconContainer, { backgroundColor: stat.color + '15' }]}>
            {stat.icon}
          </View>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    width: (screenWidth - (Spacing.screenPadding * 2) - Spacing.sm) / 2,
    ...Shadows.small,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
