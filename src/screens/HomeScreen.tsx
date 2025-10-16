import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Wallet, Receipt, TrendUp, ChartPie, Download } from 'phosphor-react-native';
import { trackAIInsightInteraction } from '../services/analytics';
import { useNavigationHelper, NavigationPatterns } from '../utils/navigation';
import { useTheme } from '../context/ThemeContext';
import { useBudget } from '../context/SafeBudgetContext';
import { useAuth } from '../context/SafeFirebaseContext';
import { useToast } from '../context/SafeToastContext';
import { mockTransactions, mockPockets } from '../data/mockData';
import PocketCard from '../components/PocketCard';
import { TransactionList } from '../components/TransactionList';
import { BudgetChart } from '../components/BudgetChart';
import { InsightCard } from '../components/InsightCard';
import Overview from '../components/Overview';
import AICardInsight from '../components/AICardInsight';
import SectionTitle from '../components/SectionTitle';
import Header from '../components/Header';
import QuickActionButton from '../components/QuickActionButton';
import QuickActionCarousel from '../components/QuickActionCarousel';
import AIInsightsCarousel from '../components/AIInsightsCarousel';
import Card from '../components/Card';
import NewPocketBottomSheet from '../components/NewPocketBottomSheet';
import NewTransactionBottomSheet from '../components/NewTransactionBottomSheet';
import EnhancedTransactionBottomSheet from '../components/EnhancedTransactionBottomSheet';
import PocketBottomSheet from '../components/PocketBottomSheet';
import TransactionHome from '../components/TransactionHome';
import { Pocket, Transaction } from '../services/firestoreService';

