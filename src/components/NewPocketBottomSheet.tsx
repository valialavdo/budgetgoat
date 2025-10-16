import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wallet, Target } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useBudget } from '../context/SafeBudgetContext';
import KeyboardAwareBottomSheet from './KeyboardAwareBottomSheet';
import Input from './Input';
import SegmentedControl from './SegmentedControl';

interface CreatePocketBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onPocketCreated: (pocket: any) => void;
}

export default function CreatePocketBottomSheet({
  visible,
  onClose,
  onPocketCreated
}: CreatePocketBottomSheetProps) {
  const theme = useTheme();
  const { createPocket } = useBudget();
  const styles = getStyles(theme);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'standard' | 'goal'>('standard');
  const [currentBalance, setCurrentBalance] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [transactionCount, setTransactionCount] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (visible) {
      // Reset form when modal becomes visible
      setName('');
      setDescription('');
      setType('standard');
      setCurrentBalance('');
      setTargetAmount('');
      setTransactionCount('');
      setErrors({});
    }
  }, [visible]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) {
      newErrors.name = 'Pocket name is required';
    }
    
    if (!currentBalance.trim()) {
      newErrors.currentBalance = 'Current balance is required';
    } else if (isNaN(parseFloat(currentBalance))) {
      newErrors.currentBalance = 'Please enter a valid number';
    }
    
    if (type === 'goal' && !targetAmount.trim()) {
      newErrors.targetAmount = 'Target amount is required for goal pockets';
    } else if (targetAmount.trim() && isNaN(parseFloat(targetAmount))) {
      newErrors.targetAmount = 'Please enter a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const pocketData = {
          name: name.trim(),
          description: description.trim(),
          type,
          currentBalance: parseFloat(currentBalance),
          targetAmount: targetAmount ? parseFloat(targetAmount) : 0,
          transactionCount: parseInt(transactionCount) || 0,
          isGoal: type === 'goal',
          color: '#0052CC', // Default color
        };
        
        const pocketId = await addPocket(pocketData);
        onPocketCreated({ id: pocketId, ...pocketData });
        onClose();
      } catch (error) {
        console.error('Failed to create pocket:', error);
      }
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const isFormValid = name.trim() && currentBalance.trim() && 
    (type === 'standard' || (type === 'goal' && targetAmount.trim()));

  const dynamicTitle = name.trim() ? `Create '${name.trim()}'` : 'Create New Pocket';

  return (
    <KeyboardAwareBottomSheet
      visible={visible}
      onClose={onClose}
      title="Create New Pocket"
      actionButtons={[
        {
          title: 'Cancel',
          onPress: onClose,
          variant: 'secondary',
        },
        {
          title: 'Create Pocket',
          onPress: handleSave,
          variant: 'primary',
        },
      ]}
    >
      <View style={styles.content}>
        {/* Pocket Name */}
        <Input
          label="Pocket Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter pocket name"
          type="text"
          error={errors.name}
        />

        {/* Description */}
        <Input
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          type="multiline"
        />

        {/* Pocket Type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pocket Type</Text>
          <SegmentedControl
            options={[
              {
                value: 'standard',
                label: 'Standard',
                icon: <Wallet size={20} weight="light" />,
              },
              {
                value: 'goal',
                label: 'Goal Oriented',
                icon: <Target size={20} weight="light" />,
              },
            ]}
            selectedValue={type}
            onValueChange={(value) => setType(value as 'standard' | 'goal')}
          />
        </View>

        {/* Current Balance */}
        <Input
          label="Current Balance"
          value={currentBalance}
          onChangeText={setCurrentBalance}
          placeholder="Enter current balance"
          type="number"
          error={errors.currentBalance}
        />

        {/* Target Amount (only for goal pockets) */}
        {type === 'goal' && (
          <Input
            label="Target Amount"
            value={targetAmount}
            onChangeText={setTargetAmount}
            placeholder="Enter target amount"
            type="number"
            error={errors.targetAmount}
          />
        )}

        {/* Transaction Count */}
        <Input
          label="Initial Transaction Count (Optional)"
          value={transactionCount}
          onChangeText={setTransactionCount}
          placeholder="Enter transaction count"
          type="number"
        />
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
  });
}