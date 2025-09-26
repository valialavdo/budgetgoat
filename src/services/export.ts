import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BudgetState, MonthKey, Category, BudgetMonth, Transaction } from '../types';

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

export async function exportTransactionsToCSV(state: BudgetState, dateRange?: { start: Date; end: Date }): Promise<string> {
  const lines: string[] = [];
  lines.push('Date,Type,Amount,Category,Note,Recurring');

  const categoryById: Record<string, Category> = Object.fromEntries(state.categories.map(c => [c.id, c]));
  
  // Get all transactions
  const allTransactions = Object.values(state.transactionsByMonth || {}).flat();
  
  // Filter by date range if provided
  const filteredTransactions = dateRange 
    ? allTransactions.filter(tx => {
        const txDate = new Date(tx.month + '-01');
        return txDate >= dateRange.start && txDate <= dateRange.end;
      })
    : allTransactions;

  const rows = filteredTransactions.map(tx => {
    const cat = categoryById[tx.pocketCategoryId];
    return [
      escapeCsv(tx.month + '-01'),
      escapeCsv(tx.type),
      tx.amount.toFixed(2),
      escapeCsv(cat?.name || 'Unknown'),
      escapeCsv(tx.note || ''),
      String(!!tx.recurrence?.isRecurring),
    ].join(',');
  });
  lines.push(...rows);

  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const path = FileSystem.cacheDirectory + `transactions-${timestamp}.csv`;
  await FileSystem.writeAsStringAsync(path, lines.join('\n'));
  return path;
}

export async function exportPocketsToCSV(state: BudgetState): Promise<string> {
  const lines: string[] = [];
  lines.push('Name,Type,Target Amount,Current Balance,Notes');

  const pockets = state.categories.filter(cat => !cat.isInflux);
  
  const rows = pockets.map(cat => {
    return [
      escapeCsv(cat.name),
      escapeCsv(cat.type),
      cat.defaultAmount.toFixed(2),
      '0.00', // Current balance would need to be calculated
      escapeCsv(cat.notes || ''),
    ].join(',');
  });
  lines.push(...rows);

  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const path = FileSystem.cacheDirectory + `pockets-${timestamp}.csv`;
  await FileSystem.writeAsStringAsync(path, lines.join('\n'));
  return path;
}

export async function exportAllDataToCSV(state: BudgetState, dateRange?: { start: Date; end: Date }): Promise<string> {
  const lines: string[] = [];
  lines.push('Export Date,Data Type,Name,Type,Amount,Date,Notes');
  
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  lines.push(`${timestamp},Export Info,BudgetGOAT Data Export,All Data,0.00,${timestamp},Complete data export`);

  // Export pockets
  const pockets = state.categories.filter(cat => !cat.isInflux);
  pockets.forEach(cat => {
    lines.push([
      timestamp,
      'Pocket',
      escapeCsv(cat.name),
      escapeCsv(cat.type),
      cat.defaultAmount.toFixed(2),
      timestamp,
      escapeCsv(cat.notes || ''),
    ].join(','));
  });

  // Export transactions
  const allTransactions = Object.values(state.transactionsByMonth || {}).flat();
  const filteredTransactions = dateRange 
    ? allTransactions.filter(tx => {
        const txDate = new Date(tx.month + '-01');
        return txDate >= dateRange.start && txDate <= dateRange.end;
      })
    : allTransactions;

  const categoryById: Record<string, Category> = Object.fromEntries(state.categories.map(c => [c.id, c]));
  filteredTransactions.forEach(tx => {
    const cat = categoryById[tx.pocketCategoryId];
    lines.push([
      timestamp,
      'Transaction',
      escapeCsv(cat?.name || 'Unknown'),
      escapeCsv(tx.type),
      tx.amount.toFixed(2),
      tx.month + '-01',
      escapeCsv(tx.note || ''),
    ].join(','));
  });

  const path = FileSystem.cacheDirectory + `budgetgoat-export-${timestamp}.csv`;
  await FileSystem.writeAsStringAsync(path, lines.join('\n'));
  return path;
}

export async function shareFile(path: string): Promise<void> {
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(path);
  }
}


