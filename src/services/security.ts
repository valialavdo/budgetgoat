import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'budgetPlannerPIN';

export async function isBiometricAvailable(): Promise<boolean> {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
}

export async function authenticate(): Promise<boolean> {
  const available = await isBiometricAvailable();
  if (available) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Budget Planner',
    });
    if (result.success) return true;
  }
  const pin = await SecureStore.getItemAsync(PIN_KEY);
  return !pin; // If no PIN set, allow access
}

export async function setPin(pin: string): Promise<void> {
  await SecureStore.setItemAsync(PIN_KEY, pin);
}

export async function clearPin(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY);
}


