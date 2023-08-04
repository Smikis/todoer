import React, { useContext, useEffect } from 'react'

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import AppContext from '../../contexts/AppContext'

export default function Dot({ step, index }) {
  const { colors } = useContext(AppContext)

  const width = useSharedValue(10)
  const color = useSharedValue(colors.White)

  const animDot = useAnimatedStyle(() => {
    return {
      width: width.value,
      backgroundColor: color.value
    }
  })

  useEffect(() => {
    if (step === index) {
      width.value = withSpring(20, { damping: 10, stiffness: 100 })
      color.value = withTiming(colors.White)
    } else {
      width.value = withSpring(10, { damping: 10, stiffness: 100 })
      color.value = withTiming(colors.Grey)
    }
  }, [step])

  return (
    <Animated.View
      key={index}
      style={[
        {
          height: 10,
          width: 10,
          borderRadius: 100,
          backgroundColor: step === index ? colors.White : colors.Grey,
          marginHorizontal: 5
        },
        animDot
      ]}
    />
  )
}
