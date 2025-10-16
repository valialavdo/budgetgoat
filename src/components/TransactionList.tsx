import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Transaction } from '../services/firestoreService';

interface TransactionListProps {
  transactions: Transaction[];
  onPress?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  theme?: 'light' | 'dark';
  showPocketName?: boolean;
}

export function TransactionList({ 
  transactions, 
  onPress, 
  onEdit, 
  onDelete, 
  theme = 'light',
  showPocketName = false
}: TransactionListProps) {
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions
    .filter(transaction => filterType === 'all' || transaction.type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.date.getTime() - a.date.getTime();
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const handlePress = (transaction: Transaction) => {
    if (onPress) {
      onPress(transaction);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    if (onEdit) {
      onEdit(transaction);
    }
  };

  const handleDelete = (transaction: Transaction) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete this ${transaction.type}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete?.(transaction)
        }
      ]
    );
  };

  const getTransactionIcon = (type: 'income' | 'expense', category: string) => {
    if (type === 'income') {
      return '💰';
    }
    
    // Handle undefined or null category
    if (!category) {
      return '💳';
    }
    
    switch (category.toLowerCase()) {
      case 'food':
      case 'dining':
        return '🍽️';
      case 'transport':
      case 'transportation':
        return '🚗';
      case 'shopping':
        return '🛍️';
      case 'entertainment':
        return '🎬';
      case 'health':
      case 'healthcare':
        return '🏥';
      case 'utilities':
        return '⚡';
      case 'rent':
      case 'housing':
        return '🏠';
      default:
        return '💳';
    }
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix}$${amount.toFixed(2)}`;
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={[
        styles.transactionItem,
        { backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff' }
      ]}
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionIcon}>
            {getTransactionIcon(item.type, item.category)}
          </Text>
          <View style={styles.transactionDetails}>
            <Text style={[styles.transactionDescription, { color: theme === 'dark' ? '#fff' : '#2c3e50' }]}>
              {item.description}
            </Text>
            <Text style={[styles.transactionCategory, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
              {item.category}
            </Text>
            {showPocketName && (
              <Text style={[styles.pocketName, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
                Pocket: {item.pocketId}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.transactionAmount}>
          <Text style={[
            styles.amount,
            { 
              color: theme === 'dark' ? (item.type === 'income' ? '#2ecc71' : '#e74c3c') : (item.type === 'income' ? '#27ae60' : '#e74c3c')
            }
          ]}>
            {formatAmount(item.amount, item.type)}
          </Text>
          <Text style={[styles.transactionDate, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
            {item.date.toLocaleDateString()}
          </Text>
        </View>
      </View>

      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={[styles.tagText, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.transactionActions}>
        {onEdit && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.actionText}>✏️</Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.actionText}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'all' && styles.activeFilter
          ]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[
            styles.filterButtonText,
            { color: filterType === 'all' ? '#fff' : (theme === 'dark' ? '#ccc' : '#7f8c8d') }
          ]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'income' && styles.activeFilter
          ]}
          onPress={() => setFilterType('income')}
        >
          <Text style={[
            styles.filterButtonText,
            { color: filterType === 'income' ? '#fff' : (theme === 'dark' ? '#ccc' : '#7f8c8d') }
          ]}>
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'expense' && styles.activeFilter
          ]}
          onPress={() => setFilterType('expense')}
        >
          <Text style={[
            styles.filterButtonText,
            { color: filterType === 'expense' ? '#fff' : (theme === 'dark' ? '#ccc' : '#7f8c8d') }
          ]}>
            Expenses
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sortButtons}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'date' && styles.activeSort
          ]}
          onPress={() => setSortBy('date')}
        >
          <Text style={[
            styles.sortButtonText,
            { color: sortBy === 'date' ? '#fff' : (theme === 'dark' ? '#ccc' : '#7f8c8d') }
          ]}>
            Date
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'amount' && styles.activeSort
          ]}
          onPress={() => setSortBy('amount')}
        >
          <Text style={[
            styles.sortButtonText,
            { color: sortBy === 'amount' ? '#fff' : (theme === 'dark' ? '#ccc' : '#7f8c8d') }
          ]}>
            Amount
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'category' && styles.activeSort
          ]}
          onPress={() => setSortBy('category')}
        >
          <Text style={[
            styles.sortButtonText,
            { color: sortBy === 'category' ? '#fff' : (theme === 'dark' ? '#ccc' : '#7f8c8d') }
          ]}>
            Category
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyIcon, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
        💳
      </Text>
      <Text style={[styles.emptyText, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
        No transactions found
      </Text>
      <Text style={[styles.emptySubtext, { color: theme === 'dark' ? '#ccc' : '#7f8c8d' }]}>
        {filterType === 'all' 
          ? 'Start by adding your first transaction'
          : `No ${filterType}s found`
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#ecf0f1',
  },
  activeFilter: {
    backgroundColor: '#3498db',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    backgroundColor: '#ecf0f1',
  },
  activeSort: {
    backgroundColor: '#95a5a6',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  transactionItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
  },
  pocketName: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
  },
  transactionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
