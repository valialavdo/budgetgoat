import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../theme';

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  title: {
    ...Typography.h4,
    color: Colors.text,
  },
  rightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  rightButtonText: {
    ...Typography.bodyMedium,
    color: Colors.trustBlue,
  },
});
