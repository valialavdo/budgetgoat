import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import type { IconProps } from 'phosphor-react-native';

/**
 * LabelPill Component
 * 
 * Usage examples:
 * 
 * // With icon
 * <LabelPill
 *   icon={<Wallet />}
 *   text="Standard"
 *   backgroundColor={theme.colors.standardPocket}
 *   textColor={theme.colors.background}
 * />
 * 
 * // With number (for transaction counts, etc.)
 * <LabelPill
 *   number={5}
 *   text="transactions"
 *   backgroundColor={theme.colors.numericLabel}
 *   textColor={theme.colors.background}
 * />
 */

export interface LabelPillProps {
  icon?: React.ReactElement<IconProps>;
  number?: number;
  text: string;
  backgroundColor: string;
  textColor: string;
  onPress?: () => void;
}

export default function LabelPill({ 
  icon, 
  number,
  text, 
  backgroundColor, 
  textColor,
  onPress
}: LabelPillProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  
  const content = (
    <View style={[
      styles.container,
      { backgroundColor }
    ]}>
      {number !== undefined ? (
        <Text style={[
          styles.number,
          { color: textColor }
        ]}>
          {number}
        </Text>
      ) : icon ? (
        <View style={styles.iconContainer}>
          {React.cloneElement(icon, { color: textColor })}
        </View>
      ) : null}
      <Text style={[
        styles.text,
        { color: textColor }
      ]}>
        {text}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

function getStyles(theme: any) {
  return StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    alignSelf: 'flex-start',
    paddingHorizontal: 8, // 8px background frame padding
    paddingVertical: 6, // 6px background frame padding
    gap: 6, // 6px between icon and text
    flexShrink: 0, // Prevent shrinking
  },
  text: {
    ...theme.typography.bodySmall,
  },
  number: {
    ...theme.typography.bodySmall,
  },
  iconContainer: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  });
}
