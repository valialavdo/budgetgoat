import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock User type
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface MockFirebaseContextType {
  user: MockUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const MockFirebaseContext = createContext<MockFirebaseContextType | undefined>(undefined);

export function MockFirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(false);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock user
    const mockUser: MockUser = {
      uid: 'mock-uid-' + Date.now(),
      email,
      displayName: email.split('@')[0],
    };
    
    setUser(mockUser);
    setLoading(false);
    console.log('Mock sign up successful:', mockUser);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock user
    const mockUser: MockUser = {
      uid: 'mock-uid-' + Date.now(),
      email,
      displayName: email.split('@')[0],
    };
    
    setUser(mockUser);
    setLoading(false);
    console.log('Mock sign in successful:', mockUser);
  };

  const signOut = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    setLoading(false);
    console.log('Mock sign out successful');
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    console.log('Mock password reset email sent to:', email);
    alert('Mock: Password reset email sent to ' + email);
  };

  const value: MockFirebaseContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <MockFirebaseContext.Provider value={value}>
      {children}
    </MockFirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(MockFirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a MockFirebaseProvider');
  }
  return context;
}
