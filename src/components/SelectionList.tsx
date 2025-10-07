import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Check } from 'phosphor-react-native';

export interface SelectionListOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface SelectionListProps {
  /**
   * Array of options to display
   */
  options: SelectionListOption[];
  
  /**
   * Currently selected value(s) - string for single selection, string[] for multiple
   */
  selectedValue: string | string[];
  
  /**
   * Callback when selection changes
   */
  onSelectionChange: (value: string | string[]) => void;
  
  /**
   * Selection type - 'single' for radio button behavior, 'multiple' for checkbox behavior
   */
  selectionType?: 'single' | 'multiple';
  
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
  selectionType = 'single',
  style,
}: SelectionListProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleSelection = (value: string) => {
    if (selectionType === 'multiple') {
      const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      onSelectionChange(newValues);
    } else {
      onSelectionChange(value);
    }
  };

  const isSelected = (value: string) => {
    if (selectionType === 'multiple') {
      return Array.isArray(selectedValue) && selectedValue.includes(value);
    }
    return selectedValue === value;
  };

  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const optionIsSelected = isSelected(option.value);
        
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              optionIsSelected && styles.optionSelected,
            ]}
            onPress={() => handleSelection(option.value)}
            accessible={true}
            accessibilityRole={selectionType === 'multiple' ? 'checkbox' : 'radio'}
            accessibilityLabel={option.label}
            accessibilityState={{ selected: optionIsSelected }}
            accessibilityHint={option.description}
          >
            <View style={styles.optionContent}>
              {option.icon && (
                <View style={styles.iconContainer}>
                  {React.cloneElement(option.icon as React.ReactElement, {
                    size: 20,
                    color: optionIsSelected ? theme.colors.trustBlue : theme.colors.textMuted,
                    weight: 'light'
                  } as any)}
                </View>
              )}
              <View style={styles.textContainer}>
                <Text style={[
                  styles.optionLabel,
                  optionIsSelected && styles.optionLabelSelected,
                ]}>
                  {option.label}
                </Text>
                {option.description && (
                  <Text style={[
                    styles.optionDescription,
                    optionIsSelected && styles.optionDescriptionSelected,
                  ]}>
                    {option.description}
                  </Text>
                )}
              </View>
            </View>
            
            {optionIsSelected && (
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
      gap: theme.spacing.sm,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.screenPadding, // 20px padding like Linked Pocket
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      backgroundColor: theme.colors.surface, // Use surface color like Linked Pocket
      minHeight: 64, // Match Linked Pocket height
    },
    optionSelected: {
      borderColor: theme.colors.trustBlue,
      backgroundColor: theme.colors.trustBlue + '10', // Light blue background for selected
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.trustBlue,
    },
    optionContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      flex: 1,
    },
    optionLabel: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: 2,
    },
    optionLabelSelected: {
      color: theme.colors.trustBlue,
      fontWeight: '600',
    },
    optionDescription: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
    },
    optionDescriptionSelected: {
      color: theme.colors.textMuted, // Keep description muted even when selected
    },
  });
}
