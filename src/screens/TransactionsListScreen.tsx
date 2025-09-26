import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../components/SecondaryHeader';
import { 
  MagnifyingGlass, 
  FunnelSimple, 
  Plus, 
  TrendUp, 
  TrendDown,
  Calendar,
  Wallet,
  SortAscending,
  SortDescending
} from 'phosphor-react-native';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  pocket: string;
  description?: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Salary',
    amount: 3500,
    type: 'income',
    category: 'Salary',
    date: new Date('2024-01-15'),
    pocket: 'Main Account',
  },
  {
    id: '2',
    title: 'Grocery Shopping',
    amount: -85.50,
    type: 'expense',
    category: 'Food & Dining',
    date: new Date('2024-01-14'),
    pocket: 'Groceries',
    description: 'Weekly grocery shopping at Whole Foods',
  },
  {
    id: '3',
    title: 'Gas Station',
    amount: -45.00,
    type: 'expense',
    category: 'Transportation',
    date: new Date('2024-01-13'),
    pocket: 'Transportation',
  },
  {
    id: '4',
    title: 'Freelance Work',
    amount: 500,
    type: 'income',
    category: 'Freelance',
    date: new Date('2024-01-12'),
    pocket: 'Side Income',
  },
  {
    id: '5',
    title: 'Netflix Subscription',
    amount: -15.99,
    type: 'expense',
    category: 'Entertainment',
    date: new Date('2024-01-10'),
    pocket: 'Entertainment',
  },
  {
    id: '6',
    title: 'Restaurant Dinner',
    amount: -67.80,
    type: 'expense',
    category: 'Food & Dining',
    date: new Date('2024-01-09'),
    pocket: 'Dining Out',
    description: 'Date night at Italian restaurant',
  },
  {
    id: '7',
    title: 'Investment Return',
    amount: 120,
    type: 'income',
    category: 'Investments',
    date: new Date('2024-01-08'),
    pocket: 'Investments',
  },
  {
    id: '8',
    title: 'Gym Membership',
    amount: -29.99,
    type: 'expense',
    category: 'Health & Fitness',
    date: new Date('2024-01-05'),
    pocket: 'Health',
  },
];

type SortBy = 'date' | 'amount' | 'title';
type SortOrder = 'asc' | 'desc';
type FilterType = 'all' | 'income' | 'expense';

export default function TransactionsListScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const styles = getStyles(theme);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddTransaction = () => {
    Alert.alert('Add Transaction', 'This would open the add transaction bottom sheet.');
  };

  const handleTransactionPress = (transaction: Transaction) => {
    Alert.alert('Transaction Details', `View details for: ${transaction.title}`);
  };

  const handleSortChange = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = MOCK_TRANSACTIONS;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.pocket.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchQuery, sortBy, sortOrder, filterType]);

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === 'income';
    
    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => handleTransactionPress(item)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Transaction: ${item.title}, ${Math.abs(item.amount)}, ${item.date.toLocaleDateString()}`}
      >
        <View style={styles.transactionLeft}>
          <View style={[
            styles.transactionIcon,
            { backgroundColor: isIncome ? theme.colors.goatGreen + '20' : theme.colors.alertRed + '20' }
          ]}>
            {isIncome ? (
              <TrendUp size={20} color={theme.colors.goatGreen} weight="light" />
            ) : (
              <TrendDown size={20} color={theme.colors.alertRed} weight="light" />
            )}
          </View>
          
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>{item.title}</Text>
            <Text style={styles.transactionCategory}>{item.category}</Text>
            <Text style={styles.transactionDate}>
              {format(item.date, 'MMM d, yyyy')} • {item.pocket}
            </Text>
            {item.description && (
              <Text style={styles.transactionDescription}>{item.description}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.transactionRight}>
          <Text style={[
            styles.transactionAmount,
            { color: isIncome ? theme.colors.goatGreen : theme.colors.alertRed }
          ]}>
            {isIncome ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (type: FilterType, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterType === type && styles.filterButtonActive
      ]}
      onPress={() => setFilterType(type)}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Filter by ${label}`}
    >
      <Text style={[
        styles.filterButtonText,
        filterType === type && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderSortButton = (type: SortBy, label: string) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        sortBy === type && styles.sortButtonActive
      ]}
      onPress={() => handleSortChange(type)}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Sort by ${label}`}
    >
      <Text style={[
        styles.sortButtonText,
        sortBy === type && styles.sortButtonTextActive
      ]}>
        {label}
      </Text>
      {sortBy === type && (
        sortOrder === 'asc' ? (
          <SortAscending size={16} color={theme.colors.trustBlue} weight="light" />
        ) : (
          <SortDescending size={16} color={theme.colors.trustBlue} weight="light" />
        )
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SecondaryHeader
        title="Transactions"
        onBackPress={handleBack}
        scrollY={scrollY}
        scrollThreshold={10}
      />
      
      <View style={styles.content}>
        {/* Search and Filter Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <MagnifyingGlass size={20} color={theme.colors.textMuted} weight="light" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessible={true}
              accessibilityLabel="Search transactions"
            />
          </View>
          
          <TouchableOpacity
            style={styles.filterToggle}
            onPress={() => setShowFilters(!showFilters)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={showFilters ? "Hide filters" : "Show filters"}
          >
            <FunnelSimple size={20} color={theme.colors.trustBlue} weight="light" />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            {/* Type Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Type</Text>
              <View style={styles.filterButtons}>
                {renderFilterButton('all', 'All')}
                {renderFilterButton('income', 'Income')}
                {renderFilterButton('expense', 'Expense')}
              </View>
            </View>

            {/* Sort Options */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.sortButtons}>
                {renderSortButton('date', 'Date')}
                {renderSortButton('amount', 'Amount')}
                {renderSortButton('title', 'Title')}
              </View>
            </View>
          </View>
        )}

        {/* Results Summary */}
        <View style={styles.resultsSummary}>
          <Text style={styles.resultsText}>
            {filteredAndSortedTransactions.length} transaction{filteredAndSortedTransactions.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Transactions List */}
        <Animated.FlatList
          data={filteredAndSortedTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.transactionsList}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Calendar size={48} color={theme.colors.textMuted} weight="light" />
              <Text style={styles.emptyStateTitle}>No transactions found</Text>
              <Text style={styles.emptyStateDescription}>
                {searchQuery ? 'Try adjusting your search terms' : 'Start by adding your first transaction'}
              </Text>
            </View>
          }
        />

        {/* Add Transaction FAB */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.trustBlue }]}
          onPress={handleAddTransaction}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Add new transaction"
        >
          <Plus size={24} color={theme.colors.background} weight="light" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  filterToggle: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  filtersContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  filterGroup: {
    marginBottom: theme.spacing.md,
  },
  filterLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.background,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.trustBlue,
    borderColor: theme.colors.trustBlue,
  },
  filterButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: theme.colors.background,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.xs,
  },
  sortButtonActive: {
    backgroundColor: theme.colors.trustBlue,
    borderColor: theme.colors.trustBlue,
  },
  sortButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: theme.colors.background,
  },
  resultsSummary: {
    marginBottom: theme.spacing.md,
  },
  resultsText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
  },
  transactionsList: {
    paddingBottom: 100, // Space for FAB
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    minHeight: 72,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionCategory: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  transactionDate: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
  transactionDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...theme.typography.bodyLarge,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyStateTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    fontWeight: '600',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyStateDescription: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});