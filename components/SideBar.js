import { View, Text, SafeAreaView, Image, Pressable, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import AppContext from '../contexts/AppContext'

import Icon from 'react-native-vector-icons/FontAwesome'
import { useAuth } from '../hooks/useAuth'
import SideBarContext from '../contexts/SideBarContext'

export default function SideBar() {
    const {colors, theme, TEXT } = useContext(AppContext)
    const { setSideBarOpen } = useContext(SideBarContext)
    const { user, logout } = useAuth()

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.Primary,
                justifyContent: 'flex-start',
                padding: 20
            }}
        >
            <View
                style={{
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '40%',
                    paddingVertical: 20,
                }}
            >
                <View
                    style={{
                        flexDirection: 'column',
                        width: '100%',
                        marginBottom: 50,
                        alignItems: 'center',
                    }}
                >
                    <View style={styles(colors, theme).pfp}>
                        {user ? (
                            user.photoURL ? (
                                <Image
                                    source={{ uri: user.photoURL }}
                                    style={{
                                        height: 100,
                                        width: 100,
                                        borderRadius: 100,
                                        overflow: 'hidden'
                                    }}
                                />
                            ) : (
                                <View
                                    style={{
                                        height: 100,
                                        width: 100,
                                        borderRadius: 100,
                                        overflow: 'hidden',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <View style={styles(colors, theme).profile_circle} />
                                    <Icon
                                        style={styles(colors, theme).icon_style}
                                        name="user-o"
                                        color={colors.White}
                                        size={70}
                                    />
                                </View>
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
                </View>
                <Pressable 
                    onPress={async () => {
                        await logout()
                        setSideBarOpen(false)
                    }}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Icon name="sign-out" color={colors.White} size={30} />
                    <Text
                        style={{
                            fontSize: 20,
                            color: colors.White,
                            fontWeight: 'bold'
                        }}
                    >
                        Atsijungti
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = (colors) =>
  StyleSheet.create({
    profile_circle: {
      backgroundColor: colors.Grey,
      width: 100,
      height: 100,
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
      color: colors.White,
    },
    pfp: {
        marginBottom: 20
    }
  })