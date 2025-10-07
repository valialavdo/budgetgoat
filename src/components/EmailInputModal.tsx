import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import BaseBottomSheet from './BaseBottomSheet';
import Input from './Input';
import ActionButton from './ActionButton';
import { X } from 'phosphor-react-native';

interface EmailInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

/**
 * Email input modal for onboarding flow
 * 
 * Features:
 * - Proper keyboard handling
 * - Email validation
 * - Clean, focused design
 * - Accessibility support
 * - Loading states
 * 
 * Usage:
 * ```tsx
 * <EmailInputModal
 *   visible={showEmailModal}
 *   onClose={() => setShowEmailModal(false)}
 *   onSubmit={(email) => handleEmailSignIn(email)}
 * />
 * ```
 */
export default function EmailInputModal({
  visible,
  onClose,
  onSubmit,
}: EmailInputModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(email.trim());
      setEmail('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send sign-in link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={handleClose}
      title=""
      showActionButtons={false}
    >
      <View style={styles.container}>
        {/* Close Button */}
        <View style={styles.header}>
          <ActionButton
            title=""
            icon={<X size={20} color={theme.colors.text} weight="light" />}
            onPress={handleClose}
            variant="ghost"
            size="small"
            style={styles.closeButton}
            accessibilityLabel="Close email input"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Enter your email address</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Input
            label=""
            type="text"
            value={email}
            onChangeText={setEmail}
            placeholder="Type your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            style={styles.input}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <ActionButton
            title="Send link"
            variant={email.trim() ? 'primary' : 'secondary'}
            onPress={handleSubmit}
            loading={loading}
            disabled={!email.trim() || loading}
            style={styles.submitButton}
            accessibilityLabel="Send sign-in link"
            accessibilityHint="Sends a sign-in link to the entered email address"
          />
        </View>
      </View>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.lg,
    },
    header: {
      alignItems: 'flex-end',
      marginBottom: theme.spacing.lg,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      fontWeight: '600',
    },
    inputContainer: {
      marginBottom: theme.spacing.xl,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    buttonContainer: {
      alignItems: 'center',
    },
    submitButton: {
      minWidth: 200,
    },
  });
}
