import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export interface DividerProps {
  /**
   * Whether to show the divider
   * @default true
   */
  visible?: boolean;
  
  /**
   * Vertical margin around the divider
   * @default 12
   */
  margin?: number;
  
  /**
   * Horizontal margin (padding) from screen edges
   * @default 0
   */
  horizontalMargin?: number;
  
  /**
   * Custom styles for the divider container
   */
  style?: any;
}

/**
 * Reusable Divider component with consistent dashed styling
 * 
 * Features:
 * - Consistent dashed line appearance
 * - Configurable margins
 * - Theme-aware colors
 * - Optional visibility
 * - Accessibility support
 * 
 * Usage:
 * ```tsx
 * <Divider />
 * <Divider margin={16} horizontalMargin={20} />
 * <Divider visible={false} />
 * ```
 */
export default function Divider({
  visible = true,
  margin = 12,
  horizontalMargin = 0,
  style,
}: DividerProps) {
  const theme = useTheme();
  
  if (!visible) {
    return null;
  }

  const styles = getStyles(theme, margin, horizontalMargin);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.dashedLine}>
        {Array.from({ length: 20 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dash,
              { marginRight: index < 19 ? 4 : 0 }
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function getStyles(theme: any, margin: number, horizontalMargin: number) {
  return StyleSheet.create({
    container: {
      marginVertical: margin,
      marginHorizontal: horizontalMargin,
    },
    dashedLine: {
      height: 1,
      backgroundColor: theme.colors.borderLight,
      flexDirection: 'row',
      alignItems: 'center',
    },
    dash: {
      width: 4,
      height: 1,
      backgroundColor: theme.colors.borderLight,
    },
  });
}
