import React, { useState, useEffect } from 'react';
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
import { X, Info, Crown, Wallet } from 'phosphor-react-native';
import { Colors, Spacing, Radius, Typography, Layout } from '../theme';
import { Category } from '../types';

interface PocketFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (pocket: Partial<Category>) => void;
  initialData?: Partial<Category>;
  isEditing?: boolean;
}

const POCKET_TYPES = [
  { type: 'bank', label: 'Bank Account', icon: '🏦', description: 'Traditional bank accounts' },
  { type: 'cash', label: 'Cash', icon: '💵', description: 'Physical cash on hand' },
  { type: 'custom', label: 'Custom', icon: '📁', description: 'Other storage methods' },
];

export default function PocketForm({ 
  visible, 
  onClose, 
  onSave, 
  initialData,
  isEditing = false 
}: PocketFormProps) {
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [selectedType, setSelectedType] = useState('bank');
  const [notes, setNotes] = useState('');
  const [isGoalPocket, setIsGoalPocket] = useState(false);
  const [targetAmount, setTargetAmount] = useState('');
  const [timeline, setTimeline] = useState('');
  const [carryover, setCarryover] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setInitialBalance(initialData.defaultAmount?.toString() || '');
      setSelectedType(initialData.type || 'bank');
      setNotes(initialData.notes || '');
      setIsGoalPocket(initialData.notes?.includes('goal') || false);
      // Extract goal data from notes if available
      if (initialData.notes?.includes('goal')) {
        const goalMatch = initialData.notes.match(/target:(\d+),timeline:(\d+)/);
        if (goalMatch) {
          setTargetAmount(goalMatch[1]);
          setTimeline(goalMatch[2]);
        }
      }
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) {
      newErrors.name = 'Pocket name is required';
    }
    
    if (!initialBalance.trim()) {
      newErrors.initialBalance = 'Initial balance is required';
    } else if (isNaN(Number(initialBalance))) {
      newErrors.initialBalance = 'Initial balance must be a valid number';
    }
    
    if (isGoalPocket) {
      if (!targetAmount.trim()) {
        newErrors.targetAmount = 'Target amount is required for goal pockets';
      } else if (isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
        newErrors.targetAmount = 'Target amount must be a positive number';
      }
      
      if (!timeline.trim()) {
        newErrors.timeline = 'Timeline is required for goal pockets';
      } else if (isNaN(Number(timeline)) || Number(timeline) <= 0) {
        newErrors.timeline = 'Timeline must be a positive number of months';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    const pocketData: Partial<Category> = {
      name: name.trim(),
      type: 'bank',
      defaultAmount: Math.abs(Number(initialBalance)),
      isInflux: true,
      color: Colors.pocket,
      notes: notes.trim(),
      recurrence: {
        isRecurring: true,
      },
    };
    
    // Add goal information to notes if it's a goal pocket
    if (isGoalPocket) {
      pocketData.notes = `${notes.trim()}\n[goal] target:${targetAmount},timeline:${timeline}`;
    }
    
    onSave(pocketData);
    onClose();
    
    // Show success message
    Alert.alert('Success', `${isEditing ? 'Updated' : 'Created'} pocket successfully!`);
  };

  const getAIRecommendations = () => {
    const recommendations = [];
    
    if (isGoalPocket && targetAmount && timeline) {
      const monthlyAmount = Number(targetAmount) / Number(timeline);
      const initialBalanceNum = Number(initialBalance) || 0;
      
      if (monthlyAmount > Number(initialBalance)) {
        recommendations.push('💡 Consider increasing your monthly contribution to reach your goal faster');
      }
      
      if (Number(timeline) < 3) {
        recommendations.push('🎯 Short timelines can be challenging. Consider extending to 6+ months for better success');
      }
      
      if (Number(targetAmount) > Number(initialBalance) * 10) {
        recommendations.push('🏆 This is an ambitious goal! Consider breaking it into smaller milestones');
      }
    }
    
    if (selectedType === 'bank' && Number(initialBalance) > 10000) {
      recommendations.push('🏦 Large balances are great! Consider splitting into multiple accounts for different purposes');
    }
    
    if (carryover) {
      recommendations.push('✅ Carryover enabled - your pocket will maintain balance month to month');
    }
    
    return recommendations;
  };

  const renderTypeSelector = () => (
    <View style={styles.typeGrid}>
      {POCKET_TYPES.map((type) => (
        <TouchableOpacity
          key={type.type}
          style={[
            styles.typeCard,
            selectedType === type.type && styles.typeCardSelected
          ]}
          onPress={() => setSelectedType(type.type)}
          accessibilityLabel={`Select ${type.label} pocket type`}
          accessibilityRole="button"
        >
          <Text style={styles.typeIcon}>{type.icon}</Text>
          <Text style={[
            styles.typeLabel,
            selectedType === type.type && styles.typeLabelSelected
          ]}>
            {type.label}
          </Text>
          <Text style={[
            styles.typeDescription,
            selectedType === type.type && styles.typeDescriptionSelected
          ]}>
            {type.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderGoalSection = () => (
    <>
      <View style={styles.goalHeader}>
        <Switch
          value={isGoalPocket}
          onValueChange={setIsGoalPocket}
          trackColor={{ false: Colors.border, true: Colors.goatGreen }}
          thumbColor={Colors.background}
        />
      </View>
      
              {isGoalPocket && (
          <View style={styles.goalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Target Amount (€)</Text>
              <TextInput
                style={[styles.input, errors.targetAmount && styles.inputError]}
                value={targetAmount}
                onChangeText={setTargetAmount}
                placeholder="5000"
                placeholderTextColor={Colors.textLight}
                keyboardType="numeric"
                accessibilityLabel="Target amount input"
              />
              {errors.targetAmount && <Text style={styles.errorText}>{errors.targetAmount}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Timeline (months)</Text>
              <TextInput
                style={[styles.input, errors.timeline && styles.inputError]}
                value={timeline}
                onChangeText={setTimeline}
                placeholder="12"
                placeholderTextColor={Colors.textLight}
                keyboardType="numeric"
                accessibilityLabel="Timeline input"
              />
              {errors.timeline && <Text style={styles.errorText}>{errors.timeline}</Text>}
            </View>

          {targetAmount && timeline && (
            <View style={styles.goalPreview}>
              <Text style={styles.goalPreviewTitle}>🎯 Goal Preview</Text>
              <Text style={styles.goalPreviewText}>
                Monthly contribution: €{Math.ceil(Number(targetAmount) / Number(timeline))}
              </Text>
              <Text style={styles.goalPreviewText}>
                Target date: {new Date(Date.now() + Number(timeline) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      )}
    </>
  );

  const renderCarryoverToggle = () => (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleLeft}>
        <Wallet weight="regular" size={24} color={Colors.trustBlue} />
        <View style={styles.toggleText}>
          <Text style={styles.toggleTitle}>Monthly Carryover</Text>
          <Text style={styles.toggleSubtitle}>Keep balance between months</Text>
        </View>
      </View>
      <Switch
        value={carryover}
        onValueChange={setCarryover}
        trackColor={{ false: Colors.border, true: Colors.goatGreen }}
        thumbColor={Colors.background}
      />
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
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Pocket' : 'New Pocket'}
          </Text>
          <TouchableOpacity 
            onPress={() => setShowAIRecommendations(!showAIRecommendations)}
            style={styles.infoButton}
            activeOpacity={0.7}
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

          {/* Pocket Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pocket Type</Text>
            {renderTypeSelector()}
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pocket Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pocket Name</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Main Account, Vacation Fund, Emergency Savings"
                placeholderTextColor={Colors.textLight}
                accessibilityLabel="Pocket name input"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Initial Balance (€)</Text>
              <TextInput
                style={[styles.input, errors.initialBalance && styles.inputError]}
                value={initialBalance}
                onChangeText={setInitialBalance}
                placeholder="1000"
                placeholderTextColor={Colors.textLight}
                keyboardType="numeric"
                accessibilityLabel="Initial balance input"
              />
              {errors.initialBalance && <Text style={styles.errorText}>{errors.initialBalance}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about this pocket..."
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={3}
                accessibilityLabel="Notes input"
              />
            </View>
          </View>

          {/* Goal Tracking */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Goal Tracking</Text>
            {renderGoalSection()}
          </View>

          {/* Carryover Toggle */}
          <View style={styles.section}>
            {renderCarryoverToggle()}
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
            accessibilityLabel="Save pocket"
            accessibilityRole="button"
          >
            <Crown weight="regular" size={20} color={Colors.background} />
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Pocket' : 'Create Pocket'}
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
  typeGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  typeCardSelected: {
    backgroundColor: Colors.trustBlue,
    borderColor: Colors.trustBlue,
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  typeLabel: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  typeLabelSelected: {
    color: Colors.background,
  },
  typeDescription: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    fontSize: 11,
  },
  typeDescriptionSelected: {
    color: Colors.background,
    opacity: 0.8,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: Spacing.md,
  },
  goalContent: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
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
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    ...Typography.caption,
    color: Colors.alertRed,
    marginTop: Spacing.xs,
  },
  goalPreview: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.goatGreen,
  },
  goalPreviewTitle: {
    ...Typography.bodyMedium,
    color: Colors.goatGreen,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  goalPreviewText: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  toggleTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
  },
  toggleSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
    position: 'relative', // Ensure footer stays at bottom
  },
  saveButton: {
    backgroundColor: Colors.goatGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    minHeight: Layout.minTapArea,
  },
  saveButtonText: {
    ...Typography.button,
    color: Colors.background,
    marginLeft: Spacing.sm,
  },

});
