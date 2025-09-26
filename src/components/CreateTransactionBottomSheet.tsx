import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity } from 'react-native';
import { TrendUp, TrendDown, Plus, Minus, Check, Wallet } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useToastHelpers } from '../context/ToastContext';
import BaseBottomSheet from './BaseBottomSheet';
import ActionButton from './ActionButton';
import SegmentedControl from './SegmentedControl';
import SelectionInput from './SelectionInput';

interface Pocket {
  id: string;
  name: string;
  type: 'standard' | 'goal';
}

interface CreateTransactionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (transaction: any) => void;
  pockets?: Pocket[];
  initialData?: any;
}

export default function CreateTransactionBottomSheet({
  visible,
  onClose,
  pockets = [],
  onSave,
  initialData
}: CreateTransactionBottomSheetProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { showSuccess, showError } = useToastHelpers();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPocketId, setSelectedPocketId] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showPocketSelector, setShowPocketSelector] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (visible) {
      // Reset form when modal becomes visible
      setTitle('');
      setType('expense');
      setAmount('');
      setDescription('');
      setSelectedPocketId('');
      setIsRecurring(false);
      setDate(new Date().toISOString().split('T')[0]);
      setErrors({});
    }
  }, [visible]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount))) {
      newErrors.amount = 'Please enter a valid number';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!selectedPocketId) {
      newErrors.pocket = 'Please select a pocket';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const transactionData = {
        id: Date.now().toString(),
        title: title.trim(),
        type,
        amount: parseFloat(amount) * (type === 'income' ? 1 : -1),
        description: description.trim(),
        pocketId: selectedPocketId,
        isRecurring,
        date,
        pocketInfo: {
          name: pockets.find(p => p.id === selectedPocketId)?.name || 'Unknown',
          isLinked: true
        }
      };
      
      onSave(transactionData);
      showSuccess('Success', 'Transaction created successfully!');
      onClose();
    } else {
      showError('Error', 'Please fill in all required fields');
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const selectedPocket = pockets.find(p => p.id === selectedPocketId);
  const dynamicTitle = title.trim() ? `Create '${title.trim()}' Transaction` : 'Create New Transaction';
  const isFormValid = title.trim() && description.trim() && amount.trim() && selectedPocketId;

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title={dynamicTitle}
      showActionButtons={true}
      actionButtonText="Save Transaction"
      actionButtonDisabled={!isFormValid}
      onActionButtonPress={handleSave}
      cancelButtonText="Cancel"
      onCancelButtonPress={onClose}
      maxHeight="90%"
    >
      <View style={styles.content}>
        {/* Transaction Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title</Text>
          <TextInput
            style={[styles.textInput, errors.title && styles.inputError]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter transaction title"
            placeholderTextColor={theme.colors.textLight}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Transaction Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type</Text>
          <Text style={styles.sectionSubtitle}>Select the type of transaction</Text>
          <SegmentedControl
            options={[
              {
                value: 'income',
                label: 'Income',
                icon: <TrendUp />
              },
              {
                value: 'expense',
                label: 'Expense',
                icon: <TrendDown />
              }
            ]}
            selectedValue={type}
            onValueChange={(value) => setType(value as 'income' | 'expense')}
          />
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <TextInput
            style={[styles.textInput, errors.amount && styles.inputError]}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            placeholderTextColor={theme.colors.textLight}
            keyboardType="numeric"
          />
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.textInput, errors.description && styles.inputError]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor={theme.colors.textLight}
            multiline
            numberOfLines={2}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Pocket Selector */}
        <SelectionInput
          label="Linked Pocket"
          description="Choose which pocket to link this transaction to"
          placeholder="Select a pocket"
          value={selectedPocketId ? pockets?.find(p => p.id === selectedPocketId)?.name : undefined}
          icon={<Wallet />}
          onPress={() => setShowPocketSelector(true)}
          accessibilityLabel="Select pocket"
        />

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
                trackColor={{ false: theme.colors.borderLight, true: theme.colors.trustBlue }}
                thumbColor={isRecurring ? theme.colors.background : theme.colors.background}
              />
            </View>
          </View>
        </View>

        {/* Date Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>
          <TextInput
            style={styles.textInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.textLight}
          />
        </View>

        {/* Pocket Selector Modal */}
        <BaseBottomSheet
          visible={showPocketSelector}
          onClose={() => setShowPocketSelector(false)}
          title="Select Pocket"
          showActionButtons={true}
          actionButtonText="Select"
          actionButtonDisabled={!selectedPocketId}
          onActionButtonPress={() => setShowPocketSelector(false)}
          cancelButtonText="Cancel"
          onCancelButtonPress={() => setShowPocketSelector(false)}
        >
          <View style={styles.pocketList}>
            {pockets.map((pocket) => (
              <TouchableOpacity
                key={pocket.id}
                style={[
                  styles.pocketOption,
                  selectedPocketId === pocket.id && styles.pocketOptionSelected
                ]}
                onPress={() => {
                  setSelectedPocketId(pocket.id);
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Select ${pocket.name} pocket`}
              >
                <Wallet 
                  size={24} 
                  color={selectedPocketId === pocket.id ? theme.colors.background : theme.colors.textMuted} 
                  weight="light" 
                />
                <Text style={[
                  styles.pocketOptionText,
                  { color: selectedPocketId === pocket.id ? theme.colors.background : theme.colors.text }
                ]}>
                  {pocket.name}
                </Text>
                {selectedPocketId === pocket.id && (
                  <Check 
                    size={24} 
                    color={theme.colors.background} 
                    weight="light" 
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </BaseBottomSheet>
      </View>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingBottom: theme.spacing.xl,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.bodyMedium,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    sectionSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.md,
    },
    textInput: {
      ...theme.typography.bodyLarge,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.screenPadding, // 20px left/right padding
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
    },
    inputError: {
      borderColor: theme.colors.alertRed,
    },
    errorText: {
      ...theme.typography.bodySmall,
      color: theme.colors.alertRed,
      marginTop: theme.spacing.xs,
    },
    pocketHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    selectedPocketDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.screenPadding, // 20px left/right padding
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.trustBlue,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.trustBlue + '15',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    selectedPocketText: {
      ...theme.typography.bodyLarge,
      color: theme.colors.trustBlue,
      fontWeight: '600',
    },
    pocketList: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingBottom: theme.spacing.xl,
    },
    pocketSelector: {
      gap: theme.spacing.sm,
    },
    pocketOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    pocketOptionSelected: {
      borderColor: theme.colors.trustBlue,
      backgroundColor: theme.colors.trustBlue,
    },
    pocketOptionText: {
      ...theme.typography.bodyMedium,
      fontWeight: '500',
      flex: 1,
    },
    recurringContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },
    recurringInfo: {
      flex: 1,
    },
    recurringTitle: {
      ...theme.typography.bodyMedium,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    recurringSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
    },
    toggleWrapper: {
      marginLeft: theme.spacing.md,
    },
  });
}