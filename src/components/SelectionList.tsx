import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Check } from 'phosphor-react-native';

export interface SelectionListOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectionListProps {
  /**
   * Array of options to display
   */
  options: SelectionListOption[];
  
  /**
   * Currently selected value
   */
  selectedValue: string;
  
  /**
   * Callback when selection changes
   */
  onSelectionChange: (value: string) => void;
  
  /**
   * Custom styles for the container
   */
  style?: any;
}

/**
 * Reusable SelectionList component for radio button style selections
 * 
 * Features:
 * - Consistent styling with other form components
 * - Radio button style selection
 * - Optional descriptions for each option
 * - Accessibility compliance (WCAG AA)
 * - Dark mode support
 * 
 * Usage:
 * ```tsx
 * <SelectionList
 *   options={[
 *     { value: 'all', label: 'All Time' },
 *     { value: 'month', label: 'This Month', description: 'Current month data' }
 *   ]}
 *   selectedValue={selectedValue}
 *   onSelectionChange={setSelectedValue}
 * />
 * ```
 */
export default function SelectionList({
  options,
  selectedValue,
  onSelectionChange,
  style,
}: SelectionListProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              isSelected && styles.optionSelected,
            ]}
            onPress={() => onSelectionChange(option.value)}
            accessible={true}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isSelected }}
            accessibilityHint={option.description}
          >
            <View style={styles.optionContent}>
              <Text style={[
                styles.optionLabel,
                isSelected && styles.optionLabelSelected,
              ]}>
                {option.label}
              </Text>
              {option.description && (
                <Text style={[
                  styles.optionDescription,
                  isSelected && styles.optionDescriptionSelected,
                ]}>
                  {option.description}
                </Text>
              )}
            </View>
            
            {isSelected && (
              <Check 
                size={20} 
                color={theme.colors.trustBlue} 
                weight="light" 
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      gap: theme.spacing.xs,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      backgroundColor: theme.colors.background,
    },
    optionSelected: {
      borderColor: theme.colors.trustBlue,
      backgroundColor: theme.colors.trustBlue + '15', // Transparent blue background for selected
    },
    optionContent: {
      flex: 1,
    },
    optionLabel: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      fontWeight: '500',
      marginBottom: theme.spacing.xs,
    },
    optionLabelSelected: {
      color: theme.colors.trustBlue,
      fontWeight: '600',
    },
    optionDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
    },
    optionDescriptionSelected: {
      color: theme.colors.trustBlue + 'CC', // Blue with opacity
    },
  });
}
