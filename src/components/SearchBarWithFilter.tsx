import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MagnifyingGlass, Funnel, X } from 'phosphor-react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface SearchBarWithFilterProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onFilterPress: () => void;
  placeholder?: string;
}

export default function SearchBarWithFilter({
  searchQuery,
  onSearchChange,
  onFilterPress,
  placeholder = "Search...",
}: SearchBarWithFilterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <MagnifyingGlass 
          weight="light" 
          size={20} 
          color={Colors.textMuted} 
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <X size={16} color={Colors.textMuted} weight="light" />
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        onPress={onFilterPress}
        style={styles.filterButton}
        activeOpacity={0.7}
      >
        <View style={styles.filterIconContainer}>
          <Funnel weight="light" size={20} color={Colors.trustBlue} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.md,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xl,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyRegular,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
  clearButton: {
    padding: Spacing.xs,
    marginRight: Spacing.xs,
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  filterIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
