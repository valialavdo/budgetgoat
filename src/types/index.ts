/**
 * TypeScript type definitions for BudgetGOAT
 */

export type MonthKey = string; // YYYY-MM format

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string; // ISO date string
  linkedPocketId?: string;
  description?: string;
  category?: string;
  isRecurring?: boolean;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  userId?: string;
}

export interface Pocket {
  id: string;
  name: string;
  balance: number;
  goal?: number;
  icon?: string;
  color?: string;
  isSavings?: boolean;
  allocationRule?: AllocationRule;
  transactions?: Transaction[];
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  userId?: string;
}

export interface Category {
  id: string;
  name: string;
  budgetedAmount: number;
  spentAmount: number;
  icon?: string;
  color?: string;
}

export interface AllocationRule {
  type: 'percentage' | 'fixed';
  value: number;
  frequency: 'monthly' | 'weekly' | 'bi-weekly';
}

export interface BudgetMonth {
  monthKey: MonthKey; // e.g., "2023-10"
  income: number;
  expenses: number;
  netSavings: number;
  categories: Category[];
  transactions: Transaction[];
}

export interface BudgetState {
  currentMonth: MonthKey;
  totalBalance: number;
  pockets: Pocket[];
  transactions: Transaction[];
  budgetHistory: { [key: MonthKey]: BudgetMonth };
  settings: UserSettings;
  onboarding: OnboardingState;
}

export interface UserSettings {
  currency: string;
  enableBiometrics: boolean;
  hideBalances: boolean;
  enableNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface OnboardingState {
  hasCompletedOnboarding: boolean;
  completedSteps: string[];
  currentStep: number;
}

export interface Totals {
  income: number;
  expenses: number;
  netSavings: number;
}

export interface CategoryAmountOverride {
  categoryId: string;
  monthKey: MonthKey;
  amount: number;
}

export interface EditOptions {
  isEditing: boolean;
  transactionId?: string;
  pocketId?: string;
}

// Navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Tabs: undefined;
  NewTransaction: undefined;
  NewPocket: undefined;
  PocketDetails: { pocketId: string };
  TransactionDetails: { transactionId: string };
  Settings: undefined;
  Profile: undefined;
};

export type TabParamList = {
  Home: undefined;
  Pockets: undefined;
  Transactions: undefined;
  Account: undefined;
};