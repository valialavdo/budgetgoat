/**
 * Internationalization (i18n) setup for BudgetGOAT
 * 
 * This module provides centralized string management and localization support
 * for the entire application, preparing it for multi-language support and
 * Google Play Store localization requirements.
 */

// Translation keys interface for type safety
export interface TranslationKeys {
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    remove: string;
    confirm: string;
    close: string;
    done: string;
    next: string;
    back: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    yes: string;
    no: string;
    ok: string;
  };
  
  // Navigation
  navigation: {
    home: string;
    pockets: string;
    transactions: string;
    account: string;
    settings: string;
  };
  
  // Home Screen
  home: {
    title: string;
    totalBalance: string;
    monthlyBudget: string;
    recentTransactions: string;
    viewAll: string;
    quickActions: string;
    aiInsights: string;
    addTransaction: string;
    createPocket: string;
  };
  
  // Transactions
  transactions: {
    title: string;
    addTransaction: string;
    editTransaction: string;
    deleteTransaction: string;
    transactionDetails: string;
    amount: string;
    description: string;
    category: string;
    date: string;
    type: string;
    income: string;
    expense: string;
    recurring: string;
    tags: string;
    pocket: string;
    selectPocket: string;
    frequency: string;
    monthly: string;
    yearly: string;
    duration: string;
    saveTransaction: string;
    updateTransaction: string;
    deleteConfirmation: string;
    noTransactions: string;
    filterBy: string;
    sortBy: string;
    dateRange: string;
    allTime: string;
    last30Days: string;
    last90Days: string;
    lastYear: string;
    custom: string;
    clearFilters: string;
    applyFilters: string;
  };
  
  // Pockets
  pockets: {
    title: string;
    createPocket: string;
    editPocket: string;
    deletePocket: string;
    pocketName: string;
    pocketDescription: string;
    pocketType: string;
    standard: string;
    goal: string;
    targetAmount: string;
    currentBalance: string;
    pocketDetails: string;
    savePocket: string;
    updatePocket: string;
    deleteConfirmation: string;
    noPockets: string;
    totalPockets: string;
    activePockets: string;
  };
  
  // Account
  account: {
    title: string;
    profile: string;
    editProfile: string;
    memberSince: string;
    appearance: string;
    currency: string;
    notifications: string;
    privacy: string;
    privacyPolicy: string;
    termsOfService: string;
    help: string;
    support: string;
    about: string;
    rateUs: string;
    shareApp: string;
    exportData: string;
    clearData: string;
    signOut: string;
    deleteAccount: string;
  };
  
  // Forms
  forms: {
    required: string;
    invalidEmail: string;
    invalidAmount: string;
    invalidDate: string;
    passwordTooShort: string;
    passwordsDoNotMatch: string;
    selectOption: string;
    enterAmount: string;
    enterDescription: string;
    selectCategory: string;
    selectDate: string;
    enterTags: string;
  };
  
  // Errors
  errors: {
    networkError: string;
    serverError: string;
    validationError: string;
    unknownError: string;
    insufficientFunds: string;
    pocketNotFound: string;
    transactionNotFound: string;
    saveError: string;
    deleteError: string;
    loadError: string;
  };
  
  // Success Messages
  success: {
    transactionSaved: string;
    transactionUpdated: string;
    transactionDeleted: string;
    pocketCreated: string;
    pocketUpdated: string;
    pocketDeleted: string;
    profileUpdated: string;
    dataExported: string;
    dataCleared: string;
    settingsSaved: string;
  };
  
  // About Screen
  about: {
    title: string;
    heroText: string;
    bodyText: string;
    version: string;
    copyright: string;
  };
  
  // Privacy Policy
  privacy: {
    title: string;
    lastUpdated: string;
    mainHeading: string;
    bodyText: string;
    sectionHeading: string;
    dataSecurity: string;
    yourRights: string;
    contactUs: string;
  };
  
  // Rate Us
  rateUs: {
    title: string;
    headerTitle: string;
    headerDescription: string;
    ratingTitle: string;
    ratingDescription: string;
    supportTitle: string;
    shareWithFriends: string;
    shareDescription: string;
  };
}

