import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import BaseBottomSheet from './BaseBottomSheet';
import LabelPill from './LabelPill';
import Input from './Input';
import { format } from 'date-fns';
import { ArrowUp, ArrowDown, Link, LinkBreak, Repeat, PencilSimple, Trash, Check, X } from 'phosphor-react-native';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  isRecurring?: boolean;
  pocketInfo?: {
    isLinked: boolean;
    pocketName?: string;
  };
  description?: string;
  category?: string;
}

interface TransactionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
}

export default function TransactionBottomSheet({
  visible,
  onClose,
  transaction,
  onEdit,
  onDelete,
}: TransactionBottomSheetProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [editedTransaction, setEditedTransaction] = useState<Transaction | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible && transaction) {
      setEditedTransaction({ ...transaction });
      setHasChanges(false);
      setEditingField(null);
    }
  }, [visible, transaction]);

  const handleFieldChange = (field: string, value: any) => {
    if (editedTransaction) {
      const newTransaction = { ...editedTransaction, [field]: value };
      setEditedTransaction(newTransaction);
      
      // Check if there are changes compared to original
      const hasChangesNow = transaction ? 
        Object.keys(newTransaction).some(key => newTransaction[key as keyof Transaction] !== transaction[key as keyof Transaction]) :
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

  const handleEdit = () => {
    // This function is called when the edit button is pressed
    console.log('Edit transaction:', editedTransaction);
    if (onEdit && editedTransaction) {
      onEdit(editedTransaction);
    }
  };

  const handleSave = async () => {
    if (editedTransaction && hasChanges) {
      try {
        // In a real app, this would update the transaction in the database
        console.log('Saving transaction:', editedTransaction);
        if (onEdit) {
          onEdit(editedTransaction);
        }
        setHasChanges(false);
      } catch (error) {
        console.error('Failed to update transaction:', error);
      }
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      // Show confirmation dialog for unsaved changes
      // For now, just close
    }
    if (transaction) {
      setEditedTransaction({ ...transaction });
      setHasChanges(false);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (transaction && onDelete) {
      try {
        await onDelete(transaction.id);
        onClose();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
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
      {isEditing ? (
        <View style={[styles.fieldValue, styles.editingField]}>
          {children}
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.fieldValue}
          onPress={() => handleFieldEdit(field)}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${label.toLowerCase()}`}
        >
          <Text style={[styles.fieldText, !value && styles.placeholderText]}>
            {value || `Tap to add ${label.toLowerCase()}`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (!transaction || !editedTransaction) return null;

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${type === 'expense' ? '-' : '+'}€${formatted}`;
  };

  const getAmountColor = (type: 'income' | 'expense') => {
    return type === 'income' ? theme.colors.goatGreen : theme.colors.alertRed;
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Transaction Details"
      headerRightIcon={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {hasChanges ? (
            <>
              <TouchableOpacity onPress={handleSave} style={{ padding: 4 }}>
                <Check size={24} color={theme.colors.goatGreen} weight="light" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={{ padding: 4 }}>
                <X size={24} color={theme.colors.textMuted} weight="light" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={handleEdit} style={{ padding: 4 }}>
                <PencilSimple size={24} color={theme.colors.text} weight="light" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={{ padding: 4 }}>
                <Trash size={24} color={theme.colors.alertRed} weight="light" />
              </TouchableOpacity>
            </>
          )}
        </View>
      }
      onHeaderRightPress={undefined}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Transaction Header */}
        <View style={styles.transactionHeader}>
          <PreviewField
            label="Transaction Name"
            value={editedTransaction.title}
            field="title"
            isEditing={editingField === 'title'}
          >
            <Input
              label=""
              value={editedTransaction.title}
              onChangeText={(text) => handleFieldChange('title', text)}
              onFocus={() => handleFieldEdit('title')}
              onBlur={handleFieldBlur}
              placeholder="Enter transaction name"
              style={{ marginBottom: 0 }}
              autoFocus={true}
            />
          </PreviewField>
          
          <PreviewField
            label="Amount"
            value={formatAmount(editedTransaction.amount, editedTransaction.type)}
            field="amount"
            isEditing={editingField === 'amount'}
          >
            <View style={styles.amountEditContainer}>
              <Input
                label=""
                value={Math.abs(editedTransaction.amount).toString()}
                onChangeText={(text) => {
                  const numValue = parseFloat(text) || 0;
                  handleFieldChange('amount', editedTransaction.type === 'expense' ? -numValue : numValue);
                }}
                onFocus={() => handleFieldEdit('amount')}
                onBlur={handleFieldBlur}
                placeholder="0.00"
                type="number"
                style={{ marginBottom: 0, flex: 1 }}
              />
              <TouchableOpacity
                style={styles.typeToggle}
                onPress={() => {
                  const newType = editedTransaction.type === 'income' ? 'expense' : 'income';
                  const newAmount = editedTransaction.type === 'income' ? -Math.abs(editedTransaction.amount) : Math.abs(editedTransaction.amount);
                  handleFieldChange('type', newType);
                  handleFieldChange('amount', newAmount);
                }}
              >
                <Text style={[styles.typeToggleText, { color: getAmountColor(editedTransaction.type) }]}>
                  {editedTransaction.type === 'income' ? 'Income' : 'Expense'}
                </Text>
              </TouchableOpacity>
            </View>
          </PreviewField>
        </View>

        {/* Transaction Info */}
        <View style={styles.infoSection}>
          <PreviewField
            label="Date"
            value={format(new Date(editedTransaction.date), 'MMMM dd, yyyy')}
            field="date"
            isEditing={editingField === 'date'}
          >
            <Input
              label=""
              value={format(new Date(editedTransaction.date), 'yyyy-MM-dd')}
              onChangeText={(text) => handleFieldChange('date', text)}
              onFocus={() => handleFieldEdit('date')}
              onBlur={handleFieldBlur}
              placeholder="YYYY-MM-DD"
              style={{ marginBottom: 0 }}
            />
          </PreviewField>

          <PreviewField
            label="Description"
            value={editedTransaction.description || ''}
            field="description"
            isEditing={editingField === 'description'}
          >
            <Input
              label=""
              value={editedTransaction.description || ''}
              onChangeText={(text) => handleFieldChange('description', text)}
              onFocus={() => handleFieldEdit('description')}
              onBlur={handleFieldBlur}
              placeholder="Enter description"
              type="multiline"
              numberOfLines={2}
              style={{ marginBottom: 0 }}
            />
          </PreviewField>

          <PreviewField
            label="Category"
            value={editedTransaction.category || ''}
            field="category"
            isEditing={editingField === 'category'}
          >
            <Input
              label=""
              value={editedTransaction.category || ''}
              onChangeText={(text) => handleFieldChange('category', text)}
              onFocus={() => handleFieldEdit('category')}
              onBlur={handleFieldBlur}
              placeholder="Enter category"
              style={{ marginBottom: 0 }}
            />
          </PreviewField>
        </View>

        {/* Transaction Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {editedTransaction.isRecurring && (
              <LabelPill
                text="Recurring"
                backgroundColor={theme.colors.labelRecurring}
                textColor={theme.colors.text}
                icon={<Repeat size={12} weight="regular" />}
              />
            )}
            {editedTransaction.pocketInfo && (
              <LabelPill
                text={
                  editedTransaction.pocketInfo.isLinked
                    ? editedTransaction.pocketInfo.pocketName || 'Linked'
                    : 'Unlinked'
                }
                backgroundColor={editedTransaction.pocketInfo.isLinked ? '#E0F2FE' : '#FEF2F2'}
                textColor={editedTransaction.pocketInfo.isLinked ? '#0277BD' : '#DC2626'}
                icon={
                  editedTransaction.pocketInfo.isLinked ? (
                    <Link size={12} weight="regular" />
                  ) : (
                    <LinkBreak size={12} weight="regular" />
                  )
                }
              />
            )}
          </View>
        </View>

        {/* Pocket Information */}
        {editedTransaction.pocketInfo && (
          <View style={styles.pocketSection}>
            <Text style={styles.sectionTitle}>Pocket</Text>
            <View style={styles.pocketInfo}>
              {editedTransaction.pocketInfo.isLinked ? (
                <View style={styles.pocketLinked}>
                  <Link size={16} color={theme.colors.trustBlue} weight="light" />
                  <Text style={styles.pocketLinkedText}>
                    Linked to {editedTransaction.pocketInfo.pocketName || 'Unknown Pocket'}
                  </Text>
                </View>
              ) : (
                <View style={styles.pocketUnlinked}>
                  <LinkBreak size={16} color={theme.colors.textMuted} weight="light" />
                  <Text style={styles.pocketUnlinkedText}>Not linked to any pocket</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: theme.spacing.md,
    },
    transactionHeader: {
      marginBottom: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: '600',
    },
    amount: {
      ...theme.typography.h2,
      fontWeight: '600',
    },
    infoSection: {
      marginBottom: theme.spacing.lg,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    infoLabel: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
    },
    infoValue: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      fontWeight: '500',
    },
    tagsSection: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.md,
      fontWeight: '500',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    pocketSection: {
      marginBottom: theme.spacing.lg,
    },
    pocketInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pocketLinked: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    pocketLinkedText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.trustBlue,
      fontWeight: '500',
    },
    pocketUnlinked: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    pocketUnlinkedText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.alertRed,
      fontWeight: '500',
    },
    actionsSection: {
      marginTop: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
      paddingTop: theme.spacing.md,
    },
    actionButton: {
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.sm,
    },
    deleteButton: {
      backgroundColor: theme.colors.alertRed,
    },
    deleteButtonText: {
      ...theme.typography.button,
      color: theme.colors.background,
      fontWeight: '500',
    },
    // New styles for edit functionality
    fieldContainer: {
      marginBottom: theme.spacing.md,
    },
    fieldLabel: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.xs,
      fontWeight: '500',
    },
    fieldValue: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 48,
      justifyContent: 'center',
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
      fontStyle: 'italic',
    },
    amountEditContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    typeToggle: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minWidth: 80,
      alignItems: 'center',
    },
    typeToggleText: {
      ...theme.typography.bodyMedium,
      fontWeight: '500',
    },
  });
}