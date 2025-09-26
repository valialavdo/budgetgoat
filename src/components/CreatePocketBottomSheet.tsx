import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Wallet, Target, Check } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import BaseBottomSheet from './BaseBottomSheet';

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

  const handleSave = () => {
    if (validateForm()) {
      const pocketData = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        type,
        currentBalance: parseFloat(currentBalance),
        targetAmount: targetAmount ? parseFloat(targetAmount) : 0,
        transactionCount: parseInt(transactionCount) || 0,
        isGoal: type === 'goal'
      };
      
      onPocketCreated(pocketData);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const isFormValid = name.trim() && currentBalance.trim() && 
    (type === 'standard' || (type === 'goal' && targetAmount.trim()));

  const dynamicTitle = name.trim() ? `Create '${name.trim()}'` : 'Create New Pocket';

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title={dynamicTitle}
      headerRightIcon={<Check size={20} color={theme.colors.trustBlue} />}
      onHeaderRightPress={isFormValid ? handleSave : undefined}
      maxHeight="90%"
    >
      <View style={styles.content}>
        {/* Pocket Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Pocket Name</Text>
          <TextInput
            style={[styles.textInput, errors.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Enter pocket name"
            placeholderTextColor={theme.colors.textLight}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Description (Optional)</Text>
          <TextInput
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor={theme.colors.textLight}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Pocket Type */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Pocket Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeOption,
                type === 'standard' && styles.typeOptionSelected
              ]}
              onPress={() => setType('standard')}
            >
              <Wallet size={20} color={type === 'standard' ? theme.colors.trustBlue : theme.colors.textMuted} weight="light" />
              <Text style={[
                styles.typeOptionText,
                { color: type === 'standard' ? theme.colors.trustBlue : theme.colors.textMuted }
              ]}>
                Standard
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeOption,
                type === 'goal' && styles.typeOptionSelected
              ]}
              onPress={() => setType('goal')}
            >
              <Target size={20} color={type === 'goal' ? theme.colors.trustBlue : theme.colors.textMuted} weight="light" />
              <Text style={[
                styles.typeOptionText,
                { color: type === 'goal' ? theme.colors.trustBlue : theme.colors.textMuted }
              ]}>
                Goal
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Balance */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Current Balance</Text>
          <TextInput
            style={[styles.textInput, errors.currentBalance && styles.inputError]}
            value={currentBalance}
            onChangeText={setCurrentBalance}
            placeholder="Enter current balance"
            placeholderTextColor={theme.colors.textLight}
            keyboardType="numeric"
          />
          {errors.currentBalance && <Text style={styles.errorText}>{errors.currentBalance}</Text>}
        </View>

        {/* Target Amount (only for goal pockets) */}
        {type === 'goal' && (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Target Amount</Text>
            <TextInput
              style={[styles.textInput, errors.targetAmount && styles.inputError]}
              value={targetAmount}
              onChangeText={setTargetAmount}
              placeholder="Enter target amount"
              placeholderTextColor={theme.colors.textLight}
              keyboardType="numeric"
            />
            {errors.targetAmount && <Text style={styles.errorText}>{errors.targetAmount}</Text>}
          </View>
        )}

        {/* Transaction Count */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Initial Transaction Count (Optional)</Text>
          <TextInput
            style={styles.textInput}
            value={transactionCount}
            onChangeText={setTransactionCount}
            placeholder="Enter transaction count"
            placeholderTextColor={theme.colors.textLight}
            keyboardType="numeric"
          />
        </View>
      </View>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    fieldContainer: {
      marginBottom: theme.spacing.lg,
    },
    fieldLabel: {
      ...theme.typography.bodyMedium,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    textInput: {
      ...theme.typography.bodyLarge,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
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
    typeSelector: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    typeOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.sm,
    },
    typeOptionSelected: {
      borderColor: theme.colors.trustBlue,
      backgroundColor: theme.colors.trustBlue + '10',
    },
    typeOptionText: {
      ...theme.typography.bodyMedium,
      fontWeight: '500',
    },
  });
}