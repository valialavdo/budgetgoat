import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/SafeFirebaseContext';
import { SignOut, User, Gear } from 'phosphor-react-native';

export default function SimpleAccountScreen() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const colors = {
    background: theme === 'dark' ? '#000000' : '#ffffff',
    surface: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
    text: theme === 'dark' ? '#ffffff' : '#000000',
    textMuted: theme === 'dark' ? '#9ca3af' : '#6b7280',
    trustBlue: '#0052CC',
    alertRed: '#DC2626',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Account</Text>
        
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <User size={24} color={colors.trustBlue} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile</Text>
          </View>
          <Text style={[styles.userEmail, { color: colors.textMuted }]}>
            {user?.email || 'Not signed in'}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Gear size={24} color={colors.trustBlue} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={toggleTheme}
          >
            <Text style={[styles.settingText, { color: colors.text }]}>Theme</Text>
            <Text style={[styles.settingValue, { color: colors.textMuted }]}>
              {theme === 'dark' ? 'Dark' : 'Light'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.signOutButton, { backgroundColor: colors.alertRed }]}
          onPress={handleSignOut}
        >
          <SignOut size={24} color="white" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  userEmail: {
    fontSize: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingText: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
