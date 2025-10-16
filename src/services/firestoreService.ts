import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { errorLogger } from '../services/errorLogger';

export interface Pocket {
  id: string;
  userId: string;
  name: string;
  description: string;
  amount: number;
  currentBalance: number;
  targetAmount?: number;
  category: string;
  color: string;
  type: 'standard' | 'goal';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  pocketId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface BudgetGoal {
  id: string;
  userId: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}

export interface Insight {
  id: string;
  userId: string;
  type: 'spending_pattern' | 'saving_trend' | 'budget_alert' | 'goal_progress';
  title: string;
  description: string;
  data: any;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  isRead: boolean;
}

class FirestoreService {
  private getUserId(): string {
    // In a real app, this would come from the auth context
    // For now, we'll use a placeholder
    return 'demo-user-id';
  }

  // Pocket operations
  async createPocket(pocketData: Omit<Pocket, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const userId = this.getUserId();
      const pocketRef = await addDoc(collection(db, 'pockets'), {
        ...pocketData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      errorLogger.logInfo('Firestore', `Pocket created: ${pocketRef.id}`);
      return pocketRef.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create pocket';
      errorLogger.logError('Firestore', new Error(`Create pocket failed: ${errorMessage}`));
      throw error;
    }
  }

  async updatePocket(pocketId: string, updates: Partial<Pocket>): Promise<void> {
    try {
      const pocketRef = doc(db, 'pockets', pocketId);
      await updateDoc(pocketRef, {
        ...updates,
        updatedAt: new Date(),
      });

      errorLogger.logInfo('Firestore', `Pocket updated: ${pocketId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update pocket';
      errorLogger.logError('Firestore', new Error(`Update pocket failed: ${errorMessage}`));
      throw error;
    }
  }

  async deletePocket(pocketId: string): Promise<void> {
    try {
      const pocketRef = doc(db, 'pockets', pocketId);
      await deleteDoc(pocketRef);

      errorLogger.logInfo('Firestore', `Pocket deleted: ${pocketId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete pocket';
      errorLogger.logError('Firestore', new Error(`Delete pocket failed: ${errorMessage}`));
      throw error;
    }
  }

  async getPockets(): Promise<Pocket[]> {
    try {
      const userId = this.getUserId();
      const pocketsQuery = query(
        collection(db, 'pockets'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(pocketsQuery);
      const pockets: Pocket[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        pockets.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Pocket);
      });

      errorLogger.logInfo('Firestore', `Retrieved ${pockets.length} pockets`);
      return pockets;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get pockets';
      errorLogger.logError('Firestore', new Error(`Get pockets failed: ${errorMessage}`));
      throw error;
    }
  }

  // Transaction operations
  async createTransaction(transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const userId = this.getUserId();
      const transactionRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Update pocket balance
      await this.updatePocketBalance(transactionData.pocketId, transactionData.amount, transactionData.type);

      errorLogger.logInfo('Firestore', `Transaction created: ${transactionRef.id}`);
      return transactionRef.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create transaction';
      errorLogger.logError('Firestore', new Error(`Create transaction failed: ${errorMessage}`));
      throw error;
    }
  }

  async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<void> {
    try {
      const transactionRef = doc(db, 'transactions', transactionId);
      await updateDoc(transactionRef, {
        ...updates,
        updatedAt: new Date(),
      });

      errorLogger.logInfo('Firestore', `Transaction updated: ${transactionId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update transaction';
      errorLogger.logError('Firestore', new Error(`Update transaction failed: ${errorMessage}`));
      throw error;
    }
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      const transactionRef = doc(db, 'transactions', transactionId);
      const transactionDoc = await getDoc(transactionRef);
      
      if (transactionDoc.exists()) {
        const transactionData = transactionDoc.data() as Transaction;
        
        // Revert pocket balance
        await this.updatePocketBalance(
          transactionData.pocketId, 
          transactionData.amount, 
          transactionData.type === 'income' ? 'expense' : 'income'
        );
      }

      await deleteDoc(transactionRef);

      errorLogger.logInfo('Firestore', `Transaction deleted: ${transactionId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete transaction';
      errorLogger.logError('Firestore', new Error(`Delete transaction failed: ${errorMessage}`));
      throw error;
    }
  }

  async getTransactions(pocketId?: string, limitCount: number = 50): Promise<Transaction[]> {
    try {
      const userId = this.getUserId();
      let transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount)
      );

      if (pocketId) {
        transactionsQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', userId),
          where('pocketId', '==', pocketId),
          orderBy('date', 'desc'),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(transactionsQuery);
      const transactions: Transaction[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          ...data,
          date: data.date?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Transaction);
      });

      errorLogger.logInfo('Firestore', `Retrieved ${transactions.length} transactions`);
      return transactions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get transactions';
      errorLogger.logError('Firestore', new Error(`Get transactions failed: ${errorMessage}`));
      throw error;
    }
  }

  // Budget goal operations
  async createBudgetGoal(goalData: Omit<BudgetGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const userId = this.getUserId();
      const goalRef = await addDoc(collection(db, 'budgetGoals'), {
        ...goalData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      errorLogger.logInfo('Firestore', `Budget goal created: ${goalRef.id}`);
      return goalRef.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create budget goal';
      errorLogger.logError('Firestore', new Error(`Create budget goal failed: ${errorMessage}`));
      throw error;
    }
  }

  async getBudgetGoals(): Promise<BudgetGoal[]> {
    try {
      const userId = this.getUserId();
      const goalsQuery = query(
        collection(db, 'budgetGoals'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(goalsQuery);
      const goals: BudgetGoal[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        goals.push({
          id: doc.id,
          ...data,
          deadline: data.deadline?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as BudgetGoal);
      });

      errorLogger.logInfo('Firestore', `Retrieved ${goals.length} budget goals`);
      return goals;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get budget goals';
      errorLogger.logError('Firestore', new Error(`Get budget goals failed: ${errorMessage}`));
      throw error;
    }
  }

  // Insight operations
  async getInsights(): Promise<Insight[]> {
    try {
      const userId = this.getUserId();
      const insightsQuery = query(
        collection(db, 'insights'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const querySnapshot = await getDocs(insightsQuery);
      const insights: Insight[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        insights.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Insight);
      });

      errorLogger.logInfo('Firestore', `Retrieved ${insights.length} insights`);
      return insights;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get insights';
      errorLogger.logError('Firestore', new Error(`Get insights failed: ${errorMessage}`));
      throw error;
    }
  }

  // Helper methods
  private async updatePocketBalance(pocketId: string, amount: number, type: 'income' | 'expense'): Promise<void> {
    try {
      const pocketRef = doc(db, 'pockets', pocketId);
      const pocketDoc = await getDoc(pocketRef);
      
      if (pocketDoc.exists()) {
        const currentBalance = pocketDoc.data().currentBalance || 0;
        const newBalance = type === 'income' 
          ? currentBalance + amount 
          : currentBalance - amount;
        
        await updateDoc(pocketRef, {
          currentBalance: newBalance,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update pocket balance';
      errorLogger.logError('Firestore', new Error(`Update pocket balance failed: ${errorMessage}`));
      throw error;
    }
  }

  // Real-time listeners
  subscribeToPockets(callback: (pockets: Pocket[]) => void): () => void {
    try {
      const userId = this.getUserId();
      const pocketsQuery = query(
        collection(db, 'pockets'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(pocketsQuery, (querySnapshot) => {
        const pockets: Pocket[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          pockets.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Pocket);
        });
        callback(pockets);
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe to pockets';
      errorLogger.logError('Firestore', new Error(`Subscribe to pockets failed: ${errorMessage}`));
      throw error;
    }
  }

  subscribeToTransactions(callback: (transactions: Transaction[]) => void, pocketId?: string): () => void {
    try {
      const userId = this.getUserId();
      let transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(50)
      );

      if (pocketId) {
        transactionsQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', userId),
          where('pocketId', '==', pocketId),
          orderBy('date', 'desc'),
          limit(50)
        );
      }

      return onSnapshot(transactionsQuery, (querySnapshot) => {
        const transactions: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          transactions.push({
            id: doc.id,
            ...data,
            date: data.date?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Transaction);
        });
        callback(transactions);
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe to transactions';
      errorLogger.logError('Firestore', new Error(`Subscribe to transactions failed: ${errorMessage}`));
      throw error;
    }
  }
}

export const firestoreService = new FirestoreService();
export default firestoreService;
