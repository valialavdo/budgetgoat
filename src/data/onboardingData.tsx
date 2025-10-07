import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wallet, Target, ChartLineUp, Shield, User, Calendar, CheckCircle } from 'phosphor-react-native';

export interface OnboardingStep {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: React.ReactNode;
  showAuthButtons?: boolean;
}

/**
 * Onboarding data configuration
 * 
 * Features:
 * - Centralized content management
 * - Easy to customize and scale
 * - Reusable across different onboarding flows
 * - Themed components
 * 
 * Usage:
 * ```tsx
 * import { getOnboardingSteps } from '../data/onboardingData';
 * const steps = getOnboardingSteps();
 * ```
 */

// Feature Card Component for Step 2
const FeatureCard = ({ icon: Icon, title, description, color, theme }: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  theme: any;
}) => {
  const styles = getStyles(theme);

  return (
    <View style={styles.featureCard}>
      <View style={[styles.featureIcon, { backgroundColor: color }]}>
        <Icon size={24} color={theme.colors.background} weight="light" />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
};

// Task Card Component for Step 1
const TaskCard = ({ title, status, assigned, theme }: {
  title: string;
  status: 'completed' | 'pending';
  assigned?: string;
  theme: any;
}) => {
  const styles = getStyles(theme);

  return (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{title}</Text>
        {assigned && (
          <View style={styles.assignedContainer}>
            <User size={16} color={theme.colors.trustBlue} weight="light" />
            <Text style={styles.assignedText}>{assigned}</Text>
          </View>
        )}
      </View>
      <View style={styles.taskStatus}>
        <CheckCircle 
          size={20} 
          color={status === 'completed' ? theme.colors.goatGreen : theme.colors.textMuted} 
          weight={status === 'completed' ? 'fill' : 'light'} 
        />
        <Text style={[
          styles.statusText,
          { color: status === 'completed' ? theme.colors.goatGreen : theme.colors.textMuted }
        ]}>
          {status === 'completed' ? 'Completed' : 'Pending'}
        </Text>
      </View>
    </View>
  );
};

export const getOnboardingSteps = (theme: any): OnboardingStep[] => {
  const styles = getStyles(theme);

  return [
    {
      id: 'welcome',
      title: 'Welcome to BudgetGOAT',
      subtitle: 'Smart budget planning at the speed of thought',
      description: 'Take control of your finances with our intuitive budgeting app designed to help you achieve your financial goals.',
      image: (
        <View style={styles.heroImageContainer}>
          <View style={styles.heroImagePlaceholder}>
            <Wallet size={80} color={theme.colors.background} weight="light" />
          </View>
        </View>
      ),
    },
    {
      id: 'features',
      title: 'Get things done with smarter budgeting',
      subtitle: 'Your finances, organized and optimized',
      description: 'BudgetGOAT helps you track expenses, set goals, and make informed financial decisions.',
      image: (
        <View style={styles.featuresContainer}>
          <FeatureCard
            icon={Wallet}
            title="Smart Pockets"
            description="Organize your money into dedicated pockets for different goals"
            color={theme.colors.trustBlue}
            theme={theme}
          />
          <FeatureCard
            icon={Target}
            title="Goal Tracking"
            description="Set and track your financial goals with visual progress"
            color={theme.colors.goatGreen}
            theme={theme}
          />
          <FeatureCard
            icon={ChartLineUp}
            title="AI Insights"
            description="Get personalized recommendations to optimize your spending"
            color={theme.colors.warningOrange}
            theme={theme}
          />
          <FeatureCard
            icon={Shield}
            title="Secure & Private"
            description="Your financial data is encrypted and never shared"
            color={theme.colors.alertRed}
            theme={theme}
          />
        </View>
      ),
    },
    {
      id: 'tasks',
      title: 'Create tasks at the speed of thought',
      subtitle: 'Organize your financial life with smart automation',
      description: 'From daily expenses to long-term goals, BudgetGOAT helps you stay on top of your financial tasks.',
      image: (
        <View style={styles.tasksContainer}>
          <View style={styles.taskStack}>
            <TaskCard title="Daily design check-in" status="pending" assigned="@Ad" theme={theme} />
            <TaskCard title="Publish the design system" status="completed" theme={theme} />
            <TaskCard title="Prepare branding assets" status="pending" theme={theme} />
          </View>
        </View>
      ),
    },
    {
      id: 'get-started',
      title: "Let's get started",
      subtitle: 'Sign in to take control of your finances',
      description: 'Your budget, goals, and insights all in one secure place.',
      image: (
        <View style={styles.getStartedImage}>
          <View style={styles.getStartedPlaceholder}>
            <Calendar size={60} color={theme.colors.trustBlue} weight="light" />
          </View>
        </View>
      ),
      showAuthButtons: true,
    },
  ];
};

function getStyles(theme: any) {
  return StyleSheet.create({
    heroImageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroImagePlaceholder: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: theme.colors.background,
      borderWidth: 4,
      borderColor: theme.colors.trustBlue,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    featuresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    featureCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      width: '45%',
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    featureIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    featureTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
      fontWeight: '600',
    },
    featureDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textMuted,
      textAlign: 'center',
      lineHeight: 18,
    },
    tasksContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    taskStack: {
      width: '100%',
      maxWidth: 300,
    },
    taskCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    taskHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    taskTitle: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      fontWeight: '500',
      flex: 1,
    },
    assignedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    assignedText: {
      ...theme.typography.bodySmall,
      color: theme.colors.trustBlue,
      fontWeight: '500',
    },
    taskStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    statusText: {
      ...theme.typography.bodySmall,
      fontWeight: '500',
    },
    getStartedImage: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    getStartedPlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  });
}
