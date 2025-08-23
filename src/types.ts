export type UUID = string;

export type MonthKey = string; // e.g., "2025-08"

export type CategoryType = 'income' | 'bank' | 'extra' | 'other';

export interface RecurrenceRule {
  isRecurring: boolean;
  // If true, apply from effectiveFrom (inclusive) to all future months
  effectiveFrom?: MonthKey;
  // For timed events like transfers on last working day
  timing?: 'lastWorkingDay' | 'customDate' | null;
  customDayOfMonth?: number | null; // when timing === 'customDate'
}

export interface Category {
  id: UUID;
  name: string;
  type: CategoryType;
  color: string;
  // Default planned amount for recurring months
  defaultAmount: number; // positive amounts for both inflows and outflows; sign derived from type
  isInflux: boolean; // true for income; false for allocations/outflows
  recurrence: RecurrenceRule;
  notes?: string; // Optional notes for the category
}

export interface CategoryAmountOverride {
  categoryId: UUID;
  amount: number; // positive magnitude; sign derived from category isInflux
  note?: string;
  appliedToFuture?: boolean; // whether this change propagates forward from this month
}

export interface BudgetMonth {
  month: MonthKey; // YYYY-MM
  overrides: CategoryAmountOverride[]; // per-month overrides relative to recurring defaults
}

export interface BudgetState {
  categories: Category[];
  budgetsByMonth: Record<MonthKey, BudgetMonth>;
  lastOpenedMonth?: MonthKey;
  allocationRules: Record<string, AllocationRule[]>; // key: income category id
  transactionsByMonth: Record<MonthKey, Transaction[]>; // pocket expenses/inflows
}

export interface Totals {
  totalIncome: number;
  totalOutflow: number;
  remaining: number; // income - outflow
}

export interface EditOptions {
  propagateToFuture?: boolean;
}

export type AllocationMode = 'percent' | 'amount';

export interface AllocationRule {
  targetCategoryId: UUID; // typically a bank/pocket category
  mode: AllocationMode; // 'percent' means value is 0..100
  value: number; // when mode === 'amount', currency amount; when 'percent', percent share
}

export type TransactionType = 'expense' | 'income';

export interface TransactionRecurrence {
  isRecurring: boolean;
  effectiveFrom?: MonthKey; // month to start applying
  frequency?: string; // 'monthly', 'quarterly', 'yearly'
  duration?: number; // number of months to repeat
}

export interface Transaction {
  id: UUID;
  month: MonthKey; // allocation month (YYYY-MM)
  pocketCategoryId: UUID; // bank category id
  type: TransactionType; // expense reduces, income increases pocket
  amount: number; // positive magnitude
  note?: string;
  recurrence?: TransactionRecurrence;
}

export type PocketBalances = Record<UUID, number>; // pocketCategoryId -> balance


