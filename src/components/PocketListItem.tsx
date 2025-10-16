import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import DashedDivider from './DashedDivider';
import LabelPill from './LabelPill';

interface PocketListItemProps {
  pocket: {
    id: string;
    name: string;
    type: 'standard' | 'goal';
    currentBalance: number;
    targetAmount?: number;
    description: string;
    color: string;
    category: string;
    transactionCount: number;
  };
  onPress: (pocket: any) => void;
  showDivider?: boolean;
}

export default function PocketListItem({ pocket, onPress, showDivider = true }: PocketListItemProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  // Calculate progress percentage for goal-oriented pockets
  const progressPercentage = pocket.type === 'goal' && pocket.targetAmount && pocket.targetAmount > 0
    ? Math.min((pocket.currentBalance / pocket.targetAmount) * 100, 100)
    : 0;

  // Helper function to truncate text with + indicator
  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text || typeof text !== 'string' || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + `+${text.length - maxLength}`;
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.pocketCard}
        onPress={() => onPress(pocket)}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          {/* Title and Amount */}
          <View style={styles.pocketRow}>
            <Text style={[styles.pocketName, { color: theme.colors.textMuted }]}>
              {truncateText(pocket?.name, 20)}
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
          
          {/* Labels */}
          <View style={styles.pocketLabels}>
            <LabelPill
              text={pocket.type === 'standard' ? 'Standard' : 'Goal'}
              backgroundColor="#F3F4F6"
              textColor="#6B7280"
            />
            
            {pocket.type === 'goal' && (
              <LabelPill
                text={`${progressPercentage.toFixed(0)}% complete`}
                backgroundColor="#FEF3C7"
                textColor="#D97706"
              />
            )}
            
            <LabelPill
              text={truncateText(pocket?.category, 10)}
              backgroundColor="#DBEAFE"
              textColor="#1D4ED8"
            />
          </View>

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
            </View>
          )}
        </View>
      </TouchableOpacity>
      {showDivider && <DashedDivider style={styles.divider} />}
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  pocketCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    minHeight: 120, // Uniform height for all pockets
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
    fontSize: 14,
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
    marginBottom: 8,
    textAlign: 'right',
  },
  pocketLabels: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  divider: {
    marginTop: 8,
  },
});
