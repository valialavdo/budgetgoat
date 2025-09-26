import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { Trash, Warning } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';
import BaseBottomSheet from './BaseBottomSheet';
import ActionButton from './ActionButton';
import LoadingSpinner from './LoadingSpinner';
import SuccessAnimation from './SuccessAnimation';

interface ClearDataConfirmationBottomSheetProps {
  /**
   * Whether the bottom sheet is visible
   */
  visible: boolean;
  
  /**
   * Callback when the bottom sheet should be closed
   */
  onClose: () => void;
  
  /**
   * Callback when data is successfully cleared
   */
  onDataCleared: () => void;
}

/**
 * ClearDataConfirmationBottomSheet - Modal for confirming data deletion
 * 
 * Features:
 * - Strong warning about data deletion
 * - Two-step confirmation process
 * - Loading states during deletion
 * - Success feedback
 * - Accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Microinteractions
 * 
 * Usage: Trigger from AccountScreen Clear All Data setting
 */
export default function ClearDataConfirmationBottomSheet({
  visible,
  onClose,
  onDataCleared,
}: ClearDataConfirmationBottomSheetProps) {
  const theme = useTheme();
  const { triggerHaptic } = useMicroInteractions();
  
  const [isClearing, setIsClearing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState<'warning' | 'confirm'>('warning');

  const handleProceed = () => {
    triggerHaptic('light');
    setStep('confirm');
  };

  const handleGoBack = () => {
    triggerHaptic('light');
    setStep('warning');
  };

  const handleConfirmClear = async () => {
    setIsClearing(true);
    triggerHaptic('medium');

    try {
      // TODO: Implement actual data clearing
      // await clearAllUserData();
      
      // Simulate data clearing process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setShowSuccess(true);
      triggerHaptic('success');
      
      setTimeout(() => {
        setShowSuccess(false);
        onDataCleared();
        onClose();
        setStep('warning'); // Reset for next time
      }, 2000);
      
    } catch (error) {
      triggerHaptic('error');
      Alert.alert('Error', 'Failed to clear data. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  const styles = getStyles(theme);

  const renderWarningStep = () => (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <Warning 
          weight="light" 
          size={48} 
          color={theme.colors.alertRed} 
        />
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Clear All Data
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.textMuted }]}>
          This will permanently delete all your data including:
        </Text>
        
        <View style={styles.dataList}>
          <Text style={[styles.dataItem, { color: theme.colors.textMuted }]}>
            • All transactions and history
          </Text>
          <Text style={[styles.dataItem, { color: theme.colors.textMuted }]}>
            • All pockets and savings goals
          </Text>
          <Text style={[styles.dataItem, { color: theme.colors.textMuted }]}>
            • Spending analytics and reports
          </Text>
          <Text style={[styles.dataItem, { color: theme.colors.textMuted }]}>
            • App preferences and settings
          </Text>
        </View>
        
        <Text style={[styles.warningText, { color: theme.colors.alertRed }]}>
          This action cannot be undone!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <ActionButton
          title="Cancel"
          variant="outline"
          size="medium"
          onPress={onClose}
          hapticType="light"
          accessibilityLabel="Cancel data clearing"
          accessibilityHint="Keeps all your data intact"
        />
        
        <ActionButton
          title="I Understand"
          variant="danger"
          size="medium"
          onPress={handleProceed}
          hapticType="medium"
          accessibilityLabel="Proceed to final confirmation"
          accessibilityHint="Continues to the final confirmation step"
        />
      </View>
    </View>
  );

  const renderConfirmStep = () => (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <Trash 
          weight="light" 
          size={48} 
          color={theme.colors.alertRed} 
        />
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Final Confirmation
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.textMuted }]}>
          Are you absolutely sure you want to delete all your data? This action is permanent and cannot be undone.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <ActionButton
          title="Go Back"
          variant="outline"
          size="medium"
          onPress={handleGoBack}
          hapticType="light"
          accessibilityLabel="Go back to previous step"
          accessibilityHint="Returns to the warning step"
        />
        
        <ActionButton
          title="Delete Everything"
          variant="danger"
          size="medium"
          onPress={handleConfirmClear}
          disabled={isClearing}
          hapticType="heavy"
          accessibilityLabel="Delete all data permanently"
          accessibilityHint="Permanently deletes all your data"
        />
      </View>
    </View>
  );

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Clear All Data"
    >
      {step === 'warning' ? renderWarningStep() : renderConfirmStep()}

      {/* Loading Overlay */}
      {isClearing && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner size="large" visible={true} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Clearing your data...
          </Text>
        </View>
      )}

      {/* Success Animation */}
      {showSuccess && (
        <View style={styles.successOverlay}>
          <SuccessAnimation type="checkmark" visible={true} />
          <Text style={[styles.successText, { color: theme.colors.text }]}>
            Data cleared successfully
          </Text>
        </View>
      )}
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.screenPadding,
      paddingTop: theme.spacing.lg,
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    descriptionContainer: {
      marginBottom: theme.spacing.xl,
    },
    title: {
      ...theme.typography.h4,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    description: {
      ...theme.typography.body1,
      lineHeight: 24,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    dataList: {
      marginBottom: theme.spacing.lg,
    },
    dataItem: {
      ...theme.typography.body2,
      marginBottom: theme.spacing.xs,
    },
    warningText: {
      ...theme.typography.subtitle1,
      fontWeight: '600',
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: 'auto',
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.shadow,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.lg,
    },
    loadingText: {
      ...theme.typography.body1,
      textAlign: 'center',
    },
    successOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.lg,
    },
    successText: {
      ...theme.typography.h4,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
}
