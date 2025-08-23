import { format, isWeekend, lastDayOfMonth, subDays } from 'date-fns';
import { MonthKey } from '../types';

export function toMonthKey(date: Date): MonthKey {
  return format(date, 'yyyy-MM');
}

export function fromMonthKey(key: MonthKey): Date {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, (m || 1) - 1, 1);
}

export function getCurrentMonthKey(): MonthKey {
  return toMonthKey(new Date());
}

export function getNextMonthKey(from?: MonthKey): MonthKey {
  const d = from ? fromMonthKey(from) : new Date();
  const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return toMonthKey(next);
}

export function getLastWorkingDayOfMonth(year: number, monthIndex0: number): Date {
  // monthIndex0: 0-11
  let d = lastDayOfMonth(new Date(year, monthIndex0, 1));
  while (isWeekend(d)) {
    d = subDays(d, 1);
  }
  return d;
}


