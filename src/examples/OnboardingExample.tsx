/**
 * OnboardingExample.tsx
 * 
 * This file demonstrates how to use all the onboarding components
 * in various scenarios and configurations.
 * 
 * Components demonstrated:
 * - OnboardingCard
 * - DotIndicator
 * - AuthButton
 * - EmailInputModal
 * - OnboardingFlow
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import OnboardingCard from '../components/OnboardingCard';
import DotIndicator from '../components/DotIndicator';
import AuthButton from '../components/AuthButton';
import EmailInputModal from '../components/EmailInputModal';
import OnboardingFlow from '../components/OnboardingFlow';
import { Wallet, Target, ChartLineUp } from 'phosphor-react-native';

/**
 * Example 1: Individual OnboardingCard Usage
 */
export function OnboardingCardExample() {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <OnboardingCard
        title="Welcome to BudgetGOAT"
        subtitle="Smart budget planning at the speed of thought"
        description="Take control of your finances with our intuitive budgeting app designed to help you achieve your financial goals."
        image={
          <View style={styles.imagePlaceholder}>
            <Wallet size={60} color={theme.colors.trustBlue} weight="light" />
          </View>
        }
      >
        <Text style={styles.customContent}>
          This is custom content that appears below the card!
        </Text>
      </OnboardingCard>
    </View>
  );
}

/**
 * Example 2: DotIndicator Usage
 */
export function DotIndicatorExample() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dot Indicator Examples</Text>
      
      {/* Basic dots */}
      <View style={styles.exampleSection}>
        <Text style={styles.sectionTitle}>Basic Dots (3 steps)</Text>
        <DotIndicator count={3} activeIndex={activeIndex} />
      </View>

      {/* Custom styled dots */}
      <View style={styles.exampleSection}>
        <Text style={styles.sectionTitle}>Custom Styled Dots (5 steps)</Text>
        <DotIndicator
          count={5}
          activeIndex={2}
          color="#CCCCCC"
          activeColor="#FF6B6B"
          size={6}
          activeSize={20}
          spacing={12}
        />
      </View>

      {/* Interactive dots */}
      <View style={styles.exampleSection}>
        <Text style={styles.sectionTitle}>Interactive Dots</Text>
        <DotIndicator count={4} activeIndex={activeIndex} />
        <Text style={styles.hint}>Tap anywhere to change active dot</Text>
      </View>
    </View>
  );
}

/**
 * Example 3: AuthButton Usage
 */
export function AuthButtonExample() {
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleGoogleSignIn = () => {
    console.log('Google Sign-In pressed');
  };

  const handleAppleSignIn = () => {
    console.log('Apple Sign-In pressed');
  };

  const handleEmailSignIn = () => {
    console.log('Email Sign-In pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth Button Examples</Text>
      
      <View style={styles.exampleSection}>
        <AuthButton
          provider="google"
          onPress={handleGoogleSignIn}
        />
        
        <AuthButton
          provider="apple"
          onPress={handleAppleSignIn}
        />
        
        <AuthButton
          provider="email"
          onPress={handleEmailSignIn}
        />
        
        <AuthButton
          provider="email"
          onPress={() => {}}
          disabled={true}
          loading={true}
        />
      </View>
    </View>
  );
}

/**
 * Example 4: EmailInputModal Usage
 */
export function EmailInputModalExample() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [showModal, setShowModal] = useState(false);

  const handleEmailSubmit = (email: string) => {
    console.log('Email submitted:', email);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Input Modal Example</Text>
      
      <AuthButton
        provider="email"
        onPress={() => setShowModal(true)}
      />

      <EmailInputModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleEmailSubmit}
      />
    </View>
  );
}

/**
 * Example 5: Complete OnboardingFlow Usage
 */
export function OnboardingFlowExample() {
  const handleOnboardingComplete = () => {
    console.log('Onboarding completed!');
    // Navigate to main app or auth screen
  };

  return (
    <OnboardingFlow onComplete={handleOnboardingComplete} />
  );
}

/**
 * Example 6: Custom Onboarding Data
 */
export function CustomOnboardingExample() {
  const theme = useTheme();
  const styles = getStyles(theme);

  // Custom onboarding steps
  const customSteps = [
    {
      id: 'step1',
      title: 'Custom Step 1',
      subtitle: 'This is a custom onboarding step',
      description: 'You can create your own onboarding content using the same components.',
      image: (
        <View style={styles.imagePlaceholder}>
          <Target size={60} color={theme.colors.goatGreen} weight="light" />
        </View>
      ),
    },
    {
      id: 'step2',
      title: 'Custom Step 2',
      subtitle: 'Another custom step',
      description: 'Each step can have different content and styling.',
      image: (
        <View style={styles.imagePlaceholder}>
          <ChartLineUp size={60} color={theme.colors.warningOrange} weight="light" />
        </View>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Onboarding Steps</Text>
      <ScrollView>
        {customSteps.map((step, index) => (
          <View key={step.id} style={styles.customStep}>
            <OnboardingCard
              title={step.title}
              subtitle={step.subtitle}
              description={step.description}
              image={step.image}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    title: {
      ...theme.typography.h2,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      fontWeight: '700',
    },
    exampleSection: {
      marginBottom: theme.spacing.xl,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
    },
    sectionTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: '600',
    },
    hint: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
      fontStyle: 'italic',
    },
    imagePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    customContent: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    customStep: {
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
    },
  });
}
