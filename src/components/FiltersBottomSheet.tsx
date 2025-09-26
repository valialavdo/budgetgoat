import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Funnel, Calendar, SortAscending } from 'phosphor-react-native';
import BaseBottomSheet from './BaseBottomSheet';
import SegmentedControl from './SegmentedControl';
import SelectionInput from './SelectionInput';
import SelectionList from './SelectionList';

interface FiltersBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export default function FiltersBottomSheet({ 
  visible, 
  onClose, 
  filters,
  onFiltersChange
}: FiltersBottomSheetProps) {
  const theme = useTheme();
  const [selectedFilters, setSelectedFilters] = useState(filters);
  const styles = getStyles(theme);

  const handleApplyFilters = () => {
    onFiltersChange(selectedFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      sortBy: 'date',
      sortOrder: 'desc',
      dateRange: 'all',
      type: 'all',
      pocket: 'all',
    };
    setSelectedFilters(resetFilters);
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Filters"
      showActionButtons={true}
      actionButtonText="Apply Filters"
      onActionButtonPress={handleApplyFilters}
      cancelButtonText="Reset"
      onCancelButtonPress={handleReset}
    >
      <View style={styles.content}>
        {/* Sort By */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Sort By</Text>
          <SegmentedControl
            options={[
              { value: 'date', label: 'Date', icon: <Calendar /> },
              { value: 'amount', label: 'Amount', icon: <SortAscending /> },
              { value: 'title', label: 'Title', icon: <Funnel /> }
            ]}
            selectedValue={selectedFilters.sortBy}
            onValueChange={(value) => setSelectedFilters((prev: any) => ({ ...prev, sortBy: value }))}
          />
        </View>

        {/* Sort Order */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Order</Text>
          <SegmentedControl
            options={[
              { value: 'desc', label: 'Newest First' },
              { value: 'asc', label: 'Oldest First' }
            ]}
            selectedValue={selectedFilters.sortOrder}
            onValueChange={(value) => setSelectedFilters((prev: any) => ({ ...prev, sortOrder: value }))}
          />
        </View>

        {/* Date Range */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Date Range</Text>
          <SelectionList
            options={[
              { value: 'all', label: 'All Time', description: 'Export all your data' },
              { value: 'last30', label: 'Last 30 Days', description: 'Recent month data' },
              { value: 'last90', label: 'Last 90 Days', description: 'Recent quarter data' },
              { value: 'lastYear', label: 'Last Year', description: 'Past year data' }
            ]}
            selectedValue={selectedFilters.dateRange}
            onSelectionChange={(value) => setSelectedFilters((prev: any) => ({ ...prev, dateRange: value }))}
          />
        </View>

        {/* Transaction Type */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Type</Text>
          <SegmentedControl
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expenses' }
            ]}
            selectedValue={selectedFilters.type}
            onValueChange={(value) => setSelectedFilters((prev: any) => ({ ...prev, type: value }))}
          />
        </View>

        {/* Pocket Status */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Pocket Status</Text>
          <SegmentedControl
            options={[
              { value: 'all', label: 'All Transactions' },
              { value: 'linked', label: 'Linked to Pockets' },
              { value: 'unlinked', label: 'Not Linked' }
            ]}
            selectedValue={selectedFilters.pocket}
            onValueChange={(value) => setSelectedFilters((prev: any) => ({ ...prev, pocket: value }))}
          />
        </View>
      </View>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    filterSection: {
      marginBottom: theme.spacing.lg,
    },
    filterLabel: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
  });
}
