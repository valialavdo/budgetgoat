import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useMicroInteractions } from '../context/MicroInteractionsContext';
import ScreenTitle from '../components/ScreenTitle';
import ActionButton from '../components/ActionButton';
import AddPocketBottomSheet from '../components/AddPocketBottomSheet';
import AddTransactionBottomSheet from '../components/AddTransactionBottomSheet';

export default function DemoScreen() {
  const theme = useTheme();
  const { triggerHaptic } = useMicroInteractions();
  
  const [showAddPocket, setShowAddPocket] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const handleAddPocket = () => {
    triggerHaptic('light');
    setShowAddPocket(true);
  };

  const handleAddTransaction = () => {
    triggerHaptic('light');
    setShowAddTransaction(true);
  };

  const handlePocketAdded = (pocketName: string) => {
    console.log('Pocket added:', pocketName);
    triggerHaptic('success');
  };

  const handleTransactionAdded = (transaction: any) => {
    console.log('Transaction added:', transaction);
    triggerHaptic('success');
  };

  const styles = getStyles(theme);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScreenTitle title="Demo" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <ActionButton
            title="Add New Pocket"
            onPress={handleAddPocket}
            variant="primary"
            size="large"
            fullWidth={true}
            hapticType="light"
            accessibilityLabel="Add new pocket"
            accessibilityHint="Opens the add pocket bottom sheet"
          />
        </View>

        <View style={styles.section}>
          <ActionButton
            title="Add New Transaction"
            onPress={handleAddTransaction}
            variant="secondary"
            size="large"
            fullWidth={true}
            hapticType="light"
            accessibilityLabel="Add new transaction"
            accessibilityHint="Opens the add transaction bottom sheet"
          />
        </View>
      </ScrollView>

      {/* Bottom Sheets */}
      <AddPocketBottomSheet
        visible={showAddPocket}
        onClose={() => setShowAddPocket(false)}
        onPocketAdded={handlePocketAdded}
      />

      <AddTransactionBottomSheet
        visible={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingBottom: 100,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
  });
}
