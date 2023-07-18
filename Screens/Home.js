import React, { useContext, useEffect } from 'react'
import {
  StyleSheet,
  StatusBar,
} from 'react-native'

import AppContext from '../contexts/AppContext'
import SideBarContext from '../contexts/SideBarContext'

import AddNewButton from '../components/AddNew/AddNewButton'
import AppHeader from '../components/AppHeader'
import SideBar from '../components/SideBar'
import HomeContent from '../components/HomeContent'

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

export default function Home() {
  const { colors, theme } = useContext(AppContext)
  const { sideBarOpen } = useContext(SideBarContext)

  const scale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const borderRadius = useSharedValue(0)

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value }
      ],
      borderRadius: borderRadius.value
    }
  })

  useEffect(() => {
    if (sideBarOpen) {
      scale.value = withTiming(0.9, { duration: 500 })
      translateX.value = withTiming(200, { duration: 500 })
      borderRadius.value = withTiming(10, { duration: 500 })
    } else {
      scale.value = withTiming(1, { duration: 500 })
      translateX.value = withTiming(0, { duration: 500 })
      borderRadius.value = withTiming(0, { duration: 500 })
    }
  }, [sideBarOpen])

  return (
    <>
      <StatusBar
        backgroundColor={sideBarOpen ? colors.Primary : theme === 'Dark' ? colors.DarkGrey : colors.White}
        barStyle={theme === 'Dark' || sideBarOpen ? 'light-content' : 'dark-content'}
        animated={true}
      />
      <SideBar />
      <Animated.View style={[styles(colors, theme).background, animStyle]}>
        <AppHeader />
        <HomeContent />
        <AddNewButton />
      </Animated.View>
    </>
  )
}

const styles = (colors, theme) =>
  StyleSheet.create({
    background: {
      backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White,
      flexGrow: 1,
      position: 'absolute',
      top: 0, 
      left: 0,
      right: 0,
      bottom: 0,
      elevation: 10,
      overflow: 'hidden'
    }
  })
