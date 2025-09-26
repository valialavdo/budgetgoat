import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Plus, Minus, Clock } from 'phosphor-react-native';
import LabelPill from './LabelPill';

interface TransactionCardProps {
  transaction: {
    id: string;
    title: string;
    subtitle: string;
    amount: number;
    originalPrice?: number;
    percentReturn?: number;
    type: 'income' | 'expense' | 'investment';
    category: string;
    date: string;
    icon?: string;
    isRecurring?: boolean;
  };
  onPress?: () => void;
}

export default function TransactionCard({ transaction, onPress }: TransactionCardProps) {
  const isPositive = transaction.amount > 0;
  
  const renderLabels = () => {
    const labels = [];
    
    // Add type label (expenses/income)
    if (transaction.type === 'income') {
      labels.push(
        <LabelPill
          key="income"
          icon={<Plus />}
          text="Income"
          backgroundColor={Colors.income + '15'}
          textColor={Colors.income}
        />
      );
    } else {
      labels.push(
        <LabelPill
          key="expense"
          icon={<Minus />}
          text="Expenses"
          backgroundColor={Colors.expense + '15'}
          textColor={Colors.expense}
        />
      );
    }
    
    // Add recurring label if applicable
    if (transaction.isRecurring) {
      labels.push(
        <LabelPill
          key="recurring"
          icon={<Clock />}
          text="Recurring"
          backgroundColor={Colors.trustBlue + '15'}
          textColor={Colors.trustBlue}
        />
      );
    }
    
    return (
      <View style={styles.labelsContainer}>
        {labels}
      </View>
    );
  };

  const formatCurrency = (amount: number) => {
    return `€${Math.abs(amount).toLocaleString()}`;
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* Main Transaction Info */}
      <View style={styles.mainContent}>
        <View style={styles.leftSection}>
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={1}>
              {transaction.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {transaction.subtitle}
            </Text>
            {renderLabels()}
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Text style={styles.amount}>
            {isPositive ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    paddingHorizontal: 20,
    marginBottom: Spacing.sm,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  leftSection: {
    flex: 1,
    marginRight: Spacing.md,
  },
  textContent: {
    justifyContent: 'center',
  },
  title: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: 4, // 4px spacing between title and description
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: 16, // 16px between title/description and labels
  },
  rightSection: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  amount: {
    ...Typography.h4, // Changed from h3 to h4 for consistent amount sizing
    color: Colors.text,
    textAlign: 'right',
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, // 8px between labels
    marginTop: 0, // Remove margin since subtitle already has marginBottom: 16
  },
});
