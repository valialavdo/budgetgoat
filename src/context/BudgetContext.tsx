import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { BudgetState, BudgetMonth, Category, CategoryAmountOverride, EditOptions, MonthKey, Totals, AllocationRule, Transaction, PocketBalances } from '../types';
import { getCurrentMonthKey, getNextMonthKey, toMonthKey } from '../utils/date';
import { loadState, saveState } from '../storage/storage';

interface BudgetContextValue {
  state: BudgetState;
  ready: boolean;
  ensureMonth(month: MonthKey): void;
  upsertCategory(category: Partial<Category> & Pick<Category, 'name' | 'type' | 'isInflux' | 'color'>): void;
  deleteCategories(ids: string[]): void;
  updateCategoryAmount(categoryId: string, amount: number, month: MonthKey, options?: EditOptions): void;
  computeTotals(month: MonthKey): Totals;
  setAllocationRules(incomeCategoryId: string, rules: AllocationRule[], month?: MonthKey, propagate?: boolean): void;
  addTransaction(t: Omit<Transaction, 'id'>): void;
  computePocketBalancesUpTo(month: MonthKey): PocketBalances;
}

export const BudgetContext = createContext<BudgetContextValue>({} as any);

function createDefaultState(): BudgetState {
  const now = new Date();
  const currentMonth = toMonthKey(now);
  const nextMonth = getNextMonthKey(currentMonth);
  const salaryId = 'cat-salary';
  const revolutId = 'cat-revolut';
  const piraeusId = 'cat-piraeus';
  const xtraId = 'cat-xtra';

  const categories: Category[] = [
    {
      id: salaryId,
      name: 'Salary',
      type: 'income',
      color: '#16a34a',
      defaultAmount: 5000,
      isInflux: true,
      recurrence: { isRecurring: true, timing: null },
    },
    {
      id: revolutId,
      name: 'Revolut Bank',
      type: 'bank',
      color: '#3b82f6',
      defaultAmount: 2000,
      isInflux: false,
      recurrence: { isRecurring: true, timing: 'lastWorkingDay' },
    },
    {
      id: piraeusId,
      name: 'Other Bank (Piraeus)',
      type: 'bank',
      color: '#0ea5e9',
      defaultAmount: 3000,
      isInflux: false,
      recurrence: { isRecurring: true, timing: 'lastWorkingDay' },
    },
    {
      id: xtraId,
      name: 'XTRA Money',
      type: 'extra',
      color: '#a855f7',
      defaultAmount: 0,
      isInflux: false,
      recurrence: { isRecurring: true, timing: null },
    },
  ];

  const initialMonth: BudgetMonth = {
    month: currentMonth,
    overrides: categories.map(c => ({ categoryId: c.id, amount: c.defaultAmount })),
  };
  const nextMonthBudget: BudgetMonth = {
    month: nextMonth,
    overrides: categories.map(c => ({ categoryId: c.id, amount: c.defaultAmount })),
  };

  return {
    categories,
    budgetsByMonth: {
      [currentMonth]: initialMonth,
      [nextMonth]: nextMonthBudget,
    },
    lastOpenedMonth: currentMonth,
    allocationRules: {
      [salaryId]: [
        { targetCategoryId: revolutId, mode: 'amount', value: 2000 },
        { targetCategoryId: piraeusId, mode: 'amount', value: 3000 },
      ],
    },
    transactionsByMonth: { [currentMonth]: [], [nextMonth]: [] },
  };
}

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BudgetState>(createDefaultState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await loadState();
      if (loaded) setState(loaded);
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [ready, state]);

  const ensureMonth = useCallback((month: MonthKey) => {
    setState(prev => {
      if (prev.budgetsByMonth[month]) return prev;
      const overrides: CategoryAmountOverride[] = prev.categories.map(c => ({ categoryId: c.id, amount: c.defaultAmount }));
      const bm: BudgetMonth = { month, overrides };
      return {
        ...prev,
        budgetsByMonth: { ...prev.budgetsByMonth, [month]: bm },
      };
    });
  }, []);

  const upsertCategory = useCallback((category: Partial<Category> & Pick<Category, 'name' | 'type' | 'isInflux' | 'color'>) => {
    setState(prev => {
      const existing = category.id ? prev.categories.find(c => c.id === category.id) : undefined;
      if (existing) {
        const updated: Category = { ...existing, ...category } as Category;
        const categories = prev.categories.map(c => (c.id === updated.id ? updated : c));
        return { ...prev, categories };
      }
      const id = `cat-${Math.random().toString(36).slice(2, 9)}`;
      const newCat: Category = {
        id,
        name: category.name,
        type: category.type,
        color: category.color,
        isInflux: category.isInflux,
        defaultAmount: (category as any).defaultAmount ?? 0,
        recurrence: (category as any).recurrence ?? { isRecurring: true, timing: null },
      } as Category;
      return { ...prev, categories: [...prev.categories, newCat] };
    });
  }, []);

  const deleteCategories = useCallback((ids: string[]) => {
    setState(prev => {
      const idSet = new Set(ids);
      const categories = prev.categories.filter(c => !idSet.has(c.id));
      // Remove overrides for removed categories
      const budgetsByMonth: typeof prev.budgetsByMonth = Object.fromEntries(
        Object.entries(prev.budgetsByMonth).map(([m, bm]) => [m, { ...bm, overrides: bm.overrides.filter(o => !idSet.has(o.categoryId)) }])
      );
      // Clean allocation rules: drop rules for removed incomes and targets
      const allocationRules: typeof prev.allocationRules = {};
      for (const [incomeId, rules] of Object.entries(prev.allocationRules || {})) {
        if (idSet.has(incomeId)) continue;
        const filtered = rules.filter(r => !idSet.has(r.targetCategoryId));
        if (filtered.length) allocationRules[incomeId] = filtered;
      }
      // Remove transactions targeting removed pockets
      const transactionsByMonth: typeof prev.transactionsByMonth = Object.fromEntries(
        Object.entries(prev.transactionsByMonth || {}).map(([m, list]) => [m, list.filter(tx => !idSet.has(tx.pocketCategoryId))])
      );
      return { ...prev, categories, budgetsByMonth, allocationRules, transactionsByMonth };
    });
  }, []);

  const updateCategoryAmount = useCallback((categoryId: string, amount: number, month: MonthKey, options?: EditOptions) => {
    setState(prev => {
      const budgetsByMonth = { ...prev.budgetsByMonth };
      const target = budgetsByMonth[month] ?? { month, overrides: [] };
      const existing = target.overrides.find(o => o.categoryId === categoryId);
      if (existing) existing.amount = amount; else target.overrides.push({ categoryId, amount });
      budgetsByMonth[month] = target;

      // If changing an income category that has allocation rules, apply them
      const category = prev.categories.find(c => c.id === categoryId);
      if (category?.isInflux && prev.allocationRules[categoryId]) {
        const rules = prev.allocationRules[categoryId];
        let remaining = amount;
        // Apply amount-based first
        for (const r of rules.filter(r => r.mode === 'amount')) {
          const amt = Math.min(r.value, Math.max(0, remaining));
          const m = budgetsByMonth[month] ?? { month, overrides: [] };
          const ov = m.overrides.find(o => o.categoryId === r.targetCategoryId);
          if (ov) ov.amount = amt; else m.overrides.push({ categoryId: r.targetCategoryId, amount: amt });
          budgetsByMonth[month] = m;
          remaining -= amt;
        }
        // Then percent-based
        const pctRules = rules.filter(r => r.mode === 'percent');
        const totalPct = pctRules.reduce((s, r) => s + r.value, 0);
        for (const r of pctRules) {
          const amt = totalPct > 0 ? (remaining * r.value) / totalPct : 0;
          const m = budgetsByMonth[month] ?? { month, overrides: [] };
          const ov = m.overrides.find(o => o.categoryId === r.targetCategoryId);
          if (ov) ov.amount = amt; else m.overrides.push({ categoryId: r.targetCategoryId, amount: amt });
          budgetsByMonth[month] = m;
        }
      }

      if (options?.propagateToFuture) {
        const months = Object.keys(prev.budgetsByMonth).sort();
        for (const m of months) {
          if (m >= month) {
            const copy = budgetsByMonth[m] ?? { month: m, overrides: [] };
            const o = copy.overrides.find(v => v.categoryId === categoryId);
            if (o) o.amount = amount; else copy.overrides.push({ categoryId, amount });
            budgetsByMonth[m] = copy;
          }
        }
      }
      return { ...prev, budgetsByMonth };
    });
  }, []);

  const computeTotals = useCallback((month: MonthKey): Totals => {
    const bm = state.budgetsByMonth[month];
    if (!bm) return { totalIncome: 0, totalOutflow: 0, remaining: 0 };
    const categoryById = Object.fromEntries(state.categories.map(c => [c.id, c]));
    let income = 0;
    let out = 0;
    for (const o of bm.overrides) {
      const cat = categoryById[o.categoryId];
      if (!cat) continue;
      if (cat.isInflux) income += o.amount; else out += o.amount;
    }
    return { totalIncome: income, totalOutflow: out, remaining: income - out };
  }, [state.budgetsByMonth, state.categories]);


  const setAllocationRules = useCallback((incomeCategoryId: string, rules: AllocationRule[], month?: MonthKey, propagate?: boolean) => {
    setState(prev => {
      const allocationRules = { ...prev.allocationRules, [incomeCategoryId]: rules };
      const budgetsByMonth = { ...prev.budgetsByMonth };
      if (month) {
        const incomeOv = budgetsByMonth[month]?.overrides.find(o => o.categoryId === incomeCategoryId);
        const amount = incomeOv?.amount ?? prev.categories.find(c => c.id === incomeCategoryId)?.defaultAmount ?? 0;
        // Re-run allocation using the same logic as in updateCategoryAmount
        let remaining = amount;
        const applyTo = (mKey: string) => {
          const m = budgetsByMonth[mKey] ?? { month: mKey, overrides: [] };
          // amount-based first
          for (const r of rules.filter(r => r.mode === 'amount')) {
            const amt = Math.min(r.value, Math.max(0, remaining));
            const ov = m.overrides.find(o => o.categoryId === r.targetCategoryId);
            if (ov) ov.amount = amt; else m.overrides.push({ categoryId: r.targetCategoryId, amount: amt });
            remaining -= amt;
          }
          // percent-based
          const pctRules = rules.filter(r => r.mode === 'percent');
          const totalPct = pctRules.reduce((s, r) => s + r.value, 0);
          for (const r of pctRules) {
            const amt = totalPct > 0 ? (remaining * r.value) / totalPct : 0;
            const ov = m.overrides.find(o => o.categoryId === r.targetCategoryId);
            if (ov) ov.amount = amt; else m.overrides.push({ categoryId: r.targetCategoryId, amount: amt });
          }
          budgetsByMonth[mKey] = m;
        };
        applyTo(month);
        if (propagate) {
          const months = Object.keys(prev.budgetsByMonth).sort();
          for (const mkey of months) if (mkey >= month) applyTo(mkey);
        }
      }
      return { ...prev, allocationRules, budgetsByMonth };
    });
  }, []);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    setState(prev => {
      const month = t.month;
      const list = (prev.transactionsByMonth && prev.transactionsByMonth[month]) || [];
      const tx: Transaction = { id: `tx-${Math.random().toString(36).slice(2, 9)}`, ...t };
      const transactionsByMonth = { ...(prev.transactionsByMonth || {}), [month]: [...list, tx] };
      return { ...prev, transactionsByMonth };
    });
  }, []);

  const computePocketBalancesUpTo = useCallback((month: MonthKey): PocketBalances => {
    const months = Object.keys(state.budgetsByMonth).sort().filter(m => m <= month);
    const balances: PocketBalances = {};
    const bankIds = state.categories.filter(c => !c.isInflux).map(c => c.id);
    for (const id of bankIds) balances[id] = 0;

    for (const m of months) {
      const bm = state.budgetsByMonth[m];
      if (!bm) continue;
      // Allocate incomes into pockets according to rules
      for (const cat of state.categories) {
        if (!cat.isInflux) continue;
        const ov = bm.overrides.find(o => o.categoryId === cat.id);
        const amount = ov?.amount ?? cat.defaultAmount;
        const rules = state.allocationRules[cat.id] || [];
        let remaining = amount;
        for (const r of rules.filter(r => r.mode === 'amount')) {
          const add = Math.min(r.value, Math.max(0, remaining));
          balances[r.targetCategoryId] = (balances[r.targetCategoryId] || 0) + add;
          remaining -= add;
        }
        const pctRules = rules.filter(r => r.mode === 'percent');
        const totalPct = pctRules.reduce((s, r) => s + r.value, 0);
        for (const r of pctRules) {
          const add = totalPct > 0 ? (remaining * r.value) / totalPct : 0;
          balances[r.targetCategoryId] = (balances[r.targetCategoryId] || 0) + add;
        }
      }
      // Apply pocket transactions for the month
      const txs = (state.transactionsByMonth && state.transactionsByMonth[m]) || [];
      for (const tx of txs) {
        if (tx.type === 'expense') {
          balances[tx.pocketCategoryId] = (balances[tx.pocketCategoryId] || 0) - tx.amount;
        } else if (tx.type === 'income') {
          balances[tx.pocketCategoryId] = (balances[tx.pocketCategoryId] || 0) + tx.amount;
        }
      }
    }
    return balances;
  }, [state.budgetsByMonth, state.categories, state.allocationRules, state.transactionsByMonth]);

  const ctx: BudgetContextValue = useMemo(() => ({ state, ready, ensureMonth, upsertCategory, deleteCategories, updateCategoryAmount, computeTotals, setAllocationRules, addTransaction, computePocketBalancesUpTo }), [state, ready, ensureMonth, upsertCategory, deleteCategories, updateCategoryAmount, computeTotals, setAllocationRules, addTransaction, computePocketBalancesUpTo]);
  return <BudgetContext.Provider value={ctx}>{children}</BudgetContext.Provider>;
}


