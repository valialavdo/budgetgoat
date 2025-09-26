import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../components/SecondaryHeader';
import { 
  ChartLine, 
  TrendUp, 
  TrendDown, 
  Target, 
  Calendar,
  Wallet,
  ChartPie,
  ChartBar,
  Clock,
  CheckCircle,
  Warning,
  ArrowUpRight,
  ArrowDownRight
} from 'phosphor-react-native';

interface ProjectionData {
  month: string;
  totalBalance: number;
  income: number;
  expenses: number;
  savings: number;
}

interface GoalProgress {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  progress: number;
}

const MOCK_PROJECTION_DATA: ProjectionData[] = [
  { month: 'Jan 2024', totalBalance: 2500, income: 3500, expenses: 2800, savings: 700 },
  { month: 'Feb 2024', totalBalance: 3200, income: 3500, expenses: 2600, savings: 900 },
  { month: 'Mar 2024', totalBalance: 4100, income: 3600, expenses: 2400, savings: 1200 },
  { month: 'Apr 2024', totalBalance: 5300, income: 3500, expenses: 2200, savings: 1300 },
  { month: 'May 2024', totalBalance: 6600, income: 3700, expenses: 2100, savings: 1600 },
  { month: 'Jun 2024', totalBalance: 8200, income: 3500, expenses: 1900, savings: 1600 },
];

const MOCK_GOALS: GoalProgress[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    target: 5000,
    current: 3200,
    deadline: 'Dec 2024',
    progress: 64
  },
  {
    id: '2',
    name: 'Vacation Fund',
    target: 3000,
    current: 1200,
    deadline: 'Aug 2024',
    progress: 40
  },
  {
    id: '3',
    name: 'New Car Down Payment',
    target: 8000,
    current: 2400,
    deadline: 'Mar 2025',
    progress: 30
  }
];

