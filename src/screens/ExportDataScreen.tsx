import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BudgetContext } from '../context/BudgetContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../components/SecondaryHeader';
import BaseBottomSheet from '../components/BaseBottomSheet';
import ActionButton from '../components/ActionButton';
import { 
  Download, 
  Calendar, 
  Wallet, 
  Receipt, 
  FileText, 
  FilePdf,
  CheckCircle,
  RadioButton,
  X
} from 'phosphor-react-native';

interface DateRange {
  id: string;
  label: string;
  description: string;
}

interface ExportOption {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}

const DATE_RANGES: DateRange[] = [
  { id: 'all', label: 'All Time', description: 'Export all your data' },
  { id: 'year', label: 'This Year', description: 'Current year data' },
  { id: '6months', label: 'Last 6 Months', description: 'Recent half year' },
  { id: '3months', label: 'Last 3 Months', description: 'Recent quarter' },
  { id: 'month', label: 'This Month', description: 'Current month' },
  { id: 'custom', label: 'Custom Range', description: 'Select specific dates' },
];

const EXPORT_OPTIONS: ExportOption[] = [
  { 
    id: 'pockets', 
    label: 'Pockets', 
    description: 'Budget categories and targets',
    icon: Wallet 
  },
  { 
    id: 'transactions', 
    label: 'Transactions', 
    description: 'All transaction records',
    icon: Receipt 
  },
  { 
    id: 'budgets', 
    label: 'Budgets', 
    description: 'Budget plans and goals',
    icon: CheckCircle 
  },
];

const FILE_FORMATS = [
  { id: 'csv', label: 'CSV', description: 'Spreadsheet format', icon: FileText },
  { id: 'pdf', label: 'PDF', description: 'Document format', icon: FilePdf },
];

