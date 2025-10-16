import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Wallet, Link, LinkBreak, Search, X, Check } from 'phosphor-react-native';

interface Pocket {
  id: string;
  name: string;
  currentBalance: number;
  targetAmount?: number;
  color: string;
  type: 'standard' | 'goal';
}

interface PocketSelectorProps {
  value: string | null;
  onChange: (pocketId: string | null) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  pockets?: Pocket[];
}

export default function PocketSelector({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = "Select pocket",
  disabled = false,
  error,
  pockets = [],
}: PocketSelectorProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredPockets, setFilteredPockets] = useState(pockets);

  useEffect(() => {
    if (searchText.trim()) {
      const filtered = pockets.filter(pocket =>
        pocket.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPockets(filtered);
    } else {
      setFilteredPockets(pockets);
    }
  }, [searchText, pockets]);

  const handlePress = () => {
    if (disabled) return;
    setIsOpen(true);
    setSearchText('');
    onFocus?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchText('');
    onBlur?.();
  };

  const handlePocketSelect = (pocket: Pocket) => {
    onChange(pocket.id);
    handleClose();
  };

  const handleUnlink = () => {
    onChange(null);
    handleClose();
  };

  const selectedPocket = pockets.find(pocket => pocket.id === value);

  const formatAmount = (amount: number) => {
    return `€${Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getProgressPercentage = (pocket: Pocket) => {
    if (!pocket.targetAmount || pocket.targetAmount === 0) return 0;
    return Math.min((pocket.currentBalance / pocket.targetAmount) * 100, 100);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.inputContainer, error && styles.errorContainer]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Wallet size={20} color={theme.colors.textMuted} weight="regular" />
        <View style={styles.inputContent}>
          {selectedPocket ? (
            <View style={styles.selectedPocket}>
              <View style={[styles.pocketColor, { backgroundColor: selectedPocket.color }]} />
              <View style={styles.pocketInfo}>
                <Text style={styles.pocketName}>{selectedPocket.name}</Text>
                <Text style={styles.pocketBalance}>
                  {formatAmount(selectedPocket.currentBalance)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.inputText, styles.placeholderText]}>
              {placeholder}
            </Text>
          )}
        </View>
        {selectedPocket ? (
          <Link size={16} color={theme.colors.trustBlue} weight="regular" />
        ) : (
          <LinkBreak size={16} color={theme.colors.textMuted} weight="regular" />
        )}
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
              <Text style={styles.modalTitle}>Select Pocket</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={24} color={theme.colors.text} weight="regular" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color={theme.colors.textMuted} weight="regular" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search pockets..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor={theme.colors.textLight}
              />
            </View>

            <ScrollView style={styles.pocketsList} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.pocketItem,
                  !value && styles.selectedPocketItem
                ]}
                onPress={handleUnlink}
                activeOpacity={0.7}
              >
                <View style={styles.pocketInfo}>
                  <LinkBreak size={20} color={theme.colors.textMuted} weight="regular" />
                  <View style={styles.pocketDetails}>
                    <Text style={[
                      styles.pocketName,
                      !value && styles.selectedPocketName
                    ]}>
                      Unlinked
                    </Text>
                    <Text style={styles.pocketDescription}>
                      Not linked to any pocket
                    </Text>
                  </View>
                </View>
                {!value && (
                  <Check size={20} color={theme.colors.trustBlue} weight="bold" />
                )}
              </TouchableOpacity>

              {filteredPockets.map((pocket) => (
                <TouchableOpacity
                  key={pocket.id}
                  style={[
                    styles.pocketItem,
                    selectedPocket?.id === pocket.id && styles.selectedPocketItem
                  ]}
                  onPress={() => handlePocketSelect(pocket)}
                  activeOpacity={0.7}
                >
                  <View style={styles.pocketInfo}>
                    <View style={[styles.pocketColor, { backgroundColor: pocket.color }]} />
                    <View style={styles.pocketDetails}>
                      <Text style={[
                        styles.pocketName,
                        selectedPocket?.id === pocket.id && styles.selectedPocketName
                      ]}>
                        {pocket.name}
                      </Text>
                      <View style={styles.pocketStats}>
                        <Text style={styles.pocketBalance}>
                          {formatAmount(pocket.currentBalance)}
                        </Text>
                        {pocket.type === 'goal' && pocket.targetAmount && (
                          <Text style={styles.pocketTarget}>
                            of {formatAmount(pocket.targetAmount)}
                          </Text>
                        )}
                      </View>
                      {pocket.type === 'goal' && pocket.targetAmount && (
                        <View style={styles.progressContainer}>
                          <View style={styles.progressBar}>
                            <View 
                              style={[
                                styles.progressFill, 
                                { 
                                  width: `${getProgressPercentage(pocket)}%`,
                                  backgroundColor: pocket.color
                                }
                              ]} 
                            />
                          </View>
                          <Text style={styles.progressText}>
                            {Math.round(getProgressPercentage(pocket))}%
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  {selectedPocket?.id === pocket.id && (
                    <Check size={20} color={theme.colors.trustBlue} weight="bold" />
                  )}
                </TouchableOpacity>
              ))}

              {filteredPockets.length === 0 && searchText.trim() && (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>No pockets found</Text>
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
    selectedPocket: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pocketColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: theme.spacing.sm,
    },
    pocketInfo: {
      flex: 1,
    },
    pocketName: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
      fontWeight: '500',
    },
    pocketBalance: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
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
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    searchInput: {
      flex: 1,
      marginLeft: theme.spacing.sm,
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
    },
    pocketsList: {
      maxHeight: 300,
    },
    pocketItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.xs,
    },
    selectedPocketItem: {
      backgroundColor: theme.colors.trustBlue + '10',
    },
    pocketDetails: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    pocketStats: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    pocketTarget: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
      marginLeft: theme.spacing.xs,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    progressBar: {
      flex: 1,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      marginRight: theme.spacing.sm,
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },
    progressText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
      fontWeight: '500',
    },
    selectedPocketName: {
      color: theme.colors.trustBlue,
    },
    noResults: {
      paddingVertical: theme.spacing.xl,
      alignItems: 'center',
    },
    noResultsText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
    },
  });
}
