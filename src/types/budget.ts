export interface Pocket {
  id: string;
  name: string;
  budget: number;
  spent: number;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  pocketId: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: 'expense' | 'income';
  createdAt: Date;
}

export interface BudgetInsight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'tip';
  title: string;
  message: string;
  action?: string;
  createdAt: Date;
}

export interface MonthlyData {
  month: string;
  totalBudget: number;
  totalSpent: number;
  savings: number;
  transactions: Transaction[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}
