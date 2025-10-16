import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Tag, Plus, X, Check } from 'phosphor-react-native';
import LabelPill from './LabelPill';

interface TagManagerProps {
  value: string[];
  onChange: (tags: string[]) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  availableTags?: string[];
}

const DEFAULT_TAGS = [
  'recurring',
  'business',
  'personal',
  'urgent',
  'tax-deductible',
  'subscription',
  'one-time',
  'refund',
  'transfer',
  'cashback',
];

export default function TagManager({
  value = [],
  onChange,
  onFocus,
  onBlur,
  placeholder = "Add tags",
  disabled = false,
  error,
  availableTags = DEFAULT_TAGS,
}: TagManagerProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredTags, setFilteredTags] = useState(availableTags);
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    if (searchText.trim()) {
      const filtered = availableTags.filter(tag =>
        tag.toLowerCase().includes(searchText.toLowerCase()) &&
        !value.includes(tag)
      );
      setFilteredTags(filtered);
    } else {
      const filtered = availableTags.filter(tag => !value.includes(tag));
      setFilteredTags(filtered);
    }
  }, [searchText, availableTags, value]);

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
    setNewTagName('');
    onBlur?.();
  };

  const handleTagAdd = (tag: string) => {
    if (!value.includes(tag)) {
      onChange([...value, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    onChange(value.filter(t => t !== tag));
  };

  const handleCreateTag = () => {
    if (newTagName.trim() && !value.includes(newTagName.trim())) {
      onChange([...value, newTagName.trim()]);
      handleClose();
    }
  };

  const getTagColor = (tag: string) => {
    const colors = [
      theme.colors.goatGreen,
      theme.colors.trustBlue,
      theme.colors.alertRed,
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
    ];
    const index = tag.length % colors.length;
    return colors[index];
  };

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
          {value.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.tagsScrollView}
            >
              <View style={styles.tagsContainer}>
                {value.map((tag, index) => (
                  <LabelPill
                    key={index}
                    text={tag}
                    backgroundColor={getTagColor(tag) + '20'}
                    textColor={getTagColor(tag)}
                    icon={<X size={12} weight="regular" />}
                    onPress={() => handleTagRemove(tag)}
                  />
                ))}
              </View>
            </ScrollView>
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
              <Text style={styles.modalTitle}>Manage Tags</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={24} color={theme.colors.text} weight="regular" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search tags..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor={theme.colors.textLight}
              />
            </View>

            <ScrollView style={styles.tagsList} showsVerticalScrollIndicator={false}>
              {value.length > 0 && (
                <View style={styles.currentTagsSection}>
                  <Text style={styles.sectionTitle}>Current Tags</Text>
                  <View style={styles.currentTagsContainer}>
                    {value.map((tag, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.currentTagItem}
                        onPress={() => handleTagRemove(tag)}
                        activeOpacity={0.7}
                      >
                        <LabelPill
                          text={tag}
                          backgroundColor={getTagColor(tag) + '20'}
                          textColor={getTagColor(tag)}
                          icon={<X size={12} weight="regular" />}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {filteredTags.length > 0 && (
                <View style={styles.availableTagsSection}>
                  <Text style={styles.sectionTitle}>Available Tags</Text>
                  <View style={styles.availableTagsContainer}>
                    {filteredTags.map((tag, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.availableTagItem}
                        onPress={() => handleTagAdd(tag)}
                        activeOpacity={0.7}
                      >
                        <LabelPill
                          text={tag}
                          backgroundColor={theme.colors.surface}
                          textColor={theme.colors.text}
                          icon={<Plus size={12} weight="regular" />}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {searchText.trim() && !filteredTags.length && !value.includes(searchText.trim()) && (
                <TouchableOpacity
                  style={styles.createTagButton}
                  onPress={() => setIsCreating(true)}
                  activeOpacity={0.7}
                >
                  <Plus size={20} color={theme.colors.trustBlue} weight="regular" />
                  <Text style={styles.createTagText}>
                    Create "{searchText}"
                  </Text>
                </TouchableOpacity>
              )}

              {isCreating && (
                <View style={styles.createTagForm}>
                  <Text style={styles.createTagLabel}>Create New Tag</Text>
                  <TextInput
                    style={styles.createTagInput}
                    placeholder="Tag name"
                    value={newTagName}
                    onChangeText={setNewTagName}
                    placeholderTextColor={theme.colors.textLight}
                    autoFocus
                  />
                  <View style={styles.createTagActions}>
                    <TouchableOpacity
                      style={styles.cancelCreateButton}
                      onPress={() => setIsCreating(false)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cancelCreateText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.confirmCreateButton, !newTagName.trim() && styles.disabledButton]}
                      onPress={handleCreateTag}
                      disabled={!newTagName.trim()}
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
    tagsScrollView: {
      flex: 1,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
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
    tagsList: {
      maxHeight: 300,
    },
    currentTagsSection: {
      marginBottom: theme.spacing.lg,
    },
    availableTagsSection: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.md,
      fontWeight: '500',
    },
    currentTagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    availableTagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    currentTagItem: {
      // Styles handled by LabelPill
    },
    availableTagItem: {
      // Styles handled by LabelPill
    },
    createTagButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.trustBlue + '10',
      marginTop: theme.spacing.sm,
    },
    createTagText: {
      ...theme.typography.bodyLarge,
      color: theme.colors.trustBlue,
      marginLeft: theme.spacing.sm,
      fontWeight: '500',
    },
    createTagForm: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.md,
    },
    createTagLabel: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.sm,
    },
    createTagInput: {
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
    createTagActions: {
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
