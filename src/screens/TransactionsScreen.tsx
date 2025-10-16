import React, { useState, useMemo, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useBudget } from '../context/SafeBudgetContext';
// import { useTransactions, usePockets } from '../hooks/useFirebaseData'; // Temporarily disabled for APK build
import { Plus, Link, LinkBreak } from 'phosphor-react-native';
import { mockTransactions, mockPockets } from '../data/mockData';
import { useRoute, RouteProp } from '@react-navigation/native';
import Header from '../components/Header';
import SearchBarWithFilter from '../components/SearchBarWithFilter';
import TransactionHome from '../components/TransactionHome';
import FiltersBottomSheet from '../components/FiltersBottomSheet';
import NewTransactionBottomSheet from '../components/NewTransactionBottomSheet';
import EnhancedTransactionBottomSheet from '../components/EnhancedTransactionBottomSheet';
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
  const { transactions, createTransaction, transactionsLoading } = useBudget();
  // Use shared mock data
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

  // Use mock transactions directly
  const displayTransactions = mockTransactions;

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = displayTransactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
  }, [displayTransactions, searchQuery, filters]);

  const handleAddTransaction = () => {
    setShowAddTransactionSheet(true);
  };



  const handleFiltersApply = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleTransactionPress = (transaction: any) => {
    console.log('Transaction pressed:', transaction);
    // Map transaction data to match TransactionBottomSheet interface
    const mappedTransaction = {
      id: transaction.id,
      title: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date.toISOString(),
      isRecurring: transaction.tags?.includes('recurring') || false,
      pocketInfo: {
        isLinked: !!transaction.pocketId,
        pocketName: transaction.pocketId ? mockPockets.find(p => p.id === transaction.pocketId)?.name : undefined
      },
      description: transaction.description,
      category: transaction.category
    };
    console.log('Mapped transaction:', mappedTransaction);
    setSelectedTransaction(mappedTransaction);
    setShowTransactionSheet(true);
    console.log('Transaction sheet should be visible now');
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
    // In a real app, this would save the transaction to the database
    console.log('Save new transaction:', newTransaction);
    Alert.alert('Success', 'Transaction added successfully!');
    setShowAddTransactionSheet(false);
  };

  const renderTransactionItem = ({ item, index }: { item: any; index: number }) => (
    <TransactionHome 
      transaction={item}
      pockets={mockPockets}
      onPress={() => handleTransactionPress(item)}
      isLast={index === mockTransactions.length - 1}
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
        pockets={mockPockets}
      />

      <EnhancedTransactionBottomSheet
        visible={showTransactionSheet}
        onClose={() => setShowTransactionSheet(false)}
        transaction={selectedTransaction}
        pockets={mockPockets}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        onSave={async (transaction) => {
          console.log('Saving transaction:', transaction);
          // In a real app, this would save to the database
          Alert.alert('Success', 'Transaction saved successfully');
        }}
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
