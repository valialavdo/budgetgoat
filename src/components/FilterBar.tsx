import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Funnel, 
  SortAscending, 
  Calendar, 
  Tag,
  CurrencyDollar,
  X,
  Check,
  CaretDown,
  Plus
} from 'phosphor-react-native';

interface FilterOption {
  key: string;
  label: string;
  value: any;
}

interface FilterCategory {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  options: FilterOption[];
  multiSelect: boolean;
}

interface FilterBarProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  resultsCount: number;
}

const FILTER_CATEGORIES: FilterCategory[] = [
  {
    key: 'date',
    label: 'Date',
    icon: Calendar,
    multiSelect: false,
    options: [
      { key: 'all', label: 'All Time', value: 'all' },
      { key: 'today', label: 'Today', value: 'today' },
      { key: 'week', label: 'This Week', value: 'week' },
      { key: 'month', label: 'This Month', value: 'month' },
      { key: 'quarter', label: 'This Quarter', value: 'quarter' },
      { key: 'year', label: 'This Year', value: 'year' },
      { key: 'custom', label: 'Custom Range', value: 'custom' },
    ]
  },
  {
    key: 'category',
    label: 'Category',
    icon: Tag,
    multiSelect: true,
    options: [
      { key: 'food', label: 'Food & Dining', value: 'food' },
      { key: 'transportation', label: 'Transportation', value: 'transportation' },
      { key: 'entertainment', label: 'Entertainment', value: 'entertainment' },
      { key: 'shopping', label: 'Shopping', value: 'shopping' },
      { key: 'health', label: 'Health & Fitness', value: 'health' },
      { key: 'bills', label: 'Bills & Utilities', value: 'bills' },
      { key: 'income', label: 'Income', value: 'income' },
      { key: 'other', label: 'Other', value: 'other' },
    ]
  },
  {
    key: 'amount',
    label: 'Amount',
    icon: CurrencyDollar,
    multiSelect: false,
    options: [
      { key: 'all', label: 'All Amounts', value: 'all' },
      { key: 'under50', label: 'Under $50', value: 'under50' },
      { key: '50to100', label: '$50 - $100', value: '50to100' },
      { key: '100to500', label: '$100 - $500', value: '100to500' },
      { key: 'over500', label: 'Over $500', value: 'over500' },
    ]
  }
];

const SORT_OPTIONS = [
  { key: 'date', label: 'Date' },
  { key: 'amount', label: 'Amount' },
  { key: 'category', label: 'Category' },
];

