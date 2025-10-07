/**
 * BudgetGOAT - Main App Component
 * Entry point for the React Native application
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { MockFirebaseProvider } from './src/context/MockFirebaseContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { ToastProvider } from './src/context/ToastContext';
import { MicroInteractionsProvider } from './src/context/MicroInteractionsContext';
import { NavigationProvider } from './src/context/NavigationContext';
import { BudgetProvider } from './src/context/BudgetContext';
import ErrorBoundary from './src/components/ErrorBoundary';
import DebugInfo from './src/components/DebugInfo';
import RootNavigator from './src/navigation/RootNavigator';

// Simple loading component for initial app load
function AppLoading() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading BudgetGOAT...</Text>
    </View>
  );
}

// Error fallback for the entire app
function AppErrorFallback({ error, onRetry }: { error?: Error; onRetry: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>App Error</Text>
      <Text style={styles.errorMessage}>
        {error?.message || 'Failed to load the app'}
      </Text>
      {__DEV__ && error?.stack && (
        <Text style={styles.errorStack}>{error.stack}</Text>
      )}
    </View>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallback={<AppErrorFallback error={undefined} onRetry={() => {}} />}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <MockFirebaseProvider>
            <ErrorBoundary>
              <ThemeProvider>
                <ErrorBoundary>
                  <OnboardingProvider>
                    <ErrorBoundary>
                      <ToastProvider>
                        <ErrorBoundary>
                          <MicroInteractionsProvider>
                            <ErrorBoundary>
                              <NavigationProvider>
                                <ErrorBoundary>
                                  <BudgetProvider>
                                    <ErrorBoundary>
                                      <NavigationContainer>
                                        <StatusBar style="auto" />
                                        <RootNavigator />
                                        <DebugInfo visible={__DEV__} />
                                      </NavigationContainer>
                                    </ErrorBoundary>
                                  </BudgetProvider>
                                </ErrorBoundary>
                              </NavigationProvider>
                            </ErrorBoundary>
                          </MicroInteractionsProvider>
                        </ErrorBoundary>
                      </ToastProvider>
                    </ErrorBoundary>
                  </OnboardingProvider>
                </ErrorBoundary>
              </ThemeProvider>
            </ErrorBoundary>
          </MockFirebaseProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorStack: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'monospace',
    textAlign: 'left',
  },
});