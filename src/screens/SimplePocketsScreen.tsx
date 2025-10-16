import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useBudget } from '../context/SafeBudgetContext';
import { Plus } from 'phosphor-react-native';

export default function SimplePocketsScreen() {
  const theme = useTheme();
  const { pockets, pocketsLoading, createPocket } = useBudget();

  const handleCreatePocket = async () => {
    try {
      await createPocket({
        name: 'New Pocket',
        description: 'A new pocket for your budget',
        amount: 0,
        currentBalance: 0,
        targetAmount: 1000,
        category: 'General',
        color: '#3498db',
        icon: '💰',
        isActive: true,
      });
    } catch (error) {
      console.error('Failed to create pocket:', error);
    }
  };

  const colors = {
    background: theme.isDark ? '#000000' : '#ffffff',
    surface: theme.isDark ? '#1a1a1a' : '#f8f9fa',
    text: theme.isDark ? '#ffffff' : '#000000',
    textMuted: theme.isDark ? '#9ca3af' : '#6b7280',
    trustBlue: '#0052CC',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Your Pockets</Text>
        
        {pocketsLoading ? (
          <Text style={[styles.loading, { color: colors.textMuted }]}>Loading pockets...</Text>
        ) : pockets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No pockets yet. Create your first pocket to start budgeting!
            </Text>
          </View>
        ) : (
          <View style={styles.pocketsList}>
            {pockets.map((pocket) => (
              <View key={pocket.id} style={[styles.pocketCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.pocketName, { color: colors.text }]}>{pocket.name}</Text>
                <Text style={[styles.pocketBalance, { color: colors.trustBlue }]}>
                  ${pocket.currentBalance.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.trustBlue }]}
          onPress={handleCreatePocket}
        >
          <Plus size={24} color="white" />
          <Text style={styles.addButtonText}>Add Pocket</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loading: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  pocketsList: {
    marginTop: 20,
  },
  pocketCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pocketName: {
    fontSize: 18,
    fontWeight: '600',
  },
  pocketBalance: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
