import React, {useContext, useState} from 'react';
import {View} from 'react-native';

import 'react-native-gesture-handler';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome';

import Home from './Screens/Home';
import Login from './Screens/Login';
import Profile from './Screens/Profile';
import LoadingScreen from './Screens/LoadingScreen';
import Register from './Screens/Register';
import AddNewButton from './components/AddNewButton';

import Toast from 'react-native-toast-message';

import AppContext from './contexts/AppContext';
import {toastConfig} from './configs/ToastConfig';

const Tab = createBottomTabNavigator();

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);

  const {loading, user, TEXT, colors} = useContext(AppContext);

  const MiddleButton = () => {
    return null;
  };

  return loading ? (
    <LoadingScreen visible={loading} />
  ) : (
    <>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              height: 60,
              display: user ? 'flex' : 'none',
              backgroundColor: colors.Background,
              elevation: 5,
              borderColor: colors.Grey_Text,
            },
          }}>
          {user ? (
            <>
              <Tab.Screen
                name="Home"
                component={Home}
                options={{
                  tabBarLabel: TEXT.Screens.Home,
                  tabBarIcon: ({focused}) => (
                    <View
                      style={{
                        height: 50,
                        width: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="home"
                        color={
                          focused ? colors.Nav_Icon_Focused : colors.Nav_Icon
                        }
                        size={30}
                      />
                    </View>
                  ),
                }}
              />
              <Tab.Screen
                name="Add"
                options={{
                  tabBarLabel: '',
                  tabBarButton: () => (
                    <AddNewButton
                      visible={modalVisible}
                      changeVisibility={setModalVisible}
                    />
                  ),
                }}
                component={MiddleButton}
              />
              <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                  tabBarLabel: TEXT.Screens.Profile,
                  tabBarIcon: ({focused}) => (
                    <View
                      style={{
                        height: 50,
                        width: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="user"
                        color={
                          focused ? colors.Nav_Icon_Focused : colors.Nav_Icon
                        }
                        size={30}
                      />
                    </View>
                  ),
                }}
              />
            </>
          ) : (
            <>
              <Tab.Screen
                name="Login"
                component={Login}
                options={{
                  tabBarButton: () => {},
                }}
              />
              <Tab.Screen
                name="Register"
                component={Register}
                options={{
                  tabBarButton: () => {},
                }}
              />
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}
