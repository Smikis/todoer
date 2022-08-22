import notifee, {
  AndroidImportance,
  AndroidNotificationSetting,
  TriggerType,
} from '@notifee/react-native';

import {getNotifTimestamp} from '../utils/dates/getNotifTimestamp';

import {Alert} from 'react-native';

export async function createNotifChannelId() {
  const channelId = await notifee.createChannel({
    id: 'notification-channel',
    name: 'Reminders',
    importance: AndroidImportance.DEFAULT,
  });
  return channelId;
}

export async function onCreateTriggerNotification(
  dueDate,
  channelId,
  taskId,
  task,
) {
  const settings = await notifee.getNotificationSettings();

  if (settings.android.alarm === AndroidNotificationSetting.ENABLED) {
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: getNotifTimestamp(dueDate),
    };

    try {
      await notifee.createTriggerNotification(
        {
          id: taskId,
          title: 'AppName',
          body: `"${task}" is due soon!`,
          android: {
            channelId: channelId,
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
  } else
    Alert.alert(
      'Notifications',
      'If you want to receive notifications, please enable them in the settings',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Go to settings',
          onPress: async () => await notifee.openAlarmPermissionSettings(),
        },
      ],
    );
}

export async function cancelNotifications(taskId) {
  await notifee.cancelNotification(taskId);
}
