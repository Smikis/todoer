import React, { useContext } from 'react'
import { Text } from 'react-native'

import 'react-native-gesture-handler'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'

import Home from './Screens/Home'
import Login from './Screens/Login'
import Profile from './Screens/Profile'
import LoadingScreen from './Screens/LoadingScreen'
import Register from './Screens/Register'

import Toast from 'react-native-toast-message'

import AppContext from './contexts/AppContext'
import { toastConfig } from './configs/ToastConfig'

const Tab = createBottomTabNavigator()

Text.defaultProps = { ...Text.defaultProps, allowFontScaling: false } // Disable font scaling

export default function App() {
  const { loading, user } = useContext(AppContext)

  const MiddleButton = () => {
    return null
  }

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              display: 'none'
            }
          }}>
          {user ? (
            <>
              <Tab.Screen
                name="Home"
                component={Home}
              />
              <Tab.Screen
                name="Add"
                component={MiddleButton}
              />
              <Tab.Screen
                name="Profile"
                component={Profile}
              />
            </>
          ) : (
            <>
              <Tab.Screen
                name="Login"
                component={Login}
              />
              <Tab.Screen
                name="Register"
                component={Register}
              />
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  )
}
