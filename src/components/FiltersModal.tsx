import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';
import { 
  Funnel, 
  SortAscending, 
  Calendar, 
  Check 
} from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import BaseBottomSheet from './BaseBottomSheet';

const { width: screenWidth } = Dimensions.get('window');

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  sortBy: 'date' | 'amount' | 'category';
  sortOrder: 'asc' | 'desc';
  dateRange: 'all' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

const SORT_OPTIONS = [
  { key: 'date', label: 'Date', icon: Calendar },
  { key: 'amount', label: 'Amount', icon: SortAscending },
  { key: 'category', label: 'Category', icon: Funnel }
];

const DATE_RANGE_OPTIONS = [
  { key: 'all', label: 'All Time' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'quarter', label: 'This Quarter' },
  { key: 'year', label: 'This Year' },
  { key: 'custom', label: 'Custom Range' }
];

export default function FiltersModal({ 
  visible, 
  onClose, 
  onApply, 
  currentFilters 
}: FiltersModalProps) {
  const theme = useTheme();
  const [localFilters, setLocalFilters] = useState<FilterOptions>(currentFilters);
  const styles = getStyles(theme);

  const handleSortChange = (sortBy: 'date' | 'amount' | 'category') => {
    setLocalFilters(prev => ({ ...prev, sortBy }));
  };

  const handleSortOrderChange = () => {
    setLocalFilters(prev => ({ 
      ...prev, 
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
    }));
  };

  const handleDateRangeChange = (dateRange: FilterOptions['dateRange']) => {
    setLocalFilters(prev => ({ ...prev, dateRange }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    const defaultFilters: FilterOptions = {
      sortBy: 'date',
      sortOrder: 'desc',
      dateRange: 'all'
    };
    setLocalFilters(defaultFilters);
    onApply(defaultFilters);
    onClose();
  };

  const getSortIcon = (sortBy: string) => {
    switch (sortBy) {
      case 'date': return Calendar;
      case 'amount': return SortAscending;
      case 'category': return Funnel;
      default: return SortAscending;
    }
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Filters & Sorting"
      showActionButtons={true}
      actionButtonText="Apply Filters"
      onActionButtonPress={handleApply}
      cancelButtonText="Clear All"
      onCancelButtonPress={handleClear}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sort Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.optionsRow}>
            {SORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = localFilters.sortBy === option.key;
              
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.pillButton,
                    isSelected && styles.pillButtonSelected
                  ]}
                  onPress={() => handleSortChange(option.key as any)}
                >
                  <Icon 
                    weight="light" 
                    size={24} 
                    color={isSelected ? theme.colors.background : theme.colors.text} 
                  />
                  <Text style={[
                    styles.pillText,
                    isSelected && styles.pillTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Check weight="light" size={24} color={theme.colors.background} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Sort Order */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort Order</Text>
          <TouchableOpacity
            style={[
              styles.pillButton,
              styles.sortOrderPill
            ]}
            onPress={handleSortOrderChange}
          >
            <SortAscending 
              weight="light" 
              size={16} 
              color={theme.colors.text}
              style={[
                localFilters.sortOrder === 'desc' && { transform: [{ rotateY: '180deg' }] }
              ]}
            />
            <Text style={styles.pillText}>
              {localFilters.sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date Range</Text>
          <View style={styles.dateRangeList}>
            {DATE_RANGE_OPTIONS.map((option) => {
              const isSelected = localFilters.dateRange === option.key;
              
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.dateRangeOption,
                    isSelected && styles.dateRangeOptionSelected
                  ]}
                  onPress={() => handleDateRangeChange(option.key as any)}
                >
                  <Text style={[
                    styles.dateRangeText,
                    isSelected && styles.dateRangeTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Check weight="light" size={24} color={theme.colors.background} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Custom Date Range Placeholder */}
        {localFilters.dateRange === 'custom' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Date Range</Text>
            <View style={styles.customDateContainer}>
              <Text style={styles.customDateText}>
                Custom date picker will be implemented here
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </BaseBottomSheet>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginVertical: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: theme.spacing.xs,
    minHeight: 40,
  },
  pillButtonSelected: {
    backgroundColor: theme.colors.trustBlue,
    borderColor: theme.colors.trustBlue,
  },
  pillText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '500',
  },
  pillTextSelected: {
    color: theme.colors.background,
    fontWeight: '600',
  },
  sortOrderPill: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderLight,
  },
  dateRangeList: {
    gap: theme.spacing.sm,
  },
  dateRangeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  dateRangeOptionSelected: {
    backgroundColor: theme.colors.trustBlue,
    borderColor: theme.colors.trustBlue,
  },
  dateRangeText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '500',
  },
  dateRangeTextSelected: {
    color: theme.colors.background,
    fontWeight: '600',
  },
  customDateContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    alignItems: 'center',
  },
  customDateText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
