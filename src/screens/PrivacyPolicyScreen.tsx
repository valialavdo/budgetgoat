import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../components/SecondaryHeader';
import { Shield, Lock, Globe, Envelope } from 'phosphor-react-native';

export default function PrivacyPolicyScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [scrollY] = useState(new Animated.Value(0));
  const styles = getStyles(theme);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SecondaryHeader
        title="Privacy Policy"
        onBackPress={handleBack}
        scrollY={scrollY}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Main Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <Shield size={80} color={theme.colors.trustBlue} weight="light" />
            <View style={styles.lockIcon}>
              <Lock size={32} color={theme.colors.trustBlue} weight="light" />
            </View>
          </View>
        </View>

        {/* Main Heading */}
        <Text style={styles.mainHeading}>
          Thanks for trusting BudgetGOAT with your personal data
        </Text>

        {/* Introduction */}
        <Text style={styles.bodyText}>
          Using BudgetGOAT creates personal data, and we are committed to protecting your privacy and being transparent about how we collect, use, and share your information.
        </Text>

        <Text style={styles.bodyText}>
          We use cookies and other technologies to collect data about your usage of our app. You can learn more about our cookie practices in our separate cookie statement.
        </Text>

        {/* Main Section */}
        <Text style={styles.sectionHeading}>We use your personal data to</Text>
        
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Make the app function properly and provide budgeting services
            </Text>
          </View>
          
          <View style={styles.bulletItem}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Allow you to control your finances and track your spending
            </Text>
          </View>
          
          <View style={styles.bulletItem}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Generate personalized insights and recommendations
            </Text>
          </View>
          
          <View style={styles.bulletItem}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Send important updates and notifications about your budget
            </Text>
          </View>
          
          <View style={styles.bulletItem}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Provide customer support and improve our services
            </Text>
          </View>
          
          <View style={styles.bulletItem}>
            <View style={styles.bullet} />
            <Text style={styles.bulletText}>
              Ensure app security and prevent unauthorized access
            </Text>
          </View>
        </View>

        {/* Data Security Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={24} color={theme.colors.trustBlue} weight="light" />
            <Text style={styles.sectionTitle}>Data Security</Text>
          </View>
          <Text style={styles.sectionContent}>
            We implement industry-standard security measures to protect your data:
          </Text>
          <Text style={styles.sectionContent}>
            • End-to-end encryption for sensitive financial data{'\n'}
            • Secure cloud storage with regular backups{'\n'}
            • Multi-factor authentication options{'\n'}
            • Regular security audits and updates{'\n'}
            • Limited access to personal data by authorized personnel only
          </Text>
        </View>

        {/* Your Rights Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={24} color={theme.colors.trustBlue} weight="light" />
            <Text style={styles.sectionTitle}>Your Rights</Text>
          </View>
          <Text style={styles.sectionContent}>
            You have the right to:
          </Text>
          <Text style={styles.sectionContent}>
            • Access your personal data{'\n'}
            • Correct inaccurate information{'\n'}
            • Delete your account and associated data{'\n'}
            • Export your data in a portable format{'\n'}
            • Opt out of non-essential communications{'\n'}
            • Withdraw consent for data processing
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Envelope size={24} color={theme.colors.trustBlue} weight="light" />
            <Text style={styles.sectionTitle}>Contact Us</Text>
          </View>
          <Text style={styles.sectionContent}>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </Text>
          <Text style={styles.contactInfo}>
            Email: privacy@budgetgoat.com{'\n'}
            Support: support@budgetgoat.com
          </Text>
        </View>

        {/* Last Updated */}
        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  illustration: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 4,
  },
  mainHeading: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 32,
  },
  bodyText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  sectionHeading: {
    ...theme.typography.h4,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  bulletList: {
    marginBottom: theme.spacing.xl,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.trustBlue,
    marginTop: 8,
    marginRight: theme.spacing.md,
  },
  bulletText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 24,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '600',
  },
  sectionContent: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  contactInfo: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  lastUpdated: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.trustBlue,
  },
  lastUpdatedText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});