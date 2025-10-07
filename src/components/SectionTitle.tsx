import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface SectionTitleProps {
  title: string;
  rightButton?: {
    icon?: React.ReactNode;
    text?: string;
    onPress: () => void;
  };
  marginBottom?: number;
}

export default function SectionTitle({ 
  title, 
  rightButton, 
  marginBottom = 12 
}: SectionTitleProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.container, { marginBottom }]}>
      <Text style={styles.title}>{title}</Text>
      
      {rightButton && (
        <TouchableOpacity 
          style={styles.rightButton} 
          onPress={rightButton.onPress}
          activeOpacity={0.7}
        >
          {rightButton.icon}
          {rightButton.text && (
            <Text style={styles.rightButtonText}>{rightButton.text}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      fontWeight: '700', // Ensure bold weight for section titles
    },
    rightButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    rightButtonText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.trustBlue,
    },
  });
}
