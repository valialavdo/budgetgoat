import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  limit
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { errorLogger } from '../services/errorLogger';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    currency: string;
  };
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface SafeFirebaseProviderProps {
  children: ReactNode;
}

export function SafeFirebaseProvider({ children }: SafeFirebaseProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Demo mode - bypass authentication for development
  const DEMO_MODE = false;

  // Initialize auth state listener
  useEffect(() => {
    if (DEMO_MODE) {
      // Demo mode - create mock user
      const mockUser = {
        uid: 'demo-user-123',
        email: 'demo@budgetgoat.com',
        displayName: 'Demo User',
        photoURL: null, // Explicitly set to null instead of undefined
        emailVerified: true,
        isAnonymous: false,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        },
        providerData: [],
        refreshToken: 'demo-token',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => 'demo-token',
        getIdTokenResult: async () => ({ token: 'demo-token' } as any),
        reload: async () => {},
        toJSON: () => ({}),
      } as User;

      const mockProfile: UserProfile = {
        uid: 'demo-user-123',
        email: 'demo@budgetgoat.com',
        displayName: 'Demo User',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: 'light',
          notifications: true,
          currency: 'USD',
        },
      };

      setUser(mockUser);
      setUserProfile(mockProfile);
      setLoading(false);
      setError(null);
      
      errorLogger.logInfo('Auth', 'Demo mode enabled - mock user created');
      return;
    }

    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          setUser(firebaseUser);
          
          if (firebaseUser) {
            await loadUserProfile(firebaseUser.uid);
            errorLogger.logInfo('Auth', `User signed in: ${firebaseUser.email}`);
          } else {
            setUserProfile(null);
            errorLogger.logInfo('Auth', 'User signed out');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown auth error';
          setError(errorMessage);
          errorLogger.logError('Auth', new Error(errorMessage));
        } finally {
          setLoading(false);
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize auth';
      setError(errorMessage);
      errorLogger.logError('Auth', new Error(errorMessage));
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const loadUserProfile = async (uid: string) => {
    try {
      const userDoc = doc(db, 'users', uid);
      const userSnap = await getDoc(userDoc);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserProfile({
          uid,
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
          preferences: data.preferences || {
            theme: 'light',
            notifications: true,
            currency: 'USD'
          }
        });
      } else {
        // Create default profile if it doesn't exist
        const defaultProfile: UserProfile = {
          uid,
          email: user?.email || '',
          displayName: user?.displayName || 'User',
          photoURL: user?.photoURL || undefined,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          preferences: {
            theme: 'light',
            notifications: true,
            currency: 'USD'
          }
        };
        
        await setDoc(userDoc, {
          ...defaultProfile,
          createdAt: new Date(),
          lastLoginAt: new Date()
        });
        
        setUserProfile(defaultProfile);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user profile';
      errorLogger.logError('Auth', new Error(`Failed to load user profile: ${errorMessage}`));
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      if (userCredential.user) {
        const userDoc = doc(db, 'users', userCredential.user.uid);
        await updateDoc(userDoc, {
          lastLoginAt: new Date()
        });
      }
      
      errorLogger.logInfo('Auth', `User signed in successfully: ${email}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      errorLogger.logError('Auth', new Error(`Sign in failed: ${errorMessage}`));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        
        // Create user profile in Firestore
        const userDoc = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDoc, {
          uid: userCredential.user.uid,
          email,
          displayName,
          photoURL: userCredential.user.photoURL,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          preferences: {
            theme: 'light',
            notifications: true,
            currency: 'USD'
          }
        });
      }
      
      errorLogger.logInfo('Auth', `User created successfully: ${email}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      errorLogger.logError('Auth', new Error(`Sign up failed: ${errorMessage}`));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await signOut(auth);
      setUserProfile(null);
      
      errorLogger.logInfo('Auth', 'User signed out successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
      errorLogger.logError('Auth', new Error(`Sign out failed: ${errorMessage}`));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('No user signed in');
    }

    try {
      setLoading(true);
      setError(null);
      
      const userDoc = doc(db, 'users', user.uid);
      await updateDoc(userDoc, {
        ...updates,
        updatedAt: new Date()
      });
      
      // Update local state
      if (userProfile) {
        setUserProfile({ ...userProfile, ...updates });
      }
      
      errorLogger.logInfo('Auth', 'User profile updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      errorLogger.logError('Auth', new Error(`Profile update failed: ${errorMessage}`));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await sendPasswordResetEmail(auth, email);
      
      errorLogger.logInfo('Auth', `Password reset email sent to: ${email}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      errorLogger.logError('Auth', new Error(`Password reset failed: ${errorMessage}`));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user || !user.email) {
      throw new Error('No user signed in');
    }

    try {
      setLoading(true);
      setError(null);
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      errorLogger.logInfo('Auth', 'Password changed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password change failed';
      setError(errorMessage);
      errorLogger.logError('Auth', new Error(`Password change failed: ${errorMessage}`));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    if (!user) {
      return;
    }

    try {
      await loadUserProfile(user.uid);
      errorLogger.logInfo('Auth', 'User profile refreshed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile refresh failed';
      errorLogger.logError('Auth', new Error(`Profile refresh failed: ${errorMessage}`));
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    resetPassword,
    changePassword,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SafeFirebaseProvider');
  }
  return context;
}