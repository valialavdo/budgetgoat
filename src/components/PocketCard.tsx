import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import LabelPill from './LabelPill';

interface PocketCardProps {
  id: string;
  name: string;
  type: 'standard' | 'goal';
  balance: number;
  targetAmount?: number;
  transactionCount: number;
  onPress?: () => void;
  isFirst?: boolean;
}

export default function PocketCard({ 
  id, 
  name, 
  type, 
  balance, 
  targetAmount = 0, 
  transactionCount, 
  onPress,
  isFirst = false
}: PocketCardProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const isGoalPocket = type === 'goal';
  
  return (
    <TouchableOpacity style={isFirst ? styles.firstPocketCard : styles.pocketCard} onPress={onPress}>
      <View style={styles.titleContainer}>
        <Text 
          style={styles.pocketTitle} 
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {name}
        </Text>
      </View>
      
      <View style={styles.pocketMainMetric}>
        <Text style={styles.pocketBalance}>
          {Math.abs(balance).toLocaleString('de-DE')}€
        </Text>
        <LabelPill 
          number={transactionCount} 
          text="transactions"
          backgroundColor={theme.colors.numericLabel + '15'}
          textColor={theme.colors.numericLabel}
        />
      </View>
      
      {isGoalPocket && targetAmount > 0 ? (
        <View style={styles.goalSection}>
          <Text style={styles.goalText}>
            Goal: {targetAmount.toLocaleString('de-DE')}€
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min((Math.abs(balance) / targetAmount) * 100, 100)}%` } 
              ]} 
            />
          </View>
        </View>
      ) : (
        <Text style={styles.descriptionText}>
          {type === 'standard' ? 'Standard pocket' : 'Goal pocket'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
  pocketCard: {
    width: 154,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 12, // Spacing between cards
    // Ensure no background interference with overflow
    overflow: 'visible',
  },
  firstPocketCard: {
    width: 154,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginLeft: theme.spacing.screenPadding, // Only first card starts at screen edge (aligned with title)
    marginRight: 12, // Spacing between cards
    // Ensure no background interference with overflow
    overflow: 'visible',
  },
  titleContainer: {
    height: 48, // Fixed height for consistent alignment (2 lines * 24px line height)
    justifyContent: 'flex-start', // Changed from 'center' to align titles at top
    marginBottom: theme.spacing.xs,
  },
  pocketTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    textAlign: 'left',
  },
  pocketMainMetric: {
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs, // Reduced from theme.spacing.sm
    gap: theme.spacing.xs, // Reduced from theme.spacing.sm
  },
  pocketBalance: {
    ...theme.typography.h4, // Changed from h3 to h4 for consistent amount sizing
    color: theme.colors.text,
    textAlign: 'left',
  },
  goalSection: {
    marginTop: 2, // Back to original spacing
  },
  goalText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    marginBottom: 8, // Increased from 6px to 8px for more breathing room
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.trustBlue,
    borderRadius: 3,
  },
  descriptionText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: 2, // Reduced from theme.spacing.xs
    textAlign: 'left',
  },
  });
}
