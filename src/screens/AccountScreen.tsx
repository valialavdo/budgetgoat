import React, { useState, useContext } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, Alert, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
  User, 
  Coins, 
  Upload, 
  Envelope, 
  Trash, 
  Shield, 
  Star, 
  SignOut,
  PencilSimple,
  Sun,
  Info,
  Plus
} from 'phosphor-react-native';
import { BudgetContext } from '../context/BudgetContext';
import { useTheme } from '../context/ThemeContext';
import { useFirebase } from '../context/MockFirebaseContext';
import Header from '../components/Header';
import SectionHeader from '../components/SectionHeader';
import NavigationButton from '../components/NavigationButton';
import MicroInteractionWrapper from '../components/MicroInteractionWrapper';
import type { RootStackParamList } from '../navigation/RootNavigator';

type AccountScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AccountScreen() {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const { state } = useContext(BudgetContext);
  const theme = useTheme();
  const { signOut } = useFirebase();
  const [scrollY] = useState(new Animated.Value(0));
  const styles = getStyles(theme);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => signOut() }
      ]
    );
  };

  // Navigation handlers for secondary screens
  const handleAppearance = () => navigation.navigate('Appearance');
  const handleCurrency = () => navigation.navigate('Currency');
  const handleExportData = () => navigation.navigate('ExportData');
  const handleEditProfile = () => navigation.navigate('EditProfile');
  const handlePrivacyPolicy = () => navigation.navigate('PrivacyPolicy');
  const handleAboutApp = () => navigation.navigate('AboutApp');
  const handleRateUs = () => navigation.navigate('RateUs');
  const handleAIInsights = () => navigation.navigate('AIInsights');
  const handleTransactionsList = () => navigation.navigate('TransactionsList');
  const handleProjectionDetails = () => navigation.navigate('ProjectionDetails');
  const handleSendToEmail = () => navigation.navigate('SendToEmail');
  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This action will permanently delete all your data including transactions, pockets, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All Data', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement actual data clearing
            Alert.alert('Success', 'All data has been cleared successfully.');
          }
        }
      ]
    );
  };


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Account" 
        scrollY={scrollY}
        scrollThreshold={10}
      />
      
      <View style={styles.content}>
        <Animated.ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Profile Header - Enhanced Version */}
          <View style={[styles.profileHeader, { backgroundColor: theme.colors.surface }]}>
            {/* Edit Icon */}
            <MicroInteractionWrapper 
              style={styles.editHeaderButton} 
              onPress={handleEditProfile}
              hapticType="light"
              animationType="scale"
              pressScale={0.9}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Edit profile information"
              accessibilityHint="Opens the edit profile screen"
            >
              <PencilSimple weight="light" size={24} color={theme.colors.trustBlue} />
            </MicroInteractionWrapper>
            
            <View style={styles.profileInfo}>
              <MicroInteractionWrapper 
                style={styles.profilePictureContainer} 
                onPress={handleEditProfile}
                hapticType="medium"
                animationType="scale"
                pressScale={0.95}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Change profile picture"
                accessibilityHint="Opens camera or photo library to select a new profile picture"
              >
                <View style={[styles.profilePicture, { backgroundColor: theme.colors.trustBlue }]}>
                  <Text style={[styles.profileInitial, { color: theme.colors.background }]}>AS</Text>
                </View>
                <View style={[styles.profileEditIcon, { backgroundColor: theme.colors.trustBlue, borderColor: theme.colors.surface }]}>
                  <Plus weight="bold" size={10} color={theme.colors.background} />
                </View>
              </MicroInteractionWrapper>
              <View style={styles.profileDetails}>
                <Text style={[styles.profileName, { color: theme.colors.text }]}>Alex Smith</Text>
                <Text style={[styles.profileEmail, { color: theme.colors.textMuted }]}>alex.smith@email.com</Text>
                <Text style={[styles.profileDate, { color: theme.colors.textMuted }]}>147 Days Budgeting Strong</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>$5,234</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Net Worth</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>$1,200</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>This Month</Text>
              </View>
            </View>
          </View>

          {/* Settings Title */}
          <SectionHeader title="Settings" showThemeToggle={false} />

          {/* Unified Settings Section */}
          <View style={[styles.sectionContent, { marginHorizontal: 20 }]}> 
            <NavigationButton 
              icon={Sun} 
              label="Appearance" 
              onPress={() => navigation.navigate('Appearance')}
            />
            <NavigationButton 
              icon={Coins} 
              label="Currency" 
              onPress={() => navigation.navigate('Currency')}
            />
            <NavigationButton 
              icon={Upload} 
              label="Export Data" 
              onPress={() => navigation.navigate('ExportData')}
            />
            <NavigationButton 
              icon={Envelope} 
              label="Send Data to Email" 
              onPress={() => navigation.navigate('SendToEmail')}
            />

            <NavigationButton 
              icon={Shield} 
              label="Privacy Policy" 
              onPress={() => navigation.navigate('PrivacyPolicy')}
            />
            
            {/* Clear All Data */}
            <NavigationButton icon={Trash} label="Clear All Data" iconColor={theme.colors.alertRed} onPress={handleClearAllData} />
            
            {/* Sign Out */}
            <NavigationButton icon={SignOut} label="Sign Out" iconColor={theme.colors.alertRed} showArrow={false} />
          </View>

          {/* About Us Section */}
          <SectionHeader title="About Us" />
          <View style={[styles.sectionContent, { marginHorizontal: 20 }]}> 
            <NavigationButton icon={Star} label="Rate Us" onPress={handleRateUs} />
            <NavigationButton 
              icon={Info} 
              label="About BudgetGOAT" 
              onPress={() => navigation.navigate('AboutApp')}
            />
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0, // Remove top padding - let components handle their own spacing
    paddingBottom: 100, // Add bottom padding so content is visible above nav menu
  },
  profileHeader: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20, // Match screenPadding from other screens
    marginBottom: 24,
    position: 'relative',
  },
  editHeaderButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    backgroundColor: theme.colors.surface,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    marginTop: 8,
  },
  profilePictureContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  profileEditIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 4,
  },
  profileDate: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    paddingLeft: 76, // Align with the text (60px profile pic + 16px margin)
  },
  statItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.25,
  },
  sectionContent: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingTop: 0,
    paddingBottom: 8,
    marginBottom: 32, // Add proper spacing between sections
    gap: 12, // Reduced gap between action buttons
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    flex: 1,
  },
  signOutSection: {
    marginTop: 24,
    marginBottom: 48,
    paddingHorizontal: 0,
  },
  });
}


