import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeFirebaseProvider } from './src/context/SafeFirebaseContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { SafeOnboardingProvider } from './src/context/SafeOnboardingContext';
import { SafeToastProvider } from './src/context/SafeToastContext';
import { SafeBudgetProvider } from './src/context/SafeBudgetContext';
import { MicroInteractionsProvider } from './src/context/MicroInteractionsContext';
import { NavigationProvider } from './src/context/NavigationContext';
import ErrorBoundary from './src/components/ErrorBoundary';
import RootNavigator from './src/navigation/RootNavigator';

// Main App Component

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <SafeFirebaseProvider>
          <ErrorBoundary>
            <ThemeProvider>
              <ErrorBoundary>
                <SafeOnboardingProvider>
                  <ErrorBoundary>
                    <SafeToastProvider>
                      <ErrorBoundary>
                        <MicroInteractionsProvider>
                          <ErrorBoundary>
                            <NavigationProvider>
                              <ErrorBoundary>
                                <SafeBudgetProvider>
                                  <ErrorBoundary>
                                    <RootNavigator />
                                  </ErrorBoundary>
                                </SafeBudgetProvider>
                              </ErrorBoundary>
                            </NavigationProvider>
                          </ErrorBoundary>
                        </MicroInteractionsProvider>
                      </ErrorBoundary>
                    </SafeToastProvider>
                  </ErrorBoundary>
                </SafeOnboardingProvider>
              </ErrorBoundary>
            </ThemeProvider>
          </ErrorBoundary>
        </SafeFirebaseProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
