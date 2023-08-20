import notifee, {
  AndroidImportance,
  AndroidNotificationSetting,
  AuthorizationStatus,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

import {getNotifTimestamp} from '../utils/getNotifTimestamp';

import {Alert} from 'react-native';

import {displayName as appName} from '../app.json';

// Create a channel for the notifications
export async function createNotifChannel() {
  await notifee.createChannel({
    id: 'notification-channel',
    name: 'Reminders',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: 'default',
  });
}

export async function onCreateTriggerNotification(
  dueDate: Date,
  taskId: string,
  task: string,
  TEXT: any,
  toggleRepeating: boolean,
) {
  const settings = await notifee.getNotificationSettings();

  // Check if the user has enabled notifications
  if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: getNotifTimestamp(dueDate),
      repeatFrequency: toggleRepeating ? RepeatFrequency.DAILY : undefined,
      alarmManager: {
        allowWhileIdle: true,
      },
    };

    try {
      // Create the notification
      await notifee.createTriggerNotification(
        {
          id: taskId,
          title: appName,
          body: `${TEXT.Notifications.Due_Soon} "${task}"!`,
          android: {
            channelId: 'notification-channel',
            pressAction: {
              id: 'task-is-due',
              launchActivity: 'default',
            },
          },
        },
        trigger,
      );
    } catch (e) {
      console.log(e);
    }
    console.log('Notification created');
  }
  // If the user hasn't enabled notifications, show an alert
  else {
    console.log('Notifications are disabled');
    Alert.alert(
      TEXT.Notifications.Notifications,
      TEXT.Notifications.Notif_Alert_Body,
      [
        {
          text: TEXT.Cancel,
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: TEXT.Notifications.Go_To_Settings,
          onPress: async () => await notifee.openNotificationSettings(),
        },
      ],
    );
  }
}

// Cancel the notification
export async function cancelNotifications(taskId: string) {
  await notifee.cancelNotification(taskId);
}
