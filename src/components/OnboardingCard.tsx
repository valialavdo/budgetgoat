import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface OnboardingCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: React.ReactNode;
  children?: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Reusable OnboardingCard component
 * 
 * Features:
 * - Large header message with customizable title and subtitle
 * - Optional description text
 * - Custom image/content area
 * - Optional children for buttons or additional content
 * - Full theming support
 * - Accessibility compliance
 * 
 * Usage:
 * ```tsx
 * <OnboardingCard
 *   title="Get things done with smarter budgeting"
 *   subtitle="Your finances, organized and optimized"
 *   description="BudgetGOAT helps you track expenses, set goals, and make informed financial decisions."
 *   image={<CustomImageComponent />}
 * >
 *   <CustomButtonGroup />
 * </OnboardingCard>
 * ```
 */
export default function OnboardingCard({
  title,
  subtitle,
  description,
  image,
  children,
  style,
}: OnboardingCardProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.container, style]} accessible={true} accessibilityRole="none">
      {/* Header Section */}
      <View style={styles.header}>
        <Text 
          style={styles.title}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel={title}
        >
          {title}
        </Text>
        
        {subtitle && (
          <Text 
            style={styles.subtitle}
            accessible={true}
            accessibilityLabel={subtitle}
          >
            {subtitle}
          </Text>
        )}
        
        {description && (
          <Text 
            style={styles.description}
            accessible={true}
            accessibilityLabel={description}
          >
            {description}
          </Text>
        )}
      </View>

      {/* Image/Content Section */}
      {image && (
        <View 
          style={styles.imageContainer}
          accessible={true}
          accessibilityRole="image"
        >
          {image}
        </View>
      )}

      {/* Children Section (Buttons, etc.) */}
      {children && (
        <View 
          style={styles.childrenContainer}
          accessible={true}
        >
          {children}
        </View>
      )}
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.screenPadding,
      paddingVertical: theme.spacing.xl,
      paddingTop: theme.spacing.xxl, // Extra top padding for better spacing
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      maxWidth: '90%',
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
      fontWeight: '700',
      lineHeight: 40,
    },
    subtitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
      fontWeight: '600',
      opacity: 0.9,
    },
    description: {
      ...theme.typography.bodyLarge,
      color: theme.colors.textMuted,
      textAlign: 'center',
      opacity: 0.8,
      lineHeight: 24,
      maxWidth: '85%',
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      minHeight: 200,
      width: '100%',
    },
    childrenContainer: {
      width: '100%',
      alignItems: 'center',
    },
  });
}
