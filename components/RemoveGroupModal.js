import React, { useContext, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Pressable
} from 'react-native'
import PropTypes from 'prop-types'

import Toast from 'react-native-toast-message'

import AppContext from '../contexts/AppContext'

export default function RemoveGroupModal({
  visible,
  setVisible,
  group,
  setGroupChosen
}) {
  const [inputText, setInputText] = useState('')
  const [error, setError] = useState(null)
  const { TEXT, colors, removeGroup } = useContext(AppContext)

  function handleExit() {
    setError(null)
    setInputText('')
    setVisible(false)
    setGroupChosen(null)
  }

  function handleConfirm() {
    if (inputText === '') {
      setError(TEXT.Validation.Input_Empty)
      return
    }
    if (inputText.toUpperCase() !== group.group.toUpperCase()) {
      setError(TEXT.Validation.Incorrect_Input)
      return
    }

    const res = removeGroup(group.id)

    switch (res) {
      case 'success':
        Toast.show({
          type: 'successToast',
          text1: TEXT.Toast.Success,
          text2: `${TEXT.Toast.Remove_Success_Text} ${group.group}!`,
          props: { colors: colors }
        })
        break
      case 'error':
        Toast.show({
          type: 'errorToast',
          text1: TEXT.Toast.Error,
          text2: TEXT.Toast.Error_Text,
          props: { colors: colors }
        })
        break
    }

    handleExit()
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible || false}
      onRequestClose={handleExit}>
      <View style={styles(colors).centeredView}>
        <View style={styles(colors).modalView}>
          <Text style={styles(colors).remove_text}>
            {TEXT.Remove_Group_Modal.Remove_Text}
          </Text>
          <Text style={styles(colors).group_text}>
            {group ? group.group.toUpperCase() : null}
          </Text>
          {error && <Text style={styles(colors).error}>{error}</Text>}
          <TextInput
            style={[
              styles(colors).input,
              { shadowColor: error ? colors.Danger : 'black' }
            ]}
            value={inputText}
            onChangeText={text => setInputText(text)}
            placeholder={`${
              TEXT.Placeholders.Type
            } ${group?.group.toUpperCase()} ${TEXT.Placeholders.To_Confirm}`}
            onPressOut={() => setError(null)}
            placeholderTextColor={'grey'}
          />
          <View style={styles(colors).buttons}>
            <Pressable
              onPress={handleConfirm}
              style={styles(colors).confirm_btn}>
              <Text style={styles(colors).confirm_text}>{TEXT.Remove}</Text>
            </Pressable>
            <Pressable onPress={handleExit} style={styles(colors).cancel_btn}>
              <Text style={styles(colors).cancel_text}>{TEXT.Cancel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

RemoveGroupModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  group: PropTypes.object,
  setGroupChosen: PropTypes.func
}

const styles = colors =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      padding: 20
    },
    modalView: {
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: colors.Background,
      elevation: 5,
      padding: 20,
      width: '100%'
    },
    remove_text: {
      fontSize: 20,
      color: colors.Text,
      padding: 10
    },
    group_text: {
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.Primary
    },
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '90%'
    },
    confirm_btn: {
      padding: 15,
      borderRadius: 5,
      borderColor: colors.Danger,
      borderWidth: 2,
      backgroundColor: colors.Background,
      elevation: 5
    },
    confirm_text: {
      color: colors.Danger,
      fontSize: 15
    },
    cancel_btn: {
      padding: 15,
      backgroundColor: colors.Background,
      elevation: 5,
      borderRadius: 5
    },
    cancel_text: {
      color: colors.Text,
      fontSize: 15
    },
    input: {
      margin: 15,
      borderRadius: 5,
      padding: 15,
      width: '90%',
      elevation: 5,
      backgroundColor: colors.Input_Background,
      color: colors.Grey_Text
    },
    error: {
      color: colors.Danger,
      fontSize: 20,
      marginTop: 15
    }
  })
