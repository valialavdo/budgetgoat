import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme';

export default function MagicWandIllustration() {
  return (
    <View style={styles.container}>
      {/* Magic wand handle */}
      <View style={styles.wandHandle} />
      
      {/* Magic wand tip */}
      <View style={styles.wandTip} />
      
      {/* Magic sparkles */}
      <View style={styles.sparkle1} />
      <View style={styles.sparkle2} />
      <View style={styles.sparkle3} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  wandHandle: {
    width: 4,
    height: 40,
    backgroundColor: '#8B5CF6', // Purple
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  wandTip: {
    width: 12,
    height: 12,
    backgroundColor: '#F59E0B', // Amber
    borderRadius: 6,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  sparkle1: {
    width: 6,
    height: 6,
    backgroundColor: '#06B6D4', // Cyan
    borderRadius: 3,
    position: 'absolute',
    top: 12,
    left: 8,
  },
  sparkle2: {
    width: 4,
    height: 4,
    backgroundColor: '#10B981', // Green
    borderRadius: 2,
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  sparkle3: {
    width: 5,
    height: 5,
    backgroundColor: '#EF4444', // Red
    borderRadius: 2.5,
    position: 'absolute',
    bottom: 8,
    left: 12,
  },
});
