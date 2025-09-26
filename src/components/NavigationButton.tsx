import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CaretRight } from 'phosphor-react-native';
import { useTheme } from '../context/ThemeContext';

interface NavigationButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  onPress?: () => void;
  iconColor?: string;
  showArrow?: boolean;
}

export default function NavigationButton({
  icon,
  label,
  onPress,
  iconColor,
  showArrow = true,
}: NavigationButtonProps) {
  const theme = useTheme();
  const LeftIcon = icon;
  const styles = getStyles(theme);
  const defaultIconColor = iconColor || theme.colors.trustBlue;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.leftContent}>
        <LeftIcon size={24} color={defaultIconColor} weight="light" />
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      {showArrow && (
        <View style={styles.rightIcon}>
          <CaretRight size={24} color={theme.colors.trustBlue} weight="light" />
        </View>
      )}
    </TouchableOpacity>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 56,
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: theme.spacing.md,
    },
    label: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      flex: 1,
    },
    rightIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}


