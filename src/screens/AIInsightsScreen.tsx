import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../components/SecondaryHeader';
import { 
  Lightbulb, 
  TrendUp, 
  Target, 
  Info, 
  ChartLine, 
  TrendDown,
  Warning,
  CheckCircle,
  ArrowRight,
  ThumbsUp,
  ThumbsDown
} from 'phosphor-react-native';

interface InsightItem {
  id: string;
  type: 'saving' | 'spending' | 'goal' | 'warning';
  title: string;
  description: string;
  impact: string;
  action: string;
  confidence: number;
  icon: React.ComponentType<any>;
}

const MOCK_INSIGHTS: InsightItem[] = [
  {
    id: '1',
    type: 'saving',
    title: 'Reduce Dining Out',
    description: 'You spent $340 on dining out this month, which is 23% above your budget. Consider cooking more meals at home.',
    impact: 'Potential savings: $120/month',
    action: 'Set a dining budget limit of $200/month',
    confidence: 92,
    icon: TrendDown
  },
  {
    id: '2',
    type: 'spending',
    title: 'Subscription Optimization',
    description: 'You have 8 active subscriptions totaling $89/month. Two services haven\'t been used in 3 months.',
    impact: 'Potential savings: $34/month',
    action: 'Cancel unused subscriptions and bundle similar services',
    confidence: 87,
    icon: Target
  },
  {
    id: '3',
    type: 'goal',
    title: 'Emergency Fund Progress',
    description: 'Your emergency fund is at $2,400. At your current savings rate, you\'ll reach your $5,000 goal in 8 months.',
    impact: 'Goal completion: 48%',
    action: 'Consider increasing monthly savings by $100 to reach goal in 5 months',
    confidence: 95,
    icon: TrendUp
  },
  {
    id: '4',
    type: 'warning',
    title: 'High Credit Card Usage',
    description: 'Your credit card balance increased by $450 this month. This trend could impact your credit score.',
    impact: 'Credit utilization: 67%',
    action: 'Create a debt payoff plan and reduce discretionary spending',
    confidence: 89,
    icon: Warning
  },
  {
    id: '5',
    type: 'saving',
    title: 'Energy Bill Optimization',
    description: 'Your energy bill is 15% higher than last month. Consider implementing energy-saving practices.',
    impact: 'Potential savings: $45/month',
    action: 'Set thermostat 2°F lower and unplug unused electronics',
    confidence: 78,
    icon: ChartLine
  }
];

