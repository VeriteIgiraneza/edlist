import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { NOTIFICATION_CHANNEL_ID, NOTIFICATION_CHANNEL_NAME } from '../constants/config';
import { Task } from '../types';
import { parseDate } from './dateUtils';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const setupNotifications = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.log('Notifications only work on physical devices');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get notification permissions');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: NOTIFICATION_CHANNEL_NAME,
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  return true;
};

export const scheduleNotification = async (task: Task): Promise<string | null> => {
  if (!task.reminder) return null;

  try {
    const reminderDate = parseDate(task.reminder);
    const now = new Date();

    // Skip if reminder is in the past (with 1 minute buffer)
    if (reminderDate.getTime() <= now.getTime() + 60000) {
      console.log('Skipping past reminder for:', task.name);
      return null;
    }

    // Cancel existing notification if any
    await cancelNotification(task.id.toString());

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: task.name,
        body: task.dueDate ? `Due: ${task.dueDate}` : 'Assignment reminder',
        data: { taskId: task.id, folderId: task.folderId },
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        date: reminderDate,
      },
      identifier: task.id.toString(),
    });

    console.log('Notification scheduled:', notificationId, 'for', task.name);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

export const cancelNotification = async (taskId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(taskId);
    console.log('Notification cancelled for task:', taskId);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

export const rescheduleAllNotifications = async (tasks: Task[]): Promise<void> => {
  console.log('Rescheduling all notifications...');
  
  // Cancel all existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  // Schedule new notifications for tasks with reminders
  const tasksWithReminders = tasks.filter(task => task.reminder && !task.completed);
  
  for (const task of tasksWithReminders) {
    await scheduleNotification(task);
  }
  
  console.log(`Rescheduled ${tasksWithReminders.length} notifications`);
};