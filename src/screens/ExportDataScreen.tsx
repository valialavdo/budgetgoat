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
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BudgetContext } from '../context/BudgetContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../components/SecondaryHeader';
import BaseBottomSheet from '../components/BaseBottomSheet';
import ActionButton from '../components/ActionButton';
import SelectionList from '../components/SelectionList';
import SelectionInput from '../components/SelectionInput';
import SelectionOption from '../components/SelectionOption';
import RadioSelectionOption from '../components/RadioSelectionOption';
import { 
  Download, 
  Calendar, 
  Wallet, 
  Receipt, 
  FileText, 
  FilePdf,
  Target,
  Check,
  Circle,
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
    icon: Target 
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
  const [scrollY] = useState(new Animated.Value(0));
  const styles = getStyles(theme);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDateRangeSelect = (value: string | string[]) => {
    const rangeId = Array.isArray(value) ? value[0] : value;
    if (rangeId === 'custom') {
      setShowCustomDateModal(true);
    } else {
      setSelectedDateRange(rangeId);
    }
  };

  const handleFormatSelect = (value: string | string[]) => {
    const formatId = Array.isArray(value) ? value[0] : value;
    setSelectedFormat(formatId);
  };

  const handleOptionToggle = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setSelectedOptions(value);
    } else {
      setSelectedOptions(prev => 
        prev.includes(value) 
          ? prev.filter(id => id !== value)
          : [...prev, value]
      );
    }
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
        scrollY={scrollY}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Date Range Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date Range</Text>
          {DATE_RANGES.map((range) => (
            <RadioSelectionOption
              key={range.id}
              title={range.label}
              subtitle={range.description}
              icon={<Calendar size={20} weight="light" />}
              selected={isDateRangeSelected(range.id)}
              onPress={() => handleDateRangeSelect(range.id)}
            />
          ))}
        </View>

        {/* Data Types Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data to Export</Text>
          {EXPORT_OPTIONS.map((option) => (
            <SelectionOption
              key={option.id}
              title={option.label}
              subtitle={option.description}
              icon={<option.icon size={20} weight="light" />}
              selected={isOptionSelected(option.id)}
              onPress={() => handleOptionToggle(option.id)}
            />
          ))}
        </View>

        {/* File Format Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Format</Text>
          {FILE_FORMATS.map((format) => (
            <RadioSelectionOption
              key={format.id}
              title={format.label}
              subtitle={format.description}
              icon={<format.icon size={20} weight="light" />}
              selected={isFormatSelected(format.id)}
              onPress={() => handleFormatSelect(format.id)}
            />
          ))}
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

      {/* Custom Date Range Bottom Sheet */}
      <BaseBottomSheet
        visible={showCustomDateModal}
        onClose={handleCustomDateCancel}
        title="Select Date Range"
        actionButtons={[
          {
            title: 'Cancel',
            variant: 'secondary',
            onPress: handleCustomDateCancel,
          },
          {
            title: 'Confirm',
            variant: 'primary',
            onPress: handleCustomDateConfirm,
            disabled: !customStartDate || !customEndDate,
          },
        ]}
      >
        <View style={styles.dateRangeContent}>
          <SelectionInput
            label="Start Date"
            value={customStartDate ? customStartDate.toLocaleDateString() : ''}
            placeholder="Select Start Date"
            onPress={() => handleDateButtonPress('start')}
            icon={<Calendar size={20} weight="light" />}
          />
          
          <SelectionInput
            label="End Date"
            value={customEndDate ? customEndDate.toLocaleDateString() : ''}
            placeholder="Select End Date"
            onPress={() => handleDateButtonPress('end')}
            icon={<Calendar size={20} weight="light" />}
          />
        </View>
      </BaseBottomSheet>

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
                  <Check 
                    size={20} 
                    color={theme.colors.trustBlue} 
                    weight="bold" 
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
    marginBottom: theme.spacing.lg, // 24px spacing between sections
  },
  sectionTitle: {
    fontSize: 14, // 14px for titles
    color: theme.colors.text,
    marginBottom: 8, // 8px spacing between title and content
    fontWeight: '600',
  },
  infoText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.lg, // 24px spacing above the text
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
  dateRangeContent: {
    paddingVertical: theme.spacing.sm,
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