// Default English translations
export const en: TranslationKeys = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    confirm: 'Confirm',
    close: 'Close',
    done: 'Done',
    next: 'Next',
    back: 'Back',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
  },
  
  navigation: {
    home: 'Home',
    pockets: 'Pockets',
    transactions: 'Transactions',
    account: 'Account',
    settings: 'Settings',
  },
  
  home: {
    title: 'Dashboard',
    totalBalance: 'Total Balance',
    monthlyBudget: 'Monthly Budget',
    recentTransactions: 'Recent Transactions',
    viewAll: 'View All',
    quickActions: 'Quick Actions',
    aiInsights: 'AI Insights',
    addTransaction: 'Add Transaction',
    createPocket: 'Create Pocket',
  },
  
  transactions: {
    title: 'Transactions',
    addTransaction: 'Add Transaction',
    editTransaction: 'Edit Transaction',
    deleteTransaction: 'Delete Transaction',
    transactionDetails: 'Transaction Details',
    amount: 'Amount',
    description: 'Description',
    category: 'Category',
    date: 'Date',
    type: 'Type',
    income: 'Income',
    expense: 'Expense',
    recurring: 'Recurring',
    tags: 'Tags',
    pocket: 'Pocket',
    selectPocket: 'Select Pocket',
    frequency: 'Frequency',
    monthly: 'Monthly',
    yearly: 'Yearly',
    duration: 'Duration',
    saveTransaction: 'Save Transaction',
    updateTransaction: 'Update Transaction',
    deleteConfirmation: 'Are you sure you want to delete this transaction?',
    noTransactions: 'No transactions found',
    filterBy: 'Filter by',
    sortBy: 'Sort by',
    dateRange: 'Date Range',
    allTime: 'All Time',
    last30Days: 'Last 30 Days',
    last90Days: 'Last 90 Days',
    lastYear: 'Last Year',
    custom: 'Custom',
    clearFilters: 'Clear Filters',
    applyFilters: 'Apply Filters',
  },
  
  pockets: {
    title: 'Pockets',
    createPocket: 'Create Pocket',
    editPocket: 'Edit Pocket',
    deletePocket: 'Delete Pocket',
    pocketName: 'Pocket Name',
    pocketDescription: 'Description',
    pocketType: 'Pocket Type',
    standard: 'Standard',
    goal: 'Goal',
    targetAmount: 'Target Amount',
    currentBalance: 'Current Balance',
    pocketDetails: 'Pocket Details',
    savePocket: 'Save Pocket',
    updatePocket: 'Update Pocket',
    deleteConfirmation: 'Are you sure you want to delete this pocket?',
    noPockets: 'No pockets found',
    totalPockets: 'Total Pockets',
    activePockets: 'Active Pockets',
  },
  
  account: {
    title: 'Account',
    profile: 'Profile',
    editProfile: 'Edit Profile',
    memberSince: 'Member Since',
    appearance: 'Appearance',
    currency: 'Currency',
    notifications: 'Notifications',
    privacy: 'Privacy',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    help: 'Help',
    support: 'Support',
    about: 'About',
    rateUs: 'Rate Us',
    shareApp: 'Share App',
    exportData: 'Export Data',
    clearData: 'Clear Data',
    signOut: 'Sign Out',
    deleteAccount: 'Delete Account',
  },
  
  forms: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidAmount: 'Please enter a valid amount',
    invalidDate: 'Please enter a valid date',
    passwordTooShort: 'Password must be at least 8 characters',
    passwordsDoNotMatch: 'Passwords do not match',
    selectOption: 'Please select an option',
    enterAmount: 'Enter amount',
    enterDescription: 'Enter description',
    selectCategory: 'Select category',
    selectDate: 'Select date',
    enterTags: 'Enter tags (comma separated)',
  },
  
  errors: {
    networkError: 'Network connection error',
    serverError: 'Server error occurred',
    validationError: 'Please check your input',
    unknownError: 'An unknown error occurred',
    insufficientFunds: 'Insufficient funds',
    pocketNotFound: 'Pocket not found',
    transactionNotFound: 'Transaction not found',
    saveError: 'Failed to save',
    deleteError: 'Failed to delete',
    loadError: 'Failed to load data',
  },
  
  success: {
    transactionSaved: 'Transaction saved successfully',
    transactionUpdated: 'Transaction updated successfully',
    transactionDeleted: 'Transaction deleted successfully',
    pocketCreated: 'Pocket created successfully',
    pocketUpdated: 'Pocket updated successfully',
    pocketDeleted: 'Pocket deleted successfully',
    profileUpdated: 'Profile updated successfully',
    dataExported: 'Data exported successfully',
    dataCleared: 'Data cleared successfully',
    settingsSaved: 'Settings saved successfully',
  },
  
  about: {
    title: 'About BudgetGOAT',
    heroText: 'Outsmart the system. Everyday.',
    bodyText: "We're not here to blend in. We're here to help you save a little more and hustle a little smarter—every single day. BudgetGOAT is your offbeat money sidekick: AI-driven, street-smart, and always on your side. Ready to flip the script?",
    version: 'Version 1.0.0 Build 1',
    copyright: '© 2024 BudgetGOAT. All rights reserved.',
  },
  
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated:',
    mainHeading: 'Thanks for trusting BudgetGOAT with your personal data',
    bodyText: 'Using BudgetGOAT creates personal data, and we are committed to protecting your privacy and being transparent about how we collect, use, and share your information.',
    sectionHeading: 'We use your personal data to',
    dataSecurity: 'Data Security',
    yourRights: 'Your Rights',
    contactUs: 'Contact Us',
  },
  
  rateUs: {
    title: 'Rate Us',
    headerTitle: 'Love BudgetGOAT?',
    headerDescription: 'Your feedback helps us improve and helps other users discover our app.',
    ratingTitle: 'How would you rate BudgetGOAT?',
    ratingDescription: 'Your rating helps other users discover BudgetGOAT.',
    supportTitle: 'More Ways to Support Us',
    shareWithFriends: 'Share with Friends',
    shareDescription: 'Help your friends take control of their finances.',
  },
};

// Simple i18n hook for accessing translations
export function useTranslation() {
  // In a real app, this would get the current locale from context/state
  // For now, we'll just return the English translations
  return {
    t: (key: string): string => {
      const keys = key.split('.');
      let value: any = en;
      
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key; // Return the key if translation not found
        }
      }
      
      return typeof value === 'string' ? value : key;
    },
    locale: 'en',
  };
}

// Helper function to get nested translation values
export function getTranslation(key: string, translations: TranslationKeys = en): string {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}
