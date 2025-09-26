import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../theme';
import CashflowChart from './CashflowChart';
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
              <Eye size={24} color={Colors.textMuted} weight="light" />
            ) : (
              <EyeSlash size={24} color={Colors.textMuted} weight="light" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Bottom: Chart */}
      <View style={styles.chartSection}>
        <CashflowChart 
          incomeData={incomeData}
          expenseData={expenseData}
          timeLabels={timeLabels}
        />
        
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    paddingBottom: Spacing.lg,
    backgroundColor: 'transparent', // No background color
    marginBottom: 24, // 24px spacing between sections
    width: '100%', // Ensure full width
  },
  textSection: {
    width: '100%',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.screenPadding, // Add padding back to text section
  },
  label: {
    ...Typography.bodyRegular,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  amount: {
    ...Typography.h1,
    color: Colors.text,
    lineHeight: 40, // Updated to match h1 line height
  },
  eyeButton: {
    padding: Spacing.xs,
    borderRadius: 4,
  },
  chartSection: {
    width: '100%',
    alignItems: 'stretch', // Stretch to full width instead of center
    overflow: 'visible', // Allow chart overflow to be visible
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
    backgroundColor: Colors.borderLight,
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
    backgroundColor: Colors.trustBlue,
    borderRadius: 1.5,
  },
  budgetLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  budgetLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginRight: Spacing.xs,
  },
  budgetLineDash: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: Spacing.xs,
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
    backgroundColor: Colors.trustBlue,
    borderRadius: 1.5,
  },
  currentDataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: Colors.trustBlue,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.background,
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
    backgroundColor: Colors.borderLight,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
  },
  projectionDataPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.background,
  },
  timeLabels: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  timeLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  periodButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  periodButtonActive: {
    backgroundColor: Colors.trustBlue,
    borderColor: Colors.trustBlue,
  },
  periodButtonText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  periodButtonTextActive: {
    color: Colors.background,
  },
  periodSelectorContainer: {
    marginTop: 12, // 12px gap between chart and PeriodSelector
    width: '100%', // Full width
  },
});
