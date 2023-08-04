import { Pressable } from 'react-native'
import React, { useContext, useEffect } from 'react'

import AppContext from '../../contexts/AppContext'

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Button({
  onClick,
  shown,
  buttonContent,
  left,
  width,
  style
}) {
  const { colors } = useContext(AppContext)

  const buttonOpacity = useSharedValue(1)
  const buttonTranslateX = useSharedValue(left ? -100 : 100)
  const buttonWidth = useSharedValue(width)

  const animButton = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [{ translateX: buttonTranslateX.value }],
      width: buttonWidth.value
    }
  })

  useEffect(() => {
    if (shown) {
      buttonOpacity.value = withSpring(1)
      buttonTranslateX.value = withSpring(0)
    } else {
      buttonOpacity.value = withTiming(0, { duration: 300 })
      buttonTranslateX.value = withTiming(left ? -100 : 100, { duration: 300 })
    }
  }, [shown])

  useEffect(() => {
    buttonWidth.value = withTiming(width, { duration: 300 })
  }, [buttonContent])

  return (
    <AnimatedPressable
      onPress={onClick}
      style={[
        {
          backgroundColor: colors.White,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          ...style
        },
        animButton
      ]}>
      {buttonContent}
    </AnimatedPressable>
  )
}
