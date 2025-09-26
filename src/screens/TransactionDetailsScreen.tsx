import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { PencilSimple, Trash, TrendUp, TrendDown, Clock } from 'phosphor-react-native';
import SecondaryHeader from '../components/SecondaryHeader';
import LabelPill from '../components/LabelPill';

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  isRecurring?: boolean;
  pocketInfo?: {
    name?: string;
    isLinked: boolean;
  };
}

interface TransactionDetailsScreenProps {
  transaction: Transaction;
  onBack: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

export default function TransactionDetailsScreen({
  transaction,
  onBack,
  onEdit,
  onDelete
}: TransactionDetailsScreenProps) {
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(transaction.id) },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${amount >= 0 ? '+' : '-'}€${formatted}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeIcon = () => {
    if (transaction.type === 'income') {
      return <TrendUp weight="light" size={16} color={Colors.labelIncome} />;
    }
    return <TrendDown weight="light" size={16} color={Colors.labelExpense} />;
  };

  const getTypeColor = () => {
    return transaction.type === 'income' ? Colors.labelIncome : Colors.labelExpense;
  };

  return (
    <View style={styles.container}>
      <SecondaryHeader
        title={transaction.title}
        onBackPress={onBack}
        scrollY={scrollY}
        scrollThreshold={10}
        rightIcon={
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerActionButton}
              onPress={() => onEdit(transaction)}
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
        {/* Transaction Information */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Title</Text>
            <Text style={styles.infoValue}>{transaction.title}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{formatDate(transaction.date)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Amount</Text>
            <Text style={[
              styles.infoValue, 
              { color: transaction.amount >= 0 ? Colors.income : Colors.expense }
            ]}>
              {formatCurrency(transaction.amount)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type</Text>
            <View style={styles.typeContainer}>
              {getTypeIcon()}
              <Text style={[styles.typeText, { color: getTypeColor() }]}>
                {transaction.type === 'income' ? 'Income' : 'Expense'}
              </Text>
            </View>
          </View>
          
          {transaction.isRecurring && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Recurring</Text>
              <View style={styles.typeContainer}>
                <Clock weight="light" size={16} color={Colors.labelRecurring} />
                <Text style={[styles.typeText, { color: Colors.labelRecurring }]}>
                  Yes
                </Text>
              </View>
            </View>
          )}
          
          {transaction.pocketInfo && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pocket</Text>
              <View style={styles.typeContainer}>
                {transaction.pocketInfo.isLinked ? (
                  <>
                    <LabelPill
                      icon={<TrendUp weight="light" size={14} color={Colors.linkedPocket} />}
                      text={transaction.pocketInfo.name || 'Linked'}
                      backgroundColor={Colors.linkedPocket + '15'}
                      textColor={Colors.linkedPocket}
                    />
                  </>
                ) : (
                  <LabelPill
                    icon={<TrendDown weight="light" size={14} color={Colors.unlinked} />}
                    text="Unlinked"
                    backgroundColor={Colors.unlinked + '15'}
                    textColor={Colors.unlinked}
                  />
                )}
              </View>
            </View>
          )}
        </View>

        {/* Labels Section */}
        <View style={styles.labelsSection}>
          <Text style={styles.sectionTitle}>Labels</Text>
          <View style={styles.labelsContainer}>
            <LabelPill
              icon={getTypeIcon()}
              text={transaction.type === 'income' ? 'Income' : 'Expense'}
              backgroundColor={getTypeColor() + '15'}
              textColor={getTypeColor()}
            />
            
            {transaction.isRecurring && (
              <LabelPill
                icon={<Clock weight="light" size={14} color={Colors.labelRecurring} />}
                text="Recurring"
                backgroundColor={Colors.labelRecurring + '15'}
                textColor={Colors.labelRecurring}
              />
            )}
            
            {transaction.pocketInfo && (
              <LabelPill
                icon={transaction.pocketInfo.isLinked ? 
                  <TrendUp weight="light" size={14} color={Colors.linkedPocket} /> :
                  <TrendDown weight="light" size={14} color={Colors.unlinked} />
                }
                text={transaction.pocketInfo.isLinked ? 
                  (transaction.pocketInfo.name || 'Linked') : 'Unlinked'
                }
                backgroundColor={transaction.pocketInfo.isLinked ? 
                  Colors.linkedPocket + '15' : Colors.unlinked + '15'
                }
                textColor={transaction.pocketInfo.isLinked ? 
                  Colors.linkedPocket : Colors.unlinked
                }
              />
            )}
          </View>
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
  labelsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.sectionTitleToContent,
  },
  labelsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
});
