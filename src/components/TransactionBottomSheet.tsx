import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Trash, TrendUp, TrendDown, Receipt, Calendar, Wallet, Repeat } from 'phosphor-react-native';
import DatePicker from './DatePicker';
import BaseBottomSheet from './BaseBottomSheet';
import ActionButton from './ActionButton';
import SegmentedControl from './SegmentedControl';

interface TransactionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    title: string;
    subtitle: string;
    amount: number;
    type: 'income' | 'expense' | 'investment';
    category: string;
    date: string;
    isRecurring?: boolean;
    linkedPocket?: {
      id: string;
      name: string;
    };
  } | null;
  onEdit?: (transaction: any) => void;
  onDelete?: (id: string) => void;
  pockets?: Array<{
    id: string;
    name: string;
    type: 'standard' | 'goal';
  }>;
}

export default function TransactionBottomSheet({ 
  visible, 
  onClose, 
  transaction, 
  onEdit, 
  onDelete,
  pockets = []
}: TransactionBottomSheetProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const isAddMode = !transaction;
  
  const [editedTransaction, setEditedTransaction] = useState(
    transaction || {
      id: '',
      title: '',
      subtitle: '',
      amount: 0,
      type: 'expense' as 'income' | 'expense' | 'investment',
      category: '',
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
      linkedPocket: undefined
    }
  );
  
  const [hasChanges, setHasChanges] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showPocketSelector, setShowPocketSelector] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setEditedTransaction(
        transaction || {
          id: '',
          title: '',
          subtitle: '',
          amount: 0,
          type: 'expense' as 'income' | 'expense' | 'investment',
          category: '',
          date: new Date().toISOString().split('T')[0],
          isRecurring: false,
          linkedPocket: undefined
        }
      );
      setHasChanges(false);
      setEditingField(null);
      setShowPocketSelector(false);
    }
  }, [visible, transaction]);

  const handleFieldChange = (field: string, value: any) => {
    const newTransaction = { ...editedTransaction, [field]: value };
    setEditedTransaction(newTransaction);
    
    // Check if there are changes compared to original
    const hasChangesNow = transaction ? 
      Object.keys(newTransaction).some(key => newTransaction[key as keyof typeof newTransaction] !== transaction[key as keyof typeof transaction]) :
      true;
    setHasChanges(hasChangesNow);
  };

  const handleFieldEdit = (field: string) => {
    setEditingField(field);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleDelete = () => {
    if (transaction && onDelete) {
      onDelete(transaction.id);
      onClose();
    }
  };

  const handleSave = () => {
    if (hasChanges && onEdit) {
      if (isAddMode) {
        onEdit(editedTransaction);
        onClose();
      } else {
        onEdit(editedTransaction);
        setHasChanges(false);
      }
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      // Show confirmation dialog for unsaved changes
      // For now, just close
    }
    if (transaction) {
      setEditedTransaction(transaction);
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
      >
        {isEditing ? children : (
          <Text style={[styles.fieldText, !value && styles.placeholderText]}>
            {value || `Tap to add ${label.toLowerCase()}`}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );


  const getTypeIcon = (type: string, isRecurring?: boolean) => {
    switch (type) {
      case 'income':
        return TrendUp;
      case 'expense':
        return TrendDown;
      case 'investment':
        return TrendUp;
      default:
        return Receipt;
    }
  };

  const getTypeLabel = (type: string, isRecurring?: boolean) => {
    switch (type) {
      case 'income':
        return isRecurring ? 'Income Recurring' : 'Income';
      case 'expense':
        return 'Expenses';
      case 'investment':
        return 'Investment';
      default:
        return 'Transaction';
    }
  };

  const TypeIcon = getTypeIcon(transaction?.type || 'expense', transaction?.isRecurring);
  const typeLabel = getTypeLabel(transaction?.type || 'expense', transaction?.isRecurring);

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title={isAddMode ? 'Add Transaction' : 'Transaction Details'}
      headerRightIcon={!isAddMode ? <Trash size={24} color={theme.colors.alertRed} weight="light" /> : undefined}
      onHeaderRightPress={!isAddMode ? handleDelete : undefined}
      showActionButtons={true}
      actionButtonText="Save Changes"
      onActionButtonPress={handleSave}
      cancelButtonText="Cancel"
      onCancelButtonPress={handleCancel}
    >

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.previewContainer}>
              
              {/* Type Toggle */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Type</Text>
                <View style={styles.segmentedControl}>
                  <TouchableOpacity
                    style={[
                      styles.segment,
                      styles.segmentLeft,
                      editedTransaction.type === 'income' && styles.segmentActive
                    ]}
                    onPress={() => handleFieldChange('type', 'income')}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Income"
                  >
                    <TrendUp size={18} color={editedTransaction.type === 'income' ? theme.colors.background : theme.colors.textMuted} weight="light" />
                    <Text style={[
                      styles.segmentText,
                      { color: editedTransaction.type === 'income' ? theme.colors.background : theme.colors.textMuted }
                    ]}>
                      Income
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.segment,
                      styles.segmentRight,
                      editedTransaction.type === 'expense' && styles.segmentActive
                    ]}
                    onPress={() => handleFieldChange('type', 'expense')}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Expense"
                  >
                    <TrendDown size={18} color={editedTransaction.type === 'expense' ? theme.colors.background : theme.colors.textMuted} weight="light" />
                    <Text style={[
                      styles.segmentText,
                      { color: editedTransaction.type === 'expense' ? theme.colors.background : theme.colors.textMuted }
                    ]}>
                      Expense
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Title */}
              <PreviewField
                label="Title"
                value={editedTransaction.title}
                field="title"
                isEditing={editingField === 'title'}
              >
                <TextInput
                  style={styles.fieldInput}
                  value={editedTransaction.title}
                  onChangeText={(text) => handleFieldChange('title', text)}
                  onFocus={() => handleFieldEdit('title')}
                  onBlur={handleFieldBlur}
                  placeholder="Enter transaction title"
                  placeholderTextColor={theme.colors.textLight}
                  autoFocus
                />
              </PreviewField>

              {/* Amount */}
              <PreviewField
                label="Amount"
                value={editedTransaction.amount ? `€${editedTransaction.amount.toLocaleString()}` : ''}
                field="amount"
                isEditing={editingField === 'amount'}
              >
                <TextInput
                  style={styles.fieldInput}
                  value={String(editedTransaction.amount)}
                  onChangeText={(text) => handleFieldChange('amount', parseFloat(text) || 0)}
                  onBlur={handleFieldBlur}
                  placeholder="0.00"
                  keyboardType="numeric"
                  autoFocus
                />
              </PreviewField>

              {/* Linked Pocket */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Linked Pocket</Text>
                <TouchableOpacity 
                  style={styles.fieldValue}
                  onPress={() => setShowPocketSelector(!showPocketSelector)}
                >
                  <View style={styles.pocketSelector}>
                    <Wallet size={16} color={theme.colors.textMuted} weight="light" />
                    <Text style={[
                      styles.fieldText,
                      !editedTransaction.linkedPocket && styles.placeholderText
                    ]}>
                      {editedTransaction.linkedPocket?.name || 'Select a pocket'}
                    </Text>
                  </View>
                </TouchableOpacity>
                
                {showPocketSelector && (
                  <View style={styles.pocketOptions}>
                    <TouchableOpacity
                      style={styles.pocketOption}
                      onPress={() => {
                        handleFieldChange('linkedPocket', undefined);
                        setShowPocketSelector(false);
                      }}
                    >
                      <Text style={[styles.pocketOptionText, { color: theme.colors.textMuted }]}>
                        No pocket linked
                      </Text>
                    </TouchableOpacity>
                    {pockets.map((pocket) => (
                      <TouchableOpacity
                        key={pocket.id}
                        style={[
                          styles.pocketOption,
                          editedTransaction.linkedPocket?.id === pocket.id && styles.pocketOptionSelected
                        ]}
                        onPress={() => {
                          handleFieldChange('linkedPocket', pocket);
                          setShowPocketSelector(false);
                        }}
                      >
                        <Text style={[
                          styles.pocketOptionText,
                          { color: editedTransaction.linkedPocket?.id === pocket.id ? theme.colors.trustBlue : theme.colors.text }
                        ]}>
                          {pocket.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Recurring Transaction */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Repeat Transaction</Text>
                <View style={styles.recurringContainer}>
                  <View style={styles.recurringInfo}>
                    <Text style={styles.recurringTitle}>
                      {editedTransaction.isRecurring ? 'Monthly Recurring' : 'One-time Transaction'}
                    </Text>
                    <Text style={styles.recurringSubtitle}>
                      {editedTransaction.isRecurring 
                        ? 'This transaction will repeat every month automatically' 
                        : 'This is a single transaction that won\'t repeat'}
                    </Text>
                  </View>
                  <View style={styles.toggleWrapper}>
                    <Switch
                      value={editedTransaction.isRecurring}
                      onValueChange={(value) => handleFieldChange('isRecurring', value)}
                      trackColor={{ 
                        false: theme.colors.borderLight, 
                        true: theme.colors.trustBlue 
                      }}
                      thumbColor={theme.colors.background}
                      ios_backgroundColor={theme.colors.borderLight}
                      style={styles.recurringSwitch}
                      accessible={true}
                      accessibilityRole="switch"
                      accessibilityLabel={`Toggle ${editedTransaction.isRecurring ? 'disable' : 'enable'} recurring transaction`}
                      accessibilityHint={editedTransaction.isRecurring 
                        ? 'Disables automatic monthly repetition' 
                        : 'Enables automatic monthly repetition'}
                    />
                  </View>
                </View>
              </View>

              {/* Description */}
              <PreviewField
                label="Description"
                value={editedTransaction.subtitle}
                field="subtitle"
                isEditing={editingField === 'subtitle'}
              >
                <TextInput
                  style={[styles.fieldInput, styles.multilineInput]}
                  value={editedTransaction.subtitle}
                  onChangeText={(text) => handleFieldChange('subtitle', text)}
                  onBlur={handleFieldBlur}
                  placeholder="Transaction description"
                  multiline
                  numberOfLines={3}
                  autoFocus
                />
              </PreviewField>

              {/* Date */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Date</Text>
                <DatePicker
                  value={new Date(editedTransaction.date)}
                  onDateChange={(date) => handleFieldChange('date', date.toISOString().split('T')[0])}
                />
              </View>

            </View>
          </ScrollView>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    bottomSheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      maxHeight: '90%',
      paddingBottom: theme.spacing.md + 16, // Safe area padding
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    headerTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '600',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    actionButton: {
      padding: theme.spacing.xs,
    },
    content: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
    },
    previewContainer: {
      gap: theme.spacing.lg,
    },
    fieldContainer: {
      gap: theme.spacing.sm,
    },
    fieldLabel: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      fontWeight: '600',
    },
    fieldValue: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
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
    segmentedControl: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    segment: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    segmentLeft: {
      borderTopLeftRadius: theme.radius.md,
      borderBottomLeftRadius: theme.radius.md,
    },
    segmentRight: {
      borderTopRightRadius: theme.radius.md,
      borderBottomRightRadius: theme.radius.md,
    },
    segmentActive: {
      backgroundColor: theme.colors.trustBlue,
    },
    segmentText: {
      ...theme.typography.bodyMedium,
      fontWeight: '600',
    },
    pocketSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    pocketOptions: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      marginTop: theme.spacing.xs,
      overflow: 'hidden',
    },
    pocketOption: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    pocketOptionSelected: {
      backgroundColor: theme.colors.trustBlue + '15',
    },
    pocketOptionText: {
      ...theme.typography.bodyMedium,
    },
    recurringContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
    },
    recurringInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    recurringTitle: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
    },
    recurringSubtitle: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
      lineHeight: 16,
    },
    toggleWrapper: {
      paddingLeft: theme.spacing.sm,
    },
    recurringSwitch: {
      transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
    },
    dateSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
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
    datePickerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl, // Extra padding for safe area
      maxHeight: 300,
      alignItems: 'center',
      justifyContent: 'center',
    },
    datePicker: {
      width: 'auto',
      height: Platform.OS === 'ios' ? 200 : 'auto',
    },
  });
}
