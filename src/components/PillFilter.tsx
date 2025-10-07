import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import PillSegmentedControl from './PillSegmentedControl';

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
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <PillSegmentedControl
        options={filters.map(filter => ({
          value: filter.key,
          label: filter.label,
        }))}
        selectedValue={selectedFilter}
        onValueChange={onFilterChange}
      />
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.screenPadding,
      marginBottom: theme.spacing.md,
    },
  });
}
