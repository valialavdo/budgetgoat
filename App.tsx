import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAppFonts } from './src/fonts';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { BudgetProvider } from './src/context/BudgetContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { MicroInteractionsProvider } from './src/context/MicroInteractionsContext';
import { NavigationProvider } from './src/context/NavigationContext';
import { ToastProvider } from './src/context/ToastContext';
import { useTheme } from './src/context/ThemeContext';

function LoadingScreen() {
  const theme = useTheme();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <ActivityIndicator size="large" color={theme.colors.trustBlue} />
      <Text style={{ marginTop: 16, color: theme.colors.text, ...theme.typography.body1 }}>Loading BudgetGOAT...</Text>
    </View>
  );
}

export default function App() {
  const fontsLoaded = useAppFonts();
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen while fonts are loading or for initial app launch
  if (!fontsLoaded || showSplash) {
    return (
      <ThemeProvider>
        {fontsLoaded ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <LoadingScreen />
        )}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <MicroInteractionsProvider>
          <NavigationProvider>
            <BudgetProvider>
              <StatusBar style="auto" />
              <RootNavigator />
            </BudgetProvider>
          </NavigationProvider>
        </MicroInteractionsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
