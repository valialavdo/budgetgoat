import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PocketsScreen from '../screens/PocketsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AccountScreen from '../screens/AccountScreen';

export type RootStackParamList = {
  Tabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Very simple test tab bar
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          height: 60,
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Pockets"
        component={PocketsScreen}
        options={{
          tabBarLabel: 'Pockets',
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarLabel: 'Transactions',
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
        }}
      />
    </Tab.Navigator>
  );
}

const AppTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007BFF',
    background: '#FFFFFF',
    card: '#F8FAFC',
    text: '#0F172A',
    border: '#E2E8F0',
    notification: '#00D084',
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


