import React from 'react'
import { Text, View } from 'react-native'

export const toastConfig = {
  successToast: ({ text1, text2, props }) => (
    <View
      style={{
        paddingHorizontal: 15,
        height: 60,
        width: '80%',
        backgroundColor: props.colors.Background,
        borderLeftColor: props.colors.Primary,
        borderLeftWidth: 5,
        elevation: 10,
        borderRadius: 5
      }}>
      <Text
        style={{
          fontSize: 17,
          paddingVertical: 5,
          fontWeight: '400',
          color: props.colors.Text
        }}>
        {text1}
      </Text>
      <Text
        style={{ color: props.colors.Text, fontSize: 14, fontWeight: '500' }}>
        {text2}
      </Text>
    </View>
  ),
  errorToast: ({ text1, text2, props }) => (
    <View
      style={{
        paddingHorizontal: 15,
        height: 60,
        width: '80%',
        backgroundColor: props.colors.Background,
        borderLeftColor: props.colors.Danger,
        borderLeftWidth: 5,
        elevation: 10,
        borderRadius: 5
      }}>
      <Text
        style={{
          fontSize: 17,
          paddingVertical: 5,
          fontWeight: '400',
          color: props.colors.Text
        }}>
        {text1}
      </Text>
      <Text
        style={{ color: props.colors.Text, fontSize: 14, fontWeight: '500' }}>
        {text2}
      </Text>
    </View>
  )
}
