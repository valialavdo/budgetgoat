import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { X } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';
import BaseBottomSheet from './BaseBottomSheet';
import ActionButton from './ActionButton';
import LoadingSpinner from './LoadingSpinner';
import SuccessAnimation from './SuccessAnimation';
import ErrorFeedback from './ErrorFeedback';
import { SafeAreaContexts } from '../utils/safeAreaUtils';

export interface AddItemBottomSheetProps {
  /**
   * Whether the bottom sheet is visible
   */
  visible: boolean;
  
  /**
   * Callback when the bottom sheet should be closed
   */
  onClose: () => void;
  
  /**
   * Title of the bottom sheet
   */
  title: string;
  
  /**
   * Input field label
   */
  inputLabel: string;
  
  /**
   * Input field placeholder
   */
  inputPlaceholder: string;
  
  /**
   * Instruction text below the input
   */
  instructionText?: string;
  
  /**
   * Button text
   * @default 'Save'
   */
  buttonText?: string;
  
  /**
   * Callback when the item is saved
   */
  onSave: (value: string) => Promise<void>;
  
  /**
   * Initial value for the input
   */
  initialValue?: string;
  
  /**
   * Maximum length for the input
   */
  maxLength?: number;
  
  /**
   * Whether the input is multiline
   * @default false
   */
  multiline?: boolean;
  
  /**
   * Keyboard type for the input
   */
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  
  /**
   * Custom validation function
   */
  validateInput?: (value: string) => string | null;
}

/**
 * Reusable AddItemBottomSheet component for adding new items
 * 
 * Features:
 * - Mimics the design from the reference image
 * - Dark/light mode support
 * - Microinteractions with haptic feedback
 * - Form validation with error feedback
 * - Loading states and success animations
 * - Full accessibility compliance
 * 
 * Usage:
 * ```tsx
 * <AddItemBottomSheet
 *   visible={showAddPocket}
 *   onClose={() => setShowAddPocket(false)}
 *   title="Add New Pocket"
 *   inputLabel="Pocket Name"
 *   inputPlaceholder="Enter pocket name"
 *   instructionText="Pocket names help you organize your savings"
 *   onSave={handleAddPocket}
 * />
 * ```
 */
export default function AddItemBottomSheet({
  visible,
  onClose,
  title,
  inputLabel,
  inputPlaceholder,
  instructionText,
  buttonText = 'Save',
  onSave,
  initialValue = '',
  maxLength,
  multiline = false,
  keyboardType = 'default',
  validateInput,
}: AddItemBottomSheetProps) {
  const theme = useTheme();
  const { triggerHaptic } = useMicroInteractions();
  
  const [inputValue, setInputValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset form when bottom sheet opens/closes
  useEffect(() => {
    if (visible) {
      setInputValue(initialValue);
      setShowError(false);
      setShowSuccess(false);
    }
  }, [visible, initialValue]);

  const handleSave = async () => {
    const trimmedValue = inputValue.trim();
    
    // Validate input
    if (!trimmedValue) {
      setErrorMessage(`${inputLabel} is required`);
      setShowError(true);
      triggerHaptic('error');
      return;
    }

    if (validateInput) {
      const validationError = validateInput(trimmedValue);
      if (validationError) {
        setErrorMessage(validationError);
        setShowError(true);
        triggerHaptic('error');
        return;
      }
    }

    setLoading(true);
    triggerHaptic('light');

    try {
      await onSave(trimmedValue);
      setLoading(false);
      setShowSuccess(true);
      triggerHaptic('success');
      
      // Auto-close after success animation
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      setLoading(false);
      setErrorMessage('Failed to save. Please try again.');
      setShowError(true);
      triggerHaptic('error');
    }
  };

  const handleClose = () => {
    triggerHaptic('light');
    onClose();
  };

  const styles = getStyles(theme);

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={handleClose}
      title="Add New Item"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          <ActionButton
            title=""
            onPress={handleClose}
            variant="ghost"
            size="small"
            icon={<X weight="light" size={20} color={theme.colors.text} />}
            style={styles.closeButton}
            hapticType="light"
            accessibilityLabel="Close"
          />
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
            {inputLabel}
          </Text>
          
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              },
              multiline && styles.multilineInput,
            ]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={inputPlaceholder}
            placeholderTextColor={theme.colors.textMuted}
            maxLength={maxLength}
            multiline={multiline}
            keyboardType={keyboardType}
            autoFocus={true}
            accessible={true}
            accessibilityLabel={`${inputLabel} input`}
            accessibilityHint={`Enter ${inputLabel.toLowerCase()}`}
          />
          
          {instructionText && (
            <Text style={[styles.instructionText, { color: theme.colors.textMuted }]}>
              {instructionText}
            </Text>
          )}
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <ActionButton
            title={buttonText}
            onPress={handleSave}
            variant="primary"
            size="large"
            fullWidth={true}
            disabled={loading || !inputValue.trim()}
            hapticType="success"
            accessibilityLabel={`${buttonText} ${inputLabel}`}
            accessibilityHint={`Saves the ${inputLabel.toLowerCase()}`}
          />
        </View>

        {/* Loading Spinner */}
        <LoadingSpinner
          visible={loading}
          message="Saving..."
          size="large"
          animated={true}
        />

        {/* Success Animation */}
        <SuccessAnimation
          visible={showSuccess}
          message={`${inputLabel} saved successfully!`}
          type="checkmark"
          duration={1500}
          onComplete={() => setShowSuccess(false)}
        />

        {/* Error Feedback */}
        <ErrorFeedback
          visible={showError}
          message={errorMessage}
          type="shake"
          duration={2000}
          onComplete={() => setShowError(false)}
        />
      </View>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: theme.spacing.lg,
    },
    title: {
      ...theme.typography.h4,
      fontWeight: '600',
      flex: 1,
      textAlign: 'center',
      marginRight: 44, // Compensate for close button width
    },
    closeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      padding: 0,
    },
    inputSection: {
      flex: 1,
      marginBottom: theme.spacing.xl,
    },
    inputLabel: {
      ...theme.typography.subtitle1,
      fontWeight: '500',
      marginBottom: theme.spacing.md,
    },
    textInput: {
      ...theme.typography.body1,
      borderWidth: 1,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      minHeight: theme.layout.inputHeight,
      textAlignVertical: 'top',
    },
    multilineInput: {
      minHeight: 100,
      maxHeight: 150,
    },
    instructionText: {
      ...theme.typography.caption,
      marginTop: theme.spacing.sm,
      lineHeight: 18,
    },
    buttonContainer: {
      marginTop: 'auto',
      paddingBottom: SafeAreaContexts.buttonContainer(), // Dynamic safe area for buttons
      paddingTop: theme.spacing.md,
    },
  });
}
