import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';
import { format } from 'date-fns';
import BaseBottomSheet from './BaseBottomSheet';

export interface DateInputProps {
  /**
   * Label for the date input field
   */
  label: string;
  
  /**
   * Selected date
   */
  value: Date;
  
  /**
   * Callback when date changes
   */
  onDateChange: (date: Date) => void;
  
  /**
   * Whether the field is required (shows asterisk)
   * @default false
   */
  required?: boolean;
  
  /**
   * Whether the date input is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Custom styles for the container
   */
  style?: any;
  
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
  
  /**
   * Accessibility hint for screen readers
   */
  accessibilityHint?: string;
}

/**
 * Reusable DateInput component that matches FormInput styling
 * 
 * Features:
 * - Consistent styling with other form inputs
 * - Required field indicators
 * - Error states with visual feedback
 * - Accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Microinteractions
 * 
 * Usage:
 * ```tsx
 * <DateInput
 *   label="Transaction Date"
 *   value={selectedDate}
 *   onDateChange={setSelectedDate}
 *   required={true}
 *   error={dateError}
 * />
 * ```
 */
export default function DateInput({
  label,
  value,
  onDateChange,
  required = false,
  disabled = false,
  error,
  style,
  accessibilityLabel,
  accessibilityHint,
}: DateInputProps) {
  const theme = useTheme();
  const { triggerHaptic } = useMicroInteractions();
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    onDateChange(tempDate);
    setShowPicker(false);
    triggerHaptic('success');
  };

  const handleCancel = () => {
    setTempDate(value); // Reset to original value
    setShowPicker(false);
    triggerHaptic('light');
  };

  const handlePress = () => {
    if (disabled) return;
    
    triggerHaptic('light');
    setTempDate(value); // Initialize temp date with current value
    setShowPicker(true);
  };

  const formattedDate = format(value, 'MMMM dd, yyyy');
  const styles = getStyles(theme, error, disabled);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TouchableOpacity
        style={[
          styles.input,
          disabled && styles.disabled,
        ]}
        onPress={handlePress}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `Select date, currently ${formattedDate}`}
        accessibilityHint={accessibilityHint || 'Opens date picker'}
      >
        <Calendar
          weight="light"
          size={20}
          color={disabled ? theme.colors.textLight : theme.colors.textMuted}
        />
        <Text
          style={[
            styles.dateText,
            {
              color: disabled ? theme.colors.textLight : theme.colors.text,
            },
          ]}
        >
          {formattedDate}
        </Text>
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {showPicker && (
        <BaseBottomSheet
          visible={showPicker}
          onClose={handleCancel}
          title="Select Date"
          actionButtons={[
            {
              text: 'Cancel',
              onPress: handleCancel,
              variant: 'secondary',
            },
            {
              text: 'Confirm',
              onPress: handleConfirm,
              variant: 'primary',
            },
          ]}
        >
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              maximumDate={new Date()}
              textColor={theme.colors.text}
              style={styles.iosPicker}
            />
          </View>
        </BaseBottomSheet>
      )}
    </View>
  );
}

function getStyles(theme: any, error?: string, disabled?: boolean) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg, // 24px spacing between inputs
    },
    label: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      fontWeight: '500',
      marginBottom: 8, // 8px spacing between title and input
    },
    required: {
      color: theme.colors.alertRed,
    },
    input: {
      ...theme.typography.body1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: error ? theme.colors.alertRed : theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.screenPadding, // 20px padding like Linked Pocket
      paddingVertical: theme.spacing.sm,
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    dateText: {
      flex: 1,
      ...theme.typography.bodyLarge,
    },
    disabled: {
      opacity: 0.6,
    },
    errorText: {
      ...theme.typography.caption,
      color: theme.colors.alertRed,
      marginTop: theme.spacing.xs,
    },
    pickerContainer: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingTop: theme.spacing.md,
    },
    iosPicker: {
      height: 200,
      marginTop: theme.spacing.md,
    },
  });
}
