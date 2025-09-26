import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import MicroInteractionWrapper from './MicroInteractionWrapper';
import ChipTag from './ChipTag';

export interface ListItemProps {
  /**
   * Main title text
   */
  title: string;
  
  /**
   * Subtitle text (optional)
   */
  subtitle?: string;
  
  /**
   * Left icon or content
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Right icon or content
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Whether the item is pressable
   * @default false
   */
  pressable?: boolean;
  
  /**
   * Callback when item is pressed (when pressable is true)
   */
  onPress?: () => void;
  
  /**
   * Whether the item is selected
   * @default false
   */
  selected?: boolean;
  
  /**
   * Array of chips to display below the content
   */
  chips?: Array<{
    id: string;
    text: string;
    backgroundColor?: string;
    textColor?: string;
  }>;
  
  /**
   * Custom styles for the container
   */
  style?: ViewStyle;
  
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
  
  /**
   * Accessibility hint for screen readers
   */
  accessibilityHint?: string;
  
  /**
   * Whether to show a divider line
   * @default false
   */
  showDivider?: boolean;
}

/**
 * Reusable ListItem component for consistent list item layouts
 * 
 * Features:
 * - Consistent spacing and typography
 * - Left and right icon support
 * - Chip display support
 * - Selection state
 * - Pressable with microinteractions
 * - Accessibility support
 * 
 * Usage:
 * ```tsx
 * <ListItem
 *   title="Transaction Title"
 *   subtitle="Transaction details"
 *   leftIcon={<Icon />}
 *   rightIcon={<ChevronRight />}
 *   pressable
 *   onPress={handlePress}
 *   chips={[{ id: '1', text: 'Expense', backgroundColor: '#FF4D4F' }]}
 * />
 * ```
 */
export default function ListItem({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  pressable = false,
  onPress,
  selected = false,
  chips,
  style,
  accessibilityLabel,
  accessibilityHint,
  showDivider = false,
}: ListItemProps) {
  const theme = useTheme();
  
  const styles = getStyles(theme, selected, showDivider);
  
  const content = (
    <View style={[styles.container, style]}>
      {leftIcon && (
        <View style={styles.leftIcon}>
          {leftIcon}
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
        
        {chips && chips.length > 0 && (
          <View style={styles.chipsContainer}>
            {chips.slice(0, 3).map((chip) => (
              <ChipTag
                key={chip.id}
                text={chip.text}
                backgroundColor={chip.backgroundColor}
                textColor={chip.textColor}
                size="small"
              />
            ))}
            {chips.length > 3 && (
              <ChipTag
                text={`+${chips.length - 3}`}
                backgroundColor={theme.colors.surface}
                textColor={theme.colors.textMuted}
                size="small"
              />
            )}
          </View>
        )}
      </View>
      
      {rightIcon && (
        <View style={styles.rightIcon}>
          {rightIcon}
        </View>
      )}
      
      {showDivider && <View style={styles.divider} />}
    </View>
  );
  
  if (pressable && onPress) {
    return (
      <MicroInteractionWrapper
        onPress={onPress}
        hapticType="light"
        animationType="scale"
        pressScale={0.98}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
      >
        {content}
      </MicroInteractionWrapper>
    );
  }
  
  return content;
}

function getStyles(theme: any, selected: boolean, showDivider: boolean) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: selected ? theme.colors.trustBlue + '10' : 'transparent',
      borderLeftWidth: selected ? 3 : 0,
      borderLeftColor: selected ? theme.colors.trustBlue : 'transparent',
    },
    leftIcon: {
      marginRight: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    title: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
      fontWeight: '500',
      marginBottom: 2,
    },
    subtitle: {
      ...theme.typography.bodyMedium,
      color: theme.colors.textMuted,
      lineHeight: 18,
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.xs,
      gap: theme.spacing.xs,
    },
    rightIcon: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    divider: {
      position: 'absolute',
      bottom: 0,
      left: theme.spacing.lg,
      right: theme.spacing.lg,
      height: 1,
      backgroundColor: theme.colors.border,
    },
  });
}
