import { AccessibilityHelper } from '../utils/accessibility';
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
      activeOpacity={0.8}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={AccessibilityHelper.getQuickActionLabel({ title })}
      accessibilityHint={AccessibilityHelper.getQuickActionHint({ title })}
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
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      paddingVertical: 20,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 6,
      // Subtle shadow for microinteraction effect
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    iconContainer: {
      marginBottom: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 14,
      color: '#1F2937',
      textAlign: 'center',
      fontWeight: '600',
      lineHeight: 20,
    },
  });
}
