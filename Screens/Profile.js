import React, { useContext, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native'

import { Switch } from 'react-native'

import { useAuth } from '../hooks/useAuth'

import Icon from 'react-native-vector-icons/FontAwesome'

import AppContext from '../contexts/AppContext'

export default function Profile() {
  const { TEXT, switchTheme, theme, colors } = useContext(AppContext)

  const { user, logout } = useAuth()

  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      await logout()
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles(colors, theme).profile_container}>
      <StatusBar
        backgroundColor={theme === 'Dark' ? colors.DarkGrey : colors.White}
        barStyle={theme === 'Light' ? 'dark-content' : 'light-content'}
      />
      <View style={styles(colors, theme).pfp}>
        {user ? (
          user.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={{
                height: 140,
                width: 140,
                borderRadius: 100,
                overflow: 'hidden'
              }}
            />
          ) : (
            <>
              <View style={styles(colors, theme).profile_circle} />
              <Icon
                style={styles(colors, theme).icon_style}
                name="user-o"
                color={colors.White}
                size={100}
              />
            </>
          )
        ) : null}
      </View>
      <Text style={styles(colors, theme).username_style}>
        {user
          ? user.displayName
            ? user.displayName.toUpperCase()
            : user.email
            ? user.email.substring(0, user.email.indexOf('@')).toUpperCase()
            : TEXT.Guest
          : null}
      </Text>
      <Pressable style={styles(colors, theme).logout_btn} onPress={handleLogout}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
          <Text style={styles(colors, theme).logout_btn_text}>
            {loading ? (
              <ActivityIndicator size={20} color={colors.Text_Btn_Blue} />
            ) : (
              TEXT.Log_Out
            )}
          </Text>
          {loading ? null : <Icon name="sign-out" color={colors.White} size={20} />}
        </View>
      </Pressable>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Switch
          trackColor={{
            false: colors.Grey,
            true: colors.LightDarkGrey
          }}
          thumbColor={colors.Primary}
          onValueChange={switchTheme}
          value={theme === 'Light' ? false : true}
        />
        <Text style={{ color: theme === 'Dark' ? colors.White : colors.Black, marginLeft: 15, fontSize: 15 }}>
          {TEXT.DarkMode}
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = (colors, theme) =>
  StyleSheet.create({
    profile_container: {
      alignItems: 'center',
      backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White,
      display: 'flex',
      flex: 1,
      justifyContent: 'center'
    },
    profile_circle: {
      backgroundColor: colors.Grey,
      width: 140,
      height: 140,
      borderRadius: 100,
      position: 'absolute',
      elevation: 5
    },
    icon_style: {
      position: 'relative',
      elevation: 6
    },
    username_style: {
      fontSize: 30,
      color: theme === 'Dark' ? colors.White : colors.Black,
    },
    pfp: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 30
    },
    logout_btn: {
      backgroundColor: colors.Primary,
      padding: 10,
      borderRadius: 3,
      width: 200,
      margin: 25
    },
    logout_btn_text: {
      color: colors.White,
      textAlign: 'center',
      fontSize: 20
    }
  })
