import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { TrendUp, TrendDown, Clock, Link, LinkBreak } from 'phosphor-react-native';
import LabelPill from './LabelPill';
import Divider from './Divider';

interface TransactionListItemProps {
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
  onPress?: () => void;
  showDivider?: boolean;
}

export default function TransactionListItem({ 
  id, 
  title, 
  date, 
  amount, 
  type, 
  isRecurring = false, 
  pocketInfo, 
  onPress, 
  showDivider = true 
}: TransactionListItemProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const isPositive = amount > 0;
  
  const renderLabels = () => {
    const labels = [];
    
    // Add type label based on the type
    if (type === 'income') {
      labels.push(
        <LabelPill
          key="income"
          icon={<TrendUp />}
          text="Income"
          backgroundColor={Colors.labelIncome + '15'}
          textColor={Colors.labelIncome}
        />
      );
    } else if (type === 'expense') {
      labels.push(
        <LabelPill
          key="expense"
          icon={<TrendDown />}
          text="Expenses"
          backgroundColor={Colors.labelExpense + '15'}
          textColor={Colors.labelExpense}
        />
      );
    }
    
    // Add recurring label if applicable
    if (isRecurring) {
      labels.push(
        <LabelPill
          key="recurring"
          icon={<Clock />}
          text="Recurring"
          backgroundColor={Colors.labelRecurring + '15'}
          textColor={Colors.labelRecurring}
        />
      );
    }
    
    // Add pocket linking status
    if (pocketInfo) {
      if (pocketInfo.isLinked && pocketInfo.name) {
        labels.push(
          <LabelPill
            key="pocket"
            icon={<Link />}
            text={pocketInfo.name}
            backgroundColor={Colors.linkedPocket + '15'}
            textColor={Colors.linkedPocket}
          />
        );
      } else {
        labels.push(
          <LabelPill
            key="unlinked"
            icon={<LinkBreak />}
            text="Unlinked"
            backgroundColor={Colors.unlinked + '15'}
            textColor={Colors.unlinked}
          />
        );
      }
    }
    
    // Handle label overflow - show only first 3 labels + count of remaining
    const visibleLabels = labels.slice(0, 3);
    const remainingCount = labels.length - 3;
    
    return (
      <View style={styles.labelsContainer}>
        {visibleLabels}
        {remainingCount > 0 && (
          <LabelPill
            key="more"
            number={remainingCount}
            text="more"
            backgroundColor={Colors.textMuted + '15'}
            textColor={Colors.textMuted}
          />
        )}
      </View>
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
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.mainContent}>
        <View style={styles.leftSection}>
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {renderLabels()}
            <Text style={styles.date} numberOfLines={1}>
              {formatDate(date)}
            </Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Text style={[
            styles.amount,
            { color: isPositive ? theme.colors.income : theme.colors.expense }
          ]}>
            {formatCurrency(amount)}
          </Text>
        </View>
      </TouchableOpacity>
      
      <Divider visible={showDivider} margin={12} horizontalMargin={20} />
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      marginBottom: 12,
      marginTop: 12,
    },
    mainContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingBottom: theme.spacing.md,
    },
    leftSection: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    textContent: {
      gap: 4,
    },
    title: {
      ...theme.typography.bodyRegular,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: 4,
    },
    date: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      marginTop: 8,
    },
    labelsContainer: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'nowrap',
    },
    rightSection: {
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    amount: {
      ...theme.typography.bodyRegular,
      fontWeight: '700',
    },
  });
}
