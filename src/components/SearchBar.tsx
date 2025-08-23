import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MagnifyingGlass } from 'phosphor-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = "Search...",
  placeholderTextColor = Colors.textMuted 
}: SearchBarProps) {
  return (
    <View style={styles.searchBar}>
      <MagnifyingGlass weight="regular" size={20} color={Colors.textMuted} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    ...Typography.bodyMedium,
    color: Colors.text,
  },
});
