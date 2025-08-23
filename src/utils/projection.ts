import { addMonths, format } from 'date-fns';
import { BudgetState, MonthKey } from '../types';
import { toMonthKey } from './date';

export interface ProjectionPoint {
  month: MonthKey;
  remaining: number;
}

export function projectSixMonths(state: BudgetState, start: Date, whatIfDelta: number = 0): ProjectionPoint[] {
  const points: ProjectionPoint[] = [];
  for (let i = 0; i < 6; i++) {
    const d = addMonths(start, i);
    const key = toMonthKey(d);
    const bm = state.budgetsByMonth[key];
    let remaining = 0;
    if (bm) {
      const byId = Object.fromEntries(state.categories.map(c => [c.id, c]));
      let inc = 0;
      let out = 0;
      for (const o of bm.overrides) {
        const c = byId[o.categoryId];
        if (!c) continue;
        if (c.isInflux) inc += o.amount; else out += o.amount;
      }
      remaining = inc - out + (i === 0 ? whatIfDelta : 0);
    }
    points.push({ month: key, remaining });
  }
  return points;
}


