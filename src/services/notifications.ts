import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleMonthlyReminder(id: string, title: string, body: string, triggerDate: Date) {
  // Cancel existing with same id
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {}

  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: { title, body },
    trigger: {
      channelId: Platform.OS === 'android' ? 'budget-reminders' : undefined,
      repeats: true,
      month: triggerDate.getMonth() + 1,
      day: triggerDate.getDate(),
      hour: 9,
      minute: 0,
    } as any,
  });
}

export async function setupAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('budget-reminders', {
      name: 'Budget Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}


