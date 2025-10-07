import React, { useState, useMemo, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BudgetContext } from '../context/BudgetContext';
// import { useTransactions, usePockets } from '../hooks/useFirebaseData'; // Temporarily disabled for APK build
import { Plus, Link, LinkBreak } from 'phosphor-react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import Header from '../components/Header';
import SearchBarWithFilter from '../components/SearchBarWithFilter';
import PocketsListItem from '../components/PocketsListItem';
import FiltersBottomSheet from '../components/FiltersBottomSheet';
import NewTransactionBottomSheet from '../components/NewTransactionBottomSheet';
// import { FilterOptions } from '../components/FiltersModal'; // Deleted

type FilterOptions = {
  sortBy?: string;
  sortOrder?: string;
  dateRange?: string;
  type?: string;
  pocket?: string;
};

type RouteParams = {
  initialFilters?: FilterOptions;
};

export default function TransactionsScreen() {
  const route = useRoute<RouteProp<{ Transactions: RouteParams }, 'Transactions'>>();
  const theme = useTheme();
  const { state, addTransaction } = useContext(BudgetContext);
  // Mock data for Expo Go compatibility
  const firebaseTransactions = [
    {
      id: '1',
      title: 'Coffee Shop',
      amount: '4.50',
      type: 'expense',
      date: '2024-01-15',
      linkedPocketId: '1',
      isRecurring: false,
    },
    {
      id: '2',
      title: 'Salary',
      amount: '3000',
      type: 'income', 
      date: '2024-01-14',
      linkedPocketId: '1',
      isRecurring: true,
    }
  ];
  const firebasePockets = [
    {
      id: '1',
      name: 'Emergency Fund',
      type: 'standard',
      currentBalance: 2500,
      targetAmount: 0,
      transactionCount: 5,
    },
    {
      id: '2', 
      name: 'Vacation',
      type: 'goal',
      currentBalance: 800,
      targetAmount: 2000,
      transactionCount: 3,
    }
  ];
  const transactionsLoading = false;
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'date',
    sortOrder: 'desc',
    dateRange: 'all',
  });
  const [showTransactionSheet, setShowTransactionSheet] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showAddTransactionSheet, setShowAddTransactionSheet] = useState(false);

  // Apply initial filters from navigation if provided
  useEffect(() => {
    if (route.params?.initialFilters) {
      setFilters(route.params.initialFilters);
    }
  }, [route.params?.initialFilters]);

  // Convert real transactions from state to display format
  const transactions = useMemo(() => {
    return firebaseTransactions.map(tx => {
      const linkedPocket = firebasePockets.find(pocket => pocket.id === tx.linkedPocketId);
      
      return {
        id: tx.id,
        title: tx.title,
        subtitle: tx.description || 'Transaction',
        amount: parseFloat(tx.amount) * (tx.type === 'income' ? 1 : -1),
        type: tx.type,
        category: linkedPocket?.name || 'Uncategorized',
        date: tx.date,
        isRecurring: tx.isRecurring || false,
        pocketInfo: {
          name: linkedPocket?.name,
          isLinked: !!linkedPocket
        }
      };
    });
  }, [firebaseTransactions, firebasePockets]);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'amount':
          comparison = Math.abs(b.amount) - Math.abs(a.amount);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      
      return filters.sortOrder === 'asc' ? -comparison : comparison;
    });

    return filtered;
  }, [transactions, searchQuery, filters]);

  const handleAddTransaction = () => {
    setShowAddTransactionSheet(true);
  };



  const handleFiltersApply = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleTransactionPress = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowTransactionSheet(true);
  };

  const handleEditTransaction = (editedTransaction: any) => {
    // In a real app, this would update the transaction in the database
    Alert.alert('Success', 'Transaction updated successfully!');
    setShowTransactionSheet(false);
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would delete the transaction from the database
            Alert.alert('Success', 'Transaction deleted successfully!');
            setShowTransactionSheet(false);
            setSelectedTransaction(null);
          }
        }
      ]
    );
  };

  const handleSaveNewTransaction = (newTransaction: any) => {
    // Convert the new transaction to the proper format and save it
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    addTransaction({
      month: currentMonth,
      pocketCategoryId: newTransaction.pocketId || state.categories[0]?.id || '',
      type: newTransaction.type,
      amount: newTransaction.type === 'income' ? Math.abs(Number(newTransaction.amount)) : -Math.abs(Number(newTransaction.amount)),
      note: newTransaction.title,
      recurrence: newTransaction.isRecurring ? {
        isRecurring: true,
        frequency: 'monthly',
        duration: 12
      } : undefined
    });
    
    Alert.alert('Success', 'Transaction added successfully!');
    setShowAddTransactionSheet(false);
  };

  const renderTransactionItem = ({ item, index }: { item: any; index: number }) => (
    <PocketsListItem 
      title={item.title}
      date={item.date}
      amount={item.amount}
      type={item.type}
      isRecurring={item.isRecurring}
      onPress={() => handleTransactionPress(item)}
      showDivider={index < transactions.length - 1}
      pocketInfo={item.pocketInfo}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Transactions Found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search or filters to find what you're looking for.
      </Text>
    </View>
  );

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Header 
        title="Transactions" 
        rightIcon={
          <View style={styles.addIconContainer}>
            <Plus weight="light" size={20} color={theme.colors.trustBlue} />
          </View>
        }
        onRightPress={handleAddTransaction}
        scrollY={scrollY}
        scrollThreshold={10}
      />
      
      <View style={styles.content}>
        <SearchBarWithFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterPress={() => setShowFiltersModal(true)}
          placeholder="Search transactions..."
        />
        
        <View style={styles.listItemsContainer}>
          <View style={styles.listItemsWrapper}>
            {filteredAndSortedTransactions.length > 0 ? (
              <Animated.FlatList
                data={filteredAndSortedTransactions}
                renderItem={renderTransactionItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                style={styles.flatList}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
              />
            ) : (
              renderEmptyState()
            )}
          </View>
        </View>
      </View>



      <FiltersBottomSheet
        visible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        filters={filters}
        onFiltersChange={handleFiltersApply}
      />


      <NewTransactionBottomSheet
        visible={showAddTransactionSheet}
        onClose={() => setShowAddTransactionSheet(false)}
        onSave={handleSaveNewTransaction}
        pockets={firebasePockets}
      />
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      ...theme.typography.h3,
      color: theme.colors.textMuted,
    },
    content: {
      flex: 1,
    },
    listContainer: {
      paddingBottom: 150, // Increased bottom padding so content is visible above nav menu
    },
    flatList: {
      paddingBottom: 100, // Increased padding for FlatList itself
    },
    listItemsContainer: {
      marginTop: 12, // 12px gap between search bar and list items container
    },
    listItemsWrapper: {
      paddingHorizontal: 20, // 20px padding to match other components
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xxl,
    },
    emptyStateTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    emptyStateText: {
      ...theme.typography.bodyRegular,
      color: theme.colors.textMuted,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    addIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}
