import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Check, X } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';
import { format } from 'date-fns';

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
        <Modal
          transparent={true}
          animationType="slide"
          visible={showPicker}
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
              <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
                <TouchableOpacity onPress={handleCancel} style={styles.modalButton}>
                  <X size={20} color={theme.colors.text} weight="light" />
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Date</Text>
                <TouchableOpacity onPress={handleConfirm} style={styles.modalButton}>
                  <Check size={20} color={theme.colors.trustBlue} weight="light" />
                </TouchableOpacity>
              </View>
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
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

function getStyles(theme: any, error?: string, disabled?: boolean) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      ...theme.typography.subtitle1,
      color: theme.colors.text,
      fontWeight: '500',
      marginBottom: theme.spacing.xs,
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
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    dateText: {
      flex: 1,
      fontSize: 16, // Prevent zoom on iOS
    },
    disabled: {
      opacity: 0.6,
    },
    errorText: {
      ...theme.typography.caption,
      color: theme.colors.alertRed,
      marginTop: theme.spacing.xs,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      paddingBottom: theme.spacing.xl,
      maxHeight: '50%',
      alignItems: 'center', // Center-align the content
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
    },
    modalButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.radius.sm,
    },
    modalTitle: {
      ...theme.typography.h4,
      fontWeight: '600',
    },
    pickerContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    iosPicker: {
      height: 200,
      marginTop: theme.spacing.md,
    },
  });
}
