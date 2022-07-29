import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

import 'react-native-gesture-handler'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'

import Icon from 'react-native-vector-icons/FontAwesome'

import Home from './Screens/Home'
import Login from './Screens/Login'
import Profile from './Screens/Profile'
import LoadingScreen from './Screens/LoadingScreen'

import AddNewButton from './components/AddNewButton'

import { useAuth } from './authentication/authContext'
import { useDb } from './database/dbContext'

import { updateLocalData } from './utils/updateLocalData'
import { readLocalData } from './utils/readLocalData'

const Tab = createBottomTabNavigator()

export default function App() {
  const { user } = useAuth()
  const { readData } = useDb()
  const [data, setData] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    (async () => {
      try {
        const initData = await readData(user)
        setData(initData)
        setLoading(false)
        updateLocalData(initData)
      }
      catch (e) {
        const initData = await readLocalData()
        setData(initData)
        setLoading(false)
      }

    })()
  }, [user])

  if (!user) return (<Login />)

  const MiddleButton = () => { return null }

  return (
    loading ? <LoadingScreen visible={loading}/> :
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
          },
        }}
      >
        <Tab.Screen
          name='Home'
          children={() => <Home data={data} setData={setData}/>}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon name="home" color={focused ? 'blue' : 'black'} size={30} />
              </View>
            )
          }}
        />
        <Tab.Screen
          name="Add"
          options={{
            tabBarLabel: '',
            tabBarButton: () => (<AddNewButton visible={modalVisible} changeVisibility={setModalVisible} data={data} setData={setData}/>)
          }}
          component={MiddleButton}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon name="user" color={focused ? 'blue' : 'black'} size={30} />
              </View>
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}