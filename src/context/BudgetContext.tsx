import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Pocket, Transaction, BudgetInsight, MonthlyData, ChartData } from '../types/budget';
import { useToast } from './SafeToastContext';

interface BudgetContextType {
  // Pockets
  pockets: Pocket[];
  loading: boolean;
  
  // Pocket methods
  addPocket: (pocket: Omit<Pocket, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  updatePocket: (id: string, updates: Partial<Pocket>) => Promise<{ success: boolean; error?: string }>;
  deletePocket: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<{ success: boolean; error?: string }>;
  deleteTransaction: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Insights
  insights: BudgetInsight[];
  generateInsights: () => void;
  
  // Chart data
  getChartData: () => ChartData;
  getMonthlyData: () => MonthlyData;
  
  // Calculations
  getTotalBudget: () => number;
  getTotalSpent: () => number;
  getTotalSavings: () => number;
  getPocketSpentPercentage: (pocketId: string) => number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

interface BudgetProviderProps {
  children: ReactNode;
}

export function BudgetProvider({ children }: BudgetProviderProps) {
  const [pockets, setPockets] = useState<Pocket[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [insights, setInsights] = useState<BudgetInsight[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { showSuccess, showError, showWarning } = useToast();

  // Mock implementation - no Firestore dependency
  const addPocket = async (pocketData: Omit<Pocket, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const pocket: Pocket = {
        ...pocketData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setPockets(prev => [...prev, pocket]);
      showSuccess('Success', 'Pocket added successfully!');
      generateInsights();
      return { success: true };
    } catch (error: any) {
      showError('Error', 'Failed to add pocket');
      return { success: false, error: error.message };
    }
  };

  const updatePocket = async (id: string, updates: Partial<Pocket>) => {
    try {
      setPockets(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p));
      showSuccess('Success', 'Pocket updated successfully!');
      generateInsights();
      return { success: true };
    } catch (error: any) {
      showError('Error', 'Failed to update pocket');
      return { success: false, error: error.message };
    }
  };

  const deletePocket = async (id: string) => {
    try {
      setPockets(prev => prev.filter(p => p.id !== id));
      setTransactions(prev => prev.filter(t => t.pocketId !== id));
      showSuccess('Success', 'Pocket deleted successfully!');
      generateInsights();
      return { success: true };
    } catch (error: any) {
      showError('Error', 'Failed to delete pocket');
      return { success: false, error: error.message };
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      const transaction: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      
      setTransactions(prev => [...prev, transaction]);
      
      // Update pocket spent amount
      const pocket = pockets.find(p => p.id === transaction.pocketId);
      if (pocket) {
        const newSpent = pocket.spent + (transaction.type === 'expense' ? transaction.amount : -transaction.amount);
        await updatePocket(transaction.pocketId, { spent: Math.max(0, newSpent) });
      }
      
      showSuccess('Success', 'Transaction added successfully!');
      generateInsights();
      return { success: true };
    } catch (error: any) {
      showError('Error', 'Failed to add transaction');
      return { success: false, error: error.message };
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      showSuccess('Success', 'Transaction updated successfully!');
      generateInsights();
      return { success: true };
    } catch (error: any) {
      showError('Error', 'Failed to update transaction');
      return { success: false, error: error.message };
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setTransactions(prev => prev.filter(t => t.id !== id));
      showSuccess('Success', 'Transaction deleted successfully!');
      generateInsights();
      return { success: true };
    } catch (error: any) {
      showError('Error', 'Failed to delete transaction');
      return { success: false, error: error.message };
    }
  };

  const generateInsights = () => {
    const newInsights: BudgetInsight[] = [];
    
    // Check for overspending
    pockets.forEach(pocket => {
      const percentage = (pocket.spent / pocket.budget) * 100;
      if (percentage > 100) {
        newInsights.push({
          id: `overspend-${pocket.id}`,
          type: 'warning',
          title: 'Overspending Alert',
          message: `You've exceeded your ${pocket.name} budget by ${(percentage - 100).toFixed(1)}%`,
          action: 'Review expenses',
          createdAt: new Date(),
        });
      } else if (percentage > 80) {
        newInsights.push({
          id: `warning-${pocket.id}`,
          type: 'warning',
          title: 'Budget Warning',
          message: `You've used ${percentage.toFixed(1)}% of your ${pocket.name} budget`,
          action: 'Monitor spending',
          createdAt: new Date(),
        });
      }
    });
    
    // Check for good savings
    const totalSavings = getTotalSavings();
    if (totalSavings > 0) {
      newInsights.push({
        id: 'savings-positive',
        type: 'success',
        title: 'Great Job!',
        message: `You've saved $${totalSavings.toFixed(2)} this month`,
        action: 'Keep it up!',
        createdAt: new Date(),
      });
    }
    
    // Check for no transactions
    if (transactions.length === 0) {
      newInsights.push({
        id: 'no-transactions',
        type: 'info',
        title: 'Get Started',
        message: 'Add your first transaction to start tracking your budget',
        action: 'Add transaction',
        createdAt: new Date(),
      });
    }
    
    setInsights(newInsights);
  };

  const getChartData = (): ChartData => {
    const labels = pockets.map(p => p.name);
    const budgetData = pockets.map(p => p.budget);
    const spentData = pockets.map(p => p.spent);
    
    return {
      labels,
      datasets: [
        {
          label: 'Budget',
          data: budgetData,
          color: '#007BFF',
        },
        {
          label: 'Spent',
          data: spentData,
          color: '#DC3545',
        },
      ],
    };
  };

  const getMonthlyData = (): MonthlyData => {
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const totalBudget = getTotalBudget();
    const totalSpent = getTotalSpent();
    const savings = totalBudget - totalSpent;
    
    return {
      month: currentMonth,
      totalBudget,
      totalSpent,
      savings,
      transactions: transactions.filter(t => 
        t.date.getMonth() === new Date().getMonth() && 
        t.date.getFullYear() === new Date().getFullYear()
      ),
    };
  };

  const getTotalBudget = () => pockets.reduce((sum, pocket) => sum + pocket.budget, 0);
  const getTotalSpent = () => pockets.reduce((sum, pocket) => sum + pocket.spent, 0);
  const getTotalSavings = () => getTotalBudget() - getTotalSpent();
  const getPocketSpentPercentage = (pocketId: string) => {
    const pocket = pockets.find(p => p.id === pocketId);
    if (!pocket) return 0;
    return (pocket.spent / pocket.budget) * 100;
  };

  const value: BudgetContextType = {
    pockets,
    loading,
    addPocket,
    updatePocket,
    deletePocket,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    insights,
    generateInsights,
    getChartData,
    getMonthlyData,
    getTotalBudget,
    getTotalSpent,
    getTotalSavings,
    getPocketSpentPercentage,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}