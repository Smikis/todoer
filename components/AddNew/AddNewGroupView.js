import React, { useContext, useState } from 'react'
import { TextInput, StyleSheet, View, Pressable, Text } from 'react-native'

import AppContext from '../../contexts/AppContext'

import Toast from 'react-native-toast-message'

import PropTypes from 'prop-types'

export default function AddNewGroupView({ handleExit }) {
  const { colors, theme, TEXT, appendGroup, groupExists } =
    useContext(AppContext)
  const [inputText, setInputText] = useState('')
  const [error, setError] = useState(null)

  function handleConfirm() {
    if (inputText === '') {
      setError(TEXT.Validation.Input_Empty)
      return
    }
    if (groupExists(inputText)) {
      setError(TEXT.Add_New_Button.Group_Exists)
      return
    }
    const res = appendGroup(inputText)

    switch (res) {
      case 'success':
        Toast.show({
          type: 'successToast',
          text1: TEXT.Toast.Success,
          text2: TEXT.Toast.Group_Success_Text,
          props: { colors: colors, theme: theme }
        })
        break
      case 'error':
        Toast.show({
          type: 'errorToast',
          text1: TEXT.Toast.Error,
          text2: TEXT.Toast.Error_Text,
          props: { colors: colors, theme: theme }
        })
        break
    }
    handleExit()
  }

  return (
    <>
      {error && <Text style={styles(colors, theme).error}>{error}</Text>}
      <TextInput
        style={styles(colors, theme).input}
        placeholder={TEXT.Add_New_Button.Title}
        placeholderTextColor={colors.Grey}
        allowFontScaling={false}
        onChangeText={setInputText}
        value={inputText}
        onPressOut={() => setError(null)}
      />
      <View style={styles(colors, theme).button_container}>
        <Pressable onPress={handleConfirm} style={styles(colors, theme).button}>
          <Text style={styles(colors, theme).button_text}>{TEXT.Confirm}</Text>
        </Pressable>
        <Pressable
          onPress={handleExit}
          style={[
            styles(colors, theme).button,
            styles(colors, theme).btn_cancel
          ]}>
          <Text
            style={[
              styles(colors, theme).button_text,
              styles(colors, theme).btn_cancel_text
            ]}>
            {TEXT.Cancel}
          </Text>
        </Pressable>
      </View>
    </>
  )
}

AddNewGroupView.propTypes = {
  handleExit: PropTypes.func
}

const styles = (colors, theme) =>
  StyleSheet.create({
    input: {
      fontSize: 20,
      width: '100%',
      borderRadius: 3,
      padding: 15,
      elevation: 5,
      backgroundColor: theme === 'Dark' ? colors.LightDarkGrey : colors.White,
      color: theme === 'Dark' ? colors.White : colors.Black,
      marginBottom: 20
    },
    button_container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    },
    button: {
      padding: 15,
      backgroundColor: colors.Primary,
      borderRadius: 5,
      width: 100,
      elevation: 5
    },
    button_text: {
      color: colors.White,
      fontSize: 15,
      textAlign: 'center'
    },
    btn_cancel: {
      backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White
    },
    btn_cancel_text: {
      color: theme === 'Dark' ? colors.White : colors.Black
    },
    error: {
      color: colors.Red,
      fontSize: 20,
      marginBottom: 15,
      textAlign: 'center'
    }
  })
