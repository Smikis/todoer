import React, { useContext } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native'
import AppContext from '../contexts/AppContext'

export default function LoadingScreen() {
  const { TEXT, colors } = useContext(AppContext)
  return (
    <SafeAreaView style={styles(colors).spinner}>
      <StatusBar
        backgroundColor={colors.Primary}
        barStyle="light-content"
      />
      <Image
        source={require('../icons/play_store_512.png')}
        style={{ width: 200, height: 200 }}
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator
          size="large"
          color={colors.White}
          animating={true}
        />
        <Text style={styles(colors).loading_text}>{TEXT.Loading}</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = colors =>
  StyleSheet.create({
    spinner: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.Primary
    },
    loading_text: {
      fontSize: 30,
      color: colors.White
    }
  })
