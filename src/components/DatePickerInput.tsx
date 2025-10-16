import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Calendar, Clock, X } from 'phosphor-react-native';
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface DatePickerInputProps {
  value: Date;
  onChange: (date: Date) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const QUICK_PRESETS = [
  { label: 'Today', getDate: () => new Date() },
  { label: 'Yesterday', getDate: () => subDays(new Date(), 1) },
  { label: 'This Week', getDate: () => startOfWeek(new Date()) },
  { label: 'Last Week', getDate: () => startOfWeek(subDays(new Date(), 7)) },
  { label: 'This Month', getDate: () => startOfMonth(new Date()) },
  { label: 'Last Month', getDate: () => startOfMonth(subDays(new Date(), 30)) },
];

export default function DatePickerInput({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = "Select date",
  disabled = false,
  error,
}: DatePickerInputProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);

  const handlePress = () => {
    if (disabled) return;
    setIsOpen(true);
    onFocus?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    onBlur?.();
  };

  const handleConfirm = () => {
    onChange(selectedDate);
    handleClose();
  };

  const handlePresetSelect = (preset: typeof QUICK_PRESETS[0]) => {
    const newDate = preset.getDate();
    setSelectedDate(newDate);
    onChange(newDate);
    handleClose();
  };

  const formatDisplayDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

  const formatInputDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.inputContainer, error && styles.errorContainer]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Calendar size={20} color={theme.colors.textMuted} weight="regular" />
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
        <Clock size={16} color={theme.colors.textMuted} weight="regular" />
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={24} color={theme.colors.text} weight="regular" />
              </TouchableOpacity>
            </View>

            <View style={styles.presetsContainer}>
              <Text style={styles.presetsTitle}>Quick Presets</Text>
              <View style={styles.presetsGrid}>
                {QUICK_PRESETS.map((preset, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.presetButton}
                    onPress={() => handlePresetSelect(preset)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.presetText}>{preset.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDateLabel}>Selected Date</Text>
              <Text style={styles.selectedDateText}>
                {formatDisplayDate(selectedDate)}
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 2,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 56,
    },
    errorContainer: {
      borderColor: theme.colors.alertRed,
    },
    inputText: {
      flex: 1,
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    placeholderText: {
      color: theme.colors.textLight,
    },
    errorText: {
      ...theme.typography.bodySmall,
      color: theme.colors.alertRed,
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.sm,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      paddingTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      maxHeight: '70%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    modalTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '600',
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    presetsContainer: {
      marginBottom: theme.spacing.lg,
    },
    presetsTitle: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.md,
      fontWeight: '500',
    },
    presetsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    presetButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    presetText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
    },
    selectedDateContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    selectedDateLabel: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.xs,
    },
    selectedDateText: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '600',
    },
    modalActions: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelButtonText: {
      ...theme.typography.button,
      color: theme.colors.text,
      fontWeight: '500',
    },
    confirmButton: {
      flex: 1,
      backgroundColor: theme.colors.trustBlue,
      borderRadius: theme.radius.lg,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
    },
    confirmButtonText: {
      ...theme.typography.button,
      color: theme.colors.background,
      fontWeight: '500',
    },
  });
}
