/**
 * Firebase Context Provider
 * Provides Firebase authentication and Firestore functionality
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { FirebaseHelpers } from '../services/firebase';
import { Pocket, Transaction, UserSettings } from '../types';

interface FirebaseContextType {
  // Authentication
  user: FirebaseAuthTypes.User | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  
  // Data
  pockets: Pocket[];
  transactions: Transaction[];
  userSettings: UserSettings | null;
  
  // Data methods
  addPocket: (pocketData: Omit<Pocket, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; id?: string; error?: string }>;
  updatePocket: (id: string, updates: Partial<Pocket>) => Promise<{ success: boolean; error?: string }>;
  deletePocket: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  addTransaction: (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; id?: string; error?: string }>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<{ success: boolean; error?: string }>;
  deleteTransaction: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Analytics
  logEvent: (eventName: string, parameters?: any) => Promise<{ success: boolean; error?: string }>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pockets, setPockets] = useState<Pocket[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      setLoading(false);

      if (currentUser) {
        await loadUserData(currentUser.uid);
      } else {
        // Clear data when user logs out
        setPockets([]);
        setTransactions([]);
        setUserSettings(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Load pockets
      const pocketsResult = await FirebaseHelpers.getCollection('pockets', userId);
      if (pocketsResult.success && pocketsResult.data) {
        setPockets(pocketsResult.data as Pocket[]);
      }

      // Load transactions
      const transactionsResult = await FirebaseHelpers.getCollection('transactions', userId);
      if (transactionsResult.success && transactionsResult.data) {
        setTransactions(transactionsResult.data as Transaction[]);
      }

      // Load user settings
      const settingsResult = await FirebaseHelpers.getCollection('userSettings', userId);
      if (settingsResult.success && settingsResult.data && settingsResult.data.length > 0) {
        setUserSettings(settingsResult.data[0] as UserSettings);
      } else {
        // Create default settings
        const defaultSettings: UserSettings = {
          currency: 'USD',
          enableBiometrics: false,
          hideBalances: false,
          enableNotifications: true,
          theme: 'light',
          language: 'en',
        };
        
        const addResult = await FirebaseHelpers.addDocument('userSettings', {
          ...defaultSettings,
          userId,
        });
        
        if (addResult.success) {
          setUserSettings(defaultSettings);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Authentication methods
  const signIn = async (email: string, password: string) => {
    return await FirebaseHelpers.signInWithEmail(email, password);
  };

  const signUp = async (email: string, password: string) => {
    return await FirebaseHelpers.signUpWithEmail(email, password);
  };

  const signOut = async () => {
    return await FirebaseHelpers.signOut();
  };

  // Pocket methods
  const addPocket = async (pocketData: Omit<Pocket, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const result = await FirebaseHelpers.addDocument('pockets', {
      ...pocketData,
      userId: user.uid,
    });

    if (result.success) {
      await FirebaseHelpers.logEvent('pocket_created', { pocket_name: pocketData.name });
    }

    return result;
  };

  const updatePocket = async (id: string, updates: Partial<Pocket>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const result = await FirebaseHelpers.updateDocument('pockets', id, updates);

    if (result.success) {
      await FirebaseHelpers.logEvent('pocket_updated', { pocket_id: id });
    }

    return result;
  };

  const deletePocket = async (id: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const result = await FirebaseHelpers.deleteDocument('pockets', id);

    if (result.success) {
      await FirebaseHelpers.logEvent('pocket_deleted', { pocket_id: id });
    }

    return result;
  };

  // Transaction methods
  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const result = await FirebaseHelpers.addDocument('transactions', {
      ...transactionData,
      userId: user.uid,
    });

    if (result.success) {
      await FirebaseHelpers.logEvent('transaction_created', { transaction_type: transactionData.type });
    }

    return result;
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const result = await FirebaseHelpers.updateDocument('transactions', id, updates);

    if (result.success) {
      await FirebaseHelpers.logEvent('transaction_updated', { transaction_id: id });
    }

    return result;
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const result = await FirebaseHelpers.deleteDocument('transactions', id);

    if (result.success) {
      await FirebaseHelpers.logEvent('transaction_deleted', { transaction_id: id });
    }

    return result;
  };

  // Analytics
  const logEvent = async (eventName: string, parameters?: any) => {
    return await FirebaseHelpers.logEvent(eventName, parameters);
  };

  const contextValue: FirebaseContextType = {
    user,
    isAuthenticated,
    loading,
    signIn,
    signUp,
    signOut,
    pockets,
    addPocket,
    updatePocket,
    deletePocket,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    userSettings,
    logEvent,
  };

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;