export default function ProjectionDetailsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'6months' | '1year' | '2years'>('6months');
  const [selectedChart, setSelectedChart] = useState<'balance' | 'income' | 'expenses'>('balance');
  const styles = getStyles(theme);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTimeframeChange = (timeframe: '6months' | '1year' | '2years') => {
    setSelectedTimeframe(timeframe);
  };

  const handleChartChange = (chart: 'balance' | 'income' | 'expenses') => {
    setSelectedChart(chart);
  };

  const handleGoalPress = (goal: GoalProgress) => {
    Alert.alert(
      goal.name,
      `Progress: ${goal.progress}%\nCurrent: $${goal.current.toLocaleString()}\nTarget: $${goal.target.toLocaleString()}\nDeadline: ${goal.deadline}`
    );
  };

  const getTimeframeLabel = (timeframe: string) => {
    switch (timeframe) {
      case '6months': return '6 Months';
      case '1year': return '1 Year';
      case '2years': return '2 Years';
      default: return '6 Months';
    }
  };

  const getChartIcon = (chart: string) => {
    switch (chart) {
      case 'balance': return ChartLine;
      case 'income': return TrendUp;
      case 'expenses': return TrendDown;
      default: return ChartLine;
    }
  };

  const getChartColor = (chart: string) => {
    switch (chart) {
      case 'balance': return theme.colors.trustBlue;
      case 'income': return theme.colors.goatGreen;
      case 'expenses': return theme.colors.alertRed;
      default: return theme.colors.trustBlue;
    }
  };

  const renderProjectionChart = () => {
    const maxValue = Math.max(...MOCK_PROJECTION_DATA.map(d => d.totalBalance));
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Balance Projection</Text>
          <View style={styles.chartValue}>
            <Text style={[styles.chartValueAmount, { color: getChartColor(selectedChart) }]}>
              ${MOCK_PROJECTION_DATA[MOCK_PROJECTION_DATA.length - 1].totalBalance.toLocaleString()}
            </Text>
            <View style={styles.chartValueChange}>
              <ArrowUpRight size={24} color={theme.colors.goatGreen} weight="light" />
              <Text style={[styles.chartValueChangeText, { color: theme.colors.goatGreen }]}>
                +12.5%
              </Text>
            </View>
          </View>
        </View>
        
        {/* Simple Bar Chart Representation */}
        <View style={styles.barChart}>
          {MOCK_PROJECTION_DATA.map((data, index) => {
            const height = (data.totalBalance / maxValue) * 100;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barColumn}>
                  <View 
                    style={[
                      styles.bar,
                      { 
                        height: `${height}%`,
                        backgroundColor: getChartColor(selectedChart)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{data.month.split(' ')[0]}</Text>
                <Text style={styles.barValue}>${data.totalBalance.toLocaleString()}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderGoalCard = (goal: GoalProgress) => {
    const isOnTrack = goal.progress >= 50;
    const isAtRisk = goal.progress < 25;
    
    return (
      <TouchableOpacity
        key={goal.id}
        style={styles.goalCard}
        onPress={() => handleGoalPress(goal)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Goal: ${goal.name}, Progress: ${goal.progress}%`}
      >
        <View style={styles.goalHeader}>
          <View style={styles.goalInfo}>
            <Text style={styles.goalName}>{goal.name}</Text>
            <Text style={styles.goalDeadline}>Due: {goal.deadline}</Text>
          </View>
          <View style={[
            styles.goalStatus,
            { backgroundColor: isOnTrack ? theme.colors.goatGreen + '20' : isAtRisk ? theme.colors.alertRed + '20' : theme.colors.warningOrange + '20' }
          ]}>
            {isOnTrack ? (
              <CheckCircle size={24} color={theme.colors.goatGreen} weight="light" />
            ) : isAtRisk ? (
              <Warning size={24} color={theme.colors.alertRed} weight="light" />
            ) : (
              <Clock size={24} color={theme.colors.warningOrange} weight="light" />
            )}
          </View>
        </View>
        
        <View style={styles.goalProgress}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${goal.progress}%`,
                  backgroundColor: isOnTrack ? theme.colors.goatGreen : isAtRisk ? theme.colors.alertRed : theme.colors.warningOrange
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{goal.progress}%</Text>
        </View>
        
        <View style={styles.goalAmounts}>
          <Text style={styles.goalCurrent}>${goal.current.toLocaleString()}</Text>
          <Text style={styles.goalTarget}>of ${goal.target.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SecondaryHeader
        title="Projection Details"
        onBackPress={handleBack}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Timeframe Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Period</Text>
          <View style={styles.timeframeButtons}>
            {(['6months', '1year', '2years'] as const).map((timeframe) => (
              <TouchableOpacity
                key={timeframe}
                style={[
                  styles.timeframeButton,
                  selectedTimeframe === timeframe && styles.timeframeButtonActive
                ]}
                onPress={() => handleTimeframeChange(timeframe)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Select ${getTimeframeLabel(timeframe)} timeframe`}
              >
                <Text style={[
                  styles.timeframeButtonText,
                  selectedTimeframe === timeframe && styles.timeframeButtonTextActive
                ]}>
                  {getTimeframeLabel(timeframe)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chart Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chart Type</Text>
          <View style={styles.chartButtons}>
            {(['balance', 'income', 'expenses'] as const).map((chart) => {
              const IconComponent = getChartIcon(chart);
              return (
                <TouchableOpacity
                  key={chart}
                  style={[
                    styles.chartButton,
                    selectedChart === chart && styles.chartButtonActive
                  ]}
                  onPress={() => handleChartChange(chart)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Show ${chart} chart`}
                >
                  <IconComponent 
                    size={24} 
                    color={selectedChart === chart ? theme.colors.background : getChartColor(chart)} 
                    weight="light" 
                  />
                  <Text style={[
                    styles.chartButtonText,
                    selectedChart === chart && styles.chartButtonTextActive
                  ]}>
                    {chart.charAt(0).toUpperCase() + chart.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Projection Chart */}
        <View style={styles.section}>
          {renderProjectionChart()}
        </View>

        {/* Financial Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <TrendUp size={24} color={theme.colors.goatGreen} weight="light" />
              </View>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.goatGreen }]}>
                $21,300
              </Text>
            </View>
            
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <TrendDown size={24} color={theme.colors.alertRed} weight="light" />
              </View>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.alertRed }]}>
                $14,000
              </Text>
            </View>
            
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Target size={24} color={theme.colors.trustBlue} weight="light" />
              </View>
              <Text style={styles.summaryLabel}>Net Savings</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.trustBlue }]}>
                $7,300
              </Text>
            </View>
            
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <ChartPie size={24} color={theme.colors.warningOrange} weight="light" />
              </View>
              <Text style={styles.summaryLabel}>Savings Rate</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.warningOrange }]}>
                34.3%
              </Text>
            </View>
          </View>
        </View>

        {/* Goals Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals Progress</Text>
          <View style={styles.goalsList}>
            {MOCK_GOALS.map(renderGoalCard)}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightsContainer}>
            <View style={styles.insightItem}>
              <CheckCircle size={20} color={theme.colors.goatGreen} weight="light" />
              <Text style={styles.insightText}>
                You're on track to reach your emergency fund goal by December 2024
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Warning size={20} color={theme.colors.warningOrange} weight="light" />
              <Text style={styles.insightText}>
                Consider increasing savings to meet vacation fund deadline
              </Text>
            </View>
            <View style={styles.insightItem}>
              <TrendUp size={20} color={theme.colors.trustBlue} weight="light" />
              <Text style={styles.insightText}>
                Your savings rate has improved by 15% over the last 3 months
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  timeframeButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  timeframeButtonActive: {
    backgroundColor: theme.colors.trustBlue,
    borderColor: theme.colors.trustBlue,
  },
  timeframeButtonText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  timeframeButtonTextActive: {
    color: theme.colors.background,
  },
  chartButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  chartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.xs,
  },
  chartButtonActive: {
    backgroundColor: theme.colors.trustBlue,
    borderColor: theme.colors.trustBlue,
  },
  chartButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  chartButtonTextActive: {
    color: theme.colors.background,
  },
  chartContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  chartTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    fontWeight: '600',
  },
  chartValue: {
    alignItems: 'flex-end',
  },
  chartValueAmount: {
    ...theme.typography.h3,
    fontWeight: '700',
    marginBottom: 2,
  },
  chartValueChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chartValueChangeText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingTop: theme.spacing.md,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  barColumn: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '80%',
  },
  bar: {
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  barValue: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  summaryValue: {
    ...theme.typography.h4,
    fontWeight: '700',
  },
  goalsList: {
    gap: theme.spacing.md,
  },
  goalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  goalDeadline: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
  goalStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
    minWidth: 32,
    textAlign: 'right',
  },
  goalAmounts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  goalCurrent: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '700',
  },
  goalTarget: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textMuted,
  },
  insightsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    gap: theme.spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  insightText: {
    flex: 1,
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});
