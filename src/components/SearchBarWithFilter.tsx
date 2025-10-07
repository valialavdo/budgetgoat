import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MagnifyingGlass, Funnel, X } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';

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
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <MagnifyingGlass 
          weight="light" 
          size={20} 
          color={theme.colors.textMuted} 
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <X size={16} color={theme.colors.textMuted} weight="light" />
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        onPress={onFilterPress}
        style={styles.filterButton}
        activeOpacity={0.7}
      >
        <View style={styles.filterIconContainer}>
          <Funnel weight="light" size={20} color={theme.colors.trustBlue} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.screenPadding,
      marginBottom: theme.spacing.md,
      gap: 8,
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.xl,
    },
    searchInput: {
      flex: 1,
      ...theme.typography.bodyRegular,
      color: theme.colors.textMuted,
      marginLeft: theme.spacing.sm,
    },
    clearButton: {
      padding: theme.spacing.xs,
      marginRight: theme.spacing.xs,
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
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}
