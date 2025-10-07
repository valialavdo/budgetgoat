import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFirebase } from '../context/FirebaseContext';
import { useOnboarding } from '../context/OnboardingContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import PocketsScreen from '../screens/PocketsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AccountScreen from '../screens/AccountScreen';
// Temporarily comment out problematic imports
// import NewTransactionScreen from '../screens/NewTransactionScreen';
// import NewPocketScreen from '../screens/NewPocketScreen';
// import AppearanceScreen from '../screens/AppearanceScreen';
// import CurrencyScreen from '../screens/CurrencyScreen';
// import ExportDataScreen from '../screens/ExportDataScreen';
// import EditProfileScreen from '../screens/EditProfileScreen';
// import HelpSupportScreen from '../screens/HelpSupportScreen';
// import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
// import AboutAppScreen from '../screens/AboutAppScreen';
// import RateUsScreen from '../screens/RateUsScreen';
// import AIInsightsScreen from '../screens/AIInsightsScreen';
// import TransactionsListScreen from '../screens/TransactionsListScreen';
// import ProjectionDetailsScreen from '../screens/ProjectionDetailsScreen';
// import SendToEmailScreen from '../screens/SendToEmailScreen';
import { SquaresFour, Wallet, Receipt, User } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigationContext } from '../context/NavigationContext';

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Tabs: undefined;
  // Temporarily commented out
  // NewTransaction: undefined;
  // NewPocket: undefined;
  // Appearance: undefined;
  // Currency: undefined;
  // ExportData: undefined;
  // EditProfile: undefined;
  // HelpSupport: undefined;
  // PrivacyPolicy: undefined;
  // AboutApp: undefined;
  // RateUs: undefined;
  // AIInsights: undefined;
  // TransactionsList: undefined;
  // ProjectionDetails: undefined;
  // SendToEmail: undefined;
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

  const styles = getStyles(theme, insets);

  return (
    <View style={[styles.navbarContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
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
              color={isActive ? theme.colors.trustBlue : theme.colors.textMuted} 
              weight={isActive ? "fill" : "light"}
            />
            <Text style={[
              styles.tabLabel,
              { color: isActive ? theme.colors.trustBlue : theme.colors.textMuted }
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
      {activeTab === 0 && <HomeScreen setActiveTab={setActiveTab} />}
      {activeTab === 1 && <PocketsScreen />}
      {activeTab === 2 && <TransactionsScreen />}
      {activeTab === 3 && <AccountScreen />}

      {/* Simple Bottom Navigation */}
      <SimpleBottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
}

function getStyles(theme: any, insets: any) {
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
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
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
  const { isAuthenticated, loading: firebaseLoading } = useFirebase();
  const { hasCompletedOnboarding, completeOnboarding } = useOnboarding();
  
  // Show loading screen while contexts are initializing
  const loading = firebaseLoading || hasCompletedOnboarding === null;
  
  const AppTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.trustBlue,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.goatGreen,
    },
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <NavigationContainer theme={AppTheme}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
          <Text style={{ color: theme.colors.text, ...theme.typography.body1 }}>Loading...</Text>
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
        {!hasCompletedOnboarding ? (
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
        {/* <Stack.Screen
          name="Appearance"
          component={AppearanceScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="Currency"
          component={CurrencyScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="ExportData"
          component={ExportDataScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="HelpSupport"
          component={HelpSupportScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="AboutApp"
          component={AboutAppScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="RateUs"
          component={RateUsScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="AIInsights"
          component={AIInsightsScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="TransactionsList"
          component={TransactionsListScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="ProjectionDetails"
          component={ProjectionDetailsScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="SendToEmail"
          component={SendToEmailScreen}
          options={{ headerShown: false }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


