import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface PocketSummaryCardProps {
  title: string;
  value: string;
  style?: any;
}

export default function PocketSummaryCard({
  title,
  value,
  style,
}: PocketSummaryCardProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardContent}>
        <Text style={[styles.title, { color: theme.colors.textMuted }]}>
          {title}
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
    },
    cardContent: {
      flex: 1,
    },
    title: {
      fontSize: 14,
      fontWeight: '300',
      marginBottom: 4,
    },
    value: {
      fontSize: 20,
      fontWeight: '500',
      lineHeight: 24,
    },
  });
}

// Predefined card types for common pocket metrics
export const PocketSummaryCards = {
  TotalTargets: ({ value }: { value: string }) => (
    <PocketSummaryCard
      title="Total Targets"
      value={value}
    />
  ),
  
  Underfunded: ({ value }: { value: string }) => (
    <PocketSummaryCard
      title="Underfunded"
      value={value}
    />
  ),
  
  Assigned: ({ value }: { value: string }) => (
    <PocketSummaryCard
      title="Assigned"
      value={value}
    />
  ),
  
  Spent: ({ value }: { value: string }) => (
    <PocketSummaryCard
      title="Spent"
      value={value}
    />
  ),
};
