import { AccessibilityHelper } from '../utils/accessibility';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Transaction, Pocket } from '../services/firestoreService';
import DashedDivider from './DashedDivider';
import LabelPill from './LabelPill';
import { Link, ArrowClockwise, Repeat, Calendar } from 'phosphor-react-native';

interface TransactionHomeProps {
  transaction: Transaction;
  pockets: Pocket[];
  onPress: (transaction: Transaction) => void;
  isLast?: boolean;
}

export default function TransactionHome({ transaction, pockets, onPress, isLast = false }: TransactionHomeProps) {
  const theme = useTheme();

  // Helper function to truncate text with + indicator
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + `+${text.length - maxLength}`;
  };

  // Format amount with proper sign and color
  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const sign = type === 'income' ? '+' : '-';
    const formattedAmount = Math.abs(amount).toFixed(2);
    return `${sign}€${formattedAmount}`;
  };

  const getAmountColor = (type: 'income' | 'expense') => {
    return type === 'income' ? theme.colors.goatGreen : theme.colors.alertRed;
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => onPress(transaction)}
        activeOpacity={0.7}
        accessibilityLabel={AccessibilityHelper.getTransactionLabel({
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type,
          date: transaction.date ? transaction.date.toString() : undefined,
          category: transaction.category
        })}
        accessibilityHint={AccessibilityHelper.getTransactionHint({
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type
        })}
        accessibilityRole="button"
      >
        <View style={styles.transactionLeft}>
          <View style={styles.transactionInfo}>
                   {/* First row: Description and Amount */}
                   <View style={styles.transactionRow}>
                     <Text style={[styles.transactionDescription, { color: theme.colors.text }]}>
                       {truncateText(transaction.description, 20)}
                     </Text>
                     <View style={styles.amountContainer}>
                       <Text style={[
                         styles.transactionAmount,
                         { color: getAmountColor(transaction.type) }
                       ]}>
                         {formatAmount(transaction.amount, transaction.type)}
                       </Text>
                       <Text style={[styles.transactionDate, { color: theme.colors.textMuted }]}>
                         {transaction.date.toLocaleDateString()}
                       </Text>
                     </View>
                   </View>
                   
                   {/* Second row: Only Recurring and Linked Pocket labels */}
                   <View style={styles.transactionTags}>
                     {/* Recurring label - show for recurring transactions */}
                     {transaction.tags && transaction.tags.includes('recurring') && (
                       <LabelPill
                         icon={<Repeat size={12} weight="regular" />}
                         text="Recurring"
                         backgroundColor="#F3F4F6"
                         textColor="#6B7280"
                       />
                     )}
                     
                     {/* Linked Pocket label */}
                     {(() => {
                       const linkedPocket = pockets.find(p => p.id === transaction.pocketId);
                       return (
                         <LabelPill
                           icon={<Link size={12} weight="regular" />}
                           text={linkedPocket?.name || 'Unlinked'}
                           backgroundColor={linkedPocket ? "#E0F2FE" : "#FEF2F2"}
                           textColor={linkedPocket ? "#0277BD" : "#DC2626"}
                         />
                       );
                     })()}
                   </View>
          </View>
        </View>
      </TouchableOpacity>
      {!isLast && <DashedDivider style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 8,
  },
  transactionDescription: {
    fontSize: 14, // Smaller font size for one line
    fontWeight: '500',
    flexShrink: 1,
    marginRight: 8,
  },
  transactionTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14, // Smaller font size to match description
    fontWeight: '500',
    textAlign: 'right',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  transactionDate: {
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'right',
    marginTop: 2,
  },
  divider: {
    marginTop: 8,
    width: '100%',
  },
});
