import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface PillSegmentedOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface PillSegmentedControlProps {
  options: PillSegmentedOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: any;
  size?: 'small' | 'medium';
}

export default function PillSegmentedControl({
  options,
  selectedValue,
  onValueChange,
  style,
  size = 'medium',
}: PillSegmentedControlProps) {
  const theme = useTheme();
  const styles = getStyles(theme, size);

  return (
    <View style={[styles.container, style]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.pill,
            selectedValue === option.value && styles.pillSelected,
          ]}
          onPress={() => onValueChange(option.value)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={option.label}
          accessibilityState={{ selected: selectedValue === option.value }}
        >
          {option.icon && (
            <View style={styles.iconContainer}>
              {React.cloneElement(option.icon as React.ReactElement, {
                size: 24,
                color: selectedValue === option.value ? theme.colors.background : theme.colors.text,
                weight: 'light'
              } as any)}
            </View>
          )}
          <Text style={[
            styles.pillText,
            selectedValue === option.value && styles.pillTextSelected
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function getStyles(theme: any, size: 'small' | 'medium') {
  const isSmall = size === 'small';
  
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: theme.spacing.sm, // Gap between individual pill buttons
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isSmall ? theme.spacing.xs : theme.spacing.sm,
      paddingVertical: isSmall ? 8 : theme.spacing.sm,
      paddingHorizontal: isSmall ? theme.spacing.sm : theme.spacing.md,
      backgroundColor: theme.colors.background, // White background for unselected
      borderRadius: theme.radius.round, // Fully rounded pill shape
      borderWidth: 1,
      borderColor: theme.colors.borderLight, // Subtle gray border for unselected
    },
    pillSelected: {
      backgroundColor: theme.colors.trustBlue, // Blue background for selected
      borderColor: theme.colors.trustBlue, // Blue border for selected
    },
    pillText: {
      ...(isSmall ? theme.typography.bodySmall : theme.typography.bodyMedium),
      fontWeight: '600',
      color: theme.colors.text, // Dark text for unselected
    },
    pillTextSelected: {
      color: theme.colors.background, // White text for selected (on blue background)
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