export default function FilterBar({
  filters,
  onFiltersChange,
  onSortChange,
  sortBy,
  sortOrder,
  resultsCount
}: FilterBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const styles = getStyles(theme, insets);

  const handleFilterChange = (categoryKey: string, optionKey: string, optionValue: any) => {
    const category = FILTER_CATEGORIES.find(cat => cat.key === categoryKey);
    if (!category) return;

    let newFilters = { ...filters };

    if (category.multiSelect) {
      const currentValues = filters[categoryKey] || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v: any) => v !== optionValue)
        : [...currentValues, optionValue];
      newFilters[categoryKey] = newValues;
    } else {
      newFilters[categoryKey] = optionValue;
    }

    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters: Record<string, any> = {};
    FILTER_CATEGORIES.forEach(category => {
      clearedFilters[category.key] = category.multiSelect ? [] : 'all';
    });
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    FILTER_CATEGORIES.forEach(category => {
      const value = filters[category.key];
      if (category.multiSelect) {
        count += Array.isArray(value) ? value.length : 0;
      } else if (value && value !== 'all') {
        count += 1;
      }
    });
    return count;
  };

  const getFilterDisplayText = (categoryKey: string) => {
    const category = FILTER_CATEGORIES.find(cat => cat.key === categoryKey);
    const value = filters[categoryKey];
    
    if (!category || !value || value === 'all' || (Array.isArray(value) && value.length === 0)) {
      return category?.label || '';
    }

    if (category.multiSelect && Array.isArray(value)) {
      if (value.length === 1) {
        const option = category.options.find(opt => opt.value === value[0]);
        return option?.label || category.label;
      }
      return `${category.label} (${value.length})`;
    }

    const option = category.options.find(opt => opt.value === value);
    return option?.label || category.label;
  };

  const isFilterActive = (categoryKey: string) => {
    const value = filters[categoryKey];
    const category = FILTER_CATEGORIES.find(cat => cat.key === categoryKey);
    
    if (!category) return false;
    
    if (category.multiSelect) {
      return Array.isArray(value) && value.length > 0;
    }
    
    return value && value !== 'all';
  };

  const renderDropdown = (category: FilterCategory) => {
    const isActive = activeDropdown === category.key;
    const currentValue = filters[category.key];

    return (
      <View key={category.key} style={styles.dropdownContainer}>
        <TouchableOpacity
          style={[
            styles.filterPill,
            isFilterActive(category.key) && styles.filterPillActive,
            isActive && styles.filterPillOpen
          ]}
          onPress={() => setActiveDropdown(isActive ? null : category.key)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Filter by ${category.label}`}
          accessibilityHint={`Currently ${isFilterActive(category.key) ? 'active' : 'inactive'}`}
        >
          <category.icon 
            size={16} 
            color={isFilterActive(category.key) ? theme.colors.background : theme.colors.textMuted} 
            weight="light" 
          />
          <Text style={[
            styles.filterPillText,
            isFilterActive(category.key) && styles.filterPillTextActive
          ]}>
            {getFilterDisplayText(category.key)}
          </Text>
          <CaretDown 
            size={14} 
            color={isFilterActive(category.key) ? theme.colors.background : theme.colors.textMuted} 
            weight="light"
            style={{ transform: [{ rotate: isActive ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        {isActive && (
          <View style={styles.dropdown}>
            <ScrollView style={styles.dropdownContent} showsVerticalScrollIndicator={false}>
              {category.options.map((option) => {
                const isSelected = category.multiSelect
                  ? Array.isArray(currentValue) && currentValue.includes(option.value)
                  : currentValue === option.value;

                return (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.dropdownOption,
                      isSelected && styles.dropdownOptionSelected
                    ]}
                    onPress={() => handleFilterChange(category.key, option.key, option.value)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={option.label}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      isSelected && styles.dropdownOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Check size={16} color={theme.colors.trustBlue} weight="light" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const renderSortDropdown = () => {
    const isActive = activeDropdown === 'sort';
    const currentSort = SORT_OPTIONS.find(opt => opt.key === sortBy);

    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={[
            styles.sortPill,
            isActive && styles.filterPillOpen
          ]}
          onPress={() => setActiveDropdown(isActive ? null : 'sort')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Sort by ${currentSort?.label}`}
        >
          <SortAscending 
            size={16} 
            color={theme.colors.textMuted} 
            weight="light"
            style={{ transform: [{ rotate: sortOrder === 'desc' ? '180deg' : '0deg' }] }}
          />
          <Text style={styles.sortPillText}>
            {currentSort?.label}
          </Text>
          <CaretDown 
            size={14} 
            color={theme.colors.textMuted} 
            weight="light"
            style={{ transform: [{ rotate: isActive ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        {isActive && (
          <View style={styles.dropdown}>
            <ScrollView style={styles.dropdownContent} showsVerticalScrollIndicator={false}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.dropdownOption,
                    sortBy === option.key && styles.dropdownOptionSelected
                  ]}
                  onPress={() => onSortChange(option.key, sortOrder)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Sort by ${option.label}`}
                  accessibilityState={{ selected: sortBy === option.key }}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    sortBy === option.key && styles.dropdownOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {sortBy === option.key && (
                    <Check size={16} color={theme.colors.trustBlue} weight="light" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* Filter Pills */}
        {FILTER_CATEGORIES.map(renderDropdown)}
        
        {/* Sort Dropdown */}
        {renderSortDropdown()}
        
        {/* More Filters Button */}
        <TouchableOpacity
          style={styles.moreFiltersButton}
          onPress={() => setShowAdvancedFilters(true)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Open advanced filters"
        >
          <Plus size={16} color={theme.colors.trustBlue} weight="light" />
          <Text style={styles.moreFiltersText}>More</Text>
        </TouchableOpacity>

        {/* Clear All Button */}
        {activeFiltersCount > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={handleClearAll}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Clear all filters"
          >
            <X size={16} color={theme.colors.alertRed} weight="light" />
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {resultsCount} result{resultsCount !== 1 ? 's' : ''}
        </Text>
        {activeFiltersCount > 0 && (
          <View style={styles.activeFiltersBadge}>
            <Text style={styles.activeFiltersBadgeText}>
              {activeFiltersCount}
            </Text>
          </View>
        )}
      </View>

      {/* Overlay for dropdowns */}
      {activeDropdown && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setActiveDropdown(null)}
          accessible={false}
        />
      )}

      {/* Advanced Filters Modal */}
      <Modal
        visible={showAdvancedFilters}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAdvancedFilters(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAdvancedFilters(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Filters</Text>
              <TouchableOpacity
                onPress={() => setShowAdvancedFilters(false)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Close advanced filters"
              >
                <X size={24} color={theme.colors.text} weight="light" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDescription}>
              Advanced filter options will be implemented here
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const getStyles = (theme: any, insets: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    paddingVertical: theme.spacing.sm,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: theme.spacing.xs,
    minHeight: 40,
  },
  filterPillActive: {
    backgroundColor: theme.colors.trustBlue,
    borderColor: theme.colors.trustBlue,
  },
  filterPillOpen: {
    borderColor: theme.colors.trustBlue,
  },
  filterPillText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: theme.colors.background,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: theme.spacing.xs,
    minHeight: 40,
  },
  sortPillText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  moreFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.trustBlue,
    gap: theme.spacing.xs,
    minHeight: 40,
  },
  moreFiltersText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.trustBlue,
    fontWeight: '500',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.alertRed,
    gap: theme.spacing.xs,
    minHeight: 40,
  },
  clearAllText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.alertRed,
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    marginTop: theme.spacing.xs,
    maxHeight: 200,
    zIndex: 1001,
  },
  dropdownContent: {
    padding: theme.spacing.xs,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    minHeight: 44,
  },
  dropdownOptionSelected: {
    backgroundColor: theme.colors.trustBlue + '10',
  },
  dropdownOptionText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    flex: 1,
  },
  dropdownOptionTextSelected: {
    color: theme.colors.trustBlue,
    fontWeight: '600',
  },
  resultsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  resultsText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
  activeFiltersBadge: {
    backgroundColor: theme.colors.trustBlue,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  activeFiltersBadgeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.background,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    fontWeight: '600',
  },
  modalDescription: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
});
