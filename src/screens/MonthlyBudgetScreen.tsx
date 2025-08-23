import React, { useContext, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Switch } from 'react-native';
import { BudgetContext } from '../context/BudgetContext';
import { MonthKey } from '../types';
import { getCurrentMonthKey } from '../utils/date';

export default function MonthlyBudgetScreen() {
  const { state, updateCategoryAmount, computeTotals, ensureMonth } = useContext(BudgetContext);
  const [month, setMonth] = useState<MonthKey>(state.lastOpenedMonth || getCurrentMonthKey());
  const [propagate, setPropagate] = useState<boolean>(false);

  ensureMonth(month);

  const budget = state.budgetsByMonth[month];
  const totals = computeTotals(month);
  const categories = state.categories;
  const overridesById = Object.fromEntries((budget?.overrides || []).map(o => [o.categoryId, o]));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Month: {month}</Text>
      <View style={styles.row}>
        <Text style={{ marginRight: 8 }}>Apply to future months</Text>
        <Switch value={propagate} onValueChange={setPropagate} />
      </View>
      <FlatList
        data={categories}
        keyExtractor={c => c.id}
        renderItem={({ item }) => {
          const current = overridesById[item.id]?.amount ?? item.defaultAmount;
          return (
            <View style={styles.item}>
              <View style={[styles.color, { backgroundColor: item.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.type}>{item.isInflux ? 'Income' : 'Allocation'}</Text>
              </View>
              <TextInput
                style={styles.input}
                inputMode="decimal"
                value={String(current)}
                onChangeText={(text) => {
                  const amt = Number(text.replace(/[^0-9.]/g, '')) || 0;
                  updateCategoryAmount(item.id, amt, month, { propagateToFuture: propagate });
                }}
              />
            </View>
          );
        }}
      />
      <View style={styles.totals}>
        <Text>Income: {totals.totalIncome.toFixed(2)}</Text>
        <Text>Outflow: {totals.totalOutflow.toFixed(2)}</Text>
        <Text style={totals.remaining < 0 ? styles.negative : styles.positive}>Remaining: {totals.remaining.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e2e8f0' },
  color: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  name: { fontSize: 16, fontWeight: '500' },
  type: { color: '#64748b' },
  input: { width: 100, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 8, textAlign: 'right' },
  totals: { marginTop: 12, gap: 4 },
  positive: { color: '#16a34a', fontWeight: '600' },
  negative: { color: '#dc2626', fontWeight: '600' },
});


