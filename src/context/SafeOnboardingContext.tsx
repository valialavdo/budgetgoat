import React, { createContext, useContext, ReactNode } from 'react';
import { useSafeAsyncStorage } from '../hooks/useSafeAsyncStorage';

export interface OnboardingData {
  isCompleted: boolean;
  currentStep: number;
  completedSteps: number[];
  userPreferences: {
    notifications: boolean;
    analytics: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}

const defaultOnboardingData: OnboardingData = {
  isCompleted: false,
  currentStep: 0,
  completedSteps: [],
  userPreferences: {
    notifications: true,
    analytics: true,
    theme: 'auto',
  },
};

interface OnboardingContextType {
  onboardingData: OnboardingData;
  loading: boolean;
  error: string | null;
  updateOnboardingData: (data: Partial<OnboardingData>) => Promise<void>;
  completeStep: (step: number) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  refresh: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface SafeOnboardingProviderProps {
  children: ReactNode;
}

/**
 * Safe onboarding context provider that handles AsyncStorage operations gracefully
 * Prevents white screen crashes by using safe AsyncStorage operations
 */
export function SafeOnboardingProvider({ children }: SafeOnboardingProviderProps) {
  const {
    value: onboardingData,
    loading,
    error,
    setValue: setOnboardingData,
    refresh,
  } = useSafeAsyncStorage<OnboardingData>({
    key: 'onboarding_data',
    defaultValue: defaultOnboardingData,
  });

  const updateOnboardingData = async (data: Partial<OnboardingData>) => {
    const updatedData = { ...onboardingData, ...data };
    await setOnboardingData(updatedData);
  };

  const completeStep = async (step: number) => {
    const updatedSteps = [...onboardingData.completedSteps];
    if (!updatedSteps.includes(step)) {
      updatedSteps.push(step);
    }
    
    await updateOnboardingData({
      currentStep: step + 1,
      completedSteps: updatedSteps,
    });
  };

  const completeOnboarding = async () => {
    await updateOnboardingData({
      isCompleted: true,
      currentStep: 0, // Reset to 0 when completed
    });
  };

  const resetOnboarding = async () => {
    await setOnboardingData(defaultOnboardingData);
  };

  const value: OnboardingContextType = {
    onboardingData,
    loading,
    error,
    updateOnboardingData,
    completeStep,
    completeOnboarding,
    resetOnboarding,
    refresh,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

/**
 * Hook to use onboarding context safely
 * Returns default values if context is not available
 */
export function useOnboarding(): OnboardingContextType {
  const context = useContext(OnboardingContext);
  
  if (context === undefined) {
    console.warn('useOnboarding must be used within a SafeOnboardingProvider');
    return {
      onboardingData: defaultOnboardingData,
      loading: false,
      error: 'Onboarding context not available',
      updateOnboardingData: async () => {},
      completeStep: async () => {},
      completeOnboarding: async () => {},
      resetOnboarding: async () => {},
      refresh: async () => {},
    };
  }
  
  return context;
}