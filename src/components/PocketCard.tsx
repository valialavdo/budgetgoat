import { AccessibilityHelper } from '../utils/accessibility';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface PocketCardProps {
  pocket: {
    id: string;
    name: string;
    type: 'standard' | 'goal';
    currentBalance: number;
    targetAmount?: number;
    description: string;
    color: string;
    category: string;
  };
  onPress: (pocket: any) => void;
}

export default function PocketCard({ pocket, onPress }: PocketCardProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  // Calculate progress percentage for goal-oriented pockets
  const progressPercentage = pocket.type === 'goal' && pocket.targetAmount && pocket.targetAmount > 0
    ? Math.min((pocket.currentBalance / pocket.targetAmount) * 100, 100)
    : 0;

  // Helper function to truncate text with + indicator
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + `+${text.length - maxLength}`;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(pocket)}
      activeOpacity={0.7}
      accessibilityLabel={AccessibilityHelper.getPocketLabel({
        name: pocket.name,
        currentBalance: pocket.currentBalance,
        targetAmount: pocket.targetAmount,
        type: pocket.type
      })}
      accessibilityHint={AccessibilityHelper.getPocketHint({
        name: pocket.name,
        type: pocket.type
      })}
      accessibilityRole="button"
    >
      <View style={styles.cardContent}>
        {/* Title and Amount */}
        <View style={styles.pocketRow}>
          <Text style={[styles.pocketName, { color: theme.colors.textMuted }]}>
            {truncateText(pocket.name, 25)}
          </Text>
          <Text style={[styles.pocketAmount, { color: theme.colors.text }]}>
            €{pocket.currentBalance.toFixed(0)}
          </Text>
        </View>
        
        {/* Target amount for goal-oriented pockets */}
        {pocket.type === 'goal' && pocket.targetAmount && (
          <Text style={[styles.pocketTarget, { color: theme.colors.textMuted }]}>
            out of €{pocket.targetAmount.toFixed(0)}
          </Text>
        )}
        
        {/* Category label */}
        <Text style={[styles.pocketCategory, { color: theme.colors.textMuted }]}>
          {pocket.category}
        </Text>

        {/* Progress bar for goal-oriented pockets */}
        {pocket.type === 'goal' && pocket.targetAmount && pocket.targetAmount > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.borderLight }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: pocket.color || theme.colors.goatGreen
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.textMuted }]}>
              {progressPercentage.toFixed(0)}% complete
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      minHeight: 100, // Uniform height for all cards
    },
    cardContent: {
      flex: 1,
    },
    pocketRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    pocketName: {
      fontSize: 16,
      fontWeight: '500',
      flexShrink: 1,
      marginRight: 8,
    },
    pocketAmount: {
      fontSize: 20,
      fontWeight: '500',
      textAlign: 'right',
    },
    pocketTarget: {
      fontSize: 12,
      fontWeight: '400',
      marginBottom: 4,
      textAlign: 'right',
    },
    pocketCategory: {
      fontSize: 12,
      fontWeight: '400',
      marginBottom: 8,
    },
    progressContainer: {
      marginTop: 8,
    },
    progressBar: {
      height: 6,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 4,
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
    progressText: {
      fontSize: 10,
      fontWeight: '400',
      textAlign: 'right',
    },
  });
}