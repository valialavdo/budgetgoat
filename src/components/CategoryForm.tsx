import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Switch
} from 'react-native';
import { Plus, Calendar, Info, Clock } from 'phosphor-react-native';
import { Colors, Spacing, Radius, Typography, Layout, Shadows } from '../theme';
import { Category, CategoryType } from '../types';
import BaseBottomSheet from './BaseBottomSheet';
import ActionButton from './ActionButton';
import SegmentedControl from './SegmentedControl';

interface CategoryFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (category: Partial<Category>) => void;
  initialData?: Partial<Category>;
  isEditing?: boolean;
}

const CATEGORY_TYPES: { type: CategoryType; label: string; color: string; icon: string }[] = [
  { type: 'income', label: 'Income', color: Colors.income, icon: '💰' },
  { type: 'bank', label: 'Bank/Pocket', color: Colors.pocket, icon: '🏦' },
  { type: 'extra', label: 'Extra', color: Colors.expense, icon: '💸' },
];

const QUICK_MONTHS = [
  { label: '2M', months: 2 },
  { label: '3M', months: 3 },
  { label: '4M', months: 4 },
  { label: '6M', months: 6 },
  { label: '12M', months: 12 },
];

export default function CategoryForm({ 
  visible, 
  onClose, 
  onSave, 
  initialData,
  isEditing = false 
}: CategoryFormProps) {
  const [selectedType, setSelectedType] = useState<CategoryType>('extra');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [allocationMode, setAllocationMode] = useState<'amount' | 'percent'>('amount');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setAmount(initialData.defaultAmount ? String(initialData.defaultAmount) : '');
      setDescription('');
      setSelectedType(initialData.type || 'extra');
      setIsRecurring(initialData.recurrence?.isRecurring || false);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount))) {
      newErrors.amount = 'Amount must be a valid number';
    }
    
    if (selectedType === 'extra' && Number(amount) > 0) {
      newErrors.amount = 'Extra expenses should be negative numbers';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    const categoryData: Partial<Category> = {
      name: name.trim(),
      type: selectedType,
      defaultAmount: selectedType === 'extra' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      isInflux: selectedType === 'income',
      color: selectedType === 'income' ? Colors.income : selectedType === 'bank' ? Colors.pocket : Colors.expense,
      recurrence: {
        isRecurring,
      },
    };
    
    onSave(categoryData);
    onClose();
    
    // Show success message
    Alert.alert('Success', `${isEditing ? 'Updated' : 'Created'} ${selectedType} category successfully!`);
  };

  const getAIRecommendations = () => {
    const recommendations = [];
    
    if (selectedType === 'extra' && Number(amount) > 1000) {
      recommendations.push('💡 Consider breaking this into smaller monthly amounts');
    }
    
    if (selectedType === 'income' && isRecurring) {
      recommendations.push('🎯 Great! Recurring income helps with long-term planning');
    }
    
    if (selectedType === 'bank' && Number(amount) > 0) {
      recommendations.push('🏦 This bank/pocket will accumulate funds over time');
    }
    
    return recommendations;
  };

  const renderTypeTabs = () => (
    <SegmentedControl
      options={CATEGORY_TYPES.map((type) => ({
        value: type.type,
        label: type.label,
        icon: <Text style={styles.tabIcon}>{type.icon}</Text>
      }))}
      selectedValue={selectedType}
      onValueChange={(value) => setSelectedType(value as CategoryType)}
    />
  );

  const renderMonthSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>When to start?</Text>
      
      {/* Quick Month Options */}
      <View style={styles.quickMonthsContainer}>
        <Text style={styles.quickMonthsLabel}>Quick Select:</Text>
        <View style={styles.quickMonthsGrid}>
          {QUICK_MONTHS.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.quickMonthButton,
                selectedMonth === option.months && styles.quickMonthButtonSelected
              ]}
              onPress={() => setSelectedMonth(option.months)}
              accessibilityLabel={`Select ${option.label} months ahead`}
              accessibilityRole="button"
            >
              <Text style={[
                styles.quickMonthButtonText,
                selectedMonth === option.months && styles.quickMonthButtonTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Calendar Picker */}
      <View style={styles.calendarSection}>
        <Text style={styles.calendarLabel}>Or choose exact date:</Text>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => setShowCalendar(true)}
          accessibilityLabel="Open calendar picker"
          accessibilityRole="button"
        >
          <Calendar weight="light" size={20} color={Colors.trustBlue} />
          <Text style={styles.calendarButtonText}>
            {selectedMonth === 0 ? 'Current Month' : 
             selectedMonth === 1 ? 'Next Month' : 
             `${selectedMonth} months ahead`}
          </Text>
          <Clock weight="light" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAllocationMode = () => selectedType === 'income' && (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Allocation Mode</Text>
      <View style={styles.allocationContainer}>
        <TouchableOpacity
          style={[
            styles.allocationButton,
            allocationMode === 'amount' && styles.allocationButtonSelected
          ]}
          onPress={() => setAllocationMode('amount')}
          accessibilityLabel="Select amount-based allocation"
          accessibilityRole="button"
        >
          <Text style={[
            styles.allocationButtonText,
            allocationMode === 'amount' && styles.allocationButtonTextSelected
          ]}>
            Amount
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.allocationButton,
            allocationMode === 'percent' && styles.allocationButtonSelected
          ]}
          onPress={() => setAllocationMode('percent')}
          accessibilityLabel="Select percentage-based allocation"
          accessibilityRole="button"
        >
          <Text style={[
            styles.allocationButtonText,
            allocationMode === 'percent' && styles.allocationButtonTextSelected
          ]}>
            Percentage
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title={isEditing ? 'Edit Category' : 'New Category'}
      showActionButtons={true}
      actionButtonText="Save Category"
      onActionButtonPress={handleSave}
      cancelButtonText="Cancel"
      onCancelButtonPress={onClose}
    >

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

          {/* Category Type Tabs */}
          {renderTypeTabs()}

          {/* Month Selector */}
          {renderMonthSelector()}

          {/* Form Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Groceries, Salary, Savings"
                placeholderTextColor={Colors.textLight}
                accessibilityLabel="Category name input"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={[styles.input, errors.amount && styles.inputError]}
                value={amount}
                onChangeText={setAmount}
                placeholder={selectedType === 'extra' ? "-120" : "2000"}
                placeholderTextColor={Colors.textLight}
                keyboardType="numeric"
                accessibilityLabel="Amount input"
              />
              {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
              <Text style={styles.hint}>
                {selectedType === 'extra' ? 'Use negative numbers for expenses' : 'Use positive numbers for income'}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add notes or details about this category..."
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={3}
                accessibilityLabel="Description input"
              />
            </View>

            {/* Allocation Mode for Income */}
            {renderAllocationMode()}

            {/* Recurring Toggle */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Recurring monthly</Text>
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{ false: Colors.border, true: Colors.goatGreen }}
                thumbColor={Colors.background}
                accessibilityLabel="Toggle recurring monthly"
              />
            </View>
          </View>
        </ScrollView>
    </BaseBottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  tabContainer: {
    flexDirection: 'row',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    marginHorizontal: Spacing.xs,
  },
  tabIcon: {
    fontSize: 20,
    marginRight: Spacing.xs,
  },
  tabLabel: {
    ...Typography.bodyMedium,
    color: Colors.textMuted,
  },
  tabLabelSelected: {
    color: Colors.background,
    fontWeight: '600',
  },
  section: {
    marginVertical: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.sectionTitleToContent,
  },
  quickMonthsContainer: {
    marginBottom: Spacing.md,
  },
  quickMonthsLabel: {
    ...Typography.bodyMedium,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  quickMonthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickMonthButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 60,
    alignItems: 'center',
  },
  quickMonthButtonSelected: {
    backgroundColor: Colors.trustBlue,
    borderColor: Colors.trustBlue,
  },
  quickMonthButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  quickMonthButtonTextSelected: {
    color: Colors.background,
  },
  calendarSection: {
    marginTop: Spacing.md,
  },
  calendarLabel: {
    ...Typography.bodyMedium,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  calendarButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginLeft: Spacing.sm,
    flex: 1,
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
    ...Typography.bodyRegular,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.alertRed,
  },
  textArea: {
    height: 80,
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
  allocationContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  allocationButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  allocationButtonSelected: {
    backgroundColor: Colors.trustBlue,
    borderColor: Colors.trustBlue,
  },
  allocationButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  allocationButtonTextSelected: {
    color: Colors.background,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  toggleLabel: {
    ...Typography.bodyRegular,
    color: Colors.text,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  saveButton: {
    backgroundColor: Colors.goatGreen,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    minHeight: Layout.minTapArea,
    justifyContent: 'center',
  },
  saveButtonText: {
    ...Typography.button,
    color: Colors.background,
  },
});
