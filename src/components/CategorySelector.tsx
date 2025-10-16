import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Tag, Plus, X, Check } from 'phosphor-react-native';

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

interface CategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  categories?: Category[];
  onCreateCategory?: (name: string) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#FF6B6B' },
  { id: '2', name: 'Transportation', color: '#4ECDC4' },
  { id: '3', name: 'Shopping', color: '#45B7D1' },
  { id: '4', name: 'Entertainment', color: '#96CEB4' },
  { id: '5', name: 'Bills & Utilities', color: '#FFEAA7' },
  { id: '6', name: 'Healthcare', color: '#DDA0DD' },
  { id: '7', name: 'Education', color: '#98D8C8' },
  { id: '8', name: 'Travel', color: '#F7DC6F' },
  { id: '9', name: 'Groceries', color: '#BB8FCE' },
  { id: '10', name: 'Other', color: '#85C1E9' },
];

export default function CategorySelector({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = "Select category",
  disabled = false,
  error,
  categories = DEFAULT_CATEGORIES,
  onCreateCategory,
}: CategorySelectorProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (searchText.trim()) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchText, categories]);

  const handlePress = () => {
    if (disabled) return;
    setIsOpen(true);
    setSearchText('');
    onFocus?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchText('');
    setIsCreating(false);
    setNewCategoryName('');
    onBlur?.();
  };

  const handleCategorySelect = (category: Category) => {
    onChange(category.name);
    handleClose();
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim() && onCreateCategory) {
      onCreateCategory(newCategoryName.trim());
      onChange(newCategoryName.trim());
      handleClose();
    }
  };

  const selectedCategory = categories.find(cat => cat.name === value);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.inputContainer, error && styles.errorContainer]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Tag size={20} color={theme.colors.textMuted} weight="regular" />
        <View style={styles.inputContent}>
          {selectedCategory ? (
            <View style={styles.selectedCategory}>
              <View style={[styles.categoryColor, { backgroundColor: selectedCategory.color }]} />
              <Text style={styles.selectedText}>{selectedCategory.name}</Text>
            </View>
          ) : (
            <Text style={[styles.inputText, styles.placeholderText]}>
              {placeholder}
            </Text>
          )}
        </View>
        <Plus size={16} color={theme.colors.textMuted} weight="regular" />
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={24} color={theme.colors.text} weight="regular" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search categories..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor={theme.colors.textLight}
              />
            </View>

            <ScrollView style={styles.categoriesList} showsVerticalScrollIndicator={false}>
              {filteredCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory?.id === category.id && styles.selectedCategoryItem
                  ]}
                  onPress={() => handleCategorySelect(category)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                    <Text style={[
                      styles.categoryName,
                      selectedCategory?.id === category.id && styles.selectedCategoryName
                    ]}>
                      {category.name}
                    </Text>
                  </View>
                  {selectedCategory?.id === category.id && (
                    <Check size={20} color={theme.colors.trustBlue} weight="bold" />
                  )}
                </TouchableOpacity>
              ))}

              {searchText.trim() && !filteredCategories.length && (
                <TouchableOpacity
                  style={styles.createCategoryButton}
                  onPress={() => setIsCreating(true)}
                  activeOpacity={0.7}
                >
                  <Plus size={20} color={theme.colors.trustBlue} weight="regular" />
                  <Text style={styles.createCategoryText}>
                    Create "{searchText}"
                  </Text>
                </TouchableOpacity>
              )}

              {isCreating && (
                <View style={styles.createCategoryForm}>
                  <Text style={styles.createCategoryLabel}>Create New Category</Text>
                  <TextInput
                    style={styles.createCategoryInput}
                    placeholder="Category name"
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    placeholderTextColor={theme.colors.textLight}
                    autoFocus
                  />
                  <View style={styles.createCategoryActions}>
                    <TouchableOpacity
                      style={styles.cancelCreateButton}
                      onPress={() => setIsCreating(false)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cancelCreateText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.confirmCreateButton, !newCategoryName.trim() && styles.disabledButton]}
                      onPress={handleCreateCategory}
                      disabled={!newCategoryName.trim()}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.confirmCreateText}>Create</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 2,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 56,
    },
    errorContainer: {
      borderColor: theme.colors.alertRed,
    },
    inputContent: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    selectedCategory: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: theme.spacing.sm,
    },
    selectedText: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
    },
    inputText: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
    },
    placeholderText: {
      color: theme.colors.textLight,
    },
    errorText: {
      ...theme.typography.bodySmall,
      color: theme.colors.alertRed,
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.sm,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      paddingTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      maxHeight: '70%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    modalTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '600',
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    searchContainer: {
      marginBottom: theme.spacing.lg,
    },
    searchInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
    },
    categoriesList: {
      maxHeight: 300,
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.xs,
    },
    selectedCategoryItem: {
      backgroundColor: theme.colors.trustBlue + '10',
    },
    categoryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    categoryName: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
    },
    selectedCategoryName: {
      color: theme.colors.trustBlue,
      fontWeight: '500',
    },
    createCategoryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.trustBlue + '10',
      marginTop: theme.spacing.sm,
    },
    createCategoryText: {
      ...theme.typography.bodyLarge,
      color: theme.colors.trustBlue,
      marginLeft: theme.spacing.sm,
      fontWeight: '500',
    },
    createCategoryForm: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.md,
    },
    createCategoryLabel: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.sm,
    },
    createCategoryInput: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    createCategoryActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    cancelCreateButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelCreateText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
    },
    confirmCreateButton: {
      flex: 1,
      backgroundColor: theme.colors.trustBlue,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
    },
    disabledButton: {
      backgroundColor: theme.colors.textLight,
    },
    confirmCreateText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.background,
      fontWeight: '500',
    },
  });
}
