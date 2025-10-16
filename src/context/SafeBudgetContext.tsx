import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { firestoreService, Pocket, Transaction, BudgetGoal, Insight } from '../services/firestoreService';
import { errorLogger } from '../services/errorLogger';

interface BudgetContextType {
  // Pockets
  pockets: Pocket[];
  pocketsLoading: boolean;
  pocketsError: string | null;
  createPocket: (pocketData: Omit<Pocket, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePocket: (pocketId: string, updates: Partial<Pocket>) => Promise<void>;
  deletePocket: (pocketId: string) => Promise<void>;
  
  // Transactions
  transactions: Transaction[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  createTransaction: (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  
  // Budget Goals
  budgetGoals: BudgetGoal[];
  budgetGoalsLoading: boolean;
  budgetGoalsError: string | null;
  createBudgetGoal: (goalData: Omit<BudgetGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  
  // Insights
  insights: Insight[];
  insightsLoading: boolean;
  insightsError: string | null;
  
  // Statistics
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  
  // Utility functions
  refreshData: () => Promise<void>;
  getPocketById: (pocketId: string) => Pocket | undefined;
  getTransactionsByPocket: (pocketId: string) => Transaction[];
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

interface SafeBudgetProviderProps {
  children: ReactNode;
}

export function SafeBudgetProvider({ children }: SafeBudgetProviderProps) {
  // Pockets state
  const [pockets, setPockets] = useState<Pocket[]>([]);
  const [pocketsLoading, setPocketsLoading] = useState(true);
  const [pocketsError, setPocketsError] = useState<string | null>(null);

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);

  // Budget Goals state
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [budgetGoalsLoading, setBudgetGoalsLoading] = useState(true);
  const [budgetGoalsError, setBudgetGoalsError] = useState<string | null>(null);

  // Insights state
  const [insights, setInsights] = useState<Insight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  // Real-time subscriptions - Temporarily disabled to avoid Firebase permission errors
  useEffect(() => {
    // Mock data for development
    const mockPockets: Pocket[] = [
      {
        id: '1',
        userId: 'mock-user',
        name: 'Emergency Fund',
        description: 'Emergency savings for unexpected expenses',
        amount: 5000,
        currentBalance: 2500,
        targetAmount: 5000,
        category: 'Savings',
        color: '#007BFF',
        type: 'goal',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      },
      {
        id: '2',
        userId: 'mock-user',
        name: 'Vacation',
        description: 'Dream vacation fund',
        amount: 2000,
        currentBalance: 800,
        targetAmount: 2000,
        category: 'Travel',
        color: '#28A745',
        type: 'goal',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      },
      {
        id: '3',
        userId: 'mock-user',
        name: 'New Car',
        description: 'Down payment for a new car',
        amount: 15000,
        currentBalance: 5000,
        targetAmount: 15000,
        category: 'Transportation',
        color: '#FF6B35',
        type: 'goal',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }
    ];

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        userId: 'mock-user',
        description: 'Coffee Shop',
        amount: 4.50,
        type: 'expense',
        category: 'food',
        pocketId: '1',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['coffee', 'food'],
      },
      {
        id: '2',
        userId: 'mock-user',
        description: 'Salary',
        amount: 3000,
        type: 'income',
        category: 'salary',
        pocketId: '1',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['salary', 'income'],
      }
    ];

    const mockInsights: Insight[] = [
      {
        id: '1',
        userId: 'mock-user',
        title: 'Spending Alert',
        description: 'You\'re spending 20% more on dining this month',
        type: 'budget_alert',
        data: { category: 'dining', increase: 20 },
        priority: 'medium',
        createdAt: new Date(),
        isRead: false,
      },
      {
        id: '2',
        userId: 'mock-user',
        title: 'Budget Recommendation',
        description: 'Consider reducing entertainment expenses to meet your savings goal',
        type: 'budget_alert',
        data: { category: 'entertainment', recommendation: 'reduce' },
        priority: 'low',
        createdAt: new Date(),
        isRead: false,
      },
      {
        id: '3',
        userId: 'mock-user',
        title: 'Savings Milestone',
        description: 'Congratulations! You\'ve reached 75% of your emergency fund goal',
        type: 'budget_alert',
        data: { category: 'savings', milestone: 75 },
        priority: 'high',
        createdAt: new Date(),
        isRead: false,
      }
    ];

    // Set mock data
    setPockets(mockPockets);
    setPocketsLoading(false);
    setPocketsError(null);

    setTransactions(mockTransactions);
    setTransactionsLoading(false);
    setTransactionsError(null);

    setInsights(mockInsights);
    setInsightsLoading(false);
    setInsightsError(null);

    errorLogger.logInfo('Budget', 'Mock data loaded successfully');
  }, []);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Mock budget goals
             const mockGoals: BudgetGoal[] = [
               {
                 id: '1',
                 userId: 'mock-user',
                 name: 'Emergency Fund',
                 description: 'Build emergency fund',
                 targetAmount: 10000,
                 currentAmount: 5000,
                 deadline: new Date('2024-12-31'),
                 category: 'savings',
                 priority: 'high',
                 isCompleted: false,
                 createdAt: new Date(),
                 updatedAt: new Date(),
               }
             ];
      setBudgetGoals(mockGoals);
      setBudgetGoalsLoading(false);
      setBudgetGoalsError(null);

      errorLogger.logInfo('Budget', 'Mock initial data loaded successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load initial data';
      errorLogger.logError('Budget', new Error(`Load initial data failed: ${errorMessage}`));
      setBudgetGoalsError(errorMessage);
    }
  };

  // Pocket operations - Mock implementations
  const createPocket = async (pocketData: Omit<Pocket, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setPocketsLoading(true);
      setPocketsError(null);
      
      const newPocket: Pocket = {
        ...pocketData,
        id: Date.now().toString(),
        userId: 'mock-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setPockets(prev => [...prev, newPocket]);
      errorLogger.logInfo('Budget', 'Pocket created successfully (mock)');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create pocket';
      setPocketsError(errorMessage);
      errorLogger.logError('Budget', new Error(`Create pocket failed: ${errorMessage}`));
      throw error;
    } finally {
      setPocketsLoading(false);
    }
  };

  const updatePocket = async (pocketId: string, updates: Partial<Pocket>) => {
    try {
      setPocketsLoading(true);
      setPocketsError(null);
      
      setPockets(prev => prev.map(pocket => 
        pocket.id === pocketId 
          ? { ...pocket, ...updates, updatedAt: new Date() }
          : pocket
      ));
      errorLogger.logInfo('Budget', `Pocket updated: ${pocketId} (mock)`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update pocket';
      setPocketsError(errorMessage);
      errorLogger.logError('Budget', new Error(`Update pocket failed: ${errorMessage}`));
      throw error;
    } finally {
      setPocketsLoading(false);
    }
  };

  const deletePocket = async (pocketId: string) => {
    try {
      setPocketsLoading(true);
      setPocketsError(null);
      
      setPockets(prev => prev.filter(pocket => pocket.id !== pocketId));
      errorLogger.logInfo('Budget', `Pocket deleted: ${pocketId} (mock)`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete pocket';
      setPocketsError(errorMessage);
      errorLogger.logError('Budget', new Error(`Delete pocket failed: ${errorMessage}`));
      throw error;
    } finally {
      setPocketsLoading(false);
    }
  };

  // Transaction operations - Mock implementations
  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setTransactionsLoading(true);
      setTransactionsError(null);
      
      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
        userId: 'mock-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTransactions(prev => [...prev, newTransaction]);
      errorLogger.logInfo('Budget', 'Transaction created successfully (mock)');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create transaction';
      setTransactionsError(errorMessage);
      errorLogger.logError('Budget', new Error(`Create transaction failed: ${errorMessage}`));
      throw error;
    } finally {
      setTransactionsLoading(false);
    }
  };

  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    try {
      setTransactionsLoading(true);
      setTransactionsError(null);
      
      setTransactions(prev => prev.map(transaction => 
        transaction.id === transactionId 
          ? { ...transaction, ...updates, updatedAt: new Date() }
          : transaction
      ));
      errorLogger.logInfo('Budget', `Transaction updated: ${transactionId} (mock)`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update transaction';
      setTransactionsError(errorMessage);
      errorLogger.logError('Budget', new Error(`Update transaction failed: ${errorMessage}`));
      throw error;
    } finally {
      setTransactionsLoading(false);
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      setTransactionsLoading(true);
      setTransactionsError(null);
      
      setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
      errorLogger.logInfo('Budget', `Transaction deleted: ${transactionId} (mock)`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete transaction';
      setTransactionsError(errorMessage);
      errorLogger.logError('Budget', new Error(`Delete transaction failed: ${errorMessage}`));
      throw error;
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Budget Goal operations - Mock implementations
  const createBudgetGoal = async (goalData: Omit<BudgetGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setBudgetGoalsLoading(true);
      setBudgetGoalsError(null);
      
      const newGoal: BudgetGoal = {
        ...goalData,
        id: Date.now().toString(),
        userId: 'mock-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setBudgetGoals(prev => [...prev, newGoal]);
      errorLogger.logInfo('Budget', 'Budget goal created successfully (mock)');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create budget goal';
      setBudgetGoalsError(errorMessage);
      errorLogger.logError('Budget', new Error(`Create budget goal failed: ${errorMessage}`));
      throw error;
    } finally {
      setBudgetGoalsLoading(false);
    }
  };

  // Utility functions
  const refreshData = async () => {
    try {
      await loadInitialData();
      errorLogger.logInfo('Budget', 'Data refreshed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh data';
      errorLogger.logError('Budget', new Error(`Refresh data failed: ${errorMessage}`));
    }
  };

  const getPocketById = (pocketId: string): Pocket | undefined => {
    return pockets.find(pocket => pocket.id === pocketId);
  };

  const getTransactionsByPocket = (pocketId: string): Transaction[] => {
    return transactions.filter(transaction => transaction.pocketId === pocketId);
  };

  // Calculate statistics
  const totalBalance = pockets.reduce((sum, pocket) => sum + pocket.currentBalance, 0);
  
  const currentMonth = new Date();
  currentMonth.setDate(1);
  const nextMonth = new Date(currentMonth);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  const monthlyIncome = transactions
    .filter(transaction => 
      transaction.type === 'income' && 
      transaction.date >= currentMonth && 
      transaction.date < nextMonth
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const monthlyExpenses = transactions
    .filter(transaction => 
      transaction.type === 'expense' && 
      transaction.date >= currentMonth && 
      transaction.date < nextMonth
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

  const value: BudgetContextType = {
    // Pockets
    pockets,
    pocketsLoading,
    pocketsError,
    createPocket,
    updatePocket,
    deletePocket,
    
    // Transactions
    transactions,
    transactionsLoading,
    transactionsError,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Budget Goals
    budgetGoals,
    budgetGoalsLoading,
    budgetGoalsError,
    createBudgetGoal,
    
    // Insights
    insights,
    insightsLoading,
    insightsError,
    
    // Statistics
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    
    // Utility functions
    refreshData,
    getPocketById,
    getTransactionsByPocket,
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
    throw new Error('useBudget must be used within a SafeBudgetProvider');
  }
  return context;
}
