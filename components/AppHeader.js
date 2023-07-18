import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import AppContext from '../contexts/AppContext'
import ThemeChanger from './ThemeChanger'
import MenuIcon from './MenuIcon'

export default function AppHeader() {
    const { colors, theme } = useContext(AppContext)

    return (
        <View
            style={{
                height: 70,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: 25,
                elevation: 10,
                backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White,
                overflow: 'hidden',
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '25%'
                }}
            >
                <MenuIcon />
                <ThemeChanger />
            </View>
            <Text style={styles(colors, theme).header}>todoer</Text>
        </View>
    )
}

const styles = (colors) =>
    StyleSheet.create({
        header: {
            fontSize: 30,
            fontWeight: 'bold',
            color: colors.Primary
        }
    })