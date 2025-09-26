import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';
import BaseBottomSheet from './BaseBottomSheet';
import ActionButton from './ActionButton';

interface HideBalancesConfirmationBottomSheetProps {
  /**
   * Whether the bottom sheet is visible
   */
  visible: boolean;
  
  /**
   * Callback when the bottom sheet should be closed
   */
  onClose: () => void;
  
  /**
   * Current hide balances state
   */
  hideBalances: boolean;
  
  /**
   * Callback when hide balances state changes
   */
  onToggle: (hideBalances: boolean) => void;
}

/**
 * HideBalancesConfirmationBottomSheet - Modal for confirming hide balances toggle
 * 
 * Features:
 * - Confirmation dialog for hiding/showing balances
 * - Clear explanation of what will be hidden
 * - Immediate state update with haptic feedback
 * - Accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Microinteractions
 * 
 * Usage: Trigger from AccountScreen Hide Balances toggle
 */
export default function HideBalancesConfirmationBottomSheet({
  visible,
  onClose,
  hideBalances,
  onToggle,
}: HideBalancesConfirmationBottomSheetProps) {
  const theme = useTheme();
  const { triggerHaptic } = useMicroInteractions();

  const handleToggle = () => {
    triggerHaptic('medium');
    onToggle(!hideBalances);
    onClose();
  };

  const styles = getStyles(theme);

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title={hideBalances ? "Show Balances" : "Hide Balances"}
    >
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          {hideBalances ? (
            <Eye 
              weight="light" 
              size={48} 
              color={theme.colors.trustBlue} 
            />
          ) : (
            <EyeSlash 
              weight="light" 
              size={48} 
              color={theme.colors.trustBlue} 
            />
          )}
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {hideBalances ? "Show Your Balances" : "Hide Your Balances"}
          </Text>
          
          <Text style={[styles.description, { color: theme.colors.textMuted }]}>
            {hideBalances 
              ? "Your account balances and transaction amounts will be visible again."
              : "Your account balances and transaction amounts will be hidden for privacy. You can always show them again from settings."
            }
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <ActionButton
            title="Cancel"
            variant="outline"
            size="medium"
            onPress={onClose}
            hapticType="light"
            accessibilityLabel="Cancel hide balances change"
            accessibilityHint="Keeps the current balance visibility setting"
          />
          
          <ActionButton
            title={hideBalances ? "Show Balances" : "Hide Balances"}
            variant="primary"
            size="medium"
            onPress={handleToggle}
            hapticType="medium"
            accessibilityLabel={hideBalances ? "Show balances" : "Hide balances"}
            accessibilityHint={hideBalances ? "Makes balances visible again" : "Hides balances for privacy"}
          />
        </View>
      </View>
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
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: 'auto',
    },
  });
}
