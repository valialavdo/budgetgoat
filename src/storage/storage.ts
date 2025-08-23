import AsyncStorage from '@react-native-async-storage/async-storage';
import { BudgetState } from '../types';

const STORAGE_KEY = 'budgetPlannerState:v1';

export async function saveState(state: BudgetState): Promise<void> {
  const serialized = JSON.stringify(state);
  await AsyncStorage.setItem(STORAGE_KEY, serialized);
}

export async function loadState(): Promise<BudgetState | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BudgetState;
  } catch {
    return null;
  }
}

export async function clearState(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}


