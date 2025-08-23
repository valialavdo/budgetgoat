import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BudgetState, MonthKey, Category, BudgetMonth } from '../types';

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

export async function exportMonthToCSV(state: BudgetState, month: MonthKey): Promise<string> {
  const budget: BudgetMonth | undefined = state.budgetsByMonth[month];
  const lines: string[] = [];
  lines.push('Category,Type,Influx,Amount,Note');

  const categoryById: Record<string, Category> = Object.fromEntries(state.categories.map(c => [c.id, c]));
  const rows = (budget?.overrides || []).map(o => {
    const cat = categoryById[o.categoryId];
    const sign = cat?.isInflux ? 1 : -1;
    return [
      escapeCsv(cat?.name || 'Unknown'),
      escapeCsv(cat?.type || 'other'),
      String(!!cat?.isInflux),
      (sign * o.amount).toFixed(2),
      escapeCsv(o.note || ''),
    ].join(',');
  });
  lines.push(...rows);

  const path = FileSystem.cacheDirectory + `budget-${month}.csv`;
  await FileSystem.writeAsStringAsync(path, lines.join('\n'));
  return path;
}

export async function shareFile(path: string): Promise<void> {
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(path);
  }
}


