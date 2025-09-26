import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Animated, Dimensions } from 'react-native';
import { Star, MagnifyingGlass, Plus, TrendUp, Wallet, Calendar, Export, ChartLineUp } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import LabelPill from '../components/LabelPill';
import PocketCard from '../components/PocketCard';
import AICardInsight from '../components/AICardInsight';
import SectionTitle from '../components/SectionTitle';
import QuickActionButton from '../components/QuickActionButton';
import { Image } from 'react-native';
import { useContext } from 'react';
import { BudgetContext } from '../context/BudgetContext';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Overview from '../components/Overview';
import { generateAiTips } from '../utils/ai';
import { projectSixMonths } from '../utils/projection';
import PocketsListItem from '../components/PocketsListItem';
import ProjectionBottomSheet from '../components/ProjectionBottomSheet';
import AIInsightsBottomSheet from '../components/AIInsightsBottomSheet';
import CreateTransactionBottomSheet from '../components/CreateTransactionBottomSheet';
import CreatePocketBottomSheet from '../components/CreatePocketBottomSheet';
import PocketBottomSheet from '../components/PocketBottomSheet';
import TransactionBottomSheet from '../components/TransactionBottomSheet';
import { format } from 'date-fns';
import { generateChartData, generateProjectionData, getPreviousMonthKey, getNextMonthKey } from '../utils/date';

const { width: screenWidth } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

interface HomeScreenProps {
  setActiveTab?: (index: number) => void;
}

