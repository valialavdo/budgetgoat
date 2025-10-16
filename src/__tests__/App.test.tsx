import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';

// Mock the context providers
jest.mock('../src/context/SafeThemeContext', () => ({
  SafeThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    isDark: false,
    colors: {
      background: '#FFFFFF',
      text: '#000000',
      primary: '#007BFF',
      surface: '#F8F9FA',
      border: '#E9ECEF',
      textMuted: '#666666',
      error: '#DC3545',
      secondary: '#6C757D',
    },
    toggleTheme: jest.fn(),
  }),
}));

jest.mock('../src/context/SafeOnboardingContext', () => ({
  SafeOnboardingProvider: ({ children }: { children: React.ReactNode }) => children,
  useOnboarding: () => ({
    hasCompletedOnboarding: true,
    isLoading: false,
    completeOnboarding: jest.fn(),
  }),
}));

jest.mock('../src/context/SafeToastContext', () => ({
  SafeToastProvider: ({ children }: { children: React.ReactNode }) => children,
  useToast: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
    showInfo: jest.fn(),
    showWarning: jest.fn(),
    toasts: [],
    hideToast: jest.fn(),
  }),
}));

jest.mock('../src/context/SafeFirebaseContext', () => ({
  SafeFirebaseProvider: ({ children }: { children: React.ReactNode }) => children,
  useFirebase: () => ({
    user: { email: 'test@example.com' },
    isAuthenticated: true,
    loading: false,
    signOut: jest.fn(),
  }),
}));

describe('App', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText('BudgetGOAT')).toBeTruthy();
  });

  it('displays the main app content when authenticated', () => {
    const { getByText } = render(<App />);
    expect(getByText('Welcome, test@example.com')).toBeTruthy();
  });

  it('has all required buttons', () => {
    const { getByText } = render(<App />);
    expect(getByText('Test Success Toast')).toBeTruthy();
    expect(getByText('Test Error Toast')).toBeTruthy();
    expect(getByText('Test Info Toast')).toBeTruthy();
    expect(getByText('Test Warning Toast')).toBeTruthy();
  });
});
