import React, { useContext, useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'

import AppContext from '../../contexts/AppContext'

import PropTypes from 'prop-types'
import AddNewTaskView from './AddNewTaskView'
import AddNewGroupView from './AddNewGroupView'

import ModalView from '../ModalView'

import Animated from 'react-native-reanimated'

export default function AddNewModal({ visible, changeVisibility }) {
  const { colors, theme, TEXT } = useContext(AppContext)

  const [focused, setFocused] = useState(0)

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

  function handleExit() {
    changeVisibility(false)
  }

  return (
    <ModalView
      visible={visible}
      changeVisibility={changeVisibility}
      handleExit={handleExit}>
      <View style={styles(colors, theme).centeredView}>
        <View style={styles(colors, theme).modalView}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row'
            }}>
            <AnimatedPressable
              style={styles(colors, theme, focused).firstButton}
              onPress={() => setFocused(0)}>
              <Text
                style={{
                  color:
                    focused === 0
                      ? colors.White
                      : theme === 'Dark'
                      ? colors.White
                      : colors.Black
                }}>
                {TEXT.Add_New_Button.Add_Task}
              </Text>
            </AnimatedPressable>
            <AnimatedPressable
              style={styles(colors, theme, focused).secondButton}
              onPress={() => setFocused(1)}>
              <Text
                style={{
                  color:
                    focused === 1
                      ? colors.White
                      : theme === 'Dark'
                      ? colors.White
                      : colors.Black
                }}>
                {TEXT.Add_New_Button.Add_Group}
              </Text>
            </AnimatedPressable>
          </View>
          <View style={{ width: '100%', padding: 20 }}>
            {focused === 0 ? (
              <AddNewTaskView handleExit={handleExit} />
            ) : (
              <AddNewGroupView handleExit={handleExit} />
            )}
          </View>
        </View>
      </View>
    </ModalView>
  )
}

AddNewModal.propTypes = {
  changeVisibility: PropTypes.func,
  visible: PropTypes.bool
}

const styles = (colors, theme, focused) =>
  StyleSheet.create({
    firstButton: {
      backgroundColor:
        focused === 0
          ? theme === 'Dark'
            ? colors.Primary
            : colors.Primary
          : theme === 'Dark'
          ? colors.DarkGrey
          : colors.White,
      width: '50%',
      padding: 20,
      alignItems: 'center',
      borderTopLeftRadius: 10,
      borderBottomRightRadius: focused === 0 ? 10 : 0,
      elevation: focused === 0 ? 10 : 0
    },
    secondButton: {
      backgroundColor:
        focused === 1
          ? theme === 'Dark'
            ? colors.Primary
            : colors.Primary
          : theme === 'Dark'
          ? colors.DarkGrey
          : colors.White,
      width: '50%',
      padding: 20,
      alignItems: 'center',
      borderTopRightRadius: 10,
      borderBottomLeftRadius: focused === 1 ? 10 : 0,
      elevation: focused === 1 ? 10 : 0
    },
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
      elevation: 10,
      width: '100%'
    }
  })
