/* eslint-disable react-native/no-color-literals */
import React, { useContext } from 'react'

import PropTypes from 'prop-types'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

import AppContext from '../contexts/AppContext'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

RemoveTaskModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  task: PropTypes.object,
  setTaskChosen: PropTypes.func,
  from: PropTypes.string
}

export default function RemoveTaskModal({
  visible,
  setVisible,
  task,
  setTaskChosen,
  from
}) {
  const { TEXT, colors, removeTask } = useContext(AppContext)

  const handleExit = () => {
    setVisible(false)
    setTaskChosen(null)
  }

  const handleConfirm = () => {
    const res = removeTask(from, task.id)

    switch (res) {
      case 'success':
        Toast.show({
          type: 'successToast',
          text1: TEXT.Toast.Success,
          text2: `${TEXT.Toast.Remove_Success_Text}`,
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
      visible={visible || false}
      animationType="fade"
      transparent={true}
      onRequestClose={handleExit}>
      <View style={styles(colors).centeredView}>
        <View style={styles(colors).modalView}>
          <Text style={styles(colors).remove_text}>
            {TEXT.Remove_Group_Modal.Remove_Text}
          </Text>
          <Text style={styles(colors).task_text}>
            {task?.value ? task.value.toUpperCase() : null}
          </Text>
          <View style={styles(colors).buttons}>
            <Pressable
              style={styles(colors).confirm_btn}
              onPress={() => handleConfirm()}>
              <Text style={styles(colors).confirm_text}>{TEXT.Confirm}</Text>
            </Pressable>
            <Pressable
              style={styles(colors).cancel_btn}
              onPress={() => handleExit()}>
              <Text style={styles(colors).cancel_text}>{TEXT.Cancel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
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
      width: '90%'
    },
    confirm_btn: {
      padding: 15,
      borderRadius: 3,
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
      borderRadius: 3
    },
    cancel_text: {
      color: colors.Text,
      fontSize: 15
    },
    input: {
      margin: 15,
      borderRadius: 3,
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
