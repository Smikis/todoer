import React, { useContext } from 'react'

import PropTypes from 'prop-types'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import AppContext from '../contexts/AppContext'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import ModalView from './ModalView'

RemoveTaskModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  task: PropTypes.object,
  from: PropTypes.string
}

export default function RemoveTaskModal({ visible, setVisible, task, from }) {
  const { TEXT, colors, removeTask, theme } = useContext(AppContext)

  const handleExit = () => {
    setVisible(false)
  }

  const handleConfirm = () => {
    const res = removeTask(from, task.id)

    switch (res) {
      case 'success':
        Toast.show({
          type: 'successToast',
          text1: TEXT.Toast.Success,
          text2: `${TEXT.Toast.Remove_Success_Text}`,
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
    <ModalView visible={visible} handleExit={handleExit}>
      <View style={styles(colors, theme).centeredView}>
        <View style={styles(colors, theme).modalView}>
          <Text style={styles(colors, theme).remove_text}>
            {TEXT.Remove_Group_Modal.Remove_Text}
          </Text>
          <Text style={styles(colors, theme).task_text}>
            {task?.value ? task.value.toUpperCase() : null}
          </Text>
          <View style={styles(colors, theme).buttons}>
            <Pressable
              style={styles(colors, theme).confirm_btn}
              onPress={() => handleConfirm()}>
              <Text style={styles(colors, theme).confirm_text}>
                {TEXT.Confirm}
              </Text>
            </Pressable>
            <Pressable
              style={styles(colors, theme).cancel_btn}
              onPress={() => handleExit()}>
              <Text style={styles(colors, theme).cancel_text}>
                {TEXT.Cancel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ModalView>
  )
}

const styles = (colors, theme) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    },
    modalView: {
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White,
      elevation: 5,
      padding: 20,
      width: '100%'
    },
    remove_text: {
      fontSize: 20,
      color: theme === 'Dark' ? colors.White : colors.Black,
      padding: 10
    },
    task_text: {
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.Primary,
      marginBottom: 15
    },
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '90%',
      marginTop: 10
    },
    confirm_btn: {
      padding: 15,
      borderRadius: 3,
      borderColor: colors.Red,
      borderWidth: 2,
      backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White,
      elevation: 5
    },
    confirm_text: {
      color: colors.Red,
      fontSize: 15
    },
    cancel_btn: {
      padding: 15,
      backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White,
      elevation: 5,
      borderRadius: 3
    },
    cancel_text: {
      color: theme === 'Dark' ? colors.White : colors.Black,
      fontSize: 15
    }
  })
