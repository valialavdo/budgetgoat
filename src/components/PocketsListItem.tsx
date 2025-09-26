import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { TrendUp, TrendDown, Repeat, Wallet, Target, Link, LinkBreak } from 'phosphor-react-native';
import LabelPill from './LabelPill';
import Divider from './Divider';

interface ListItemProps {
  title: string;
  subtitle?: string;
  date?: string;
  amount: number;
  type: 'income' | 'expense' | 'investment' | 'standard' | 'goal';
  targetAmount?: number; // Add target amount for goal pockets
  isRecurring?: boolean;
  onPress?: () => void;
  showDivider?: boolean;
  transactionCount?: number;
  pocketInfo?: {
    name?: string;
    isLinked: boolean;
  };
}

export default function ListItem({ 
  title, 
  subtitle, 
  date, 
  amount, 
  type, 
  targetAmount, 
  isRecurring = false, 
  onPress, 
  showDivider = true,
  transactionCount,
  pocketInfo
}: ListItemProps) {
  const theme = useTheme();
  const isPositive = amount > 0;
  const styles = getStyles(theme);
  
  const renderLabels = () => {
    const labels = [];
    
    // Add type label based on the type
    if (type === 'income') {
      labels.push(
        <LabelPill
          key="income"
          icon={<TrendUp weight="light" size={12} color={theme.colors.labelIncome} />}
          text="Income"
          backgroundColor={theme.colors.labelIncome + '15'}
          textColor={theme.colors.labelIncome}
        />
      );
    } else if (type === 'expense') {
      labels.push(
        <LabelPill
          key="expense"
          icon={<TrendDown weight="light" size={12} color={theme.colors.labelExpense} />}
          text="Expenses"
          backgroundColor={theme.colors.labelExpense + '15'}
          textColor={theme.colors.labelExpense}
        />
      );
           } else if (type === 'standard') {
         labels.push(
           <LabelPill
             key="standard"
             icon={<Wallet weight="light" size={12} color={theme.colors.labelStandard} />}
             text="Standard"
            backgroundColor={theme.colors.labelStandard + '15'}
            textColor={theme.colors.labelStandard}
           />
         );
       } else if (type === 'goal') {
         labels.push(
           <LabelPill
             key="goal"
             icon={<Target weight="light" size={12} color={theme.colors.labelGoal} />}
             text={targetAmount ? `out of €${targetAmount.toLocaleString('de-DE')}` : 'Goal Oriented'}
            backgroundColor={theme.colors.labelGoal + '15'}
            textColor={theme.colors.labelGoal}
           />
         );
    }
    
    // Add recurring label if applicable
    if (isRecurring) {
      labels.push(
        <LabelPill
          key="recurring"
          icon={<Repeat weight="light" size={12} color={theme.colors.labelRecurring} />}
          text="Recurring"
          backgroundColor={theme.colors.labelRecurring + '15'}
          textColor={theme.colors.labelRecurring}
        />
      );
    }
    
    // Add transaction count label if provided
    if (transactionCount !== undefined) {
      labels.push(
        <LabelPill
          key="transactionCount"
          number={transactionCount}
          text="transactions"
          backgroundColor={theme.colors.numericLabel + '15'}
          textColor={theme.colors.numericLabel}
        />
      );
    }
    
    // Add pocket linking status
    if (pocketInfo) {
      if (pocketInfo.isLinked && pocketInfo.name) {
        labels.push(
          <LabelPill
            key="pocket"
            icon={<Link weight="light" size={12} color={theme.colors.linkedPocket} />}
            text={pocketInfo.name}
            backgroundColor={theme.colors.linkedPocket + '15'}
            textColor={theme.colors.linkedPocket}
          />
        );
      } else {
        labels.push(
          <LabelPill
            key="unlinked"
            icon={<LinkBreak weight="light" size={12} color={theme.colors.unlinked} />}
            text="Unlinked"
            backgroundColor={theme.colors.unlinked + '15'}
            textColor={theme.colors.unlinked}
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
            backgroundColor={theme.colors.textMuted + '15'}
            textColor={theme.colors.textMuted}
          />
        )}
      </View>
    );
  };

  const formatCurrency = (amount: number, type: string, targetAmount?: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    if (type === 'goal' && targetAmount) {
      return { main: `€${formatted}`, secondary: '' };
    } else if (type === 'standard') {
      return { main: `€${formatted}`, secondary: '' };
    } else {
      return { main: `${amount >= 0 ? '+' : '-'}€${formatted}`, secondary: '' };
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.leftSection}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        
        <View style={styles.rightSection}>
          {(() => {
            const formatted = formatCurrency(amount, type, targetAmount);
            return (
              <View style={styles.amountContainer}>
                <Text style={styles.amountMain}>{formatted.main}</Text>
                {formatted.secondary && (
                  <Text style={styles.amountSecondary}>{formatted.secondary}</Text>
                )}
              </View>
            );
          })()}
        </View>
      </View>
      
      {/* Labels and Date */}
      <View style={styles.bottomSection}>
        {renderLabels()}
        {date ? (
          <Text style={styles.date} numberOfLines={1}>
            {new Date(date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        ) : subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      
      {/* Dashed Divider - only show if showDivider is true */}
      <Divider visible={showDivider} margin={12} />
    </TouchableOpacity>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      paddingTop: 0, // No top padding
      paddingBottom: theme.spacing.md, // Keep bottom padding
    marginBottom: 12, // 12px gap between list items
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // Direct 8px gap to bottom section
  },
  leftSection: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    marginBottom: 0, // No margin, clean component
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginBottom: 16, // 16px between title/description and labels
  },
  date: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginBottom: 0,
    textAlign: 'left',
  },
  amount: {
    ...theme.typography.h4, // Changed from h3 to h4 for consistent amount sizing
    color: theme.colors.text,
  },
  amountMain: {
    ...theme.typography.h4, // Changed from h3 to h4 for consistent amount sizing
    color: theme.colors.text,
  },
  amountSecondary: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text + 'A6', // 65% opacity
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: 8, // 8px gap between labels and date
  },
  bottomSection: {
    // No margins, clean component
  },
  });
}
