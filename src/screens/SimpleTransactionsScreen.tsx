import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useBudget } from '../context/SafeBudgetContext';
import { Plus } from 'phosphor-react-native';

export default function SimpleTransactionsScreen() {
  const theme = useTheme();
  const { transactions, transactionsLoading, createTransaction, pockets } = useBudget();

  const handleCreateTransaction = async () => {
    if (pockets.length === 0) {
      return;
    }

    try {
      await createTransaction({
        pocketId: pockets[0].id,
        amount: 50,
        type: 'expense',
        category: 'General',
        description: 'Test transaction',
        date: new Date(),
        tags: ['test'],
      });
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  const colors = {
    background: theme.isDark ? '#000000' : '#ffffff',
    surface: theme.isDark ? '#1a1a1a' : '#f8f9fa',
    text: theme.isDark ? '#ffffff' : '#000000',
    textMuted: theme.isDark ? '#9ca3af' : '#6b7280',
    trustBlue: '#0052CC',
    expense: '#DC2626',
    income: '#059669',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Transactions</Text>
        
        {transactionsLoading ? (
          <Text style={[styles.loading, { color: colors.textMuted }]}>Loading transactions...</Text>
        ) : transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No transactions yet. Add your first transaction!
            </Text>
          </View>
        ) : (
          <View style={styles.transactionsList}>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={[styles.transactionCard, { backgroundColor: colors.surface }]}>
                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionDescription, { color: colors.text }]}>
                    {transaction.description || 'Transaction'}
                  </Text>
                  <Text style={[styles.transactionCategory, { color: colors.textMuted }]}>
                    {transaction.category}
                  </Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'expense' ? colors.expense : colors.income }
                ]}>
                  {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.trustBlue }]}
          onPress={handleCreateTransaction}
          disabled={pockets.length === 0}
        >
          <Plus size={24} color="white" />
          <Text style={styles.addButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loading: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  transactionsList: {
    marginTop: 20,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
