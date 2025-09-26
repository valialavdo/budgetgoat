import AsyncStorage from '@react-native-async-storage/async-storage';
import { BudgetState } from '../types';

const STORAGE_KEY = 'budgetPlannerState:v1';
const USER_PROFILE_KEY = 'userProfile:v1';
const APP_SETTINGS_KEY = 'appSettings:v1';

// Budget State Management
export async function saveState(state: BudgetState): Promise<void> {
  try {
    const serialized = JSON.stringify(state);
    await AsyncStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Error saving budget state:', error);
    throw new Error('Failed to save budget data');
  }
}

export async function loadState(): Promise<BudgetState | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BudgetState;
  } catch (error) {
    console.error('Error loading budget state:', error);
    return null;
  }
}

export async function clearState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing budget state:', error);
    throw new Error('Failed to clear budget data');
  }
}

// User Profile Management
export interface UserProfile {
  name: string;
  email: string;
  lastUpdated: string;
  profilePicture?: string;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    const serialized = JSON.stringify(profile);
    await AsyncStorage.setItem(USER_PROFILE_KEY, serialized);
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw new Error('Failed to save profile');
  }
}

export async function loadUserProfile(): Promise<UserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
}

export async function clearUserProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  } catch (error) {
    console.error('Error clearing user profile:', error);
    throw new Error('Failed to clear profile');
  }
}

// App Settings Management
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  notifications: {
    enabled: boolean;
    reminders: boolean;
    insights: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReports: boolean;
  };
  lastUpdated: string;
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  try {
    const serialized = JSON.stringify(settings);
    await AsyncStorage.setItem(APP_SETTINGS_KEY, serialized);
  } catch (error) {
    console.error('Error saving app settings:', error);
    throw new Error('Failed to save settings');
  }
}

export async function loadAppSettings(): Promise<AppSettings | null> {
  try {
    const raw = await AsyncStorage.getItem(APP_SETTINGS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppSettings;
  } catch (error) {
    console.error('Error loading app settings:', error);
    return null;
  }
}

export async function clearAppSettings(): Promise<void> {
  try {
    await AsyncStorage.removeItem(APP_SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing app settings:', error);
    throw new Error('Failed to clear settings');
  }
}

// Backup and Restore
export async function createBackup(): Promise<string> {
  try {
    const [budgetState, userProfile, appSettings] = await Promise.all([
      loadState(),
      loadUserProfile(),
      loadAppSettings()
    ]);

    const backup = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      budgetState,
      userProfile,
      appSettings
    };

    const serialized = JSON.stringify(backup);
    const backupKey = `backup:${Date.now()}`;
    await AsyncStorage.setItem(backupKey, serialized);
    
    return backupKey;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw new Error('Failed to create backup');
  }
}

export async function restoreBackup(backupKey: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(backupKey);
    if (!raw) throw new Error('Backup not found');

    const backup = JSON.parse(raw);
    
    if (backup.budgetState) {
      await saveState(backup.budgetState);
    }
    if (backup.userProfile) {
      await saveUserProfile(backup.userProfile);
    }
    if (backup.appSettings) {
      await saveAppSettings(backup.appSettings);
    }
  } catch (error) {
    console.error('Error restoring backup:', error);
    throw new Error('Failed to restore backup');
  }
}

// Clear all data
export async function clearAllData(): Promise<void> {
  try {
    await Promise.all([
      clearState(),
      clearUserProfile(),
      clearAppSettings()
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw new Error('Failed to clear all data');
  }
}


