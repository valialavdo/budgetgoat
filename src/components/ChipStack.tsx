import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import ChipTag from './ChipTag';

export interface ChipData {
  id: string;
  text: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
}

export interface ChipStackProps {
  /**
   * Array of chip data to display
   */
  chips: ChipData[];
  
  /**
   * Maximum number of chips to display before showing "more" indicator
   * @default undefined (show all)
   */
  maxChips?: number;
  
  /**
   * Size of all chips
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Whether chips are selectable
   * @default false
   */
  selectable?: boolean;
  
  /**
   * Array of selected chip IDs (when selectable is true)
   */
  selectedIds?: string[];
  
  /**
   * Callback when a chip is pressed (when selectable is true)
   */
  onChipPress?: (chipId: string) => void;
  
  /**
   * Custom styles for the container
   */
  style?: ViewStyle;
  
  /**
   * Spacing between chips
   * @default theme.spacing.xs
   */
  spacing?: number;
}

/**
 * Reusable ChipStack component for displaying multiple chips in a row
 * 
 * Features:
 * - Automatic wrapping and spacing
 * - Optional selection state
 * - Configurable max chips display
 * - Consistent with design system
 * - Accessibility support
 * 
 * Usage:
 * ```tsx
 * <ChipStack
 *   chips={[
 *     { id: '1', text: 'Groceries', backgroundColor: '#FF4D4F' },
 *     { id: '2', text: 'Transport', backgroundColor: '#1890FF' },
 *   ]}
 *   selectable={true}
 *   selectedIds={['1']}
 *   onChipPress={(id) => console.log('Selected:', id)}
 * />
 * ```
 */
export default function ChipStack({
  chips,
  maxChips,
  size = 'medium',
  selectable = false,
  selectedIds = [],
  onChipPress,
  style,
  spacing,
}: ChipStackProps) {
  const theme = useTheme();
  
  const displayChips = maxChips ? chips.slice(0, maxChips) : chips;
  const remainingCount = maxChips && chips.length > maxChips ? chips.length - maxChips : 0;
  
  const styles = getStyles(theme, spacing);
  
  return (
    <View style={[styles.container, style]}>
      {displayChips.map((chip, index) => {
        const isSelected = selectedIds.includes(chip.id);
        
        return (
          <View key={chip.id} style={styles.chipWrapper}>
            <ChipTag
              text={chip.text}
              backgroundColor={chip.backgroundColor}
              textColor={chip.textColor}
              icon={chip.icon}
              size={size}
              style={selectable ? {
                opacity: isSelected ? 1 : 0.6,
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? theme.colors.trustBlue : 'transparent',
              } : undefined}
              accessibilityLabel={`${chip.text}${isSelected ? ', selected' : ''}`}
              accessibilityHint={selectable ? 'Tap to toggle selection' : undefined}
            />
          </View>
        );
      })}
      
      {remainingCount > 0 && (
        <View style={styles.chipWrapper}>
          <ChipTag
            text={`+${remainingCount}`}
            backgroundColor={theme.colors.surface}
            textColor={theme.colors.textMuted}
            size={size}
            accessibilityLabel={`${remainingCount} more items`}
          />
        </View>
      )}
    </View>
  );
}

function getStyles(theme: any, spacing?: number) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    chipWrapper: {
      marginRight: spacing || theme.spacing.xs,
      marginBottom: spacing || theme.spacing.xs,
    },
  });
}
