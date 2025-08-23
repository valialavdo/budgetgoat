import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Shadows } from '../theme';

export default function OnboardingScreen({ onDone }: { onDone: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.h1}>BudgetGOAT</Text>
        <Text style={styles.h2}>GOAT Ahead: Turn Everyday Budgets Into Epic Wins</Text>
        <Text style={styles.body}>Plan income, split into Pockets, and track expenses. No bank links, no fuss. Offline-first with smart tips.</Text>
        <TouchableOpacity style={styles.cta} onPress={onDone}><Text style={styles.ctaText}>Get Started</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.lg, justifyContent: 'center' },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.lg, ...Shadows.card },
  h1: { fontSize: 32, fontWeight: '700', marginBottom: Spacing.sm, color: Colors.text },
  h2: { fontSize: 18, fontWeight: '500', marginBottom: Spacing.md, color: Colors.text },
  body: { color: Colors.textMuted, marginBottom: Spacing.lg },
  cta: { backgroundColor: Colors.goatGreen, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '700' },
});


