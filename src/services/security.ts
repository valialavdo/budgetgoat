import AsyncStorage from '@react-native-async-storage/async-storage';

const PIN_KEY = 'budgetPlannerPIN';

export async function isBiometricAvailable(): Promise<boolean> {
  // TODO: Implement with react-native-biometrics
  return false;
}

export async function authenticate(): Promise<boolean> {
  // TODO: Implement with react-native-biometrics
  return true; // Allow access for now
}

export async function setPin(pin: string): Promise<void> {
  await AsyncStorage.setItem(PIN_KEY, pin);
}

export async function clearPin(): Promise<void> {
  await AsyncStorage.removeItem(PIN_KEY);
}


