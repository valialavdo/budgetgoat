import { format, isWeekend, lastDayOfMonth, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
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

export function getPreviousMonthKey(from?: MonthKey): MonthKey {
  const d = from ? fromMonthKey(from) : new Date();
  const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1);
  return toMonthKey(prev);
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

export function generateChartData(
  transactions: Array<{ amount: number; month: string }>,
  monthKey: MonthKey,
  type: 'income' | 'expense' | 'net'
): { data: number[]; labels: string[] } {
  const startDate = startOfMonth(fromMonthKey(monthKey));
  const endDate = endOfMonth(startDate);
  
  // Get 5 key dates in the month (1st, 8th, 15th, 22nd, 29th)
  const keyDates = [
    new Date(startDate.getFullYear(), startDate.getMonth(), 1),
    new Date(startDate.getFullYear(), startDate.getMonth(), 8),
    new Date(startDate.getFullYear(), startDate.getMonth(), 15),
    new Date(startDate.getFullYear(), startDate.getMonth(), 22),
    new Date(startDate.getFullYear(), startDate.getMonth(), 29)
  ];
  
  const data = keyDates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Calculate cumulative amount up to this date
    const cumulativeAmount = transactions
      .filter(t => t.month <= monthKey) // Use month comparison instead of date
      .reduce((sum, t) => {
        if (type === 'income') {
          return sum + (t.amount > 0 ? t.amount : 0);
        } else if (type === 'expense') {
          return sum + (t.amount < 0 ? Math.abs(t.amount) : 0);
        } else {
          return sum + t.amount;
        }
      }, 0);
    
    return cumulativeAmount;
  });
  
  const labels = keyDates.map(date => format(date, 'dd'));
  
  return { data, labels };
}

export function generateProjectionData(
  currentData: number[],
  trend: 'increasing' | 'decreasing' | 'stable' = 'increasing'
): number[] {
  if (currentData.length === 0) return [];
  
  const lastValue = currentData[currentData.length - 1];
  const projectionLength = 5; // 5 more data points
  
  const projections = [];
  for (let i = 1; i <= projectionLength; i++) {
    let projectedValue;
    
    switch (trend) {
      case 'increasing':
        projectedValue = lastValue + (lastValue * 0.1 * i); // 10% growth per period
        break;
      case 'decreasing':
        projectedValue = lastValue - (lastValue * 0.05 * i); // 5% decline per period
        break;
      case 'stable':
      default:
        projectedValue = lastValue + (Math.random() - 0.5) * lastValue * 0.1; // ±5% variation
        break;
    }
    
    projections.push(Math.max(0, projectedValue)); // Ensure non-negative
  }
  
  return projections;
}


