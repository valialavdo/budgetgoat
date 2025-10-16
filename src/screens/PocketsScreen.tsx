import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ScrollView, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useBudget } from '../context/SafeBudgetContext';
// import { usePockets } from '../hooks/useFirebaseData'; // Temporarily disabled for APK build
import { Plus, Wallet, Target, Link, LinkBreak } from 'phosphor-react-native';
import { mockPockets, mockTransactions, getPocketsWithType } from '../data/mockData';
import Header from '../components/Header';
import PillFilter from '../components/PillFilter';
import PocketCard from '../components/PocketCard';
import InfoBottomSheet from '../components/InfoBottomSheet';
import NewPocketBottomSheet from '../components/NewPocketBottomSheet';
import PocketBottomSheet from '../components/PocketBottomSheet';

interface Pocket {
  id: string;
  name: string;
  type: 'standard' | 'goal';
  currentBalance: number;
  targetAmount?: number;
  description: string;
  color: string;
  category: string;
  transactionCount: number;
}

export default function PocketsScreen() {
  const theme = useTheme();
  const { pockets, createPocket, updatePocket, deletePocket, pocketsLoading, transactions } = useBudget();
  // Mock data for Expo Go compatibility
  const mockPockets = [
    {
      id: '1',
      name: 'Emergency Fund',
      type: 'standard',
      currentBalance: 2500,
      targetAmount: 0,
      transactionCount: 5,
      description: 'Emergency savings for unexpected expenses',
      color: '#10B981',
      category: 'Savings',
    },
    {
      id: '2', 
      name: 'Vacation',
      type: 'goal',
      currentBalance: 800,
      targetAmount: 2000,
      transactionCount: 3,
      description: 'Vacation fund for upcoming trip',
      color: '#F59E0B',
      category: 'Travel',
    }
  ];
  const [showPocketForm, setShowPocketForm] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [editingPocket, setEditingPocket] = useState<Pocket | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'standard' | 'goal'>('all');
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [showPocketSheet, setShowPocketSheet] = useState(false);
  const [selectedPocket, setSelectedPocket] = useState<Pocket | null>(null);

  // Get current month for balance calculation
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  // Mock pocket balances for now
  const pocketBalances = {};

  // Use mock pockets data
  const displayPockets: Pocket[] = useMemo(() => {
    return mockPockets.map(pocket => ({
      id: pocket.id,
      name: pocket.name,
      type: pocket.type as 'standard' | 'goal',
      currentBalance: pocket.currentBalance,
      targetAmount: pocket.targetAmount,
      description: pocket.description,
      color: pocket.color,
      category: pocket.category,
      transactionCount: pocket.transactionCount,
    }));
  }, [mockPockets]);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'standard', label: 'Standard' },
    { key: 'goal', label: 'Goal Oriented' },
  ];

  const filteredPockets = useMemo(() => {
    if (selectedFilter === 'all') return displayPockets;
    return displayPockets.filter(pocket => pocket.type === selectedFilter);
  }, [displayPockets, selectedFilter]);

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
          // TODO: Implement delete pocket functionality
          console.log('Delete pocket:', pocketId);
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
      // TODO: Implement update pocket functionality
      console.log('Update pocket:', editingPocket.id, pocketData);
      Alert.alert('Success', 'Pocket updated successfully');
    } else {
      // Create new pocket
      // TODO: Implement create pocket functionality
      console.log('Create pocket:', pocketData);
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

  const renderPocketItem = ({ item, index }: { item: any; index: number }) => (
    <PocketCard
      pocket={item}
      onPress={() => handlePocketPress(item)}
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
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
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
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

      <NewPocketBottomSheet
        visible={showPocketForm}
        onClose={() => {
          setShowPocketForm(false);
          setEditingPocket(null);
        }}
        onPocketCreated={handleSavePocket}
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
    </KeyboardAvoidingView>
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
      paddingHorizontal: 0, // Remove padding since cards now have their own 20px margin
      paddingBottom: 100, // Add bottom padding so content is visible above nav menu
    },

  });
}


