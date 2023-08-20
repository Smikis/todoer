import React, {useContext} from 'react';
import {StatusBar, Text} from 'react-native';

import 'react-native-gesture-handler';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import {Home, Login, LoadingScreen, Register, FirstLaunch} from './Screens';

import Toast from 'react-native-toast-message';

import AppContext from './contexts/AppContext';
import {toastConfig} from './configs/ToastConfig';
import SideBarContext from './contexts/SideBarContext';

const Tab = createBottomTabNavigator();

Text.defaultProps = {...Text.defaultProps, allowFontScaling: false}; // Disable font scaling

export default function App() {
  const {loading, user, firstLaunch, colors, theme} = useContext(AppContext);
  const {sideBarOpen} = useContext(SideBarContext);

  return loading || firstLaunch === null ? (
    <LoadingScreen />
  ) : (
    <>
      <StatusBar
        backgroundColor={
          sideBarOpen
            ? colors.Primary
            : theme === 'Dark'
            ? colors.DarkGrey
            : colors.White
        }
        barStyle={
          theme === 'Dark' || sideBarOpen ? 'light-content' : 'dark-content'
        }
        animated={true}
        showHideTransition={'slide'}
      />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              display: 'none',
            },
          }}
          backBehavior="none"
          initialRouteName={
            firstLaunch ? 'FirstLaunch' : user ? 'Home' : 'Login'
          }>
          <Tab.Screen name="FirstLaunch" component={FirstLaunch} />
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Login" component={Login} />
          <Tab.Screen name="Register" component={Register} />
        </Tab.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}
