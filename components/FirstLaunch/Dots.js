import { View, Text } from 'react-native'
import React from 'react'
import Dot from './Dot'

export default function Dots({ steps, step }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      {steps.map((item, index) => (
        <Dot key={index} step={step} index={index} />
      ))}
    </View>
  )
}
