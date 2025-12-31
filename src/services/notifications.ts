import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '../types';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
  init: async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }

      // Configure Android notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('due-tasks', {
          name: 'Due Tasks',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6200EE',
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      return false;
    }
  },

  scheduleDueTaskNotification: async (task: Task): Promise<string | null> => {
    try {
      const dueDate = new Date(task.dueDate);
      const now = new Date();

      // Only schedule if due date is in the future
      if (dueDate <= now) {
        return null;
      }

      // Schedule notification for 1 hour before due date
      const notificationDate = new Date(dueDate.getTime() - 60 * 60 * 1000);

      // If notification time has already passed, schedule for the due date itself
      const scheduleDate = notificationDate > now ? notificationDate : dueDate;

      // Cancel any existing notification for this task
      await NotificationService.cancelTaskNotification(task.id);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Due Soon!',
          body: `"${task.title}" is due ${
            scheduleDate === dueDate ? 'now' : 'in 1 hour'
          }`,
          data: { taskId: task.id, projectId: task.projectId },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: scheduleDate,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  },

  cancelTaskNotification: async (taskId: string): Promise<void> => {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();

      for (const notification of scheduledNotifications) {
        if (notification.content.data?.taskId === taskId) {
          await Notifications.cancelScheduledNotificationAsync(
            notification.identifier
          );
        }
      }
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  },

  scheduleImmediateNotification: async (
    title: string,
    body: string
  ): Promise<void> => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Failed to send immediate notification:', error);
    }
  },

  cancelAllNotifications: async (): Promise<void> => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  },

  getScheduledNotifications: async () => {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  },
};
