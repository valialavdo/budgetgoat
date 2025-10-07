import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Checks } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';

interface SelectionOptionProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  selected: boolean;
  onPress: () => void;
  style?: any;
}

export default function SelectionOption({
  title,
  subtitle,
  icon,
  selected,
  onPress,
  style,
}: SelectionOptionProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selectedContainer, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}${subtitle ? `, ${subtitle}` : ''}`}
      accessibilityState={{ selected }}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        {React.cloneElement(icon as React.ReactElement, {
          size: 24,
          color: theme.colors.trustBlue,
          weight: 'light'
        } as any)}
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, selected && styles.selectedTitle]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>

          {/* Checkmark */}
          {selected && (
            <Checks size={28} weight="light" color={theme.colors.trustBlue} />
          )}
    </TouchableOpacity>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderLeftWidth: 4,
      borderLeftColor: 'transparent',
      minHeight: 64,
    },
    selectedContainer: {
      backgroundColor: theme.colors.surface,
      borderLeftColor: theme.colors.trustBlue,
    },
    iconContainer: {
      marginRight: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    selectedTitle: {
      color: theme.colors.trustBlue,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textMuted,
      fontWeight: '400',
    },
  });
}
