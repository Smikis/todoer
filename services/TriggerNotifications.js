import notifee, {
  AndroidImportance,
  AndroidNotificationSetting,
  RepeatFrequency,
  TriggerType
} from '@notifee/react-native'

import NotificationSounds from 'react-native-notification-sounds'

import { getNotifTimestamp } from '../utils/getNotifTimestamp'

import { Alert } from 'react-native'

import { displayName as appName } from '../app.json'

export async function createNotifChannelId() {
  await notifee.deleteChannel('notification-channel')

  const soundsList = await NotificationSounds.getNotifications('notification')

  const channelId = await notifee.createChannel({
    id: 'notification-channel',
    name: 'Reminders',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: soundsList[0].uri
  })
  return channelId
}

export async function onCreateTriggerNotification(
  dueDate,
  channelId,
  taskId,
  task,
  TEXT,
  toggleRepeating
) {
  const settings = await notifee.getNotificationSettings()

  if (settings.android.alarm === AndroidNotificationSetting.ENABLED) {
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: getNotifTimestamp(dueDate),
      RepeatFrequency: toggleRepeating ? RepeatFrequency.DAILY : null,
      alarmManager: {
        allowWhileIdle: true
      }
    }

    try {
      await notifee.createTriggerNotification(
        {
          id: taskId,
          title: appName,
          body: `${TEXT.Notifications.Due_Soon} "${task}"!`,
          android: {
            channelId: channelId,
            pressAction: {
              id: 'task-is-due',
              launchActivity: 'default'
            }
          }
        },
        trigger
      )
    } catch (e) {
      console.log(e)
    }
  } else
    Alert.alert(
      TEXT.Notifications.Notifications,
      TEXT.Notifications.Notif_Alert_Body,
      [
        {
          text: TEXT.Cancel,
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: TEXT.Notifications.Go_To_Settings,
          onPress: async () => await notifee.openAlarmPermissionSettings()
        }
      ]
    )
}

export async function cancelNotifications(taskId) {
  await notifee.cancelNotification(taskId)
}
