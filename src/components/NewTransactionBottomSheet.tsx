import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendUp, TrendDown, Wallet } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useBudget } from '../context/SafeBudgetContext';
import { useToast } from '../context/SafeToastContext';
import KeyboardAwareBottomSheet from './KeyboardAwareBottomSheet';
import BaseBottomSheet from './BaseBottomSheet';
import SegmentedControl from './SegmentedControl';
import SelectionInput from './SelectionInput';
import Input from './Input';
import DateInput from './DateInput';

interface Pocket {
  id: string;
  name: string;
  type: 'standard' | 'goal';
}

interface NewTransactionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (transaction: {
    title: string;
    amount: string;
    type: 'income' | 'expense';
    description?: string;
    linkedPocketId?: string;
    isRecurring?: boolean;
    date: string;
  }) => void;
  pockets?: Pocket[];
  initialData?: {
    title?: string;
    amount?: string;
    type?: 'income' | 'expense';
    description?: string;
    linkedPocketId?: string;
    isRecurring?: boolean;
    date?: string;
  };
}

export default function NewTransactionBottomSheet({
  visible,
  onClose,
  pockets = [],
  onSave,
  initialData
}: NewTransactionBottomSheetProps) {
  const theme = useTheme();
  const { createTransaction } = useBudget();
  const styles = getStyles(theme);
  const { showSuccess, showError } = useToast();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPocketId, setSelectedPocketId] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPocketSelector, setShowPocketSelector] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (visible) {
      // Reset form when modal becomes visible
      setTitle(initialData?.title || '');
      setType(initialData?.type || 'expense');
      setAmount(initialData?.amount || '');
      setDescription(initialData?.description || '');
      setSelectedPocketId(initialData?.linkedPocketId || '');
      setIsRecurring(initialData?.isRecurring || false);
      setDate(initialData?.date ? new Date(initialData.date) : new Date());
      setErrors({});
    }
  }, [visible, initialData]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount))) {
      newErrors.amount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showError('Please fix the errors before saving');
      return;
    }

    try {
      const transactionData = {
        pocketId: selectedPocketId || '',
        amount: parseFloat(amount),
        type,
        category: 'General',
        description: description.trim() || 'New transaction',
        date: date,
        tags: isRecurring ? ['recurring'] : [],
      };

      await createTransaction(transactionData);
      onSave({
        title: title.trim(),
        amount: amount.trim(),
        type,
        description: description.trim() || undefined,
        linkedPocketId: selectedPocketId || undefined,
        isRecurring,
        date: date.toISOString().split('T')[0],
      });
      onClose();
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  const selectedPocket = pockets.find(p => p.id === selectedPocketId);

  return (
    <KeyboardAwareBottomSheet
      visible={visible}
      onClose={onClose}
      title="New Transaction"
      actionButtons={[
        {
          title: 'Cancel',
          onPress: onClose,
          variant: 'secondary',
        },
        {
          title: 'Save Transaction',
          onPress: handleSave,
          variant: 'primary',
        },
      ]}
    >
      <View style={styles.content}>
        {/* Transaction Type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Type</Text>
          <Text style={styles.hintText}>Select the type of transaction</Text>
          <SegmentedControl
            options={[
              {
                value: 'income',
                label: 'Income',
                icon: <TrendUp />,
              },
              {
                value: 'expense',
                label: 'Expense',
                icon: <TrendDown />,
              },
            ]}
            selectedValue={type}
            onValueChange={(value) => setType(value as 'income' | 'expense')}
          />
        </View>

        {/* Title */}
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter transaction title"
          type="text"
          error={errors.title}
        />

        {/* Amount */}
        <Input
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          type="number"
          error={errors.amount}
        />

        {/* Description */}
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          type="multiline"
        />

        {/* Linked Pocket */}
        <SelectionInput
          label="Linked Pocket"
          description="Choose which pocket to link this transaction to"
          value={selectedPocket?.name || ''}
          placeholder="Select a pocket"
          onPress={() => setShowPocketSelector(true)}
          icon={<Wallet size={20} weight="light" />}
        />

        {/* Repeat Transaction */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Repeat Transaction</Text>
          <Text style={styles.hintText}>Set up automatic recurring transactions</Text>
          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Monthly Recurring</Text>
              <Text style={styles.switchHint}>This transaction will repeat every month</Text>
            </View>
            <Input
              label=""
              value={isRecurring}
              onValueChange={setIsRecurring}
              type="switch"
            />
          </View>
        </View>

        {/* Date */}
        <View style={styles.section}>
        <DateInput
          label="Date"
          value={date}
          onDateChange={setDate}
        />
        </View>

        {/* Pocket Selector */}
        {showPocketSelector && (
          <BaseBottomSheet
            visible={showPocketSelector}
            onClose={() => setShowPocketSelector(false)}
            title="Select Pocket"
            actionButtons={[
              {
                title: 'Cancel',
                onPress: () => setShowPocketSelector(false),
                variant: 'secondary',
              },
            ]}
          >
            <View style={styles.pocketList}>
              <SelectionInput
                label=""
                value="No Pocket"
                placeholder="No pocket selected"
                icon={<Wallet size={20} weight="light" />}
                onPress={() => {
                  setSelectedPocketId('');
                  setShowPocketSelector(false);
                }}
              />
              {pockets.map((pocket) => (
                <SelectionInput
                  key={pocket.id}
                  label=""
                  value={pocket.name}
                  placeholder=""
                  icon={<Wallet size={20} weight="light" />}
                  onPress={() => {
                    setSelectedPocketId(pocket.id);
                    setShowPocketSelector(false);
                  }}
                />
              ))}
            </View>
          </BaseBottomSheet>
        )}
      </View>
    </KeyboardAwareBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    content: {
      paddingVertical: 0,
    },
    section: {
      marginBottom: theme.spacing.lg, // 24px spacing to match Input components
    },
    sectionLabel: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: 8, // 8px spacing between title and input
    },
    hintText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.sm,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
    },
    switchContent: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    switchLabel: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      fontWeight: '500',
      marginBottom: theme.spacing.xs,
    },
    switchHint: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
    },
    pocketList: {
      paddingVertical: theme.spacing.sm,
    },
  });
}
