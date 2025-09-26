import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface PillFilterProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  filters: Array<{ key: string; label: string }>;
}

export default function PillFilter({
  selectedFilter,
  onFilterChange,
  filters,
}: PillFilterProps) {
  return (
    <View style={styles.container}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.filterPill,
            selectedFilter === filter.key && styles.filterPillSelected,
          ]}
          onPress={() => onFilterChange(filter.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterPillText,
              selectedFilter === filter.key && styles.filterPillTextSelected,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.round,
    backgroundColor: Colors.surface,
  },
  filterPillSelected: {
    backgroundColor: Colors.trustBlue,
  },
  filterPillText: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '500',
  },
  filterPillTextSelected: {
    color: Colors.background,
    fontWeight: '600',
  },
});
