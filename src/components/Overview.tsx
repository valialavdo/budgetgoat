import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import PeriodSelector from './PeriodSelector';
import { Eye, EyeSlash } from 'phosphor-react-native';

interface OverviewProps {
  label: string;
  amount: number;
  incomeData: number[];
  expenseData: number[];
  timeLabels: string[];
  currency?: string;
  selectedPeriod: '1M' | '3M' | '6M' | '1Y';
  onPeriodChange: (period: '1M' | '3M' | '6M' | '1Y') => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function Overview({ 
  label, 
  amount, 
  incomeData, 
  expenseData, 
  timeLabels,
  currency = '€',
  selectedPeriod,
  onPeriodChange
}: OverviewProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const theme = useTheme();
  const styles = getStyles(theme);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const formatAmount = () => {
    if (isBalanceVisible) {
      return `${currency}${amount.toLocaleString('de-DE', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    } else {
      return '••••••';
    }
  };

  return (
    <View style={styles.container}>
      {/* Top: Label and Amount */}
      <View style={styles.textSection}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>
            {formatAmount()}
          </Text>
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={toggleBalanceVisibility}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isBalanceVisible ? "Hide balance" : "Show balance"}
            accessibilityHint="Toggles the visibility of your current balance"
          >
            {isBalanceVisible ? (
              <Eye size={24} color={theme.colors.textMuted} weight="light" />
            ) : (
              <EyeSlash size={24} color={theme.colors.textMuted} weight="light" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Bottom: Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.chartPlaceholder}>
          Chart visualization coming soon
        </Text>
        
        {/* Period Selector under the chart with 12px gap */}
        <View style={styles.periodSelectorContainer}>
          <PeriodSelector 
            selectedPeriod={selectedPeriod}
            onPeriodChange={onPeriodChange}
          />
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    paddingBottom: theme.spacing.lg,
    backgroundColor: 'transparent', // No background color
    marginBottom: 24, // 24px spacing between sections
    width: '100%', // Ensure full width
  },
  textSection: {
    width: '100%',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.screenPadding, // Add padding back to text section
  },
  label: {
    ...theme.typography.bodyRegular,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  amount: {
    ...theme.typography.h1,
    color: theme.colors.text,
    lineHeight: 40, // Updated to match h1 line height
  },
  eyeButton: {
    padding: theme.spacing.xs,
    borderRadius: 4,
  },
  chartSection: {
    width: '100%',
    alignItems: 'stretch', // Stretch to full width instead of center
    overflow: 'visible', // Allow chart overflow to be visible
  },
  chartPlaceholder: {
    textAlign: 'center',
    paddingVertical: 20,
    color: theme.colors.textMuted,
  },
  chartContainer: {
    position: 'relative',
    width: '100%',
    height: 80,
  },
  baseline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.borderLight,
  },
  chart: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  lineSegment: {
    position: 'absolute',
    backgroundColor: theme.colors.trustBlue,
    borderRadius: 1.5,
  },
  budgetLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  budgetLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginRight: theme.spacing.xs,
  },
  budgetLineDash: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginLeft: theme.spacing.xs,
  },
  currentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  currentLineSegment: {
    position: 'absolute',
    backgroundColor: theme.colors.trustBlue,
    borderRadius: 1.5,
  },
  currentDataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: theme.colors.trustBlue,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  projectionLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  projectionLineSegment: {
    position: 'absolute',
    backgroundColor: theme.colors.borderLight,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderStyle: 'dashed',
  },
  projectionDataPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: theme.colors.background,
  },
  timeLabels: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  timeLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  periodButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  periodButtonActive: {
    backgroundColor: theme.colors.trustBlue,
    borderColor: theme.colors.trustBlue,
  },
  periodButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
  periodButtonTextActive: {
    color: theme.colors.background,
  },
  periodSelectorContainer: {
    marginTop: 12, // 12px gap between chart and PeriodSelector
    width: '100%', // Full width
  },
});
