import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { TrendUp, TrendDown, Wallet } from 'phosphor-react-native';
import BaseBottomSheet from './BaseBottomSheet';
import FormInput from './FormInput';
import SegmentedControl from './SegmentedControl';
import SelectionInput from './SelectionInput';

export interface AddTransactionBottomSheetProps {
  /**
   * Whether the bottom sheet is visible
   */
  visible: boolean;
  
  /**
   * Callback when the bottom sheet should be closed
   */
  onClose: () => void;
  
  /**
   * Callback when a new transaction is created
   */
  onTransactionAdded?: (transaction: {
    title: string;
    amount: string;
    type: 'income' | 'expense';
    description?: string;
    linkedPocketId?: string;
    isRecurring?: boolean;
  }) => void;
}

/**
 * AddTransactionBottomSheet component for creating new transactions
 * 
 * Features:
 * - Consistent UI with CreateTransactionBottomSheet
 * - Form validation
 * - Reusable components (SegmentedControl, FormInput, SelectionInput)
 * - Linked pocket selection
 * - Recurring transaction option
 */
export default function AddTransactionBottomSheet({
  visible,
  onClose,
  onTransactionAdded
}: AddTransactionBottomSheetProps) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [selectedPocketId, setSelectedPocketId] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock pockets data - in real app this would come from context/props
  const pockets = [
    { id: '1', name: 'Emergency Fund' },
    { id: '2', name: 'Vacation' },
    { id: '3', name: 'Groceries' },
  ];

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount))) {
      newErrors.amount = 'Amount must be a valid number';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onTransactionAdded?.({
        title: title.trim(),
        amount: amount.trim(),
        type,
        description: description.trim() || undefined,
        linkedPocketId: selectedPocketId || undefined,
        isRecurring,
      });
      
      // Reset form
      setTitle('');
      setAmount('');
      setDescription('');
      setType('expense');
      setSelectedPocketId(null);
      setIsRecurring(false);
      setErrors({});
      
      onClose();
    }
  };

  const handleCancel = () => {
    // Reset form
    setTitle('');
    setAmount('');
    setDescription('');
    setType('expense');
    setSelectedPocketId(null);
    setIsRecurring(false);
    setErrors({});
    
    onClose();
  };

  const styles = getStyles(theme);

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Create New Transaction"
      showActionButtons={true}
      actionButtonText="Save Transaction"
      onActionButtonPress={handleSave}
      cancelButtonText="Cancel"
      onCancelButtonPress={handleCancel}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title</Text>
          <FormInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter transaction title"
            error={errors.title}
          />
        </View>

        {/* Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type</Text>
          <Text style={styles.sectionSubtitle}>Select the type of transaction</Text>
          <SegmentedControl
            options={[
              { value: 'income', label: 'Income', icon: <TrendUp /> },
              { value: 'expense', label: 'Expense', icon: <TrendDown /> }
            ]}
            selectedValue={type}
            onValueChange={(value) => setType(value as 'income' | 'expense')}
          />
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <FormInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
            error={errors.amount}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <FormInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Linked Pocket */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Linked Pocket</Text>
          <Text style={styles.sectionSubtitle}>Choose which pocket to link this transaction to</Text>
          <SelectionInput
            label="Linked Pocket"
            description="Choose which pocket to link this transaction to"
            placeholder="Select a pocket"
            value={selectedPocketId ? pockets?.find(p => p.id === selectedPocketId)?.name : undefined}
            icon={<Wallet />}
            onPress={() => {
              // In a real app, this would open a pocket selector
              console.log('Open pocket selector');
            }}
            accessibilityLabel="Select pocket"
          />
        </View>

        {/* Recurring Transaction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repeat Transaction</Text>
          <Text style={styles.sectionSubtitle}>Set up automatic recurring transactions</Text>
          <View style={styles.recurringContainer}>
            <View style={styles.recurringInfo}>
              <Text style={styles.recurringTitle}>Monthly Recurring</Text>
              <Text style={styles.recurringSubtitle}>This transaction will repeat every month automatically</Text>
            </View>
            <View style={styles.toggleWrapper}>
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{ false: theme.colors.borderLight, true: theme.colors.trustBlue + '30' }}
                thumbColor={isRecurring ? theme.colors.trustBlue : theme.colors.textMuted}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: theme.spacing.screenPadding, // 20px padding
      paddingVertical: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
    },
    sectionSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.md,
    },
    recurringContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    recurringInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    recurringTitle: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      fontWeight: '500',
      marginBottom: theme.spacing.xs,
    },
    recurringSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
    },
    toggleWrapper: {
      // Switch component handles its own styling
    },
  });
}