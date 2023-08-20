import {AppRegistry, PermissionsAndroid, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react';

import notifee, {EventType} from '@notifee/react-native';

import {AppProvider} from './contexts/AppContext';
import {SideBarProvider} from './contexts/SideBarContext';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {WEBCLIENTID} from './constants/CONSTANTS';
import {createNotifChannel} from './services/TriggerNotifications';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

GoogleSignin.configure({
  webClientId: WEBCLIENTID,
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  // Check if the user pressed the notification
  if (type === EventType.ACTION_PRESS && pressAction.id === 'task-is-due') {
    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});

// Check if the channel has been created
notifee.isChannelCreated('notification-channel').then(created => {
  // If the channel hasn't been created, create it
  if (!created) {
    createNotifChannel();
  }
});

if (Platform.OS === 'android') {
  const checkNotifPermissions = async () => {
    const notifs = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (notifs === false) {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  checkNotifPermissions();
}

const ProvidedApp = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AppProvider>
        <SideBarProvider>
          <App />
        </SideBarProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent(appName, () => ProvidedApp);
