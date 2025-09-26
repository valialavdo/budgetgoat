import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';
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

const styles = StyleSheet.create({
  container: {
    marginRight: 12, // Spacing between cards
  },
  firstContainer: {
    marginLeft: Spacing.screenPadding, // Only first card starts at screen edge (aligned with title)
    marginRight: 12, // Spacing between cards
  },
  card: {
    width: 340,
    backgroundColor: '#F5F5F5',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    position: 'relative',
  },
  dismissButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  content: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  illustrationContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
