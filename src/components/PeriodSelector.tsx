import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import SegmentedControl from './SegmentedControl';

interface PeriodSelectorProps {
  selectedPeriod: '1M' | '3M' | '6M' | '1Y';
  onPeriodChange: (period: '1M' | '3M' | '6M' | '1Y') => void;
}

export default function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  const theme = useTheme();
  const periods: Array<'1M' | '3M' | '6M' | '1Y'> = ['1M', '3M', '6M', '1Y'];
  
  // Map internal values to display labels
  const getDisplayLabel = (period: '1M' | '3M' | '6M' | '1Y') => {
    switch (period) {
      case '1M': return '1M';
      case '3M': return '3M';
      case '6M': return '6M';
      case '1Y': return '1Y';
      default: return period;
    }
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <SegmentedControl
        options={periods.map((period) => ({
          value: period,
          label: getDisplayLabel(period)
        }))}
        selectedValue={selectedPeriod}
        onValueChange={(value) => onPeriodChange(value as '1M' | '3M' | '6M' | '1Y')}
        size="small"
      />
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      justifyContent: 'center', // Center align buttons
      alignItems: 'center',
      marginTop: 12, // Exactly 12px gap from chart
      width: '100%', // Full width to ensure proper centering
      paddingHorizontal: 20, // Keep 20px margins for period selector buttons
    },
  });
}
