import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Modal,
  Alert,
  Switch
} from 'react-native';
import { X, TrendUp, TrendDown, Info } from 'phosphor-react-native';
import { BudgetContext } from '../context/BudgetContext';
import { Colors, Spacing, Radius, Typography, Layout, Shadows } from '../theme';
import { Transaction, Category } from '../types';

interface TransactionFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (transaction: Partial<Transaction>) => void;
  initialData?: Partial<Transaction>;
  isEditing?: boolean;
}

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

export default function TransactionForm({ 
  visible, 
  onClose, 
  onSave, 
  initialData,
  isEditing = false 
}: TransactionFormProps) {
  const { state } = useContext(BudgetContext);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPocketId, setSelectedPocketId] = useState('');
  const [date, setDate] = useState(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('monthly');
  const [duration, setDuration] = useState('');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setAmount(Math.abs(initialData.amount || 0).toString());
      setDescription(initialData.note || '');
      setSelectedPocketId(initialData.pocketCategoryId || '');
      setDate(new Date());
      setIsRecurring(initialData.recurrence?.isRecurring || false);
    }
  }, [initialData]);

  // Get available pockets for linking
  const availablePockets = state?.categories?.filter(cat => cat.type === 'bank') || [];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!selectedPocketId) {
      newErrors.pocket = 'Must link to a pocket';
    }
    
    if (isRecurring && !duration.trim()) {
      newErrors.duration = 'Duration is required for recurring transactions';
    } else if (isRecurring && (isNaN(Number(duration)) || Number(duration) <= 0)) {
      newErrors.duration = 'Duration must be a positive number of months';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    const transactionData: Partial<Transaction> = {
      type,
      amount: type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      note: description.trim(),
      pocketCategoryId: selectedPocketId,
      month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      recurrence: {
        isRecurring,
        frequency: isRecurring ? frequency : undefined,
        duration: isRecurring ? Number(duration) : undefined,
      },
    };
    
    onSave(transactionData);
    onClose();
    
    // Show success message
    Alert.alert('Success', `${isEditing ? 'Updated' : 'Created'} transaction successfully!`);
  };

  const getAIRecommendations = () => {
    const recommendations = [];
    
    if (type === 'expense' && Number(amount) > 1000) {
      recommendations.push('💡 Large expenses can impact monthly budget. Consider breaking into smaller amounts');
    }
    
    if (type === 'income' && isRecurring) {
      recommendations.push('💰 Recurring income is great for stable budgeting. Consider setting up automatic allocations');
    }
    
    if (isRecurring && Number(duration) > 12) {
      recommendations.push('📅 Long-term recurring transactions help with long-range planning');
    }
    
    const selectedPocket = availablePockets.find(p => p.id === selectedPocketId);
    if (selectedPocket && type === 'expense') {
      const pocketBalance = selectedPocket.defaultAmount || 0;
      if (Number(amount) > pocketBalance * 0.5) {
        recommendations.push('⚠️ This expense is over 50% of pocket balance. Consider spreading it out');
      }
    }
    
    if (tags.trim()) {
      recommendations.push('🏷️ Good use of tags! This helps with categorization and analysis');
    }
    
    return recommendations;
  };

  const renderTypeToggle = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Transaction Type</Text>
      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === 'income' && styles.typeButtonSelected
          ]}
          onPress={() => setType('income')}
          activeOpacity={0.7}
          accessibilityLabel="Select income transaction type"
          accessibilityRole="button"
        >
          <TrendUp weight="regular" size={20} color={type === 'income' ? Colors.background : Colors.income} />
          <Text style={[
            styles.typeButtonText,
            type === 'income' && styles.typeButtonTextSelected
          ]}>
            Income
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === 'expense' && styles.typeButtonSelected
          ]}
          onPress={() => setType('expense')}
          activeOpacity={0.7}
          accessibilityLabel="Select expense transaction type"
          accessibilityRole="button"
        >
          <TrendDown weight="regular" size={20} color={type === 'expense' ? Colors.background : Colors.expense} />
          <Text style={[
            styles.typeButtonText,
            type === 'expense' && styles.typeButtonTextSelected
          ]}>
            Expense
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPocketSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Link to Pocket</Text>
      <View style={styles.pocketGrid}>
        {availablePockets.map((pocket) => (
          <TouchableOpacity
            key={pocket.id}
            style={[
              styles.pocketCard,
              selectedPocketId === pocket.id && styles.pocketCardSelected
            ]}
            onPress={() => setSelectedPocketId(pocket.id)}
            activeOpacity={0.7}
            accessibilityLabel={`Select ${pocket.name} pocket`}
            accessibilityRole="button"
          >
            <Text style={styles.pocketIcon}>🏦</Text>
            <Text style={[
              styles.pocketName,
              selectedPocketId === pocket.id && styles.pocketNameSelected
            ]}>
              {pocket.name}
            </Text>
            <Text style={[
              styles.pocketBalance,
              selectedPocketId === pocket.id && styles.pocketBalanceSelected
            ]}>
              €{pocket.defaultAmount?.toLocaleString() || 0}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.pocket && <Text style={styles.errorText}>{errors.pocket}</Text>}
    </View>
  );

  const renderRecurringSection = () => (
    <View style={styles.section}>
      <View style={styles.recurringHeader}>
        <Text style={styles.sectionTitle}>Recurring Transaction</Text>
        <Switch
          value={isRecurring}
          onValueChange={setIsRecurring}
          trackColor={{ false: Colors.border, true: Colors.goatGreen }}
          thumbColor={Colors.background}
        />
      </View>
      
      {isRecurring && (
        <View style={styles.recurringContent}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyGrid}>
              {FREQUENCIES.map((freq) => (
                <TouchableOpacity
                  key={freq.value}
                  style={[
                    styles.frequencyButton,
                    frequency === freq.value && styles.frequencyButtonSelected
                  ]}
                  onPress={() => setFrequency(freq.value)}
                >
                  <Text style={[
                    styles.frequencyButtonText,
                    frequency === freq.value && styles.frequencyButtonTextSelected
                  ]}>
                    {freq.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Duration (months)</Text>
            <TextInput
              style={[styles.input, errors.duration && styles.inputError]}
              value={duration}
              onChangeText={setDuration}
              placeholder="12"
              placeholderTextColor={Colors.textLight}
              keyboardType="numeric"
              accessibilityLabel="Duration input"
            />
            {errors.duration && <Text style={styles.errorText}>{errors.duration}</Text>}
            <Text style={styles.hint}>
              How many months should this transaction repeat?
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Transaction' : 'New Transaction'}
          </Text>
          <TouchableOpacity 
            onPress={() => setShowAIRecommendations(!showAIRecommendations)}
            style={styles.infoButton}
          >
            <Info size={20} color={Colors.trustBlue} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* AI Recommendations */}
          {showAIRecommendations && (
            <View style={styles.aiContainer}>
              <Text style={styles.aiTitle}>🤖 AI Recommendations</Text>
              {getAIRecommendations().map((rec, index) => (
                <Text key={index} style={styles.aiRecommendation}>{rec}</Text>
              ))}
            </View>
          )}

          {/* Transaction Type Toggle */}
          {renderTypeToggle()}

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transaction Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, errors.description && styles.inputError]}
                value={description}
                onChangeText={setDescription}
                placeholder="e.g., Groceries, Salary, Coffee"
                placeholderTextColor={Colors.textLight}
                accessibilityLabel="Transaction description input"
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Amount (€)</Text>
              <TextInput
                style={[styles.input, errors.amount && styles.inputError]}
                value={amount}
                onChangeText={setAmount}
                placeholder="120"
                placeholderTextColor={Colors.textLight}
                keyboardType="numeric"
                accessibilityLabel="Amount input"
              />
              {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
              <Text style={styles.hint}>
                {type === 'income' ? 'Positive amount will be added to pocket' : 'Amount will be deducted from pocket'}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tags (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={tags}
                onChangeText={setTags}
                placeholder="groceries, monthly, essential"
                placeholderTextColor={Colors.textLight}
                accessibilityLabel="Tags input"
              />
              <Text style={styles.hint}>
                Separate tags with commas for better organization
              </Text>
            </View>
          </View>

          {/* Pocket Selection */}
          {renderPocketSelector()}

          {/* Recurring Options */}
          {renderRecurringSection()}
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: type === 'income' ? Colors.income : Colors.expense }
            ]}
            onPress={handleSave}
            accessibilityLabel="Save transaction"
            accessibilityRole="button"
          >
            {type === 'income' ? (
              <TrendUp weight="regular" size={20} color={Colors.background} />
            ) : (
              <TrendDown weight="regular" size={20} color={Colors.background} />
            )}
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Transaction' : 'Create Transaction'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingTop: 48, // 48px from top
  },
  backdrop: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.background,
    maxHeight: '85%', // Limit height to 85% of screen
    minHeight: '60%', // Ensure minimum height for content
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  closeButton: {
    width: Layout.minTapArea,
    height: Layout.minTapArea,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  infoButton: {
    width: Layout.minTapArea,
    height: Layout.minTapArea,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg, // Add bottom padding for better scrolling
  },
  aiContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginVertical: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.trustBlue,
  },
  aiTitle: {
    ...Typography.bodyMedium,
    color: Colors.trustBlue,
    marginBottom: Spacing.sm,
  },
  aiRecommendation: {
    ...Typography.caption,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  section: {
    marginVertical: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  typeToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  typeButtonSelected: {
    backgroundColor: Colors.trustBlue,
    borderColor: Colors.trustBlue,
  },
  typeButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
  },
  typeButtonTextSelected: {
    color: Colors.background,
  },
  pocketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  pocketCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  pocketCardSelected: {
    backgroundColor: Colors.trustBlue,
    borderColor: Colors.trustBlue,
  },
  pocketIcon: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  pocketName: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  pocketNameSelected: {
    color: Colors.background,
  },
  pocketBalance: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  pocketBalanceSelected: {
    color: Colors.background,
    opacity: 0.8,
  },
  recurringHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  recurringContent: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  frequencyGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  frequencyButtonSelected: {
    backgroundColor: Colors.trustBlue,
    borderColor: Colors.trustBlue,
  },
  frequencyButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  frequencyButtonTextSelected: {
    color: Colors.background,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    ...Typography.body,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.alertRed,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  errorText: {
    ...Typography.caption,
    color: Colors.alertRed,
    marginTop: Spacing.xs,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
    position: 'relative', // Ensure footer stays at bottom
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    minHeight: Layout.minTapArea,
    gap: Spacing.sm,
  },
  saveButtonText: {
    ...Typography.button,
    color: Colors.background,
  },
});
