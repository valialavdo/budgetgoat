import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TrendUp, TrendDown, Repeat, PencilSimple } from 'phosphor-react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';

interface TransactionCardProps {
  transaction: {
    id: string;
    note: string;
    amount: number;
    type: 'income' | 'expense';
    pocketName: string;
    isRecurring: boolean;
  };
  onEdit: () => void;
  formatAmount: (amount: number, type: 'income' | 'expense') => string;
}

export default function TransactionCard({ transaction, onEdit, formatAmount }: TransactionCardProps) {
  return (
    <View style={styles.transactionRow}>
      {/* Left side: Icon and transaction info */}
      <View style={styles.transactionLeft}>
        {/* Transaction icon - circular like portfolio logos */}
        <View style={[
          styles.transactionIcon,
          { backgroundColor: transaction.type === 'income' ? Colors.income + '20' : Colors.expense + '20' }
        ]}>
          {transaction.type === 'income' ? (
            <TrendUp weight="regular" size={20} color={Colors.income} />
          ) : (
            <TrendDown weight="regular" size={20} color={Colors.expense} />
          )}
        </View>
        
        {/* Transaction details - company name style */}
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionNote} numberOfLines={1}>
            {transaction.note}
          </Text>
          <Text style={styles.transactionPocket} numberOfLines={1}>
            {transaction.pocketName}
          </Text>
        </View>
      </View>
      
      {/* Right side: Amount and indicators */}
      <View style={styles.transactionRight}>
        {/* Main amount - like current value */}
        <Text style={styles.amountText}>
          {formatAmount(transaction.amount, transaction.type)}
        </Text>
        
        {/* Recurring indicator - like percentage pill */}
        {transaction.isRecurring && (
          <View style={styles.recurringPill}>
            <Repeat weight="regular" size={16} color={Colors.trustBlue} />
            <Text style={styles.recurringText}>Recurring</Text>
          </View>
        )}
        
        {/* Edit button positioned at bottom-right */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <PencilSimple weight="regular" size={28} color={Colors.trustBlue} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 80, // Increased height for better proportions
  },
  
  // Left side: Icon and transaction details
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 48, // Larger circular icon like portfolio logos
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg, // More spacing between icon and text
  },
  transactionDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  transactionNote: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '700', // Bold like company names
    marginBottom: 4,
    fontSize: 16,
  },
  transactionPocket: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  
  // Right side: Amount and edit button
  transactionRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  amountText: {
    ...Typography.h3, // Larger amount text like portfolio values
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    fontSize: 18,
  },
  recurringPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.trustBlue + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: Spacing.sm,
  },
  recurringText: {
    ...Typography.caption,
    color: Colors.trustBlue,
    fontWeight: '600',
    fontSize: 12,
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    minWidth: 32,
    minHeight: 32,
  },
});
