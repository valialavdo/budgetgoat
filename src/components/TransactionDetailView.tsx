import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ArrowUp, ArrowDown, Calendar, Wallet, PencilSimple } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import ActionButton from './ActionButton';
import ChipTag from './ChipTag';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  isRecurring: boolean;
  linkedPocket?: string;
  description?: string;
  date: string;
  category?: string;
}

interface TransactionDetailViewProps {
  transaction: Transaction;
  onEdit: () => void;
  onClose: () => void;
}

/**
 * TransactionDetailView - Expanded detail view for transactions
 * 
 * Features:
 * - Clear transaction type labeling with color coding
 * - Recurring label with blue highlight
 * - Linked pocket information
 * - Proper amount formatting and coloring
 * - Prominent edit button
 * - Accessibility compliance
 * 
 * Usage:
 * ```tsx
 * <TransactionDetailView
 *   transaction={selectedTransaction}
 *   onEdit={() => setEditMode(true)}
 *   onClose={() => setSelectedTransaction(null)}
 * />
 * ```
 */
export default function TransactionDetailView({
  transaction,
  onEdit,
  onClose,
}: TransactionDetailViewProps) {
  const theme = useTheme();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const styles = getStyles(theme, transaction.type);

  return (
    <View style={styles.container}>
      {/* Header with transaction type and amount */}
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <View style={[styles.typeIcon, { backgroundColor: styles.typeColor.backgroundColor }]}>
            {transaction.type === 'income' ? (
              <ArrowUp weight="light" size={20} color={theme.colors.background} />
            ) : (
              <ArrowDown weight="light" size={20} color={theme.colors.background} />
            )}
          </View>
          <View>
            <Text style={[styles.typeLabel, { color: styles.typeColor.color }]}>
              {transaction.type === 'income' ? 'Income' : 'Expense'}
            </Text>
            <Text style={[styles.amount, { color: styles.typeColor.color }]}>
              {formatAmount(transaction.amount)}
            </Text>
          </View>
        </View>
        
        {/* Recurring badge */}
        {transaction.isRecurring && (
          <ChipTag
            text="Recurring"
            backgroundColor={theme.colors.trustBlue}
            textColor={theme.colors.background}
            size="small"
          />
        )}
      </View>

      {/* Transaction details */}
      <View style={styles.detailsContainer}>
        {/* Transaction title */}
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {transaction.title}
        </Text>

        {/* Description */}
        {transaction.description && (
          <Text style={[styles.description, { color: theme.colors.textMuted }]}>
            {transaction.description}
          </Text>
        )}

        {/* Linked pocket */}
        {transaction.linkedPocket && (
          <View style={styles.infoRow}>
            <Wallet weight="light" size={16} color={theme.colors.textMuted} />
            <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>
              Linked to
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {transaction.linkedPocket}
            </Text>
          </View>
        )}

        {/* Date */}
        <View style={styles.infoRow}>
          <Calendar weight="light" size={16} color={theme.colors.textMuted} />
          <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>
            Date
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {formatDate(transaction.date)}
          </Text>
        </View>

        {/* Category */}
        {transaction.category && (
          <View style={styles.categoryContainer}>
            <Text style={[styles.categoryLabel, { color: theme.colors.textMuted }]}>
              Category
            </Text>
            <ChipTag
              text={transaction.category}
              backgroundColor={theme.colors.textMuted}
              textColor={theme.colors.background}
              size="small"
            />
          </View>
        )}
      </View>

      {/* Edit button */}
      <ActionButton
        title="Edit"
        variant="primary"
        size="large"
        onPress={onEdit}
        icon={<PencilSimple size={24} color={theme.colors.background} weight="light" />}
        accessibilityLabel="Edit transaction"
        accessibilityHint="Opens the edit form for this transaction"
      />
    </View>
  );
}

function getStyles(theme: any, type: 'income' | 'expense') {
  const typeColor = type === 'income' 
    ? { color: theme.colors.success, backgroundColor: theme.colors.success + '20' }
    : { color: theme.colors.error, backgroundColor: theme.colors.error + '20' };

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    typeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    typeIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.round,
      alignItems: 'center',
      justifyContent: 'center',
    },
    typeLabel: {
      ...theme.typography.subtitle1,
      fontWeight: '600',
      marginBottom: 4,
    },
    amount: {
      ...theme.typography.h3,
      fontWeight: '700',
    },
    detailsContainer: {
      marginBottom: theme.spacing.xl,
    },
    title: {
      ...theme.typography.h4,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    description: {
      ...theme.typography.body1,
      lineHeight: 24,
      marginBottom: theme.spacing.lg,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    infoLabel: {
      ...theme.typography.body2,
      fontWeight: '500',
    },
    infoValue: {
      ...theme.typography.body2,
      flex: 1,
    },
    categoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
    },
    categoryLabel: {
      ...theme.typography.body2,
      fontWeight: '500',
    },
    typeColor,
  });
}
