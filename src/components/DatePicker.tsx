import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';
import { format } from 'date-fns';
import BaseBottomSheet from './BaseBottomSheet';

export interface DatePickerProps {
  /**
   * Selected date
   */
  value: Date;
  
  /**
   * Callback when date changes
   */
  onDateChange: (date: Date) => void;
  
  /**
   * Label for the date picker
   */
  label?: string;
  
  /**
   * Whether the date picker is disabled
   * @default false
   */
  disabled?: boolean;
  
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
 * Reusable DatePicker component with platform-specific behavior
 * 
 * Features:
 * - iOS: Shows native date picker modal
 * - Android: Shows native date picker
 * - Dark/light mode support
 * - Microinteractions with haptic feedback
 * - Full accessibility compliance
 * 
 * Usage:
 * ```tsx
 * <DatePicker
 *   value={selectedDate}
 *   onDateChange={setSelectedDate}
 *   label="Transaction Date"
 *   accessibilityLabel="Select transaction date"
 * />
 * ```
 */
export default function DatePicker({
  value,
  onDateChange,
  label,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
}: DatePickerProps) {
  const theme = useTheme();
  const { triggerHaptic } = useMicroInteractions();
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (selectedDate) {
        onDateChange(selectedDate);
        triggerHaptic('light');
      }
    } else {
      // iOS: Update temp date but don't close picker
      if (selectedDate) {
        setTempDate(selectedDate);
      }
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
  const styles = getStyles(theme);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.dateButton,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
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

      {showPicker && Platform.OS === 'ios' && (
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
      
      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
          textColor={theme.colors.text}
        />
      )}
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      ...theme.typography.subtitle1,
      fontWeight: '500',
      marginBottom: theme.spacing.md,
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderWidth: 1,
      borderRadius: theme.radius.md,
      minHeight: theme.layout.inputHeight,
    },
    dateText: {
      ...theme.typography.body1,
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    disabled: {
      opacity: 0.6,
    },
    iosPicker: {
      height: 200,
      marginTop: theme.spacing.md,
    },
    pickerContainer: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingTop: theme.spacing.md,
    },
  });
}
