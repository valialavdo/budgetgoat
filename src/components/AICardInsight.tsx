import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { X } from 'phosphor-react-native';

interface AICardInsightProps {
  id: string;
  title: string;
  description: string;
  illustration?: React.ReactNode;
  onDismiss: (id: string) => void;
  onPress?: () => void;
  isFirst?: boolean;
}

export default function AICardInsight({ 
  id,
  title, 
  description,
  illustration,
  onDismiss,
  onPress,
  isFirst = false
}: AICardInsightProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={isFirst ? styles.firstContainer : styles.container}>
      <TouchableOpacity 
        style={styles.card}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={() => onDismiss(id)}
          activeOpacity={0.7}
        >
          <X weight="light" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <View style={styles.textContent}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          
          {illustration && (
            <View style={styles.illustrationContainer}>
              {illustration}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      marginRight: 12, // Spacing between cards
    },
    firstContainer: {
      marginLeft: theme.spacing.screenPadding, // Only first card starts at screen edge (aligned with title)
      marginRight: 12, // Spacing between cards
    },
    card: {
      width: 340,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      position: 'relative',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    dismissButton: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    content: {
      marginTop: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textContent: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    title: {
      ...theme.typography.bodyMedium,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    description: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },
    illustrationContainer: {
      width: 80,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}
