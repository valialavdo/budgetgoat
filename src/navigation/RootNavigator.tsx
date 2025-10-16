import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/SafeFirebaseContext';
import { useOnboarding } from '../context/SafeOnboardingContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import PocketsScreen from '../screens/PocketsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AccountScreen from '../screens/AccountScreen';
import NewTransactionScreen from '../screens/NewTransactionScreen';
import NewPocketScreen from '../screens/NewPocketScreen';
import AppearanceScreen from '../screens/AppearanceScreen';
import CurrencyScreen from '../screens/CurrencyScreen';
import ExportDataScreen from '../screens/ExportDataScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import AboutAppScreen from '../screens/AboutAppScreen';
import RateUsScreen from '../screens/RateUsScreen';
import AIInsightsScreen from '../screens/AIInsightsScreen';
import TransactionsListScreen from '../screens/TransactionsListScreen';
import ProjectionDetailsScreen from '../screens/ProjectionDetailsScreen';
import SendToEmailScreen from '../screens/SendToEmailScreen';
import { SquaresFour, Wallet, Receipt, User } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigationContext } from '../context/NavigationContext';

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Tabs: undefined;
  NewTransaction: undefined;
  NewPocket: undefined;
  Appearance: undefined;
  Currency: undefined;
  ExportData: undefined;
  EditProfile: undefined;
  HelpSupport: undefined;
  PrivacyPolicy: undefined;
  AboutApp: undefined;
  RateUs: undefined;
  AIInsights: undefined;
  TransactionsList: undefined;
  ProjectionDetails: undefined;
  SendToEmail: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Simple Tab Configuration
const TAB_CONFIG = [
  { label: "Home", icon: SquaresFour },
  { label: "Pockets", icon: Wallet },
  { label: "Transactions", icon: Receipt },
  { label: "Account", icon: User }
];

// Simple Bottom Navigation Component
function SimpleBottomNavigation({ activeTab, onTabChange }: { activeTab: number; onTabChange: (index: number) => void }) {
  const theme = useTheme();
  const { hideTabBar } = useNavigationContext();
  const insets = useSafeAreaInsets();
  
  if (hideTabBar) {
    return null;
  }

  // Simple theme colors for now
  const colors = {
    surface: theme.isDark ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    border: theme.isDark ? '#333333' : '#e2e8f0',
    trustBlue: '#0052CC',
    textMuted: theme.isDark ? '#9ca3af' : '#6b7280',
  };

  const styles = getStyles(colors, insets);

  return (
    <View style={[styles.navbarContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {TAB_CONFIG.map((tab, index) => {
        const isActive = activeTab === index;
        const Icon = tab.icon;
        
        return (
          <TouchableOpacity
            key={tab.label}
            style={styles.tabItem}
            onPress={() => onTabChange(index)}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${tab.label} tab`}
            accessibilityHint={`Navigate to ${tab.label} screen`}
            accessibilityState={{ selected: isActive }}
          >
            <Icon 
              size={24} 
              color={isActive ? colors.trustBlue : colors.textMuted} 
              weight={isActive ? "fill" : "light"}
            />
            <Text style={[
              styles.tabLabel,
              { color: isActive ? colors.trustBlue : colors.textMuted }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function Tabs() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Tab Content */}
      {activeTab === 0 && <HomeScreen />}
      {activeTab === 1 && <PocketsScreen />}
      {activeTab === 2 && <TransactionsScreen />}
      {activeTab === 3 && <AccountScreen />}

      {/* Simple Bottom Navigation */}
      <SimpleBottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
}

function getStyles(colors: any, insets: any) {
  return StyleSheet.create({
    navbarContainer: {
      flexDirection: 'row',
      borderRadius: 120,
      height: 68,
      marginHorizontal: 20,
      marginTop: 4, // 4px from top of screen
      paddingTop: 16,
      paddingBottom: 16,
      paddingHorizontal: 14,
      borderWidth: 1,
      position: 'absolute',
      bottom: Math.max(insets.bottom, 20), // Use safe area bottom padding
      left: 0,
      right: 0,
      zIndex: 1000,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      gap: 2, // Reduced from 4px to 2px
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      letterSpacing: 0.25,
      textAlign: 'center',
      marginTop: 2,
    },
  });
}

export default function RootNavigator() {
  const theme = useTheme();
  const { user, loading: firebaseLoading } = useAuth();
  const isAuthenticated = !!user;
  const { onboardingData, completeOnboarding } = useOnboarding();
  
  // Show loading screen while contexts are initializing
  const loading = firebaseLoading || onboardingData === null;
  
  // Simple theme colors for navigation
  const colors = {
    trustBlue: '#0052CC',
    background: theme.isDark ? '#000000' : '#ffffff',
    surface: theme.isDark ? '#1a1a1a' : '#ffffff',
    text: theme.isDark ? '#ffffff' : '#000000',
    border: theme.isDark ? '#333333' : '#e2e8f0',
    goatGreen: '#059669',
  };
  
  const AppTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.trustBlue,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.goatGreen,
    },
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <NavigationContainer theme={AppTheme}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
          <Text style={{ color: colors.text, fontSize: 16 }}>Loading...</Text>
        </View>
      </NavigationContainer>
    );
  }

  const handleOnboardingComplete = async () => {
    await completeOnboarding();
  };

  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!onboardingData.isCompleted ? (
          <Stack.Screen
            name="Onboarding"
            options={{ headerShown: false }}
          >
            {() => <OnboardingScreen onComplete={handleOnboardingComplete} />}
          </Stack.Screen>
        ) : !isAuthenticated ? (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen
          name="Appearance"
          component={AppearanceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Currency"
          component={CurrencyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ExportData"
          component={ExportDataScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HelpSupport"
          component={HelpSupportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AboutApp"
          component={AboutAppScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RateUs"
          component={RateUsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AIInsights"
          component={AIInsightsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TransactionsList"
          component={TransactionsListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProjectionDetails"
          component={ProjectionDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SendToEmail"
          component={SendToEmailScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


