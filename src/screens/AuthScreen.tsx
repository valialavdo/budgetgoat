import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/SafeFirebaseContext';
import Input from '../components/Input';
import ActionButton from '../components/ActionButton';
import { useNavigation } from '@react-navigation/native';

export default function AuthScreen() {
  const theme = useTheme();
  const { signIn, signUp } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        Alert.alert('Success', 'Account created successfully!');
      } else {
        await signIn(email, password);
      }
      // Navigation will be handled automatically by RootNavigator based on authentication state
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Safe Area Top */}
      <View style={[styles.safeAreaTop, { height: insets.top }]} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -20}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
          keyboardDismissMode="interactive"
        >
                  <View style={styles.header}>
                    <Image
                      source={require('../../assets/icon-80x80.png')}
                      style={styles.logo}
                      resizeMode="contain"
                      accessible={true}
                      accessibilityLabel="BudgetGOAT logo"
                    />
                    <Text style={styles.title}>Welcome to BudgetGOAT</Text>
                    <Text style={styles.subtitle}>
                      {isSignUp ? 'Create your account to get started' : 'Sign in to your account'}
                    </Text>
                  </View>

        <View style={styles.form}>
          <Input
            label="Email Address"
            type="text"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
          />

          {isSignUp && (
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
            />
          )}

          <ActionButton
            title={isSignUp ? 'Create Account' : 'Sign In'}
            variant="primary"
            size="large"
            onPress={handleAuth}
            loading={loading}
            disabled={loading}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <ActionButton
            title={isSignUp ? 'Sign In' : 'Create Account'}
            variant="secondary"
            size="medium"
            onPress={() => setIsSignUp(!isSignUp)}
          />
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Safe Area Bottom */}
      <View style={[styles.safeAreaBottom, { height: Math.max(insets.bottom, 20) }]} />
    </View>
  );
}

function getStyles(theme: any, insets: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    safeAreaTop: {
      backgroundColor: theme.colors.background,
    },
    safeAreaBottom: {
      backgroundColor: theme.colors.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.screenPadding, // 20px consistent padding
      paddingVertical: theme.spacing.xl,
      paddingBottom: Math.max(insets.bottom + 40, 60), // Ensure bottom button is visible above navigation bar
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xxl,
      paddingTop: 32, // 32px padding from top
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: theme.spacing.lg,
      // Remove any shadows or effects
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: 0 },
      shadowColor: 'transparent',
      elevation: 0,
      borderWidth: 0,
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      ...theme.typography.bodyLarge,
      color: theme.colors.textMuted,
      textAlign: 'center',
      lineHeight: 24,
    },
    form: {
      flex: 1,
      marginBottom: theme.spacing.xl,
    },
    footer: {
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    footerText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.md,
    },
  });
}
