/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react';

import notifee, {EventType} from '@notifee/react-native';

import {AppProvider} from './contexts/AppContext';

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  // Check if the user pressed the notification
  if (type === EventType.ACTION_PRESS && pressAction.id === 'task-is-due') {
    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});

const ProvidedApp = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};

AppRegistry.registerComponent(appName, () => ProvidedApp);