export default function HomeScreen({ setActiveTab }: HomeScreenProps) {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const { state, computeTotals, computePocketBalancesUpTo } = useContext(BudgetContext);
  const [showProjectionModal, setShowProjectionModal] = useState(false);
  const [showAIInsightsModal, setShowAIInsightsModal] = useState(false);
  const [showCreateTransactionModal, setShowCreateTransactionModal] = useState(false);
  const [showCreatePocketModal, setShowCreatePocketModal] = useState(false);
  const [showPocketDetailsModal, setShowPocketDetailsModal] = useState(false);
  const [showTransactionDetailsModal, setShowTransactionDetailsModal] = useState(false);
  const [selectedPocket, setSelectedPocket] = useState<any>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [scrollY] = useState(new Animated.Value(0));
  
  // Mock pockets data - in real app, get from context
  const mockPockets = [
    // Standard pocket
    {
      id: 'mock-standard',
      name: 'Emergency Fund',
      type: 'standard' as const,
      balance: 2500,
      transactionCount: 8,
      isGoal: false
    },
    // Goal pocket with partial progress
    {
      id: 'mock-goal-partial',
      name: 'Vacation Fund',
      type: 'goal' as const,
      balance: 1200,
      targetAmount: 3000,
      transactionCount: 12,
      isGoal: true
    },
    // Goal pocket with full progress
    {
      id: 'mock-goal-full',
      name: 'New Laptop',
      type: 'goal' as const,
      balance: 2500,
      targetAmount: 2500,
      transactionCount: 15,
      isGoal: true
    },
    // Goal pocket with over-achievement
    {
      id: 'mock-goal-over',
      name: 'Car Down Payment',
      type: 'goal' as const,
      balance: 8000,
      targetAmount: 6000,
      transactionCount: 20,
      isGoal: true
    }
  ];
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Trigger animations on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const styles = getStyles(theme);

  if (!state || !state.categories) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading BudgetGOAT...</Text>
      </View>
    );
  }

  // Get current month in YYYY-MM format
  const currentDate = new Date();
  const currentMonth = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0');
  
  const currentMonthTotals = computeTotals(currentMonth);
  const pocketBalances = computePocketBalancesUpTo(currentMonth);
  const aiTips = generateAiTips(state, currentMonth);
  const rawProjectionData = projectSixMonths(state, new Date(currentMonth + '-01'));
  
  // Transform projection data to match expected format
  const projectionData = rawProjectionData.map((point, index) => ({
    month: format(new Date(point.month + '-01'), 'MMM'),
    totalBalance: point.remaining
  }));
  
  console.log('Raw projection data:', rawProjectionData);
  console.log('Transformed projection data:', projectionData);

  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('1M');

  // Generate chart data for Overview based on selected period
  const getChartDataForPeriod = (period: '1M' | '3M' | '6M' | '1Y') => {
    const months = period === '1M' ? 1 : period === '3M' ? 3 : period === '6M' ? 6 : 12;
    const endMonth = currentMonth;
    
    // Calculate start month by going back (months - 1) months
    let startMonth = endMonth;
    for (let i = 1; i < months; i++) {
      startMonth = getPreviousMonthKey(startMonth);
    }
    
    // Get transactions for the selected period
    const periodTransactions = [];
    let currentMonthKey = startMonth;
    
    while (currentMonthKey <= endMonth) {
      const monthTransactions = state.transactionsByMonth[currentMonthKey] || [];
      periodTransactions.push(...monthTransactions);
      currentMonthKey = getNextMonthKey(currentMonthKey);
    }
    
    return periodTransactions;
  };

  const periodTransactions = getChartDataForPeriod(selectedPeriod);
  
  // Generate real chart data from transactions
  const incomeChartData = generateChartData(
    periodTransactions,
    currentMonth,
    'income'
  );
  
  const expenseChartData = generateChartData(
    periodTransactions,
    currentMonth,
    'expense'
  );

  // Mock data to see the chart working (remove when real data is available)
  const mockIncomeData = [1200, 1800, 2200, 2800, 3200]; // Increasing income trend
  const mockExpenseData = [800, 1200, 1000, 1500, 1800]; // Variable expense trend
  const mockTimeLabels = ['01', '08', '15', '22', '29'];

  // Force mock data for now to ensure proper labels
  const displayIncomeData = mockIncomeData;
  const displayExpenseData = mockExpenseData;
  const displayTimeLabels = mockTimeLabels;












  const renderPockets = () => (
    <>
      <View style={styles.pocketsTitleContainer}>
        <SectionTitle 
          title="Pockets"
          rightButton={{
            icon: <ChartLineUp weight="light" size={16} color={theme.colors.background} />,
            onPress: () => setShowProjectionModal(true)
          }}
        />
      </View>
      
      <View style={styles.pocketsScrollSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pocketsScrollContainer}
          snapToInterval={162}
          decelerationRate="fast"
        >
        {/* Mock pockets for demonstration - different types and progress levels */}
        {[
          // Standard pocket
          {
            id: 'mock-standard',
            name: 'Emergency Fund',
            type: 'standard' as const,
            balance: 2500,
            transactionCount: 8,
            isGoal: false
          },
          // Goal pocket with partial progress
          {
            id: 'mock-goal-partial',
            name: 'Vacation Fund',
            type: 'goal' as const,
            balance: 1200,
            targetAmount: 3000,
            transactionCount: 12,
            isGoal: true
          },
          // Goal pocket with full progress
          {
            id: 'mock-goal-full',
            name: 'New Laptop',
            type: 'goal' as const,
            balance: 2500,
            targetAmount: 2500,
            transactionCount: 15,
            isGoal: true
          },
          // Goal pocket with over-achievement
          {
            id: 'mock-goal-over',
            name: 'Car Down Payment',
            type: 'goal' as const,
            balance: 8000,
            targetAmount: 6000,
            transactionCount: 20,
            isGoal: true
          }
        ].map((mockPocket, index) => (
          <PocketCard
            key={mockPocket.id}
            id={mockPocket.id}
            name={mockPocket.name}
            type={mockPocket.type}
            balance={mockPocket.balance}
            targetAmount={mockPocket.targetAmount}
            transactionCount={mockPocket.transactionCount}
            onPress={() => {
              setSelectedPocket(mockPocket);
              setShowPocketDetailsModal(true);
            }}
            isFirst={index === 0}
          />
        ))}
        </ScrollView>
      </View>
    </>
  );



  const renderAiInsights = () => {
    const [aiInsights, setAiInsights] = useState([
      {
        id: '1',
        title: 'AI Insights',
        description: 'The previous month you spent more on groceries. Put the rest of this month in the saving funds.'
      },
      {
        id: '2',
        title: 'Smart Tip',
        description: 'Your emergency fund is growing well. Consider increasing your savings goal by 20%.'
      },
      {
        id: '3',
        title: 'Budget Alert',
        description: 'You\'re on track to exceed your dining budget. Consider cooking at home more often.'
      }
    ]);

    const handleDismissInsight = (id: string) => {
      setAiInsights(prev => prev.filter(insight => insight.id !== id));
    };

    if (aiInsights.length === 0) return null;

    return (
      <>
        <View style={styles.aiInsightsTitleContainer}>
          <SectionTitle title="AI Insights" />
        </View>
        <View style={styles.aiInsightsScrollSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.aiInsightsScrollContainer}
            snapToInterval={348}
            decelerationRate="fast"
          >
            {aiInsights.map((insight, index) => (
              <AICardInsight
                key={insight.id}
                id={insight.id}
                title={insight.title}
                description={insight.description}
                isFirst={index === 0}
                illustration={
                  <Image 
                    source={require('../../assets/undraw_wallet_diag 1.png')} 
                    style={{ width: 80, height: 80, resizeMode: 'contain' }}
                  />
                }
                onDismiss={handleDismissInsight}
                onPress={() => setShowAIInsightsModal(true)}
              />
            ))}
          </ScrollView>
        </View>
      </>
    );
  };

  const renderLatestTransactions = () => (
    <View style={styles.latestTransactionsSection}>
      <SectionTitle 
        title="Latest Transactions"
        rightButton={{
          text: "View All",
          onPress: () => {
            setActiveTab?.(2); // Navigate to Transactions tab (index 2)
          }
        }}
      />
      
      <View style={styles.latestTransactionsList}>
        {/* Mock latest transactions - in real app, get from context */}
        {[
          {
            id: '1',
            title: 'Grocery Shopping',
            amount: -85.50,
            type: 'expense' as const,
            isRecurring: false,
            date: '2025-01-15',
            pocketInfo: {
              name: 'Emergency Fund',
              isLinked: true
            }
          },
          {
            id: '2',
            title: 'Salary Deposit',
            amount: 2500.00,
            type: 'income' as const,
            isRecurring: true,
            date: '2025-01-14',
            pocketInfo: {
              isLinked: false
            }
          },
          {
            id: '3',
            title: 'Coffee Shop',
            amount: -4.50,
            type: 'expense' as const,
            isRecurring: false,
            date: '2025-01-14',
            pocketInfo: {
              isLinked: false
            }
          },
          {
            id: '4',
            title: 'Freelance Project',
            amount: 500.00,
            type: 'income' as const,
            isRecurring: false,
            date: '2025-01-13',
            pocketInfo: {
              isLinked: false
            }
          }
        ].map((transaction, index) => (
          <PocketsListItem
            key={transaction.id}
            title={transaction.title}
            date={transaction.date}
            amount={transaction.amount}
            type={transaction.type}
            isRecurring={transaction.isRecurring}
            pocketInfo={transaction.pocketInfo}
            onPress={() => {
              setSelectedTransaction(transaction);
              setShowTransactionDetailsModal(true);
            }}
            showDivider={index < 3} // Don't show divider for last item
          />
        ))}
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <View style={styles.actionRow}>
        <QuickActionButton
          icon={<Plus weight="light" size={20} color={theme.colors.text} />}
          title="Add Transaction"
          onPress={() => setShowCreateTransactionModal(true)}
        />
        
        <QuickActionButton
          icon={<Wallet weight="light" size={20} color={theme.colors.text} />}
          title="Create Pocket"
          onPress={() => setShowCreatePocketModal(true)}
        />
        
        <QuickActionButton
          icon={<Export weight="light" size={20} color={theme.colors.text} />}
          title="Export CSV"
          onPress={() => {
            navigation.navigate('ExportData');
          }}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="BudgetGOAT" 
        scrollY={scrollY}
        scrollThreshold={10}
      />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <Animated.ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <Overview 
            label="Current Balance"
            amount={currentMonthTotals?.remaining || 0}
            incomeData={displayIncomeData}
            expenseData={displayExpenseData}
            timeLabels={displayTimeLabels}
            currency="€"
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
          {renderQuickActions()}
          {renderAiInsights()}
          {renderPockets()}
          {renderLatestTransactions()}
        </Animated.ScrollView>
      </Animated.View>
      
      {/* 6-Month Projection Bottom Sheet */}
      <ProjectionBottomSheet
        visible={showProjectionModal}
        onClose={() => setShowProjectionModal(false)}
        projectionData={projectionData}
      />

      {/* AI Insights Bottom Sheet */}
      <AIInsightsBottomSheet
        visible={showAIInsightsModal}
        onClose={() => setShowAIInsightsModal(false)}
      />

      {/* Create Transaction Bottom Sheet */}
      <CreateTransactionBottomSheet
        visible={showCreateTransactionModal}
        onClose={() => setShowCreateTransactionModal(false)}
        pockets={mockPockets}
        onSave={(transaction) => {
          console.log('Transaction saved:', transaction);
          setShowCreateTransactionModal(false);
        }}
      />

      {/* Create Pocket Bottom Sheet */}
      <CreatePocketBottomSheet
        visible={showCreatePocketModal}
        onClose={() => setShowCreatePocketModal(false)}
        onPocketCreated={(pocket) => {
          console.log('Pocket saved:', pocket);
          setShowCreatePocketModal(false);
        }}
      />

      {/* Pocket Details Bottom Sheet */}
      {selectedPocket && (
        <PocketBottomSheet
          visible={showPocketDetailsModal}
          onClose={() => {
            setShowPocketDetailsModal(false);
            setSelectedPocket(null);
          }}
          pocket={selectedPocket}
          onEdit={(updatedPocket) => {
            console.log('Pocket updated:', updatedPocket);
            setSelectedPocket(updatedPocket);
          }}
          onDelete={() => {
            console.log('Pocket deleted');
            setShowPocketDetailsModal(false);
            setSelectedPocket(null);
          }}
        />
      )}

      {/* Transaction Details Bottom Sheet */}
      {selectedTransaction && (
        <TransactionBottomSheet
          visible={showTransactionDetailsModal}
          onClose={() => {
            setShowTransactionDetailsModal(false);
            setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
          pockets={mockPockets}
          onEdit={(updatedTransaction) => {
            console.log('Transaction updated:', updatedTransaction);
            setSelectedTransaction(updatedTransaction);
          }}
          onDelete={() => {
            console.log('Transaction deleted');
            setShowTransactionDetailsModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}
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
    scrollContent: {
      paddingHorizontal: 0, // Remove horizontal padding to allow chart to extend to edges
      paddingBottom: 100, // Add bottom padding so quick actions are visible above nav menu
    },

    pocketsTitleContainer: {
      marginBottom: 8, // 8px spacing between title and content (reduced from 16px)
      paddingHorizontal: theme.spacing.screenPadding, // Padding for title
    },
    pocketsScrollSection: {
      marginBottom: 24, // 24px spacing between sections
    },
    pocketsScrollContainer: {
      paddingLeft: 0, // No padding - let elements extend beyond screen
      paddingRight: 0, // No padding - let elements extend beyond screen
    },

    pocketsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      justifyContent: 'space-between',
    },




  aiInsightsTitleContainer: {
    marginBottom: 8, // 8px spacing between title and content (reduced from 16px)
    paddingHorizontal: theme.spacing.screenPadding, // Padding for title
  },
  aiInsightsScrollSection: {
    marginBottom: 24, // 24px spacing between sections
  },
  aiInsightsScrollContainer: {
    paddingLeft: 0, // No padding - let elements extend beyond screen
    paddingRight: 0, // No padding - let elements extend beyond screen
    gap: 0, // No gap - cards handle their own spacing
  },
  latestTransactionsSection: {
    marginBottom: 24, // 24px spacing between sections
    paddingHorizontal: theme.spacing.screenPadding, // Add padding back to transactions section
  },
  latestTransactionsList: {
    paddingHorizontal: 0,
    marginBottom: 8, // Reduced from 20 to 8 since last ListItem has 12px marginBottom
  },
  quickActions: {
    marginBottom: 24, // Add spacing after quick actions section
    paddingHorizontal: theme.spacing.screenPadding, // Add padding back to quick actions section
  },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 0,
      gap: theme.spacing.md,
    },
  });
}


