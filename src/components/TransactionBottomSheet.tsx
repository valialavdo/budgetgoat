import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import BaseBottomSheet from './BaseBottomSheet';
import LabelPill from './LabelPill';
import { format } from 'date-fns';
import { ArrowUp, ArrowDown, Link, LinkBreak, Repeat } from 'phosphor-react-native';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  isRecurring?: boolean;
  pocketInfo?: {
    isLinked: boolean;
    pocketName?: string;
  };
  description?: string;
  category?: string;
}

interface TransactionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function TransactionBottomSheet({
  visible,
  onClose,
  transaction,
}: TransactionBottomSheetProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  if (!transaction) return null;

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${type === 'expense' ? '-' : '+'}€${formatted}`;
  };

  const getAmountColor = (type: 'income' | 'expense') => {
    return type === 'income' ? theme.colors.goatGreen : theme.colors.alertRed;
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Transaction Details"
      showActionButtons={false}
    >
      <View style={styles.container}>
        {/* Transaction Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{transaction.title}</Text>
          <Text style={[styles.amount, { color: getAmountColor(transaction.type) }]}>
            {formatAmount(transaction.amount, transaction.type)}
          </Text>
        </View>

        {/* Transaction Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>
              {format(new Date(transaction.date), 'MMMM dd, yyyy')}
            </Text>
          </View>

          {transaction.description && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Description</Text>
              <Text style={styles.infoValue}>{transaction.description}</Text>
            </View>
          )}

          {transaction.category && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{transaction.category}</Text>
            </View>
          )}
        </View>

        {/* Transaction Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {/* Type Tag */}
            <LabelPill
              label={transaction.type === 'income' ? 'Income' : 'Expenses'}
              type={transaction.type}
              icon={transaction.type === 'income' ? ArrowUp : ArrowDown}
            />

            {/* Recurring Tag */}
            {transaction.isRecurring && (
              <LabelPill
                label="Recurring"
                type="recurring"
                icon={Repeat}
              />
            )}

            {/* Pocket Link Tag */}
            {transaction.pocketInfo && (
              <LabelPill
                label={transaction.pocketInfo.isLinked ? 
                  transaction.pocketInfo.pocketName || 'Linked' : 
                  'Unlinked'
                }
                type={transaction.pocketInfo.isLinked ? 'linked' : 'unlinked'}
                icon={transaction.pocketInfo.isLinked ? Link : LinkBreak}
              />
            )}
          </View>
        </View>

        {/* Pocket Information */}
        {transaction.pocketInfo && (
          <View style={styles.pocketSection}>
            <Text style={styles.sectionTitle}>Pocket</Text>
            <View style={styles.pocketInfo}>
              {transaction.pocketInfo.isLinked ? (
                <View style={styles.pocketLinked}>
                  <Link size={16} color={theme.colors.trustBlue} weight="light" />
                  <Text style={styles.pocketLinkedText}>
                    Linked to {transaction.pocketInfo.pocketName || 'Unknown Pocket'}
                  </Text>
                </View>
              ) : (
                <View style={styles.pocketUnlinked}>
                  <LinkBreak size={16} color={theme.colors.textMuted} weight="light" />
                  <Text style={styles.pocketUnlinkedText}>Not linked to any pocket</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.md,
    },
    header: {
      marginBottom: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: '600',
    },
    amount: {
      ...theme.typography.h2,
      fontWeight: '700',
    },
    infoSection: {
      marginBottom: theme.spacing.lg,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    infoLabel: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      fontWeight: '500',
    },
    infoValue: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      textAlign: 'right',
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    tagsSection: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: '600',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    pocketSection: {
      marginBottom: theme.spacing.md,
    },
    pocketInfo: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
    },
    pocketLinked: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    pocketLinkedText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.trustBlue,
      fontWeight: '500',
    },
    pocketUnlinked: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    pocketUnlinkedText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
    },
  });
}
