import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Funnel, Calendar, SortAscending, Link, LinkBreak, List } from 'phosphor-react-native';
import BaseBottomSheet from './BaseBottomSheet';
import SegmentedControl from './SegmentedControl';
import PillSegmentedControl from './PillSegmentedControl';
import SelectionInput from './SelectionInput';
import SelectionOption from './SelectionOption';
import RadioSelectionOption from './RadioSelectionOption';

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
      actionButtons={[
        {
          title: 'Clear All',
          variant: 'secondary',
          onPress: handleReset,
        },
        {
          title: 'Apply Filters',
          variant: 'primary',
          onPress: handleApplyFilters,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Sort By */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Sort By</Text>
          <PillSegmentedControl
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
        <SelectionInput
          label="Sort Order"
          description=""
          value={selectedFilters.sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          icon={<SortAscending />}
          onPress={() => {
            // Toggle between desc and asc
            const newOrder = selectedFilters.sortOrder === 'desc' ? 'asc' : 'desc';
            setSelectedFilters((prev: any) => ({ ...prev, sortOrder: newOrder }));
          }}
        />

        {/* Date Range */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Date Range</Text>
          <RadioSelectionOption
            title="All Time"
            subtitle="Show all transactions"
            icon={<Calendar />}
            selected={selectedFilters.dateRange === 'all'}
            onPress={() => setSelectedFilters((prev: any) => ({ ...prev, dateRange: 'all' }))}
          />
          <RadioSelectionOption
            title="This Week"
            subtitle="Last 7 days"
            icon={<Calendar />}
            selected={selectedFilters.dateRange === 'week'}
            onPress={() => setSelectedFilters((prev: any) => ({ ...prev, dateRange: 'week' }))}
          />
          <RadioSelectionOption
            title="This Month"
            subtitle="Last 30 days"
            icon={<Calendar />}
            selected={selectedFilters.dateRange === 'month'}
            onPress={() => setSelectedFilters((prev: any) => ({ ...prev, dateRange: 'month' }))}
          />
          <RadioSelectionOption
            title="This Quarter"
            subtitle="Last 90 days"
            icon={<Calendar />}
            selected={selectedFilters.dateRange === 'quarter'}
            onPress={() => setSelectedFilters((prev: any) => ({ ...prev, dateRange: 'quarter' }))}
          />
          <RadioSelectionOption
            title="This Year"
            subtitle="Last 365 days"
            icon={<Calendar />}
            selected={selectedFilters.dateRange === 'year'}
            onPress={() => setSelectedFilters((prev: any) => ({ ...prev, dateRange: 'year' }))}
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
          <RadioSelectionOption
            title="All Transactions"
            subtitle="Show all transactions regardless of pocket linking"
            icon={<List size={20} weight="light" />}
            selected={selectedFilters.pocket === 'all'}
            onPress={() => setSelectedFilters((prev: any) => ({ ...prev, pocket: 'all' }))}
          />
          <RadioSelectionOption
            title="Linked to Pockets"
            subtitle="Only transactions linked to specific pockets"
            icon={<Link size={20} weight="light" />}
            selected={selectedFilters.pocket === 'linked'}
            onPress={() => setSelectedFilters((prev: any) => ({ ...prev, pocket: 'linked' }))}
          />
          <RadioSelectionOption
            title="Not Linked"
            subtitle="Only transactions not linked to any pocket"
            icon={<LinkBreak size={20} weight="light" />}
            selected={selectedFilters.pocket === 'unlinked'}
            onPress={() => setSelectedFilters((prev: any) => ({ ...prev, pocket: 'unlinked' }))}
          />
        </View>
      </View>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    content: {
      paddingVertical: 0,
    },
    filterSection: {
      marginBottom: theme.spacing.xl, // 32px spacing between sections
    },
    filterLabel: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: 8, // 8px spacing between title and input
    },
  });
}
