import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UseSafeAsyncStorageOptions<T> {
  key: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

interface UseSafeAsyncStorageReturn<T> {
  value: T;
  loading: boolean;
  error: string | null;
  setValue: (value: T) => Promise<void>;
  clearValue: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * A safe hook for AsyncStorage operations with error handling and loading states
 * Prevents white screen crashes by gracefully handling AsyncStorage failures
 */
export function useSafeAsyncStorage<T>({
  key,
  defaultValue,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}: UseSafeAsyncStorageOptions<T>): UseSafeAsyncStorageReturn<T> {
  const [value, setValueState] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load value from AsyncStorage on mount
  const loadValue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const storedValue = await AsyncStorage.getItem(key);
      
      if (storedValue !== null) {
        const parsedValue = deserialize(storedValue);
        setValueState(parsedValue);
      } else {
        setValueState(defaultValue);
      }
    } catch (err) {
      console.warn(`Failed to load ${key} from AsyncStorage:`, err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setValueState(defaultValue);
    } finally {
      setLoading(false);
    }
  }, [key, defaultValue, deserialize]);

  // Save value to AsyncStorage
  const setValue = useCallback(async (newValue: T) => {
    try {
      setError(null);
      const serializedValue = serialize(newValue);
      await AsyncStorage.setItem(key, serializedValue);
      setValueState(newValue);
    } catch (err) {
      console.warn(`Failed to save ${key} to AsyncStorage:`, err);
      setError(err instanceof Error ? err.message : 'Failed to save data');
      // Still update local state even if AsyncStorage fails
      setValueState(newValue);
    }
  }, [key, serialize]);

  // Clear value from AsyncStorage
  const clearValue = useCallback(async () => {
    try {
      setError(null);
      await AsyncStorage.removeItem(key);
      setValueState(defaultValue);
    } catch (err) {
      console.warn(`Failed to clear ${key} from AsyncStorage:`, err);
      setError(err instanceof Error ? err.message : 'Failed to clear data');
    }
  }, [key, defaultValue]);

  // Refresh value from AsyncStorage
  const refresh = useCallback(async () => {
    await loadValue();
  }, [loadValue]);

  // Load value on mount
  useEffect(() => {
    loadValue();
  }, [loadValue]);

  return {
    value,
    loading,
    error,
    setValue,
    clearValue,
    refresh,
  };
}