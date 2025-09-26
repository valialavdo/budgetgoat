import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface SegmentedOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  options: SegmentedOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: any;
  size?: 'small' | 'medium';
}

export default function SegmentedControl({
  options,
  selectedValue,
  onValueChange,
  style,
  size = 'medium',
}: SegmentedControlProps) {
  const theme = useTheme();
  const styles = getStyles(theme, size);

  return (
    <View style={[styles.container, style]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.option,
            selectedValue === option.value && styles.optionSelected,
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
                color: selectedValue === option.value ? theme.colors.trustBlue : theme.colors.textMuted,
                weight: 'light'
              })}
            </View>
          )}
          <Text style={[
            styles.optionText,
            { color: selectedValue === option.value ? theme.colors.trustBlue : theme.colors.text }
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
      gap: theme.spacing.md,
    },
    option: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isSmall ? theme.spacing.xs : theme.spacing.sm,
      paddingVertical: isSmall ? 4 : theme.spacing.sm, // Even smaller vertical padding for small variant
      paddingHorizontal: isSmall ? theme.spacing.sm : theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      backgroundColor: theme.colors.background, // White background for unselected
      borderColor: theme.colors.borderLight, // Light gray border for unselected
    },
    optionSelected: {
      backgroundColor: '#F0F8FF', // Light blue background for selected
      borderColor: theme.colors.trustBlue, // Blue border for selected
    },
    optionText: {
      ...(isSmall ? theme.typography.bodySmall : theme.typography.bodyMedium),
      fontWeight: '600',
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

