import React, { useContext } from 'react'
import { ActivityIndicator, StyleSheet, Text, View, Image } from 'react-native'
import AppContext from '../contexts/AppContext'
import PropTypes from 'prop-types'

export default function LoadingScreen({ visible }) {
  const { TEXT, colors } = useContext(AppContext)
  return (
    <View style={styles(colors).spinner}>
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
    </View>
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
