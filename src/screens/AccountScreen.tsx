import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Screen</Text>
      <Text style={styles.subtitle}>Basic test version - No dependencies</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
});


