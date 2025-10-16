import { trackBottomSheetInteraction } from '../services/analytics';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import UnifiedBaseBottomSheet from './UnifiedBaseBottomSheet';
import UnifiedInput from './UnifiedInput';
import UnifiedButton from './UnifiedButton';
import { Check, X, FloppyDisk, WarningCircle, Calendar, Wallet, Tag, Folder } from 'phosphor-react-native';

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
  tags?: string[];
}

interface Pocket {
  id: string;
  name: string;
  currentBalance: number;
  targetAmount?: number;
  color: string;
  type: 'standard' | 'goal';
}

interface EnhancedTransactionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  pockets?: Pocket[];
  onSave?: (transaction: Transaction) => Promise<void>;
}

export default function EnhancedTransactionBottomSheet({
  visible,
  onClose,
  transaction,
  onEdit,
  onDelete,
  pockets = [],
  onSave,
}: EnhancedTransactionBottomSheetProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [editedTransaction, setEditedTransaction] = useState<Transaction | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible && transaction) {
      setEditedTransaction({ ...transaction });
      setHasChanges(false);
      setErrors({});
    }
  }, [visible, transaction]);

  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case 'title':
        if (!value || value.trim().length === 0) {
          return 'Transaction name is required';
        }
        if (value.trim().length < 2) {
          return 'Transaction name must be at least 2 characters';
        }
        break;
      case 'amount':
        if (value === 0) {
          return 'Amount must be greater than 0';
        }
        if (Math.abs(value) > 1000000) {
          return 'Amount is too large';
        }
        break;
      case 'date':
        if (!value || isNaN(new Date(value).getTime())) {
          return 'Please select a valid date';
        }
        break;
      case 'category':
        if (!value || value.trim().length === 0) {
          return 'Category is required';
        }
        break;
    }
    return null;
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!editedTransaction) return;

    // Clear error for this field
    const newErrors = { ...errors };
    delete newErrors[field];
    setErrors(newErrors);

    // Validate the field
    const error = validateField(field, value);
    if (error) {
      setErrors({ ...newErrors, [field]: error });
    }

    const newTransaction = { ...editedTransaction, [field]: value };
    setEditedTransaction(newTransaction);
    
    // Check if there are changes compared to original
    const hasChangesNow = transaction ? 
      Object.keys(newTransaction).some(key => {
        const originalValue = transaction[key as keyof Transaction];
        const newValue = newTransaction[key as keyof Transaction];
        return JSON.stringify(originalValue) !== JSON.stringify(newValue);
      }) :
      true;
    setHasChanges(hasChangesNow);
  };

  const handleSave = async () => {
    if (!editedTransaction) return;

    trackBottomSheetInteraction('TransactionBottomSheet', 'save', {
      transaction_id: editedTransaction.id,
      has_changes: hasChanges
    });

    // Validate all fields
    const newErrors: Record<string, string> = {};
    const fieldsToValidate = ['title', 'amount', 'date', 'category'];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, editedTransaction[field as keyof Transaction]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(editedTransaction);
      } else if (onEdit) {
        onEdit(editedTransaction);
      }
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error('Failed to save transaction:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    trackBottomSheetInteraction('TransactionBottomSheet', 'cancel', {
      transaction_id: editedTransaction?.id,
      has_changes: hasChanges
    });
    
    if (hasChanges) {
      // In a real app, show confirmation dialog
      // For now, just close
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

  const hasValidationErrors = Object.keys(errors).length > 0;

  if (!transaction || !editedTransaction) return null;

  return (
    <UnifiedBaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Transaction Details"
      backgroundColor={theme.colors.background}
      headerRightIcon={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {hasChanges ? (
            <>
              <TouchableOpacity 
                onPress={handleSave} 
                style={[styles.headerButton, hasValidationErrors && styles.disabledButton]}
                disabled={hasValidationErrors || isSaving}
                activeOpacity={0.7}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={theme.colors.background} />
                ) : (
                  <FloppyDisk size={24} color={theme.colors.background} weight="light" />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={styles.headerButton} activeOpacity={0.7}>
                <X size={24} color={theme.colors.textMuted} weight="light" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={handleDelete} style={styles.headerButton} activeOpacity={0.7}>
                <X size={24} color={theme.colors.alertRed} weight="light" />
              </TouchableOpacity>
            </>
          )}
        </View>
      }
      onHeaderRightPress={undefined}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Transaction Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Transaction Name *</Text>
          <UnifiedInput
            label=""
            value={editedTransaction.title}
            onChangeText={(text) => handleFieldChange('title', text)}
            placeholder="Enter transaction name"
            error={errors.title}
            style={{ marginBottom: 0 }}
          />
        </View>

        {/* Amount */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Amount *</Text>
          <UnifiedInput
            label=""
            value={String(editedTransaction.amount)}
            onChangeText={(text) => handleFieldChange('amount', parseFloat(text) || 0)}
            placeholder="0.00"
            keyboardType="numeric"
            error={errors.amount}
            style={{ marginBottom: 0 }}
          />
        </View>

        {/* Date */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Date *</Text>
          <UnifiedInput
            label=""
            value={new Date(editedTransaction.date).toLocaleDateString()}
            onChangeText={(text) => handleFieldChange('date', text)}
            placeholder="Select date"
            error={errors.date}
            style={{ marginBottom: 0 }}
          />
        </View>

        {/* Category */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Category *</Text>
          <UnifiedInput
            label=""
            value={editedTransaction.category || ''}
            onChangeText={(category) => handleFieldChange('category', category)}
            placeholder="Enter category"
            error={errors.category}
            style={{ marginBottom: 0 }}
          />
        </View>

        {/* Pocket Selection */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Pocket</Text>
          <UnifiedInput
            label=""
            value={editedTransaction.pocketInfo?.isLinked ? editedTransaction.pocketInfo.pocketName || '' : ''}
            onChangeText={(text) => {
              const pocket = pockets?.find(p => p.name === text);
              handleFieldChange('pocketInfo', {
                isLinked: !!pocket,
                pocketName: pocket?.name
              });
            }}
            placeholder="Select pocket"
            style={{ marginBottom: 0 }}
          />
        </View>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Description</Text>
          <UnifiedInput
            label=""
            value={editedTransaction.description || ''}
            onChangeText={(text) => handleFieldChange('description', text)}
            placeholder="Enter description"
            type="multiline"
            numberOfLines={3}
            style={{ marginBottom: 0 }}
          />
        </View>

        {/* Tags */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Tags</Text>
          <UnifiedInput
            label=""
            value={(editedTransaction.tags || []).join(', ')}
            onChangeText={(text) => {
              const tags = text.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
              handleFieldChange('tags', tags);
            }}
            placeholder="Enter tags separated by commas"
            style={{ marginBottom: 0 }}
          />
        </View>

        {/* Recurring Toggle */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Recurring Transaction</Text>
          <UnifiedInput
            label=""
            value={editedTransaction.isRecurring || false}
            onValueChange={(value) => handleFieldChange('isRecurring', value)}
            type="switch"
            style={{ marginBottom: 0 }}
          />
        </View>

        {/* Validation Summary */}
        {hasValidationErrors && (
          <View style={styles.validationSummary}>
            <WarningCircle size={20} color={theme.colors.alertRed} weight="regular" />
            <Text style={styles.validationText}>
              Please fix the errors above to save
            </Text>
          </View>
        )}

        {/* Save/Cancel Buttons - Always Visible */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.cancelButton, hasChanges && styles.cancelButtonWithChanges]}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelButtonText, hasChanges && styles.cancelButtonTextWithChanges]}>
              {hasChanges ? 'Discard Changes' : 'Close'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.saveButton, 
              (!hasChanges || hasValidationErrors) && styles.disabledButton
            ]}
            onPress={handleSave}
            disabled={!hasChanges || hasValidationErrors || isSaving}
            activeOpacity={0.7}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={theme.colors.background} />
            ) : (
              <Check size={20} color={theme.colors.background} weight="bold" />
            )}
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </UnifiedBaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: theme.spacing.md,
    },
    fieldContainer: {
      marginBottom: theme.spacing.lg,
    },
    fieldLabel: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: '500',
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.trustBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabledButton: {
      backgroundColor: theme.colors.textLight,
    },
    validationSummary: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.alertRed + '10',
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    validationText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.alertRed,
      marginLeft: theme.spacing.sm,
      fontWeight: '500',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelButtonWithChanges: {
      backgroundColor: theme.colors.alertRed + '10',
      borderColor: theme.colors.alertRed,
    },
    cancelButtonText: {
      ...theme.typography.button,
      color: theme.colors.text,
      fontWeight: '500',
    },
    cancelButtonTextWithChanges: {
      color: theme.colors.alertRed,
    },
    saveButton: {
      flex: 1,
      backgroundColor: theme.colors.trustBlue,
      borderRadius: theme.radius.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    saveButtonText: {
      ...theme.typography.button,
      color: theme.colors.background,
      fontWeight: '500',
    },
  });
}
