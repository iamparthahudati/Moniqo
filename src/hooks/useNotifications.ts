import { useCallback } from 'react';
import {
  cancelAllScheduled,
  requestNotificationPermission,
  scheduleMonthlyReport,
  scheduleWeeklyDigest,
  sendTransactionAlert,
  setupNotificationChannel,
} from '../services/notificationService';

export default function useNotifications() {
  const setup = useCallback(async (): Promise<boolean> => {
    try {
      await setupNotificationChannel();
      return await requestNotificationPermission();
    } catch (error) {
      console.error('[useNotifications] setup error:', error);
      return false;
    }
  }, []);

  const notifyTransaction = useCallback(
    async (
      title: string,
      amount: string,
      type: 'income' | 'expense',
    ): Promise<void> => {
      try {
        await sendTransactionAlert(title, amount, type);
      } catch (error) {
        console.error('[useNotifications] notifyTransaction error:', error);
      }
    },
    [],
  );

  const enableMonthlyReport = useCallback(async (): Promise<void> => {
    try {
      await scheduleMonthlyReport();
    } catch (error) {
      console.error('[useNotifications] enableMonthlyReport error:', error);
    }
  }, []);

  const enableWeeklyDigest = useCallback(async (): Promise<void> => {
    try {
      await scheduleWeeklyDigest();
    } catch (error) {
      console.error('[useNotifications] enableWeeklyDigest error:', error);
    }
  }, []);

  const disableAll = useCallback(async (): Promise<void> => {
    try {
      await cancelAllScheduled();
    } catch (error) {
      console.error('[useNotifications] disableAll error:', error);
    }
  }, []);

  return {
    setup,
    notifyTransaction,
    enableMonthlyReport,
    enableWeeklyDigest,
    disableAll,
  };
}