type RootStackParamList = {
  AIInsights: undefined;
  ExportData: undefined;
  TransactionsList: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TransactionBottomSheetData {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  isRecurring?: boolean;
  pocketInfo?: {
    isLinked: boolean;
    pocketName?: string;
  };
  description?: string;
  category?: string;
}

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const navHelper = useNavigationHelper(navigation, 'HomeScreen');
  const { 
    pockets, 
    transactions, 
    insights, 
    totalBalance, 
    monthlyIncome, 
    monthlyExpenses, 
    savingsRate,
    pocketsLoading,
    transactionsLoading,
    insightsLoading,
    createPocket,
    createTransaction,
    refreshData
  } = useBudget();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  // Calculate pocket summary metrics
  const totalTargets = pockets.reduce((sum, pocket) => sum + (pocket.targetAmount || 0), 0);
  const totalAssigned = pockets.reduce((sum, pocket) => sum + (pocket.currentBalance || 0), 0);
  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const underfunded = totalTargets - totalAssigned;
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<'pie' | 'bar' | 'progress'>('pie');
  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('1M');
  const [showNewPocketSheet, setShowNewPocketSheet] = useState(false);
  const [showNewTransactionSheet, setShowNewTransactionSheet] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionBottomSheetData | null>(null);
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);
  const [selectedPocket, setSelectedPocket] = useState<any | null>(null);
  const [showPocketDetail, setShowPocketDetail] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      showSuccess('Data refreshed successfully', 2000);
    } catch (error) {
      showError('Failed to refresh data', 3000);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreatePocket = () => {
    setShowNewPocketSheet(true);
  };

  const handleCreateTransaction = () => {
    if (pockets.length === 0) {
      showError('Please create a pocket first', 3000);
      return;
    }
    setShowNewTransactionSheet(true);
  };

  const handlePocketCreated = async (pocketData: any) => {
    try {
      await createPocket(pocketData);
      showSuccess('Pocket created successfully', 2000);
      setShowNewPocketSheet(false);
    } catch (error) {
      showError('Failed to create pocket', 3000);
    }
  };

  const handleTransactionCreated = async (transactionData: any) => {
    try {
      await createTransaction(transactionData);
      showSuccess('Transaction created successfully', 2000);
      setShowNewTransactionSheet(false);
    } catch (error) {
      showError('Failed to create transaction', 3000);
    }
  };

  const handleInsightDismiss = (id: string) => {
    trackAIInsightInteraction(id, 'dismiss');
    console.log('Insight dismissed:', id);
    // This could update a user preference to hide this insight
    // or mark it as dismissed in the backend
  };

  const handleInsightPress = (id: string) => {
    trackAIInsightInteraction(id, 'press');
    console.log('Insight pressed:', id);
    // This could navigate to a detailed view of the insight
    // or perform a specific action related to the insight
  };

  const handleTransactionPress = (transaction: Transaction) => {
    console.log('Home screen - Transaction pressed:', transaction);
    // Map our Transaction interface to the one expected by TransactionBottomSheet
    const mappedTransaction = {
      id: transaction.id,
      title: transaction.description || 'Transaction',
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
    console.log('Home screen - Mapped transaction:', mappedTransaction);
    setSelectedTransaction(mappedTransaction);
    setShowTransactionDetail(true);
    console.log('Home screen - Transaction detail should be visible now');
  };

  const handlePocketPress = (pocket: any) => {
    console.log('Home screen - Pocket pressed:', pocket);
    setSelectedPocket(pocket);
    setShowPocketDetail(true);
    console.log('Home screen - Pocket detail should be visible now');
  };

  const recentTransactions = mockTransactions.slice(0, 5);

  // Calculate overview data
  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  // Mock data for charts (in real app, this would come from API)
  const incomeData = [1200, 1500, 1800, 1600, 2000, 1900];
  const expenseData = [800, 900, 1200, 1000, 1100, 1050];
  const timeLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.goatGreen}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header
          title="Budget Overview"
        />

        {/* Main Overview Section - This is the sophisticated UI from Expo Go */}
        <Overview
          label="Total Balance"
          amount={totalBalance}
          incomeData={incomeData}
          expenseData={expenseData}
          timeLabels={timeLabels}
          currency="€"
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />

        {/* AI Insights Section */}
        {insights.length > 0 && (
          <View style={styles.insightsSection}>
            <SectionTitle
              title="AI Insights"
              rightButton={{
                text: "View All",
                onPress: () => navHelper.goToAIInsights()
              }}
            />
            
             <AIInsightsCarousel
               insights={insights}
            onDismiss={handleInsightDismiss}
            onPress={handleInsightPress}
             />
          </View>
        )}

        {/* Quick Actions Carousel */}
        <View style={styles.quickActionsSection}>
          <SectionTitle
            title="Quick Actions"
          />
          <QuickActionCarousel
            items={[
              {
                id: 'add-pocket',
                icon: <Wallet size={24} color={theme.colors.trustBlue} weight="light" />,
                title: 'Add Pocket',
                onPress: handleCreatePocket,
              },
              {
                id: 'add-transaction',
                icon: <Receipt size={24} color={theme.colors.goatGreen} weight="light" />,
                title: 'Add Transaction',
                onPress: handleCreateTransaction,
              },
              {
                id: 'view-charts',
                icon: <TrendUp size={24} color={theme.colors.trustBlue} weight="light" />,
                title: 'View Charts',
                onPress: () => navigation.navigate('AIInsights'),
              },
              {
                id: 'budget-insights',
                icon: <ChartPie size={24} color={theme.colors.goatGreen} weight="light" />,
                title: 'Budget Insights',
                onPress: () => navigation.navigate('AIInsights'),
              },
              {
                id: 'export-data',
                icon: <Download size={24} color={theme.colors.trustBlue} weight="light" />,
                title: 'Export Data',
                onPress: () => navigation.navigate('ExportData'),
              },
            ]}
          />
        </View>

        {/* Pocket Overview Section */}
        <View style={styles.section}>
          <SectionTitle 
            title="Pockets"
            marginBottom={12}
          />
          <View style={styles.pocketsContainer}>
            {pockets.slice(0, 4).map((pocket) => (
              <PocketCard
                key={pocket.id}
                pocket={pocket}
                onPress={handlePocketPress}
              />
            ))}
          </View>
        </View>


        {/* Recent Transactions Section - Final UI */}
        <View style={styles.section}>
          <SectionTitle
            title="Recent Transactions"
            rightButton={{
              text: "View All",
              onPress: () => navHelper.goToTransactions()
            }}
          />

          {transactionsLoading ? (
            <View style={styles.loadingCard}>
              <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
                Loading transactions...
              </Text>
            </View>
          ) : recentTransactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                No transactions yet
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textMuted }]}>
                Add your first transaction to start tracking
              </Text>
            </View>
          ) : (
            <View style={styles.transactionsContainer}>
              {recentTransactions.slice(0, 3).map((transaction, index) => (
                <TransactionHome
                  key={transaction.id}
                  transaction={transaction}
                  pockets={mockPockets}
                  onPress={handleTransactionPress}
                  isLast={index === 2}
                />
              ))}
            </View>
          )}
        </View>


        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Sheets */}
      <NewPocketBottomSheet
        visible={showNewPocketSheet}
        onClose={() => setShowNewPocketSheet(false)}
        onPocketCreated={handlePocketCreated}
      />

      <NewTransactionBottomSheet
        visible={showNewTransactionSheet}
        onClose={() => setShowNewTransactionSheet(false)}
        onSave={handleTransactionCreated}
        pockets={pockets.map(pocket => ({
          id: pocket.id,
          name: pocket.name,
          type: 'standard' as const
        }))}
      />

      <EnhancedTransactionBottomSheet
        visible={showTransactionDetail}
        onClose={() => setShowTransactionDetail(false)}
        transaction={selectedTransaction}
        pockets={mockPockets}
        onEdit={(transaction) => {
          console.log('Edit transaction:', transaction);
          Alert.alert('Edit Transaction', 'Edit functionality will be implemented');
        }}
        onDelete={(transactionId) => {
          console.log('Delete transaction:', transactionId);
          Alert.alert('Delete Transaction', 'Delete functionality will be implemented');
        }}
        onSave={async (transaction) => {
          console.log('Saving transaction:', transaction);
          // In a real app, this would save to the database
          Alert.alert('Success', 'Transaction saved successfully');
        }}
      />

      <PocketBottomSheet
        visible={showPocketDetail}
        onClose={() => setShowPocketDetail(false)}
        pocket={selectedPocket}
        onEdit={(pocket) => {
          console.log('Edit pocket:', pocket);
          Alert.alert('Edit Pocket', 'Edit functionality will be implemented');
        }}
        onDelete={(pocketId) => {
          console.log('Delete pocket:', pocketId);
          Alert.alert('Delete Pocket', 'Delete functionality will be implemented');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  balanceCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  balanceContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  chartTypeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  chartTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chartTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartCard: {
    marginTop: 16,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyCard: {
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
    lineHeight: 20,
  },
  pocketCard: {
    marginBottom: 12,
  },
  transactionsCard: {
    marginTop: 16,
  },
  insightCard: {
    marginBottom: 12,
  },
  bottomSpacing: {
    height: 100,
  },
  insightsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  insightsContainer: {
    gap: 8,
    paddingHorizontal: 0,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  
  // Pockets Container Styles
  pocketsContainer: {
    gap: 16,
  },
  
  
  // Transactions Section Styles
  transactionsContainer: {
    gap: 8,
  },
});