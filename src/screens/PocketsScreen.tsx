import React, { useState, useMemo, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BudgetContext } from '../context/BudgetContext';
import { Plus, Wallet, Target, Link, LinkBreak } from 'phosphor-react-native';
import Header from '../components/Header';
import PillFilter from '../components/PillFilter';
import PocketsListItem from '../components/PocketsListItem';
import InfoBottomSheet from '../components/InfoBottomSheet';
import PocketForm from '../components/PocketForm';
import PocketBottomSheet from '../components/PocketBottomSheet';

interface Pocket {
  id: string;
  name: string;
  type: 'standard' | 'goal';
  currentBalance: number;
  targetAmount?: number;
  description: string;
  color: string;
  transactionCount: number;
}

export default function PocketsScreen() {
  const theme = useTheme();
  const { state, upsertCategory, deleteCategories, computePocketBalancesUpTo } = useContext(BudgetContext);
  const [showPocketForm, setShowPocketForm] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [editingPocket, setEditingPocket] = useState<Pocket | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'standard' | 'goal'>('all');
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [showPocketSheet, setShowPocketSheet] = useState(false);
  const [selectedPocket, setSelectedPocket] = useState<Pocket | null>(null);

  // Get current month for balance calculation
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const pocketBalances = computePocketBalancesUpTo(currentMonth);

  // Convert categories to pockets format
  const pockets: Pocket[] = useMemo(() => {
    return state.categories
      .filter(cat => !cat.isInflux) // Only non-income categories (pockets)
      .map(cat => {
        const balance = pocketBalances[cat.id] || 0;
        const transactionCount = Object.values(state.transactionsByMonth || {})
          .flat()
          .filter(tx => tx.pocketCategoryId === cat.id).length;
        
        return {
          id: cat.id,
          name: cat.name,
          type: cat.type === 'bank' ? 'standard' : 'goal', // Map bank to standard, others to goal
          currentBalance: balance,
          targetAmount: cat.type !== 'bank' ? cat.defaultAmount : undefined,
          description: cat.notes || '',
          color: cat.type === 'bank' ? theme.colors.labelStandard : theme.colors.labelGoal,
          transactionCount,
        };
      });
  }, [state.categories, pocketBalances, state.transactionsByMonth, theme.colors]);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'standard', label: 'Standard' },
    { key: 'goal', label: 'Goal Oriented' },
  ];

  const filteredPockets = useMemo(() => {
    if (selectedFilter === 'all') return pockets;
    return pockets.filter(pocket => pocket.type === selectedFilter);
  }, [pockets, selectedFilter]);

  const handleAddPocket = () => {
    setEditingPocket(null);
    setShowPocketForm(true);
  };

  const handleEditPocket = (pocket: Pocket) => {
    setEditingPocket(pocket);
    setShowPocketForm(true);
  };

  const handleDeletePocket = (pocketId: string) => {
    Alert.alert(
      'Delete Pocket',
      'Are you sure you want to delete this pocket? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          deleteCategories([pocketId]);
          Alert.alert('Success', 'Pocket deleted successfully');
        }},
      ]
    );
  };

  const handleSavePocket = (pocketData: {
    name: string;
    description: string;
    type: 'standard' | 'goal';
    currentBalance: number;
    targetAmount?: number;
    transactionCount: number;
  }) => {
    if (editingPocket) {
      // Update existing pocket
      upsertCategory({
        id: editingPocket.id,
        name: pocketData.name,
        type: pocketData.type === 'standard' ? 'bank' : 'other',
        color: pocketData.type === 'goal' ? theme.colors.labelGoal : theme.colors.labelStandard,
        isInflux: false,
        defaultAmount: pocketData.targetAmount || 0,
        notes: pocketData.description,
      });
      Alert.alert('Success', 'Pocket updated successfully');
    } else {
      // Create new pocket
      upsertCategory({
        name: pocketData.name,
        type: pocketData.type === 'standard' ? 'bank' : 'other',
        color: pocketData.type === 'goal' ? theme.colors.labelGoal : theme.colors.labelStandard,
        isInflux: false,
        defaultAmount: pocketData.targetAmount || 0,
        notes: pocketData.description,
      });
      Alert.alert('Success', 'Pocket created successfully');
    }
    setShowPocketForm(false);
    setEditingPocket(null);
  };

  const handleEditPocketFromSheet = (pocket: Pocket) => {
    setEditingPocket(pocket);
    setShowPocketSheet(false);
    setShowPocketForm(true);
  };

  const handlePocketPress = (pocket: Pocket) => {
    setSelectedPocket(pocket);
    setShowPocketSheet(true);
  };

  const renderPocketItem = ({ item, index }: { item: Pocket; index: number }) => (
    <PocketsListItem
      title={item.name}
      subtitle={item.description}
      amount={item.currentBalance}
      type={item.type}
      targetAmount={item.targetAmount}
      isRecurring={false}
      onPress={() => handlePocketPress(item)}
      showDivider={index < filteredPockets.length - 1}
      transactionCount={item.transactionCount}
    />
  );

  

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Pockets Found</Text>
      <Text style={styles.emptyStateText}>
        Create your first pocket to start organizing your finances.
      </Text>
    </View>
  );

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Header 
        title="Pockets" 
        rightIcon={
          <View style={styles.addIconContainer}>
            <Plus weight="light" size={20} color={theme.colors.trustBlue} />
          </View>
        }
        onRightPress={handleAddPocket}
        scrollY={scrollY}
        scrollThreshold={10}
      />
      
      <View style={styles.content}>
        <PillFilter
          selectedFilter={selectedFilter}
          onFilterChange={(filter: string) => setSelectedFilter(filter as 'all' | 'standard' | 'goal')}
          filters={filters}
        />
        
        <View style={styles.listItemsContainer}>
          <View style={styles.listItemsWrapper}>
            {filteredPockets.length > 0 ? (
              <Animated.FlatList
                data={filteredPockets}
                renderItem={renderPocketItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
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

      <InfoBottomSheet
        isVisible={showInfoSheet}
        onClose={() => setShowInfoSheet(false)}
        title="About Pockets"
        content="Pockets help you organize your money for different purposes. Standard pockets are for regular expenses, while Goal Oriented pockets help you save for specific targets."
      />

      <PocketForm
        visible={showPocketForm}
        onClose={() => {
          setShowPocketForm(false);
          setEditingPocket(null);
        }}
        onSave={handleSavePocket}
      />

      <PocketBottomSheet
        visible={showPocketSheet}
        pocket={selectedPocket}
        onClose={() => {
          setShowPocketSheet(false);
          setSelectedPocket(null);
        }}
        onEdit={handleEditPocketFromSheet}
        onDelete={handleDeletePocket}
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
    listContainer: {
      paddingBottom: theme.spacing.xl,
    },
    listItemsContainer: {
      marginTop: theme.spacing.md,
    },
    listItemsWrapper: {
      paddingHorizontal: 20, // 20px padding to match other components
      paddingBottom: 100, // Add bottom padding so content is visible above nav menu
    },

  });
}


