import { Dimensions, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'

import Button from './Button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Layout
} from 'react-native-reanimated'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppContext from '../../contexts/AppContext'
import { useAuth } from '../../hooks/useAuth'

const AnimatedIcon = Animated.createAnimatedComponent(Icon)

export default function Buttons({ step, steps, flatlistRef }) {
  const { setFirstLaunch, setLoading, TEXT } = useContext(AppContext)
  const arrowOpacity = useSharedValue(0)
  const arrowTranslateX = useSharedValue(-50)
  const { width } = Dimensions.get('window')
  const { continueAsGuest } = useAuth()

  const animArrow = useAnimatedStyle(() => {
    return {
      opacity: arrowOpacity.value,
      transform: [{ translateX: arrowTranslateX.value }]
    }
  })

  useEffect(() => {
    if (step === steps.length) {
      arrowOpacity.value = withTiming(0, { duration: 300, delay: 100 })
      arrowTranslateX.value = withTiming(-50, { duration: 300, delay: 100 })
    } else {
      arrowOpacity.value = withTiming(1, { duration: 300, delay: 100 })
      arrowTranslateX.value = withTiming(0, { duration: 300, delay: 100 })
    }
  }, [step])

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width
      }}>
      <Button
        step={step}
        style={{
          zIndex: 1
        }}
        onClick={() => {
          if (step > 0) {
            flatlistRef.current.scrollToIndex({
              index: step - 1,
              animated: true
            })
          }
        }}
        shown={step > 0}
        left
        buttonContent={
          <AnimatedIcon
            style={animArrow}
            name={'arrow-left'}
            size={20}
            color={'#000'}
            layout={Layout.springify()}
          />
        }
      />
      <Button
        step={step}
        style={{
          zIndex: 1
        }}
        onClick={() => {
          if (step < steps.length - 1) {
            flatlistRef.current.scrollToIndex({
              index: step + 1,
              animated: true
            })
          }
        }}
        buttonContent={
          <AnimatedIcon
            style={animArrow}
            name={'arrow-right'}
            size={20}
            color={'#000'}
            layout={Layout.springify()}
          />
        }
        shown={step < steps.length - 1 && step !== 1}
      />
      <Button
        step={step}
        shown={step === 1}
        style={{
          position: 'absolute',
          right: 20,
          zIndex: -1
        }}
        onClick={() => {
          if (step < steps.length - 1) {
            flatlistRef.current.scrollToIndex({
              index: step + 1,
              animated: true
            })
          }
        }}
        buttonContent={
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: '#000'
            }}>
            {TEXT.Continue_As_Guest}
          </Text>
        }
      />
      <Button
        step={step}
        shown={step === steps.length - 1}
        onClick={async () => {
          setLoading(true)
          await AsyncStorage.setItem('@first_launch', 'false')
          setFirstLaunch(false)
          await continueAsGuest()
        }}
        style={{
          position: 'absolute',
          right: 20,
          zIndex: -1
        }}
        buttonContent={
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: '#000'
            }}>
            {TEXT.Get_Started}
          </Text>
        }
      />
    </View>
  )
}
