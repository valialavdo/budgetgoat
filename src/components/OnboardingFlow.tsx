import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';
import OnboardingCard from './OnboardingCard';
import DotIndicator from './DotIndicator';
import AuthButton from './AuthButton';
import EmailInputModal from './EmailInputModal';
import { getOnboardingSteps, OnboardingStep } from '../data/onboardingData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingFlowProps {
  onComplete: () => void;
}

/**
 * Complete OnboardingFlow component
 * 
 * Features:
 * - Horizontal scrolling with FlatList
 * - Snap-to-card functionality
 * - Animated dot indicators
 * - Auth button integration
 * - Email input modal
 * - Smooth transitions
 * - Full accessibility support
 * - Cross-platform compatibility
 * 
 * Usage:
 * ```tsx
 * <OnboardingFlow onComplete={() => setOnboardingComplete(true)} />
 * ```
 */
export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { triggerHaptic } = useMicroInteractions();
  const styles = getStyles(theme, insets);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const onboardingSteps = getOnboardingSteps(theme);
  const isLastStep = currentIndex === onboardingSteps.length - 1;

  // Handle scroll events
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const newIndex = viewableItems[0].index;
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
          triggerHaptic('light');
        }
      }
    },
    [currentIndex, triggerHaptic]
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // Handle auth button presses
  const handleGoogleSignIn = () => {
    triggerHaptic('medium');
    // TODO: Implement Google Sign-In
    console.log('Google Sign-In pressed');
    onComplete();
  };

  const handleAppleSignIn = () => {
    triggerHaptic('medium');
    // TODO: Implement Apple Sign-In
    console.log('Apple Sign-In pressed');
    onComplete();
  };

  const handleEmailSignIn = () => {
    triggerHaptic('medium');
    setShowEmailModal(true);
  };

  const handleEmailSubmit = async (email: string) => {
    triggerHaptic('success');
    // TODO: Implement email sign-in
    console.log('Email submitted:', email);
    setShowEmailModal(false);
    onComplete();
  };

  const handleSkip = () => {
    triggerHaptic('medium');
    onComplete();
  };

  // Render individual onboarding card
  const renderOnboardingCard = ({ item, index }: { item: OnboardingStep; index: number }) => (
    <View style={[styles.cardContainer, { width: SCREEN_WIDTH }]}>
      <OnboardingCard
        title={item.title}
        subtitle={item.subtitle}
        description={item.description}
        image={item.image}
      >
        {item.showAuthButtons ? (
          <View style={styles.authButtonsContainer}>
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
          </View>
        ) : null}
      </OnboardingCard>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.contentContainer}>
        <FlatList
          ref={flatListRef}
          data={onboardingSteps}
          renderItem={renderOnboardingCard}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          scrollEventThrottle={16}
          snapToInterval={SCREEN_WIDTH}
          snapToAlignment="center"
          decelerationRate="fast"
          accessibilityLabel="Onboarding cards"
        />
      </View>

      {/* Dot Indicators */}
      <View style={styles.dotsContainer}>
        <DotIndicator
          count={onboardingSteps.length}
          activeIndex={currentIndex}
          color={theme.colors.textMuted}
          activeColor={theme.colors.trustBlue}
          size={8}
          activeSize={24}
          spacing={8}
        />
      </View>

      {/* Skip Button (only show on non-last steps) */}
      {!isLastStep && (
        <View style={styles.skipContainer}>
          <AuthButton
            provider="email" // Reuse AuthButton for skip
            onPress={handleSkip}
            style={styles.skipButton}
          />
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>BudgetGOAT</Text>
        <Text style={styles.footerSubtext}>Smart Budget Planning</Text>
      </View>

      {/* Email Input Modal */}
      <EmailInputModal
        visible={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
      />
    </View>
  );
}

function getStyles(theme: 'light' | 'dark', insets: any) {
  const colors = {
    background: theme === 'dark' ? '#000000' : '#ffffff',
    surface: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
    text: theme === 'dark' ? '#ffffff' : '#0f172a',
    textMuted: theme === 'dark' ? '#9ca3af' : '#475569',
    trustBlue: '#0052CC',
    border: theme === 'dark' ? '#333333' : '#e2e8f0',
  };

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: insets.top, // Safe area top padding
    },
    contentContainer: {
      flex: 1,
      paddingTop: 24, // Additional top padding
    },
    cardContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    dotsContainer: {
      paddingVertical: 20,
      paddingBottom: 16,
    },
    skipContainer: {
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    skipButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.textMuted,
    },
    authButtonsContainer: {
      width: '100%',
      paddingHorizontal: 20,
    },
    footer: {
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: Math.max(insets.bottom + 20, 24),
    },
    footerText: {
      fontSize: 24,
      color: colors.text,
      fontWeight: '700',
      marginBottom: 8,
    },
    footerSubtext: {
      fontSize: 14,
      color: colors.textMuted,
      opacity: 0.7,
    },
  });
}
