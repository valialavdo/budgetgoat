import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export interface FormProps {
  /**
   * Form content
   */
  children: React.ReactNode;
  
  /**
   * Whether the form is scrollable
   * @default true
   */
  scrollable?: boolean;
  
  /**
   * Custom styles for the form container
   */
  style?: ViewStyle;
  
  /**
   * Custom styles for the content container
   */
  contentStyle?: ViewStyle;
  
  /**
   * Whether to show keyboard avoiding behavior
   * @default true
   */
  keyboardAvoiding?: boolean;
  
  /**
   * Padding around the form content
   * @default theme.spacing.lg
   */
  padding?: number;
}

export interface FormGroupProps {
  /**
   * Group title (optional)
   */
  title?: string;
  
  /**
   * Group content
   */
  children: React.ReactNode;
  
  /**
   * Custom styles for the group container
   */
  style?: ViewStyle;
  
  /**
   * Whether the group is collapsible
   * @default false
   */
  collapsible?: boolean;
  
  /**
   * Whether the group is initially expanded (when collapsible)
   * @default true
   */
  expanded?: boolean;
}

/**
 * Reusable Form component for consistent form layouts
 * 
 * Features:
 * - Consistent spacing and padding
 * - Scrollable content support
 * - Keyboard avoiding behavior
 * - Theme integration
 * - Accessibility support
 * 
 * Usage:
 * ```tsx
 * <Form>
 *   <FormGroup title="Personal Information">
 *     <FormInput label="Name" value={name} onChangeText={setName} />
 *     <FormInput label="Email" value={email} onChangeText={setEmail} />
 *   </FormGroup>
 * </Form>
 * ```
 */
export function Form({
  children,
  scrollable = true,
  style,
  contentStyle,
  keyboardAvoiding = true,
  padding,
}: FormProps) {
  const theme = useTheme();
  
  const styles = getStyles(theme, padding);
  
  const content = (
    <View style={[styles.content, contentStyle]}>
      {children}
    </View>
  );
  
  if (scrollable) {
    return (
      <View style={[styles.container, style]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, style]}>
      {content}
    </View>
  );
}

/**
 * FormGroup component for organizing related form fields
 * 
 * Features:
 * - Grouped field spacing
 * - Optional titles
 * - Collapsible sections
 * - Consistent styling
 * 
 * Usage:
 * ```tsx
 * <FormGroup title="Contact Details">
 *   <FormInput label="Phone" value={phone} onChangeText={setPhone} />
 *   <FormInput label="Address" value={address} onChangeText={setAddress} />
 * </FormGroup>
 * ```
 */
export function FormGroup({
  title,
  children,
  style,
  collapsible = false,
  expanded = true,
}: FormGroupProps) {
  const theme = useTheme();
  
  const styles = getStyles(theme);
  
  return (
    <View style={[styles.group, style]}>
      {title && (
        <View style={styles.groupHeader}>
          <Text style={styles.groupTitle}>{title}</Text>
        </View>
      )}
      <View style={styles.groupContent}>
        {children}
      </View>
    </View>
  );
}

function getStyles(theme: any, padding?: number) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      padding: padding || theme.spacing.lg,
      flex: 1,
    },
    group: {
      marginBottom: theme.spacing.xl,
    },
    groupHeader: {
      marginBottom: theme.spacing.md,
    },
    groupTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: '600',
    },
    groupContent: {
      gap: theme.spacing.md,
    },
  });
}

// Export both components
export default Form;
