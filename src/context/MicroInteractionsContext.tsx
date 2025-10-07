import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MicroInteractionsContextType {
  hapticEnabled: boolean;
  animationsEnabled: boolean;
  toggleHaptic: () => void;
  toggleAnimations: () => void;
  triggerHaptic: (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => void;
}

const MICRO_INTERACTIONS_STORAGE_KEY = '@budgetgoat_micro_interactions';

const MicroInteractionsContext = createContext<MicroInteractionsContextType | undefined>(undefined);

interface MicroInteractionsProviderProps {
  children: React.ReactNode;
}

export function MicroInteractionsProvider({ children }: MicroInteractionsProviderProps) {
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Load preferences on app start
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedPreferences = await AsyncStorage.getItem(MICRO_INTERACTIONS_STORAGE_KEY);
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        setHapticEnabled(preferences.hapticEnabled ?? true);
        setAnimationsEnabled(preferences.animationsEnabled ?? true);
      }
    } catch (error) {
      console.warn('Failed to load microinteractions preferences:', error);
      // Fallback to default values if AsyncStorage fails
      setHapticEnabled(true);
      setAnimationsEnabled(true);
    }
  };

  const savePreferences = async (haptic: boolean, animations: boolean) => {
    try {
      await AsyncStorage.setItem(
        MICRO_INTERACTIONS_STORAGE_KEY,
        JSON.stringify({ hapticEnabled: haptic, animationsEnabled: animations })
      );
    } catch (error) {
      console.warn('Failed to save microinteractions preferences:', error);
    }
  };

  const toggleHaptic = async () => {
    const newValue = !hapticEnabled;
    setHapticEnabled(newValue);
    await savePreferences(newValue, animationsEnabled);
    
    // Provide haptic feedback for the toggle itself
    if (newValue) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const toggleAnimations = async () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    await savePreferences(hapticEnabled, newValue);
    
    // Provide haptic feedback for the toggle itself
    if (hapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const triggerHaptic = async (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
    if (!hapticEnabled) return;

    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch (error) {
      console.warn('Failed to trigger haptic feedback:', error);
    }
  };

  const contextValue = {
    hapticEnabled,
    animationsEnabled,
    toggleHaptic,
    toggleAnimations,
    triggerHaptic,
  };

  return (
    <MicroInteractionsContext.Provider value={contextValue}>
      {children}
    </MicroInteractionsContext.Provider>
  );
}

export function useMicroInteractions() {
  const context = useContext(MicroInteractionsContext);
  if (context === undefined) {
    throw new Error('useMicroInteractions must be used within a MicroInteractionsProvider');
  }
  return context;
}
