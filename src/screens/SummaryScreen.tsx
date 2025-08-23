import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { BudgetContext } from '../context/BudgetContext';

export default function SummaryScreen() {
  const { state, computeTotals } = useContext(BudgetContext);
  const months = useMemo(() => Object.keys(state.budgetsByMonth).sort(), [state.budgetsByMonth]);
  const remaining = months.map(m => computeTotals(m).remaining);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Yearly Overview</Text>
      <LineChart
        data={{ labels: months.map(m => m.slice(5)), datasets: [{ data: remaining }] }}
        width={Dimensions.get('window').width - 32}
        height={220}
        yAxisSuffix="€"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          labelColor: () => '#0f172a',
        }}
        bezier
        style={{ borderRadius: 12 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
});


