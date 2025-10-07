import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Trash, Wallet, Target, Plus, Minus } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useFirebase } from '../context/MockFirebaseContext';
import { useTranslation } from '../i18n';
import BaseBottomSheet from './BaseBottomSheet';
import Input from './Input';
import SegmentedControl from './SegmentedControl';
import ActionRow from './ActionRow';
import ActionButton from './ActionButton';

interface Pocket {
  id: string;
  name: string;
  description: string;
  currentBalance: number;
  type: 'standard' | 'goal';
  targetAmount?: number;
  color: string;
  transactionCount: number;
}

interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

interface PocketBottomSheetProps {
  visible: boolean;
  pocket: Pocket | null;
  onClose: () => void;
  onEdit: (pocket: Pocket) => void;
  onDelete: (id: string) => void;
  transactions?: Array<{
    id: string;
    title: string;
    subtitle: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
  }>;
}

export default function PocketBottomSheet({
  visible,
  pocket,
  onClose,
  onEdit,
  onDelete,
  transactions = [],
}: PocketBottomSheetProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { updatePocket, deletePocket } = useFirebase();
  const styles = getStyles(theme);
  const [editedPocket, setEditedPocket] = useState<Pocket | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showTransactionSheet, setShowTransactionSheet] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Use provided transactions or fallback to empty array
  const pocketTransactions = transactions.length > 0 ? transactions : [];

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible && pocket) {
      setEditedPocket({ ...pocket });
      setHasChanges(false);
      setEditingField(null);
    }
  }, [visible, pocket]);

  const handleFieldChange = (field: string, value: any) => {
    if (editedPocket) {
      const newPocket = { ...editedPocket, [field]: value };
      setEditedPocket(newPocket);
      
      // Check if there are changes compared to original
      const hasChangesNow = pocket ? 
        Object.keys(newPocket).some(key => newPocket[key as keyof Pocket] !== pocket[key as keyof Pocket]) :
        true;
      setHasChanges(hasChangesNow);
    }
  };

  const handleFieldEdit = (field: string) => {
    setEditingField(field);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleDelete = async () => {
    if (pocket) {
      try {
        await deletePocket(pocket.id);
        onDelete(pocket.id);
        onClose();
      } catch (error) {
        console.error('Failed to delete pocket:', error);
      }
    }
  };

  const handleSave = async () => {
    if (editedPocket && hasChanges) {
      try {
        await updatePocket(editedPocket.id, editedPocket);
        onEdit(editedPocket);
        setHasChanges(false);
      } catch (error) {
        console.error('Failed to update pocket:', error);
      }
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      // Show confirmation dialog for unsaved changes
      // For now, just close
    }
    if (pocket) {
      setEditedPocket({ ...pocket });
      setHasChanges(false);
    }
    onClose();
  };

  // Preview Field Component
  const PreviewField = ({ 
    label, 
    value, 
    field, 
    isEditing, 
    children 
  }: { 
    label: string; 
    value: string | number; 
    field: string; 
    isEditing: boolean; 
    children?: React.ReactNode; 
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity 
        style={[styles.fieldValue, isEditing && styles.editingField]}
        onPress={() => handleFieldEdit(field)}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${label.toLowerCase()}`}
      >
        {isEditing ? children : (
          <Text style={[styles.fieldText, !value && styles.placeholderText]}>
            {value || `Tap to add ${label.toLowerCase()}`}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const handleAddTransaction = () => {
    setShowTransactionSheet(true);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionSheet(true);
  };

  const handleRemoveTransaction = (transactionId: string) => {
    // In a real app, this would remove the transaction from the pocket
    console.log('Removing transaction:', transactionId);
  };

  const getTypeIcon = (type: string) => {
    return type === 'goal' ? <Target weight="light" size={20} color={theme.colors.labelGoal} /> : <Wallet weight="light" size={20} color={theme.colors.labelStandard} />;
  };

  const getTypeLabel = (type: string) => {
    return type === 'goal' ? 'Goal Oriented' : 'Standard';
  };

  if (!pocket) return null;

  return (
    <>
      <BaseBottomSheet
        visible={visible}
        onClose={onClose}
        title={editedPocket?.name ? `${editedPocket.name}` : 'Pocket Details'}
        headerRightIcon={<Trash size={24} color={theme.colors.alertRed} weight="light" />}
        onHeaderRightPress={handleDelete}
      actionButtons={[
        {
          title: 'Cancel',
          onPress: handleCancel,
          variant: 'secondary',
        },
        {
          title: 'Save Changes',
          onPress: handleSave,
          variant: 'primary',
        },
      ]}
      >
        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.previewContainer}>
            
            {/* Name */}
            <Input
              label="Name"
              value={editedPocket?.name || ''}
              onChangeText={(text) => handleFieldChange('name', text)}
              placeholder="Pocket name"
              type="text"
            />

            {/* Description */}
            <Input
              label="Description"
              value={editedPocket?.description || ''}
              onChangeText={(text) => handleFieldChange('description', text)}
              placeholder="Description"
              type="multiline"
            />

            {/* Type Selection */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Type</Text>
              <SegmentedControl
                options={[
                  {
                    value: 'standard',
                    label: 'Standard',
                    icon: <Wallet />
                  },
                  {
                    value: 'goal',
                    label: 'Goal Oriented',
                    icon: <Target />
                  }
                ]}
                selectedValue={editedPocket?.type || 'standard'}
                onValueChange={(value) => handleFieldChange('type', value)}
                size="small"
              />
            </View>

            {/* Current Balance */}
            <Input
              label="Current Balance"
              value={editedPocket?.currentBalance ? String(editedPocket.currentBalance) : ''}
              onChangeText={(text) => {
                const num = parseFloat(text) || 0;
                handleFieldChange('currentBalance', num);
              }}
              placeholder="0"
              type="number"
            />

            {/* Target Amount (only for goal type) */}
            {editedPocket?.type === 'goal' && (
              <Input
                label="Target Amount"
                value={editedPocket?.targetAmount ? String(editedPocket.targetAmount) : ''}
                onChangeText={(text) => {
                  const num = parseFloat(text) || 0;
                  handleFieldChange('targetAmount', num);
                }}
                placeholder="0"
                type="number"
              />
            )}

            {/* Linked Transactions */}
            <View style={styles.transactionsSection}>
              <View style={styles.transactionsHeader}>
                <Text style={styles.transactionsTitle}>Linked Transactions</Text>
                <ActionButton
                  title={t('common.add')}
                  onPress={handleAddTransaction}
                  variant="primary"
                  size="small"
                  icon={<Plus size={16} color={theme.colors.background} weight="light" />}
                  accessibilityLabel={t('common.add')}
                />
              </View>
              
              {pocketTransactions.length > 0 ? (
                pocketTransactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionContent}>
                      <View style={styles.transactionLeft}>
                        <Text style={styles.transactionTitle}>{transaction.title}</Text>
                        <Text style={styles.transactionSubtitle}>{transaction.subtitle}</Text>
                      </View>
                      <View style={styles.transactionRight}>
                        <Text style={[
                          styles.transactionAmount,
                          { color: transaction.amount > 0 ? theme.colors.goatGreen : theme.colors.alertRed }
                        ]}>
                          {transaction.amount > 0 ? '+' : ''}€{Math.abs(transaction.amount).toLocaleString()}
                        </Text>
                        <Text style={styles.transactionDate}>{transaction.date}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleRemoveTransaction(transaction.id)}
                      style={styles.removeTransactionButton}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="Remove transaction"
                    >
                      <Minus size={14} color={theme.colors.alertRed} weight="light" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View style={styles.emptyTransactions}>
                  <Text style={styles.emptyTransactionsText}>No transactions linked yet</Text>
                  <Text style={styles.emptyTransactionsSubtext}>Tap + Add to link a transaction</Text>
                </View>
              )}
            </View>

          </View>
        </ScrollView>
      </BaseBottomSheet>

    </>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
    },
    previewContainer: {
      gap: 0, // Remove gap since Input components handle their own spacing
    },
    fieldContainer: {
      marginBottom: theme.spacing.lg, // 24px spacing to match Input components
    },
    fieldLabel: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: 8, // 8px spacing between title and input
    },
    fieldValue: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    editingField: {
      borderColor: theme.colors.trustBlue,
      backgroundColor: theme.colors.background,
    },
    fieldText: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
    },
    placeholderText: {
      color: theme.colors.textMuted,
    },
    fieldInput: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 0,
      margin: 0,
    },
    multilineInput: {
      minHeight: 60,
      textAlignVertical: 'top',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.screenPadding,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      alignItems: 'center',
    },
    cancelButtonText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      fontWeight: '600',
    },
    saveButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.screenPadding,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.trustBlue,
      alignItems: 'center',
    },
    saveButtonText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.background,
      fontWeight: '600',
    },
    disabledButton: {
      backgroundColor: theme.colors.border,
    },
    disabledButtonText: {
      color: theme.colors.textMuted,
    },
    transactionsSection: {
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
    },
    transactionsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    transactionsTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
    },
    addTransactionButton: {
      backgroundColor: theme.colors.trustBlue,
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    addTransactionButtonText: {
      ...theme.typography.caption,
      color: theme.colors.background,
      fontWeight: '600',
    },
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight + '30',
    },
    transactionContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    transactionLeft: {
      flex: 1,
    },
    transactionTitle: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      marginBottom: 2,
    },
    transactionSubtitle: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },
    transactionRight: {
      alignItems: 'flex-end',
    },
    transactionAmount: {
      ...theme.typography.bodyMedium,
      fontWeight: '600',
      marginBottom: 2,
    },
    transactionDate: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },
    removeTransactionButton: {
      backgroundColor: theme.colors.alertRed + '15',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      marginLeft: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTransactions: {
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
    },
    emptyTransactionsText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.xs,
    },
    emptyTransactionsSubtext: {
      ...theme.typography.caption,
      color: theme.colors.textLight,
    },
  });
}
