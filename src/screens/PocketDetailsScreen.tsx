import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { PencilSimple, Trash, Plus, Wallet, Target } from 'phosphor-react-native';
import SecondaryHeader from '../components/SecondaryHeader';
import TransactionListItemDetails from '../components/TransactionListItemDetails';

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

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  isRecurring?: boolean;
}

interface PocketDetailsScreenProps {
  pocket: Pocket;
  onBack: () => void;
  onEdit: (pocket: Pocket) => void;
  onDelete: (pocketId: string) => void;
  onAddTransaction: () => void;
  onTransactionPress: (transaction: Transaction) => void;
  onRemoveTransaction: (transactionId: string) => void;
}

export default function PocketDetailsScreen({
  pocket,
  onBack,
  onEdit,
  onDelete,
  onAddTransaction,
  onTransactionPress,
  onRemoveTransaction
}: PocketDetailsScreenProps) {
  const scrollY = useRef(new Animated.Value(0)).current;
  // Mock transactions data
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      title: 'Kitchen Cabinet',
      date: '2025-01-15',
      amount: -800,
      type: 'expense',
      isRecurring: false,
    },
    {
      id: '2',
      title: 'Bathroom Tiles',
      date: '2025-01-10',
      amount: -400,
      type: 'expense',
      isRecurring: false,
    },
  ];

  const handleDelete = () => {
    Alert.alert(
      'Delete Pocket',
      'Are you sure you want to delete this pocket?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(pocket.id) },
      ]
    );
  };

  const getTypeIcon = () => {
    if (pocket.type === 'goal') {
      return <Target weight="light" size={16} color={Colors.labelGoal} />;
    }
    return <Wallet weight="light" size={16} color={Colors.labelStandard} />;
  };

  const getTypeColor = () => {
    return pocket.type === 'goal' ? Colors.labelGoal : Colors.labelStandard;
  };

  return (
    <View style={styles.container}>
      <SecondaryHeader
        title={pocket.name}
        onBackPress={onBack}
        rightIcon={
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerActionButton}
              onPress={() => onEdit(pocket)}
            >
              <PencilSimple weight="light" size={16} color={Colors.trustBlue} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerActionButton}
              onPress={handleDelete}
            >
              <Trash weight="light" size={16} color={Colors.alertRed} />
            </TouchableOpacity>
          </View>
        }
        scrollY={scrollY}
        scrollThreshold={10}
      />
      
      <Animated.ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Pocket Information */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{pocket.name}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.infoValue}>{pocket.description}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type</Text>
            <View style={styles.typeContainer}>
              {getTypeIcon()}
              <Text style={[styles.typeText, { color: getTypeColor() }]}>
                {pocket.type === 'goal' ? 'Goal Oriented' : 'Standard'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Balance</Text>
            <Text style={styles.infoValue}>
              €{pocket.currentBalance.toLocaleString('de-DE')}
            </Text>
          </View>
          
          {pocket.type === 'goal' && pocket.targetAmount && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Target Amount</Text>
              <Text style={styles.infoValue}>
                €{pocket.targetAmount.toLocaleString('de-DE')}
              </Text>
            </View>
          )}
        </View>

        {/* Linked Transactions Section */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Linked Transactions</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={onAddTransaction}
            >
              <Plus weight="light" size={16} color={Colors.trustBlue} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          {mockTransactions.map((transaction, index) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <TransactionListItemDetails
                id={transaction.id}
                title={transaction.title}
                date={transaction.date}
                amount={transaction.amount}
                type={transaction.type}
                isRecurring={transaction.isRecurring}
                onPress={() => onTransactionPress(transaction)}
                showDivider={false}
              />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => onRemoveTransaction(transaction.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 100, // Add bottom padding so content is visible above nav menu
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  headerActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: {
    ...Typography.bodyMedium,
    color: Colors.textMuted,
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '400',
    flex: 2,
    textAlign: 'right',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 2,
    justifyContent: 'flex-end',
  },
  typeText: {
    ...Typography.bodyMedium,
    fontWeight: '500',
  },
  transactionsSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  addButtonText: {
    ...Typography.bodyMedium,
    color: Colors.trustBlue,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  removeButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  removeButtonText: {
    ...Typography.bodyMedium,
    color: Colors.alertRed,
    fontWeight: '500',
  },
});
