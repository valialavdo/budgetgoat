import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}

export default function QuickActionButton({ 
  icon, 
  title, 
  onPress 
}: QuickActionButtonProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.7}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={`Tap to ${title.toLowerCase()}`}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    iconContainer: {
      marginBottom: theme.spacing.xs,
    },
    title: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      textAlign: 'center',
      fontWeight: '500',
    },
  });
}
