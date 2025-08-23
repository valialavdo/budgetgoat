import { BudgetState, MonthKey } from '../types';

export interface AiTip {
  id: string;
  title: string;
  body: string;
  cta?: string;
}

export function generateAiTips(state: BudgetState, month: MonthKey): AiTip[] {
  const tips: AiTip[] = [];
  // Simple surplus/shortfall heuristic
  const bm = state.budgetsByMonth[month];
  if (bm) {
    const byId = Object.fromEntries(state.categories.map(c => [c.id, c]));
    let inc = 0;
    let out = 0;
    for (const o of bm.overrides) {
      const c = byId[o.categoryId];
      if (!c) continue;
      if (c.isInflux) inc += o.amount; else out += o.amount;
    }
    const remaining = inc - out;
    if (remaining > 150) {
      tips.push({ id: 'surplus', title: 'AI Forecast: Surplus ahead', body: `You may have about €${remaining.toFixed(0)} left this month. Allocate to Savings pocket?`, cta: 'Allocate now' });
    }
    if (remaining < -50) {
      tips.push({ id: 'shortfall', title: 'AI Suggestion: Adjust plan', body: 'Spending may exceed income. Consider reducing low-priority categories by 10%.' });
    }
  }

  // 50/30/20 hint
  const hasIncome = state.categories.some(c => c.isInflux);
  if (hasIncome) {
    tips.push({ id: 'rule-503020', title: 'Try 50/30/20', body: 'Base rule: 50% needs, 30% wants, 20% savings. Want automatic suggestions in Categories?' });
  }
  return tips;
}


