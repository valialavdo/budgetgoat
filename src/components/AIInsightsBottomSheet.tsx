import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Lightbulb, TrendUp, Target, Info, Plus, Minus, ThumbsUp, ThumbsDown } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MicroInteractionWrapper from '../components/MicroInteractionWrapper';
import BaseBottomSheet from './BaseBottomSheet';

interface AIInsightsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  insights?: Array<{
    id: string;
    title: string;
    description: string;
    type: 'tip' | 'alert' | 'achievement' | 'suggestion';
    confidence: number;
  }>;
}

export default function AIInsightsBottomSheet({ 
  visible, 
  onClose, 
  insights = [] 
}: AIInsightsBottomSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);

  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  // Mock insights if none provided
  const defaultInsights = [
    {
      id: '1',
      title: 'Spending Pattern Alert',
      description: 'You spent 15% more on dining out this month compared to last month. Consider cooking at home more often to save money.',
      type: 'alert' as const,
      confidence: 85
    },
    {
      id: '2',
      title: 'Savings Opportunity',
      description: 'Your emergency fund is growing well! Consider increasing your monthly savings goal by 20% to reach your target faster.',
      type: 'suggestion' as const,
      confidence: 92
    },
    {
      id: '3',
      title: 'Budget Achievement',
      description: 'Great job! You stayed within your grocery budget this month. This is the third month in a row.',
      type: 'achievement' as const,
      confidence: 100
    },
    {
      id: '4',
      title: 'Smart Tip',
      description: 'Based on your spending patterns, setting up automatic transfers to your vacation fund could help you save €200 more per month.',
      type: 'tip' as const,
      confidence: 78
    }
  ];

  const displayInsights = insights.length > 0 ? insights : defaultInsights;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <TrendUp size={24} color={theme.colors.alertRed} weight="light" />;
      case 'achievement':
        return <Target size={24} color={theme.colors.goatGreen} weight="light" />;
      case 'suggestion':
        return <Lightbulb size={24} color={theme.colors.warningOrange} weight="light" />;
      case 'tip':
        return <Info size={24} color={theme.colors.trustBlue} weight="light" />;
      default:
        return <Lightbulb size={24} color={theme.colors.trustBlue} weight="light" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'alert':
        return theme.colors.alertRed;
      case 'achievement':
        return theme.colors.goatGreen;
      case 'suggestion':
        return theme.colors.warningOrange;
      case 'tip':
        return theme.colors.trustBlue;
      default:
        return theme.colors.trustBlue;
    }
  };

  const handleInsightPress = (insightId: string) => {
    setSelectedInsight(selectedInsight === insightId ? null : insightId);
  };

  const handleFeedback = (insightId: string, helpful: boolean) => {
    // In a real app, this would send feedback to the AI system
    console.log(`Insight ${insightId} feedback: ${helpful ? 'helpful' : 'not helpful'}`);
    Alert.alert(
      'Thank you!', 
      `Your feedback has been recorded and will help improve future insights.`
    );
  };

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={onClose}
      title="AI Insights"
    >
      <View style={styles.introSection}>
        <Text style={[styles.introTitle, { color: theme.colors.text }]}>
          Your Personalized Financial Insights
        </Text>
        <Text style={[styles.introDescription, { color: theme.colors.textMuted }]}>
          Our AI analyzes your spending patterns and provides actionable insights to help you make better financial decisions.
        </Text>
      </View>

      <View style={styles.insightsSection}>
        {displayInsights.map((insight) => {
          const isExpanded = selectedInsight === insight.id;
          const insightColor = getInsightColor(insight.type);
          
          return (
            <View key={insight.id} style={styles.insightContainer}>
              <MicroInteractionWrapper
                onPress={() => handleInsightPress(insight.id)}
                hapticType="light"
                animationType="scale"
                pressScale={0.98}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${insight.title} insight`}
                accessibilityHint="Tap to expand or collapse insight details"
              >
                <View style={[
                  styles.insightCard,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderLight }
                ]}>
                  <View style={styles.insightHeader}>
                    <View style={[styles.insightIconContainer, { backgroundColor: insightColor + '15' }]}>
                      {getInsightIcon(insight.type)}
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={[styles.insightTitle, { color: theme.colors.text }]}>
                        {insight.title}
                      </Text>
                      <View style={styles.insightMeta}>
                        <Text style={[styles.insightType, { color: theme.colors.textMuted }]}>
                          {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                        </Text>
                        <Text style={[styles.insightConfidence, { color: theme.colors.textMuted }]}>
                          {insight.confidence}% confidence
                        </Text>
                      </View>
                    </View>
                    {isExpanded ? (
                      <Minus size={24} color={theme.colors.textMuted} weight="light" />
                    ) : (
                      <Plus size={24} color={theme.colors.textMuted} weight="light" />
                    )}
                  </View>
                  
                  {isExpanded && (
                    <View style={styles.insightDetails}>
                      <Text style={[styles.insightDescription, { color: theme.colors.text }]}>
                        {insight.description}
                      </Text>
                      
                      <View style={styles.feedbackSection}>
                        <Text style={[styles.feedbackLabel, { color: theme.colors.textMuted }]}>
                          Was this insight helpful?
                        </Text>
                        <View style={styles.feedbackButtons}>
                          <MicroInteractionWrapper
                            onPress={() => handleFeedback(insight.id, true)}
                            hapticType="light"
                            animationType="scale"
                            pressScale={0.95}
                            style={StyleSheet.flatten([styles.feedbackButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.goatGreen }])}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Mark as helpful"
                          >
                            <ThumbsUp size={24} color={theme.colors.goatGreen} weight="light" />
                            <Text style={[styles.feedbackButtonText, { color: theme.colors.goatGreen }]}>
                              Helpful
                            </Text>
                          </MicroInteractionWrapper>
                          
                          <MicroInteractionWrapper
                            onPress={() => handleFeedback(insight.id, false)}
                            hapticType="light"
                            animationType="scale"
                            pressScale={0.95}
                            style={StyleSheet.flatten([styles.feedbackButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.alertRed }])}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Mark as not helpful"
                          >
                            <ThumbsDown size={24} color={theme.colors.alertRed} weight="light" />
                            <Text style={[styles.feedbackButtonText, { color: theme.colors.alertRed }]}>
                              Not helpful
                            </Text>
                          </MicroInteractionWrapper>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </MicroInteractionWrapper>
            </View>
          );
        })}
      </View>

      <View style={styles.disclaimerSection}>
        <Text style={[styles.disclaimerText, { color: theme.colors.textMuted }]}>
          AI insights are based on your transaction patterns and are for informational purposes only. 
          Always consult with a financial advisor for major financial decisions.
        </Text>
      </View>
    </BaseBottomSheet>
  );
}

function getStyles(theme: any, insets: any) {
  return StyleSheet.create({
    introSection: {
      marginBottom: theme.spacing.xl,
      alignItems: 'center',
    },
    introTitle: {
      ...theme.typography.h4,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    introDescription: {
      ...theme.typography.bodyMedium,
      textAlign: 'center',
      lineHeight: 20,
    },
    insightsSection: {
      marginBottom: theme.spacing.xl,
    },
    insightContainer: {
      marginBottom: theme.spacing.md,
    },
    insightCard: {
      borderRadius: theme.radius.md,
      borderWidth: 1,
      overflow: 'hidden',
    },
    insightHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    insightIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    insightContent: {
      flex: 1,
    },
    insightTitle: {
      ...theme.typography.bodyLarge,
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
    },
    insightMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    insightType: {
      ...theme.typography.bodySmall,
      fontWeight: '600',
    },
    insightConfidence: {
      ...theme.typography.bodySmall,
    },
    insightDetails: {
      paddingHorizontal: theme.spacing.screenPadding,
      paddingBottom: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
    },
    insightDescription: {
      ...theme.typography.bodyMedium,
      lineHeight: 20,
      marginBottom: theme.spacing.md,
    },
    feedbackSection: {
      alignItems: 'center',
    },
    feedbackLabel: {
      ...theme.typography.bodySmall,
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
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      gap: theme.spacing.xs,
    },
    feedbackButtonText: {
      ...theme.typography.bodySmall,
      fontWeight: '500',
    },
    disclaimerSection: {
      paddingTop: theme.spacing.lg,
      paddingBottom: Math.max(insets.bottom + theme.spacing.lg, theme.spacing.xl),
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
    },
    disclaimerText: {
      ...theme.typography.bodySmall,
      textAlign: 'center',
      lineHeight: 16,
      fontStyle: 'italic',
    },
  });
}
