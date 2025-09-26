import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';
import ActionButton from './ActionButton';
import MicroInteractionWrapper from './MicroInteractionWrapper';

export interface ConfirmationDialogProps {
  /**
   * Whether the dialog is visible
   */
  visible: boolean;
  
  /**
   * Callback when the dialog should be closed
   */
  onClose: () => void;
  
  /**
   * Callback when user confirms the action
   */
  onConfirm: () => void;
  
  /**
   * Title of the confirmation dialog
   */
  title: string;
  
  /**
   * Description/message of the confirmation dialog
   */
  message: string;
  
  /**
   * Text for the confirm button
   * @default "Confirm"
   */
  confirmText?: string;
  
  /**
   * Text for the cancel button
   * @default "Cancel"
   */
  cancelText?: string;
  
  /**
   * Whether this is a destructive action (red confirm button)
   * @default false
   */
  isDestructive?: boolean;
  
  /**
   * Custom styles for the container
   */
  style?: any;
}

/**
 * Reusable ConfirmationDialog component for warnings and confirmations
 * 
 * Features:
 * - Accessible modal with backdrop
 * - Destructive action styling
 * - Microinteractions with haptic feedback
 * - Dark mode support
 * - Customizable text and styling
 * 
 * Usage:
 * ```tsx
 * <ConfirmationDialog
 *   visible={showConfirm}
 *   onClose={() => setShowConfirm(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Transaction"
 *   message="This action cannot be undone."
 *   isDestructive={true}
 * />
 * ```
 */
export default function ConfirmationDialog({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  style,
}: ConfirmationDialogProps) {
  const theme = useTheme();
  const { triggerHaptic } = useMicroInteractions();

  const handleConfirm = () => {
    triggerHaptic('medium');
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    triggerHaptic('light');
    onClose();
  };

  const styles = getStyles(theme);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      accessible={true}
      accessibilityViewIsModal={true}
      accessibilityLabel="Confirmation dialog"
    >
      <View style={styles.backdrop}>
        <MicroInteractionWrapper
          style={styles.backdropTouchable}
          onPress={handleCancel}
          hapticType="light"
          animationType="scale"
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          accessibilityHint="Tap to close the confirmation dialog"
        />
        
        <View style={[styles.dialog, style]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.buttonContainer}>
            <ActionButton
              title={cancelText}
              variant="outline"
              size="medium"
              onPress={handleCancel}
              hapticType="light"
              style={styles.cancelButton}
              accessibilityLabel={`Cancel ${title.toLowerCase()}`}
              accessibilityHint="Cancels the current action"
            />
            
            <ActionButton
              title={confirmText}
              variant={isDestructive ? "danger" : "primary"}
              size="medium"
              onPress={handleConfirm}
              hapticType="medium"
              style={styles.confirmButton}
              accessibilityLabel={`Confirm ${title.toLowerCase()}`}
              accessibilityHint={isDestructive ? "Permanently deletes the item" : "Confirms the current action"}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: theme.colors.shadow,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    backdropTouchable: {
      ...StyleSheet.absoluteFillObject,
    },
    dialog: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      width: '100%',
      maxWidth: 400,
      ...theme.shadows.large,
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    message: {
      ...theme.typography.body1,
      color: theme.colors.textMuted,
      lineHeight: 24,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    cancelButton: {
      flex: 1,
    },
    confirmButton: {
      flex: 1,
    },
  });
}
