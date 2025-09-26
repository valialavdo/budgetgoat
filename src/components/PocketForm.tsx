import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Wallet, Target } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import BaseBottomSheet from './BaseBottomSheet';
import SegmentedControl from './SegmentedControl';
import FormInput from './FormInput';

interface PocketFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (pocket: {
    name: string;
    description: string;
    type: 'standard' | 'goal';
    currentBalance: number;
    targetAmount?: number;
    transactionCount: number;
  }) => void;
}

export default function PocketForm({ visible, onClose, onSave }: PocketFormProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'standard' | 'goal'>('standard');
  const [currentBalance, setCurrentBalance] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [transactionCount, setTransactionCount] = useState('0');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      setName('');
      setDescription('');
      setType('standard');
      setCurrentBalance('');
      setTargetAmount('');
      setTransactionCount('0');
      setErrors({});
    }
  }, [visible]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Pocket name is required';
    }
    
    if (!currentBalance.trim()) {
      newErrors.balance = 'Current balance is required';
    } else {
      const balance = parseFloat(currentBalance);
      if (isNaN(balance) || balance < 0) {
        newErrors.balance = 'Please enter a valid balance';
      }
    }
    
    if (type === 'goal') {
      if (!targetAmount.trim()) {
        newErrors.targetAmount = 'Target amount is required for goal pockets';
      } else {
        const target = parseFloat(targetAmount);
        if (isNaN(target) || target <= 0) {
          newErrors.targetAmount = 'Please enter a valid target amount';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const balance = parseFloat(currentBalance);
    let target: number | undefined;
    
    if (type === 'goal') {
      target = parseFloat(targetAmount);
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      type,
      currentBalance: balance,
      targetAmount: target,
      transactionCount: parseInt(transactionCount) || 0,
    });

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Check if form is valid
  const isFormValid = name.trim() && 
    currentBalance.trim() && 
    !isNaN(parseFloat(currentBalance)) && 
    parseFloat(currentBalance) >= 0 &&
    (type === 'standard' || (type === 'goal' && targetAmount.trim() && !isNaN(parseFloat(targetAmount)) && parseFloat(targetAmount) > 0));

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title={name.trim() ? `Create '${name.trim()}'` : 'Create New Pocket'}
      showActionButtons={true}
      actionButtonText="Create Pocket"
      onActionButtonPress={handleSave}
      actionButtonDisabled={!isFormValid}
      cancelButtonText="Cancel"
      onCancelButtonPress={handleCancel}
    >

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.form}>
              {/* Name */}
              <View style={styles.inputGroup}>
                <FormInput
                  label="Pocket Name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) {
                      setErrors(prev => ({ ...prev, name: '' }));
                    }
                  }}
                  placeholder="e.g., Vacation Fund"
                  error={errors.name}
                />
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <FormInput
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="e.g., Saving for summer vacation"
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Type Selection */}
              <View style={styles.inputGroup}>
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
                  selectedValue={type}
                  onValueChange={(value) => setType(value as 'standard' | 'goal')}
                  size="small"
                />
              </View>

              {/* Current Balance */}
              <View style={styles.inputGroup}>
                <FormInput
                  label="Current Balance"
                  value={currentBalance}
                  onChangeText={(text: string) => {
                    setCurrentBalance(text);
                    if (errors.balance) {
                      setErrors(prev => ({ ...prev, balance: '' }));
                    }
                  }}
                  placeholder="0"
                  keyboardType="numeric"
                  error={errors.balance}
                />
              </View>

              {/* Target Amount (only for goal type) */}
              {type === 'goal' && (
                <View style={styles.inputGroup}>
                  <FormInput
                    label="Target Amount"
                    value={targetAmount}
                    onChangeText={(text: string) => {
                      setTargetAmount(text);
                      if (errors.targetAmount) {
                        setErrors(prev => ({ ...prev, targetAmount: '' }));
                      }
                    }}
                    placeholder="0"
                    keyboardType="numeric"
                    error={errors.targetAmount}
                  />
                </View>
              )}
               
              {/* Transaction Count */}
              <View style={styles.inputGroup}>
                <FormInput
                  label="Initial Transaction Count"
                  value={transactionCount}
                  onChangeText={setTransactionCount}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
             </View>
           </ScrollView>
    </BaseBottomSheet>
   );
 }

function getStyles(theme: any) {
  return StyleSheet.create({
    content: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
    },
    form: {
      gap: theme.spacing.lg,
    },
    inputGroup: {
      gap: theme.spacing.sm,
    },
  });
}
