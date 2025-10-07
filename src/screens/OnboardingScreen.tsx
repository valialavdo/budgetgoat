import React from 'react';
import OnboardingFlow from '../components/OnboardingFlow';

interface OnboardingScreenProps {
  onComplete: () => void;
}

/**
 * OnboardingScreen component
 * 
 * This is a wrapper around the OnboardingFlow component that integrates
 * with the navigation system and handles onboarding completion.
 * 
 * Features:
 * - Integrates with OnboardingContext
 * - Handles navigation to AuthScreen
 * - Clean separation of concerns
 * 
 * Usage:
 * ```tsx
 * <OnboardingScreen onComplete={() => setOnboardingComplete(true)} />
 * ```
 */
export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return <OnboardingFlow onComplete={onComplete} />;
}