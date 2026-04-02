import notifee, {
  AndroidImportance,
  AndroidStyle,
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { Platform } from 'react-native';

export const CHANNEL_ID = 'moniqo_default';

export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  try {
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'Moniqo',
      importance: AndroidImportance.HIGH,
      vibration: true,
    });
  } catch (error) {
    console.error(
      '[notificationService] setupNotificationChannel error:',
      error,
    );
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
  } catch (error) {
    console.error(
      '[notificationService] requestNotificationPermission error:',
      error,
    );
    return false;
  }
}

export async function sendTransactionAlert(
  title: string,
  amount: string,
  type: 'income' | 'expense',
): Promise<void> {
  try {
    const label = type === 'expense' ? 'Expense' : 'Income';
    const body = `${label} of \u20B9${amount} recorded`;

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        style: {
          type: AndroidStyle.BIGTEXT,
          text: body,
        },
      },
      ios: {
        sound: 'default',
      },
    });
  } catch (error) {
    console.error('[notificationService] sendTransactionAlert error:', error);
  }
}

export async function scheduleMonthlyReport(): Promise<void> {
  try {
    const now = new Date();
    const nextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
      9,
      0,
      0,
      0,
    );

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: nextMonth.getTime(),
    };

    await notifee.createTriggerNotification(
      {
        title: 'Monthly Finance Report',
        body: 'Your monthly spending summary is ready. Tap to review your finances.',
        android: {
          channelId: CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          style: {
            type: AndroidStyle.BIGTEXT,
            text: 'Your monthly spending summary is ready. Tap to review your finances.',
          },
        },
        ios: {
          sound: 'default',
        },
      },
      trigger,
    );
  } catch (error) {
    console.error('[notificationService] scheduleMonthlyReport error:', error);
  }
}

export async function scheduleWeeklyDigest(): Promise<void> {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    // Days until next Monday: Monday is 1, so daysUntilMonday = (8 - dayOfWeek) % 7 || 7
    const daysUntilMonday = dayOfWeek === 1 ? 7 : (8 - dayOfWeek) % 7;

    const nextMonday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilMonday,
      9,
      0,
      0,
      0,
    );

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: nextMonday.getTime(),
    };

    await notifee.createTriggerNotification(
      {
        title: 'Weekly Finance Digest',
        body: 'Here is your weekly spending overview. Stay on top of your budget.',
        android: {
          channelId: CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          style: {
            type: AndroidStyle.BIGTEXT,
            text: 'Here is your weekly spending overview. Stay on top of your budget.',
          },
        },
        ios: {
          sound: 'default',
        },
      },
      trigger,
    );
  } catch (error) {
    console.error('[notificationService] scheduleWeeklyDigest error:', error);
  }
}

export async function cancelAllScheduled(): Promise<void> {
  try {
    await notifee.cancelAllNotifications();
  } catch (error) {
    console.error('[notificationService] cancelAllScheduled error:', error);
  }
}