export default function AIInsightsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'helpful' | 'not_helpful' | null>>({});
  const styles = getStyles(theme);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleInsightToggle = (insightId: string) => {
    setExpandedInsight(expandedInsight === insightId ? null : insightId);
  };

  const handleFeedback = (insightId: string, feedbackType: 'helpful' | 'not_helpful') => {
    setFeedback(prev => ({
      ...prev,
      [insightId]: feedbackType
    }));
  };

  const handleActionApply = (insight: InsightItem) => {
    Alert.alert(
      'Apply Insight',
      `Would you like to apply this recommendation: "${insight.action}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Apply', onPress: () => {
          // TODO: Implement insight application logic
          Alert.alert('Success', 'Recommendation applied! We\'ll track your progress.');
        }}
      ]
    );
  };

  const getInsightIcon = (insight: InsightItem) => {
    const IconComponent = insight.icon;
    let iconColor = theme.colors.textMuted;
    
    switch (insight.type) {
      case 'saving':
        iconColor = theme.colors.goatGreen;
        break;
      case 'spending':
        iconColor = theme.colors.alertRed;
        break;
      case 'goal':
        iconColor = theme.colors.trustBlue;
        break;
      case 'warning':
        iconColor = theme.colors.warningOrange;
        break;
    }
    
    return <IconComponent size={24} color={iconColor} weight="light" />;
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'saving': return theme.colors.goatGreen;
      case 'spending': return theme.colors.alertRed;
      case 'goal': return theme.colors.trustBlue;
      case 'warning': return theme.colors.warningOrange;
      default: return theme.colors.textMuted;
    }
  };

  const getInsightTypeLabel = (type: string) => {
    switch (type) {
      case 'saving': return 'Money Saving';
      case 'spending': return 'Spending Alert';
      case 'goal': return 'Goal Progress';
      case 'warning': return 'Attention Needed';
      default: return 'Insight';
    }
  };

  return (
    <View style={styles.container}>
      <SecondaryHeader
        title="AI Insights"
        onBackPress={handleBack}
        scrollY={scrollY}
        scrollThreshold={10}
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
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}>
            <Lightbulb size={32} color={theme.colors.trustBlue} weight="light" />
          </View>
          <Text style={styles.headerTitle}>Personalized Financial Insights</Text>
          <Text style={styles.headerDescription}>
            AI-powered recommendations to help you optimize your finances and reach your goals faster.
          </Text>
        </View>

        {/* Insights List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Insights</Text>
          <View style={styles.insightsList}>
            {MOCK_INSIGHTS.map((insight) => {
              const isExpanded = expandedInsight === insight.id;
              const insightFeedback = feedback[insight.id];
              
              return (
                <View key={insight.id} style={styles.insightCard}>
                  {/* Insight Header */}
                  <TouchableOpacity
                    style={styles.insightHeader}
                    onPress={() => handleInsightToggle(insight.id)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={insight.title}
                    accessibilityHint={isExpanded ? "Tap to collapse details" : "Tap to expand details"}
                  >
                    <View style={styles.insightHeaderLeft}>
                      {getInsightIcon(insight)}
                      <View style={styles.insightHeaderText}>
                        <Text style={styles.insightType}>
                          {getInsightTypeLabel(insight.type)}
                        </Text>
                        <Text style={styles.insightTitle}>{insight.title}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.insightHeaderRight}>
                      <View style={styles.confidenceBadge}>
                        <Text style={styles.confidenceText}>{insight.confidence}%</Text>
                      </View>
                      <ArrowRight 
                        size={16} 
                        color={theme.colors.textMuted} 
                        weight="light"
                        style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <View style={styles.insightContent}>
                      <Text style={styles.insightDescription}>{insight.description}</Text>
                      
                      <View style={styles.insightMetrics}>
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>Impact</Text>
                          <Text style={[styles.metricValue, { color: getInsightTypeColor(insight.type) }]}>
                            {insight.impact}
                          </Text>
                        </View>
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>Confidence</Text>
                          <Text style={styles.metricValue}>{insight.confidence}%</Text>
                        </View>
                      </View>

                      <View style={styles.actionSection}>
                        <Text style={styles.actionLabel}>Recommended Action</Text>
                        <Text style={styles.actionText}>{insight.action}</Text>
                        
                        <TouchableOpacity
                          style={[
                            styles.applyButton,
                            { backgroundColor: getInsightTypeColor(insight.type) }
                          ]}
                          onPress={() => handleActionApply(insight)}
                          accessible={true}
                          accessibilityRole="button"
                          accessibilityLabel="Apply this recommendation"
                        >
                          <Text style={styles.applyButtonText}>Apply Recommendation</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Feedback Section */}
                      <View style={styles.feedbackSection}>
                        <Text style={styles.feedbackLabel}>Was this insight helpful?</Text>
                        <View style={styles.feedbackButtons}>
                          <TouchableOpacity
                            style={[
                              styles.feedbackButton,
                              { borderColor: theme.colors.goatGreen },
                              insightFeedback === 'helpful' && { backgroundColor: theme.colors.goatGreen + '20' }
                            ]}
                            onPress={() => handleFeedback(insight.id, 'helpful')}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Mark as helpful"
                          >
                            <ThumbsUp 
                              size={16} 
                              color={insightFeedback === 'helpful' ? theme.colors.goatGreen : theme.colors.textMuted} 
                              weight="light" 
                            />
                            <Text style={[
                              styles.feedbackButtonText,
                              { color: insightFeedback === 'helpful' ? theme.colors.goatGreen : theme.colors.textMuted }
                            ]}>
                              Helpful
                            </Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={[
                              styles.feedbackButton,
                              { borderColor: theme.colors.alertRed },
                              insightFeedback === 'not_helpful' && { backgroundColor: theme.colors.alertRed + '20' }
                            ]}
                            onPress={() => handleFeedback(insight.id, 'not_helpful')}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Mark as not helpful"
                          >
                            <ThumbsDown 
                              size={16} 
                              color={insightFeedback === 'not_helpful' ? theme.colors.alertRed : theme.colors.textMuted} 
                              weight="light" 
                            />
                            <Text style={[
                              styles.feedbackButtonText,
                              { color: insightFeedback === 'not_helpful' ? theme.colors.alertRed : theme.colors.textMuted }
                            ]}>
                              Not helpful
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
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
  headerSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.trustBlue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  headerDescription: {
    ...theme.typography.bodyLarge,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  insightsList: {
    gap: theme.spacing.md,
  },
  insightCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    overflow: 'hidden',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    minHeight: 64,
  },
  insightHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
  },
  insightHeaderText: {
    flex: 1,
  },
  insightType: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  insightTitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '600',
  },
  insightHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  confidenceBadge: {
    backgroundColor: theme.colors.goatGreen + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  confidenceText: {
    ...theme.typography.bodySmall,
    color: theme.colors.goatGreen,
    fontWeight: '600',
  },
  insightContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  insightDescription: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  insightMetrics: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  metricValue: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '600',
  },
  actionSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  actionText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: theme.spacing.md,
  },
  applyButton: {
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  applyButtonText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.background,
    fontWeight: '600',
  },
  feedbackSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingTop: theme.spacing.md,
  },
  feedbackLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    gap: theme.spacing.xs,
    flex: 1,
  },
  feedbackButtonText: {
    ...theme.typography.bodySmall,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});
