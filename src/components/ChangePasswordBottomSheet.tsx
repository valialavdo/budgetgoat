import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle, XCircle } from 'phosphor-react-native';
import BaseBottomSheet from './BaseBottomSheet';
import Input from './Input';

interface ChangePasswordBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onPasswordChanged?: () => void;
}

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export default function ChangePasswordBottomSheet({
  visible,
  onClose,
  onPasswordChanged
}: ChangePasswordBottomSheetProps) {
  const theme = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState<PasswordValidation>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const validatePassword = (password: string): PasswordValidation => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const handleNewPasswordChange = (password: string) => {
    setNewPassword(password);
    setValidation(validatePassword(password));
  };

  const handleSave = async () => {
    // Validation
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password.');
      return;
    }

    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (!Object.values(validation).every(Boolean)) {
      Alert.alert('Error', 'Password does not meet all requirements.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setValidation({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });

      Alert.alert(
        'Success',
        'Your password has been changed successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
              onPasswordChanged?.();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (currentPassword || newPassword || confirmPassword) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setValidation({
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false
              });
              onClose();
            }
          }
        ]
      );
    } else {
      onClose();
    }
  };

  const isFormValid = currentPassword && newPassword && confirmPassword && 
                     newPassword === confirmPassword && 
                     Object.values(validation).every(Boolean);

  const styles = getStyles(theme);

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={handleClose}
      title="Change Password"
      actionButtons={[
        {
          title: 'Cancel',
          variant: 'secondary',
          onPress: handleClose,
        },
        {
          title: isLoading ? 'Saving...' : 'Save Changes',
          variant: 'primary',
          onPress: handleSave,
          disabled: !isFormValid || isLoading,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Current Password */}
        <Input
          label="Current Password"
          type="password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Enter your current password"
        />

        {/* New Password */}
        <Input
          label="New Password"
          type="password"
          value={newPassword}
          onChangeText={handleNewPasswordChange}
          placeholder="Enter your new password"
        />

        {/* Password Requirements */}
        {newPassword.length > 0 && (
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <View style={styles.requirementsList}>
              <View style={styles.requirementItem}>
                {validation.length ? (
                  <CheckCircle size={16} color={theme.colors.success} weight="fill" />
                ) : (
                  <XCircle size={16} color={theme.colors.error} weight="light" />
                )}
                <Text style={[
                  styles.requirementText,
                  { color: validation.length ? theme.colors.success : theme.colors.textMuted }
                ]}>
                  At least 8 characters
                </Text>
              </View>
              
              <View style={styles.requirementItem}>
                {validation.uppercase ? (
                  <CheckCircle size={16} color={theme.colors.success} weight="fill" />
                ) : (
                  <XCircle size={16} color={theme.colors.error} weight="light" />
                )}
                <Text style={[
                  styles.requirementText,
                  { color: validation.uppercase ? theme.colors.success : theme.colors.textMuted }
                ]}>
                  One uppercase letter
                </Text>
              </View>
              
              <View style={styles.requirementItem}>
                {validation.lowercase ? (
                  <CheckCircle size={16} color={theme.colors.success} weight="fill" />
                ) : (
                  <XCircle size={16} color={theme.colors.error} weight="light" />
                )}
                <Text style={[
                  styles.requirementText,
                  { color: validation.lowercase ? theme.colors.success : theme.colors.textMuted }
                ]}>
                  One lowercase letter
                </Text>
              </View>
              
              <View style={styles.requirementItem}>
                {validation.number ? (
                  <CheckCircle size={16} color={theme.colors.success} weight="fill" />
                ) : (
                  <XCircle size={16} color={theme.colors.error} weight="light" />
                )}
                <Text style={[
                  styles.requirementText,
                  { color: validation.number ? theme.colors.success : theme.colors.textMuted }
                ]}>
                  One number
                </Text>
              </View>
              
              <View style={styles.requirementItem}>
                {validation.special ? (
                  <CheckCircle size={16} color={theme.colors.success} weight="fill" />
                ) : (
                  <XCircle size={16} color={theme.colors.error} weight="light" />
                )}
                <Text style={[
                  styles.requirementText,
                  { color: validation.special ? theme.colors.success : theme.colors.textMuted }
                ]}>
                  One special character
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Confirm Password */}
        <Input
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your new password"
          error={confirmPassword && newPassword !== confirmPassword ? 'Passwords do not match' : undefined}
        />
      </View>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    content: {
      paddingVertical: theme.spacing.sm,
    },
    requirementsContainer: {
      marginVertical: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    requirementsTitle: {
      ...theme.typography.subtitle2,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    requirementsList: {
      gap: theme.spacing.xs,
    },
    requirementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    requirementText: {
      ...theme.typography.bodySmall,
      fontSize: 13,
    },
  });
}
