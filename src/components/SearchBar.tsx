import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { MagnifyingGlass, X } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import IconButton from './IconButton';

export interface SearchBarProps {
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;
  
  /**
   * Current search value
   */
  value: string;
  
  /**
   * Callback when search value changes
   */
  onChangeText: (text: string) => void;
  
  /**
   * Whether the search bar is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom styles for the container
   */
  style?: ViewStyle;
  
  /**
   * Whether to show the clear button
   * @default true
   */
  showClearButton?: boolean;
  
  /**
   * Whether to auto-focus the input
   * @default false
   */
  autoFocus?: boolean;
  
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
  
  /**
   * Accessibility hint for screen readers
   */
  accessibilityHint?: string;
}

/**
 * Reusable SearchBar component for consistent search functionality
 * 
 * Features:
 * - Consistent styling and spacing
 * - Clear button functionality
 * - Theme integration
 * - Accessibility support
 * - Microinteractions
 * 
 * Usage:
 * ```tsx
 * <SearchBar
 *   placeholder="Search transactions..."
 *   value={searchQuery}
 *   onChangeText={setSearchQuery}
 *   showClearButton={true}
 * />
 * ```
 */
export default function SearchBar({
  placeholder = 'Search...',
  value,
  onChangeText,
  disabled = false,
  style,
  showClearButton = true,
  autoFocus = false,
  accessibilityLabel = 'Search',
  accessibilityHint,
}: SearchBarProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  const styles = getStyles(theme, isFocused, disabled);
  
  const handleClear = () => {
    onChangeText('');
  };
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchIcon}>
        <MagnifyingGlass 
          size={20} 
          color={isFocused ? theme.colors.trustBlue : theme.colors.textMuted} 
          weight="light" 
        />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        autoFocus={autoFocus}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessible={true}
        accessibilityRole="search"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
      />
      
      {showClearButton && value.length > 0 && (
        <IconButton
          icon={<X size={20} color={theme.colors.textMuted} weight="light" />}
          onPress={handleClear}
          variant="ghost"
          size="small"
          accessibilityLabel="Clear search"
          accessibilityHint="Clears the search input"
        />
      )}
    </View>
  );
}

function getStyles(theme: any, isFocused: boolean, disabled: boolean) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: isFocused ? theme.colors.trustBlue : theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      opacity: disabled ? 0.6 : 1,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    input: {
      ...theme.typography.bodyMedium,
      flex: 1,
      color: theme.colors.text,
      paddingVertical: 0,
      fontSize: 16, // Prevent zoom on iOS
    },
  });
}