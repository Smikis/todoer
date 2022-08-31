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
import PropTypes from 'prop-types'

export default function LoadingScreen({ visible }) {
  const { TEXT, colors } = useContext(AppContext)
  return (
    <SafeAreaView style={styles(colors).spinner}>
      <StatusBar
        backgroundColor={colors.Loading_Spinner_Bg}
        barStyle="light-content"
      />
      <Image
        source={require('../icons/play_store_512.png')}
        style={{ width: 200, height: 200 }}
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator
          size="large"
          color={colors.Loading_Spinner}
          animating={visible}
        />
        <Text style={styles(colors).loading_text}>{TEXT.Loading}</Text>
      </View>
    </SafeAreaView>
  )
}

LoadingScreen.propTypes = {
  visible: PropTypes.bool
}

const styles = colors =>
  StyleSheet.create({
    spinner: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.Loading_Spinner_Bg
    },
    loading_text: {
      fontSize: 30,
      color: colors.Loading_Text
    }
  })
