import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 1. Налаштовуємо поведінку сповіщень
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  
    shouldShowBanner: true, 
    shouldShowList: true,  
    shouldPlaySound: true,
    shouldSetBadge: false,
  } as any),
});

function isNotificationPermissionGranted(
  permissions: Notifications.NotificationPermissionsStatus
): boolean {
  const compatPermissions = permissions as Notifications.NotificationPermissionsStatus & {
    granted?: boolean;
    status?: string;
  };

  if (typeof compatPermissions.granted === 'boolean') {
    return compatPermissions.granted;
  }

  if (compatPermissions.status === 'granted') {
    return true;
  }

  return (
    permissions.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED ||
    permissions.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
    permissions.ios?.status === Notifications.IosAuthorizationStatus.EPHEMERAL
  );
}

// 2. Функція для запиту дозволу в користувача
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1B5E20', 
    });
  }

  const permissions = await Notifications.getPermissionsAsync();
  
  let isGranted = isNotificationPermissionGranted(permissions);
  
  if (!isGranted) {
    const request = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    isGranted = isNotificationPermissionGranted(request);
  }
  
  return !!isGranted;
}

// 3. Функція для створення сповіщень (на 12 місяців вперед)
export async function scheduleMeterNotification(dayType: 'first' | 'second_last' | 'last', hour: number, minute: number) {
  await cancelMeterNotifications();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  let scheduledCount = 0;

  for (let i = 0; i < 12; i++) {
    let targetDate = new Date(currentYear, currentMonth + i, 1, hour, minute, 0);

    if (dayType === 'last') {
      targetDate = new Date(currentYear, currentMonth + i + 1, 0, hour, minute, 0);
    } else if (dayType === 'second_last') {
      targetDate = new Date(currentYear, currentMonth + i + 1, 0, hour, minute, 0);
      targetDate.setDate(targetDate.getDate() - 1);
    }

    if (targetDate > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏳ Час передати показники!',
          body: 'Не забудьте зайти в додаток і внести актуальні показники лічильників.',
          sound: true,
          data: { type: 'meters', url: '/meters' }, 
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: targetDate,
        },
      });
      scheduledCount++;
    }
  }
  console.log(`✅ Заплановано сповіщень про лічильники: ${scheduledCount}`);
}

export async function cancelMeterNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  
  const toCancel = scheduled.filter(notif => notif.content.data?.type === 'meters');
  
  for (const notif of toCancel) {
    await Notifications.cancelScheduledNotificationAsync(notif.identifier);
  }
  
  console.log(`🗑 Видалено сповіщень про лічильники: ${toCancel.length}`);
}

//  Функція для скасування всіх нагадувань
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('🗑 Всі заплановані сповіщення скасовано');
}