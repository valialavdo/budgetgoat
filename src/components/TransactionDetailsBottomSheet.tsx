import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PencilSimple, TrendUp, TrendDown, Repeat, Link, LinkBreak } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import BaseBottomSheet from './BaseBottomSheet';
import ActionButton from './ActionButton';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  note?: string;
  pocketCategoryId?: string;
  pocketName?: string;
  isRecurring?: boolean;
  date: string;
}

interface TransactionDetailsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onEdit: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export default function TransactionDetailsBottomSheet({
  visible,
  onClose,
  transaction,
  onEdit,
  onDelete
}: TransactionDetailsBottomSheetProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);

  if (!transaction) return null;

  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? theme.colors.goatGreen : theme.colors.alertRed;
  const typeIcon = isIncome ? 
    <TrendUp weight="light" size={24} color={theme.colors.goatGreen} /> : 
    <TrendDown weight="light" size={24} color={theme.colors.alertRed} />;

  const handleEdit = () => {
    onEdit(transaction);
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="Transaction Details"
    >

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Transaction Type & Amount Section */}
            <View style={styles.section}>
              <View style={styles.typeAmountRow}>
                <View style={styles.typeContainer}>
                  <View style={styles.typeIconContainer}>
                    {typeIcon}
                  </View>
                  <View style={styles.typeTextContainer}>
                    <Text style={styles.typeLabel}>Type</Text>
                    <View style={[
                      styles.typeBadge, 
                      { backgroundColor: isIncome ? theme.colors.goatGreen + '15' : theme.colors.alertRed + '15' }
                    ]}>
                      <Text style={[
                        styles.typeText,
                        { color: amountColor }
                      ]}>
                        {isIncome ? 'Income' : 'Expense'}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.amountContainer}>
                  <Text style={styles.amountLabel}>Amount</Text>
                  <Text style={[
                    styles.amountText,
                    { color: amountColor }
                  ]}>
                    {isIncome ? '+' : '-'}€{Math.abs(transaction.amount).toLocaleString('de-DE')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Transaction Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Details</Text>
              
              {/* Title/Description */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>{transaction.title || 'No description'}</Text>
              </View>

              {/* Note */}
              {transaction.note && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Note</Text>
                  <Text style={styles.detailValue}>{transaction.note}</Text>
                </View>
              )}

              {/* Date */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>

              {/* Linked Pocket */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Linked to</Text>
                <View style={styles.linkedPocketContainer}>
                  {transaction.pocketName ? (
                    <>
                      <Link size={16} color={theme.colors.linkedPocket} weight="light" />
                      <Text style={[styles.detailValue, { color: theme.colors.linkedPocket }]}>
                        {transaction.pocketName}
                      </Text>
                    </>
                  ) : (
                    <>
                      <LinkBreak size={16} color={theme.colors.unlinked} weight="light" />
                      <Text style={[styles.detailValue, { color: theme.colors.unlinked }]}>
                        Unlinked
                      </Text>
                    </>
                  )}
                </View>
              </View>

              {/* Recurring Status */}
              {transaction.isRecurring && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Recurrence</Text>
                  <View style={styles.recurringContainer}>
                    <Repeat size={16} color={theme.colors.labelRecurring} weight="light" />
                    <View style={[
                      styles.recurringBadge,
                      { backgroundColor: theme.colors.labelRecurring + '15' }
                    ]}>
                      <Text style={[styles.recurringText, { color: theme.colors.labelRecurring }]}>
                        Recurring
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Edit Button */}
          <View style={styles.footer}>
            <ActionButton
              title={t('common.edit')}
              onPress={handleEdit}
              variant="primary"
              size="medium"
              fullWidth
              icon={<PencilSimple size={24} color={theme.colors.background} weight="light" />}
              accessibilityLabel={t('common.edit')}
              accessibilityHint="Opens the edit form for this transaction"
            />
          </View>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    bottomSheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      maxHeight: '90%',
      minHeight: '60%',
      marginBottom: 16, // Safe area from bottom navigation
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '600',
    },
    headerSpacer: {
      width: 32,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.screenPadding,
    },
    section: {
      marginVertical: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: theme.spacing.md,
    },
    typeAmountRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    typeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    typeIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    typeTextContainer: {
      flex: 1,
    },
    typeLabel: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.xs,
    },
    typeBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      alignSelf: 'flex-start',
    },
    typeText: {
      ...theme.typography.bodySmall,
      fontWeight: '600',
    },
    amountContainer: {
      alignItems: 'flex-end',
    },
    amountLabel: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.xs,
    },
    amountText: {
      ...theme.typography.h4,
      fontWeight: '700',
    },
    detailRow: {
      marginBottom: theme.spacing.md,
    },
    detailLabel: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
      marginBottom: theme.spacing.xs,
    },
    detailValue: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
    },
    linkedPocketContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    recurringContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    recurringBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.sm,
    },
    recurringText: {
      ...theme.typography.bodySmall,
      fontWeight: '600',
    },
    footer: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
    },
  });
}
