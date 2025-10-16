import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/SafeFirebaseContext';
import { useOnboarding } from '../context/SafeOnboardingContext';

interface DebugInfoProps {
  visible?: boolean;
}

export default function DebugInfo({ visible = __DEV__ }: DebugInfoProps) {
  const theme = useTheme();
  const { user, loading: firebaseLoading } = useAuth();
  const { onboardingData } = useOnboarding();
  const styles = getStyles(theme);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Info</Text>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.infoText}>Firebase Loading: {firebaseLoading ? 'Yes' : 'No'}</Text>
        <Text style={styles.infoText}>Authenticated: {user ? 'Yes' : 'No'}</Text>
        <Text style={styles.infoText}>User: {user ? user.email : 'None'}</Text>
        <Text style={styles.infoText}>Onboarding Completed: {onboardingData === null ? 'Loading...' : onboardingData.isCompleted ? 'Yes' : 'No'}</Text>
        <Text style={styles.infoText}>Theme Mode: {theme.isDark ? 'Dark' : 'Light'}</Text>
        <Text style={styles.infoText}>Platform: {Platform.OS}</Text>
      </ScrollView>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: 50,
      left: 10,
      right: 10,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 10,
      maxHeight: 200,
      zIndex: 9999,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    scrollView: {
      maxHeight: 150,
    },
    infoText: {
      fontSize: 12,
      color: theme.colors.textMuted,
      marginBottom: 4,
      fontFamily: 'monospace',
    },
  });
}