export default function ExportDataScreen() {
  const theme = useTheme();
  const { state } = useContext(BudgetContext);
  const navigation = useNavigation();
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['pockets', 'transactions']);
  const [isExporting, setIsExporting] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>('start');
  const styles = getStyles(theme);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDateRangeSelect = (rangeId: string) => {
    if (rangeId === 'custom') {
      setShowCustomDateModal(true);
    } else {
      setSelectedDateRange(rangeId);
    }
  };

  const handleFormatSelect = (formatId: string) => {
    setSelectedFormat(formatId);
  };

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleCustomDateConfirm = () => {
    if (customStartDate && customEndDate) {
      setSelectedDateRange('custom');
      setShowCustomDateModal(false);
    } else {
      Alert.alert('Invalid Date Range', 'Please select both start and end dates.');
    }
  };

  const handleCustomDateCancel = () => {
    setShowCustomDateModal(false);
    setCustomStartDate(null);
    setCustomEndDate(null);
  };

  const handleDateButtonPress = (mode: 'start' | 'end') => {
    setDatePickerMode(mode);
    setShowDatePicker(true);
  };

  const handleDateSelect = (date: Date) => {
    if (datePickerMode === 'start') {
      setCustomStartDate(date);
    } else {
      setCustomEndDate(date);
    }
    setShowDatePicker(false);
  };

  const handleDatePickerCancel = () => {
    setShowDatePicker(false);
  };

  const handleExport = async () => {
    if (selectedOptions.length === 0) {
      Alert.alert('No Data Selected', 'Please select at least one data type to export.');
      return;
    }

    setIsExporting(true);
    
    try {
      // Import the export functions
      const { exportTransactionsToCSV, exportPocketsToCSV, exportAllDataToCSV, shareFile } = await import('../services/export');
      
      let exportPath: string;
      
      // Calculate date range
      const now = new Date();
      let dateRange: { start: Date; end: Date } | undefined;
      
      if (selectedDateRange === 'custom' && customStartDate && customEndDate) {
        dateRange = { start: customStartDate, end: customEndDate };
      } else if (selectedDateRange === 'last30days') {
        const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateRange = { start, end: now };
      } else if (selectedDateRange === 'last90days') {
        const start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        dateRange = { start, end: now };
      } else if (selectedDateRange === 'lastYear') {
        const start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateRange = { start, end: now };
      }
      
      if (selectedOptions.length === 3) {
        // Export all data
        exportPath = await exportAllDataToCSV(state, dateRange);
      } else if (selectedOptions.includes('transactions')) {
        exportPath = await exportTransactionsToCSV(state, dateRange);
      } else if (selectedOptions.includes('pockets')) {
        exportPath = await exportPocketsToCSV(state);
      } else {
        throw new Error('No valid export option selected');
      }
      
      // Share the file
      await shareFile(exportPath);
      
      Alert.alert(
        'Export Complete',
        `Your data has been exported successfully in ${selectedFormat.toUpperCase()} format.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', 'There was an error exporting your data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const isOptionSelected = (optionId: string) => {
    return selectedOptions.includes(optionId);
  };

  const isDateRangeSelected = (rangeId: string) => {
    return selectedDateRange === rangeId;
  };

  const isFormatSelected = (formatId: string) => {
    return selectedFormat === formatId;
  };

  return (
    <View style={styles.container}>
      <SecondaryHeader
        title="Export Data"
        onBackPress={handleBack}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Range Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date Range</Text>
          <View style={styles.optionsList}>
            {DATE_RANGES.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.optionItem,
                  isDateRangeSelected(range.id) && styles.optionItemSelected
                ]}
                onPress={() => handleDateRangeSelect(range.id)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Select ${range.label}`}
                accessibilityHint={range.description}
              >
                <View style={styles.optionInfo}>
                  <Calendar 
                    size={20} 
                    color={isDateRangeSelected(range.id) ? theme.colors.trustBlue : theme.colors.textMuted} 
                    weight="light" 
                  />
                  <View style={styles.optionDetails}>
                    <Text style={[
                      styles.optionLabel,
                      isDateRangeSelected(range.id) && styles.optionLabelSelected
                    ]}>
                      {range.label}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {range.description}
                    </Text>
                  </View>
                </View>
                
                  <RadioButton 
                    size={20} 
                    color={isDateRangeSelected(range.id) ? theme.colors.trustBlue : theme.colors.borderLight} 
                    weight={isDateRangeSelected(range.id) ? "fill" : "light"} 
                  />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Data Types Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data to Export</Text>
          <View style={styles.optionsList}>
            {EXPORT_OPTIONS.map((option) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.toggleOptionItem,
                    isOptionSelected(option.id) && styles.toggleOptionItemSelected
                  ]}
                  onPress={() => handleOptionToggle(option.id)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`${isOptionSelected(option.id) ? 'Deselect' : 'Select'} ${option.label}`}
                  accessibilityHint={option.description}
                >
                  <View style={styles.optionInfo}>
                    <IconComponent 
                      size={20} 
                      color={isOptionSelected(option.id) ? theme.colors.trustBlue : theme.colors.textMuted} 
                      weight="light" 
                    />
                    <View style={styles.optionDetails}>
                      <Text style={[
                        styles.optionLabel,
                        isOptionSelected(option.id) && styles.optionLabelSelected
                      ]}>
                        {option.label}
                      </Text>
                      <Text style={styles.optionDescription}>
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  
                  {isOptionSelected(option.id) ? (
                    <CheckCircle 
                      size={20} 
                      color={theme.colors.trustBlue} 
                      weight="light" 
                    />
                  ) : (
                    <RadioButton 
                      size={20} 
                      color={theme.colors.borderLight} 
                      weight="light" 
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* File Format Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Format</Text>
          <View style={styles.optionsList}>
            {FILE_FORMATS.map((format) => {
              const IconComponent = format.icon;
              return (
                <TouchableOpacity
                  key={format.id}
                  style={[
                    styles.optionItem,
                    isFormatSelected(format.id) && styles.optionItemSelected
                  ]}
                  onPress={() => handleFormatSelect(format.id)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${format.label} format`}
                  accessibilityHint={format.description}
                >
                  <View style={styles.optionInfo}>
                    <IconComponent 
                      size={20} 
                      color={isFormatSelected(format.id) ? theme.colors.trustBlue : theme.colors.textMuted} 
                      weight="light" 
                    />
                    <View style={styles.optionDetails}>
                      <Text style={[
                        styles.optionLabel,
                        isFormatSelected(format.id) && styles.optionLabelSelected
                      ]}>
                        {format.label}
                      </Text>
                      <Text style={styles.optionDescription}>
                        {format.description}
                      </Text>
                    </View>
                  </View>
                  
                  <RadioButton 
                    size={20} 
                    color={isFormatSelected(format.id) ? theme.colors.trustBlue : theme.colors.borderLight} 
                    weight={isFormatSelected(format.id) ? "fill" : "light"} 
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Export Button */}
        <ActionButton
          title={isExporting ? 'Exporting...' : 'Export Data'}
          variant="primary"
          size="medium"
          onPress={handleExport}
          disabled={isExporting || selectedOptions.length === 0}
          loading={isExporting}
          icon={<Download size={20} color={theme.colors.background} weight="light" />}
          accessibilityLabel={isExporting ? "Exporting data" : "Export data"}
          accessibilityHint="Exports the selected data in the chosen format"
        />

        {/* Info Text */}
        <Text style={styles.infoText}>
          Your exported data will be saved to your device's Downloads folder.
        </Text>
      </ScrollView>

      {/* Custom Date Range Modal */}
      <Modal
        visible={showCustomDateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCustomDateCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date Range</Text>
            
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => handleDateButtonPress('start')}
              >
                <Text style={styles.dateButtonText}>
                  {customStartDate ? customStartDate.toLocaleDateString() : 'Select Start Date'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>End Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => handleDateButtonPress('end')}
              >
                <Text style={styles.dateButtonText}>
                  {customEndDate ? customEndDate.toLocaleDateString() : 'Select End Date'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCustomDateCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCustomDateConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker Bottom Sheet */}
      <BaseBottomSheet
        visible={showDatePicker}
        onClose={handleDatePickerCancel}
        title={`Select ${datePickerMode === 'start' ? 'Start' : 'End'} Date`}
      >
        <View style={styles.datePickerContent}>
          {Array.from({ length: 365 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const isToday = i === 0;
            const isSelected = datePickerMode === 'start' 
              ? customStartDate?.toDateString() === date.toDateString()
              : customEndDate?.toDateString() === date.toDateString();
            
            return (
              <TouchableOpacity
                key={date.toISOString()}
                style={[
                  styles.datePickerOption,
                  isSelected && styles.datePickerOptionSelected
                ]}
                onPress={() => handleDateSelect(date)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Select ${date.toLocaleDateString()}`}
              >
                <Text style={[
                  styles.datePickerOptionText,
                  isSelected && styles.datePickerOptionTextSelected
                ]}>
                  {date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  {isToday && ' (Today)'}
                </Text>
                {isSelected && (
                  <CheckCircle 
                    size={20} 
                    color={theme.colors.trustBlue} 
                    weight="light" 
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BaseBottomSheet>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  optionsList: {
    // Removed background and radius as requested
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    minHeight: 64,
  },
  toggleOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    minHeight: 64,
  },
  toggleOptionItemSelected: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.trustBlue,
  },
  optionItemSelected: {
    backgroundColor: theme.colors.trustBlue + '10',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.trustBlue,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
  },
  optionDetails: {
    flex: 1,
  },
  optionLabel: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '600',
  },
  optionLabelSelected: {
    color: theme.colors.trustBlue,
  },
  optionDescription: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  infoText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    fontWeight: '600',
  },
  dateInputContainer: {
    marginBottom: theme.spacing.lg,
  },
  dateLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  dateButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  dateButtonText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  modalButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  confirmButton: {
    backgroundColor: theme.colors.trustBlue,
  },
  cancelButtonText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '500',
  },
  confirmButtonText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.background,
    fontWeight: '600',
  },
  // Date Picker Bottom Sheet styles
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    maxHeight: '70%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  datePickerTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    fontWeight: '600',
  },
  datePickerCloseButton: {
    padding: theme.spacing.sm,
  },
  datePickerContent: {
    flex: 1,
  },
  datePickerScrollView: {
    flex: 1,
  },
  datePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    minHeight: 56,
  },
  datePickerOptionSelected: {
    backgroundColor: theme.colors.trustBlue + '10',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.trustBlue,
  },
  datePickerOptionText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '500',
  },
  datePickerOptionTextSelected: {
    color: theme.colors.trustBlue,
    fontWeight: '600',
  },
});