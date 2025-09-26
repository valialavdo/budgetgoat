import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import ChipTag from './ChipTag';

export interface TransactionRowProps {
  /**
   * Transaction data
   */
  transaction: {
    id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    isRecurring?: boolean;
    pocketName?: string;
  };
  
  /**
   * Callback when transaction row is pressed
   */
  onPress?: () => void;
  
  /**
   * Whether to show the pocket name
   * @default true
   */
  showPocket?: boolean;
  
  /**
   * Custom styles for the container
   */
  style?: any;
  
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
  
  /**
   * Accessibility hint for screen readers
   */
  accessibilityHint?: string;
}

/**
 * Reusable TransactionRow component for displaying transaction data
 * 
 * Features:
 * - Consistent transaction display across screens
 * - Color-coded type indicators with icons
 * - Pocket association display
 * - Full accessibility compliance (WCAG AA)
 * - Dark mode support
 * - Minimum 44px touch target
 * 
 * Usage:
 * ```tsx
 * <TransactionRow
 *   transaction={transactionData}
 *   onPress={handleTransactionPress}
 *   showPocket={true}
 *   accessibilityLabel="Transaction: $50 expense for groceries"
 * />
 * ```
 */
export default function TransactionRow({
  transaction,
  onPress,
  showPocket = true,
  style,
  accessibilityLabel,
  accessibilityHint,
}: TransactionRowProps) {
  const theme = useTheme();
  
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? theme.colors.income : theme.colors.expense;
  const amountPrefix = isIncome ? '+' : '-';
  
  const chipColor = isIncome ? theme.colors.labelIncome : theme.colors.labelExpense;
  const chipText = isIncome ? 'Income' : 'Expense';
  
  const styles = getStyles(theme);
  
  const defaultAccessibilityLabel = `${transaction.title}, ${amountPrefix}$${Math.abs(transaction.amount)}, ${transaction.type}`;
  
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <View style={styles.leftContent}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.title}
        </Text>
        
        <View style={styles.metaContainer}>
          <ChipTag
            text={chipText}
            backgroundColor={chipColor}
            textColor={theme.colors.background}
            size="small"
            accessibilityLabel={`${transaction.type} transaction`}
          />
          
          {transaction.isRecurring && (
            <ChipTag
              text="Recurring"
              backgroundColor={theme.colors.labelRecurring}
              textColor={theme.colors.background}
              size="small"
              accessibilityLabel="Recurring transaction"
            />
          )}
          
          {showPocket && transaction.pocketName && (
            <Text style={styles.pocketName} numberOfLines={1}>
              • {transaction.pocketName}
            </Text>
          )}
        </View>
        
        <Text style={styles.date}>{transaction.date}</Text>
      </View>
      
      <View style={styles.rightContent}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {amountPrefix}${Math.abs(transaction.amount).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.screenPadding,
      minHeight: theme.layout.minTouchTarget,
      backgroundColor: theme.colors.background,
    },
    leftContent: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    rightContent: {
      alignItems: 'flex-end',
    },
    title: {
      ...theme.typography.subtitle1,
      color: theme.colors.text,
      fontWeight: '500',
      marginBottom: 4,
    },
    metaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    pocketName: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
      marginLeft: theme.spacing.xs,
    },
    date: {
      ...theme.typography.caption,
      color: theme.colors.textLight,
    },
    amount: {
      ...theme.typography.subtitle1,
      fontWeight: '600',
      textAlign: 'right',
    },
  });
}
