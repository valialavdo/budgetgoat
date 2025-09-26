import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Wallet, Target, Link, LinkBreak } from 'phosphor-react-native';
import LabelPill from './LabelPill';

interface PocketsListItemDetailsProps {
  id: string;
  name: string;
  description?: string;
  type: 'standard' | 'goal';
  balance: number;
  targetAmount?: number;
  transactionCount: number;
  onPress?: () => void;
  showDivider?: boolean;
}

export default function PocketsListItemDetails({ 
  id, 
  name, 
  description, 
  type, 
  balance, 
  targetAmount = 0, 
  transactionCount, 
  onPress, 
  showDivider = true 
}: PocketsListItemDetailsProps) {
  const isGoalPocket = type === 'goal';
  
  const getTypeIcon = () => {
    if (isGoalPocket) {
      return <Target weight="light" size={12} color={Colors.labelGoal} />;
    }
    return <Wallet weight="light" size={12} color={Colors.labelStandard} />;
  };

  const getTypeColor = () => {
    if (isGoalPocket) {
      return Colors.labelGoal;
    }
    return Colors.labelStandard;
  };

  const formatCurrency = (amount: number, type: string, targetAmount?: number) => {
    const formatted = Math.abs(amount).toLocaleString('de-DE', {
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

  const amountInfo = formatCurrency(balance, type, targetAmount);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.mainContent}>
        <View style={styles.leftSection}>
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={1}>
              {name}
            </Text>
            {description && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {description}
              </Text>
            )}
            
            <View style={styles.labelsContainer}>
              <LabelPill
                icon={getTypeIcon()}
                text={type === 'goal' && targetAmount ? `out of €${targetAmount.toLocaleString('de-DE')}` : (type === 'goal' ? 'Goal Oriented' : 'Standard')}
                backgroundColor={getTypeColor() + '15'}
                textColor={getTypeColor()}
              />
              
              <LabelPill
                number={transactionCount}
                text="transactions"
                backgroundColor={Colors.numericLabel + '15'}
                textColor={Colors.numericLabel}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountMain}>
              {amountInfo.main}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      {showDivider && (
        <View style={styles.divider} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    marginTop: 12,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: Spacing.md,
  },
  leftSection: {
    flex: 1,
    marginRight: Spacing.md,
  },
  textContent: {
    gap: 4,
  },
  title: {
    ...Typography.bodyLarge,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: 8,
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
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountMain: {
    ...Typography.h4, // Changed from h3 to h4 for consistent amount sizing
    color: Colors.text,
  },
  amountSecondary: {
    ...Typography.caption,
    color: Colors.text,
    opacity: 0.65,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border + '60',
    marginHorizontal: 20,
    borderStyle: 'dashed',
  },
});
