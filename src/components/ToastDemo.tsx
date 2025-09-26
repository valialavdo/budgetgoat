import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useToastHelpers } from '../context/ToastContext';

export default function ToastDemo() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { showSuccess, showError, showInfo, showWarning } = useToastHelpers();

  const handleSuccess = () => {
    showSuccess(
      'Success',
      'Your changes are saved successfully'
    );
  };

  const handleError = () => {
    showError(
      'Error',
      'Error has occurred while saving changes.'
    );
  };

  const handleInfo = () => {
    showInfo(
      'Info',
      'New settings available on your account.'
    );
  };

  const handleWarning = () => {
    showWarning(
      'Warning',
      'Username you have entered is invalid.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toast Notifications Demo</Text>
      
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.goatGreen }]} onPress={handleSuccess}>
        <Text style={styles.buttonText}>Show Success Toast</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.alertRed }]} onPress={handleError}>
        <Text style={styles.buttonText}>Show Error Toast</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.trustBlue }]} onPress={handleInfo}>
        <Text style={styles.buttonText}>Show Info Toast</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.warningOrange }]} onPress={handleWarning}>
        <Text style={styles.buttonText}>Show Warning Toast</Text>
      </TouchableOpacity>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      padding: theme.spacing.screenPadding,
      gap: theme.spacing.md,
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    button: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.md,
      alignItems: 'center',
    },
    buttonText: {
      ...theme.typography.bodyMedium,
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });
}
