import React, { useContext, useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Pressable
} from 'react-native'

import { Dropdown } from 'react-native-element-dropdown'

import Icon from 'react-native-vector-icons/FontAwesome'

import { getGroups } from '../utils/getGroups'
import { groupExists } from '../utils/groupExists'

import AppContext from '../contexts/AppContext'

import PropTypes from 'prop-types'

import DatePicker from 'react-native-date-picker'

import CheckBox from '@react-native-community/checkbox'

import Toast from 'react-native-toast-message'

export default function AddNewButton({ changeVisibility, visible }) {
  const [inputText, setInputText] = useState('')
  const [groups, setGroups] = useState([])
  const [error, setError] = useState(null)
  const [firstDropdownValue, setFirstDropdownValue] = useState(1)
  const [secondDropdownValue, setSecondDropdownValue] = useState()
  const [groupChosenId, setGroupChosenId] = useState()
  const [date, setDate] = useState(new Date())
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [dateError, setDateError] = useState()
  const { data, appendGroup, TEXT, appendTask, colors } = useContext(AppContext)
  const [dateBtnText, setDateBtnText] = useState(TEXT.Placeholders.Select)

  useEffect(() => {
    setGroups(getGroups(data))
  }, [data])

  function clearErrors() {
    setError(null)
    setDateError(null)
  }

  function handleExit() {
    changeVisibility(false)
    setInputText('')
    setFirstDropdownValue(1)
    setSecondDropdownValue()
    setGroupChosenId()
    setDateBtnText(TEXT.Placeholders.Select)
    setToggleCheckBox(false)
    setDatePickerOpen(false)
    clearErrors()
  }

  async function handleTaskConfirm() {
    if (!groupChosenId) {
      setError(TEXT.Add_New_Button.No_Group_Chosen)
      return
    }
    if (inputText === '') {
      setError(TEXT.Validation.Input_Empty)
      return
    }

    let res

    if (toggleCheckBox) {
      if (date.getTime() - Date.now() <= 0) {
        setDateError(TEXT.Validation.Date_Must_Be_In_Future)
        return
      } else {
        res = await appendTask(groupChosenId, inputText, date)
      }
    } else {
      res = await appendTask(groupChosenId, inputText)
    }

    switch (res) {
      case 'success':
        Toast.show({
          type: 'successToast',
          text1: TEXT.Toast.Success,
          text2: TEXT.Toast.Task_Success_Text,
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

  function handleGroupConfirm() {
    if (inputText === '') {
      setError(TEXT.Validation.Input_Empty)
      return
    }
    if (groupExists(data, inputText)) {
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
    <>
      <Pressable
        style={styles(colors).middleButton}
        onPress={() => changeVisibility(true)}>
        <Icon name="plus" color={colors.Middle_Btn_Plus} size={30} />
      </Pressable>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible || false}
        onRequestClose={handleExit}>
        <View style={styles(colors).centeredView}>
          <View style={styles(colors).modalView}>
            <Text style={styles(colors).label}>
              {TEXT.Add_New_Button.Dropdown_1.Label}
            </Text>
            <Dropdown
              style={styles(colors).dropdown}
              placeholderStyle={{ color: colors.Grey_Text, fontSize: 15 }}
              selectedTextStyle={{
                color: colors.Grey_Text,
                fontSize: 15
              }}
              data={[
                { label: TEXT.Add_New_Button.Task, value: 1 },
                { label: TEXT.Add_New_Button.Group, value: 2 }
              ]}
              labelField="label"
              valueField="value"
              placeholder={TEXT.Placeholders.Select}
              value={firstDropdownValue}
              showsVerticalScrollIndicator={false}
              containerStyle={{ backgroundColor: colors.Dropdown_Item_Bg }}
              renderItem={item => (
                <View
                  style={{
                    height: 50,
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: colors.Dropdown_Container_Bg
                  }}>
                  <Text
                    style={{
                      color: colors.Grey_Text,
                      paddingLeft: 15,
                      fontSize: 15
                    }}>
                    {item.label}
                  </Text>
                </View>
              )}
              onChange={item => {
                setFirstDropdownValue(item.value)
                setError(null)
                setInputText('')
              }}
            />
            {firstDropdownValue === 1 ? (
              <>
                <Text style={[styles(colors).label, { top: 93 }]}>
                  {TEXT.Add_New_Button.Dropdown_2.Label}
                </Text>
                <Dropdown
                  style={styles(colors).dropdown}
                  placeholderStyle={{ color: colors.Grey_Text, fontSize: 15 }}
                  selectedTextStyle={{ color: colors.Grey_Text, fontSize: 15 }}
                  data={groups}
                  labelField="label"
                  valueField="value"
                  placeholder={TEXT.Placeholders.Select}
                  value={secondDropdownValue}
                  showsVerticalScrollIndicator={false}
                  containerStyle={{
                    backgroundColor: colors.Dropdown_Item_Bg
                  }}
                  renderItem={item => (
                    <View
                      style={{
                        height: 50,
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: colors.Dropdown_Container_Bg
                      }}>
                      <Text
                        style={{
                          color: colors.Grey_Text,
                          paddingLeft: 15,
                          fontSize: 15
                        }}>
                        {item.label}
                      </Text>
                    </View>
                  )}
                  onChange={item => {
                    setSecondDropdownValue(item.value)
                    setGroupChosenId(item.value)
                  }}
                />
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%'
                  }}>
                  <CheckBox
                    disabled={false}
                    value={toggleCheckBox}
                    onValueChange={newValue => setToggleCheckBox(newValue)}
                    tintColors={{
                      true: colors.Primary,
                      false: colors.Grey_Text
                    }}
                  />
                  <Text style={{ color: colors.Text, marginLeft: 20 }}>
                    {TEXT.Home.Has_End_Date}
                  </Text>
                </View>
                {toggleCheckBox && (
                  <>
                    {dateError && (
                      <Text style={styles(colors).error}>{dateError}</Text>
                    )}
                    <Pressable
                      style={styles(colors).select_date}
                      onPress={() => {
                        setDatePickerOpen(true)
                        clearErrors()
                      }}>
                      <Text style={{ color: colors.Grey_Text }}>
                        {dateBtnText}
                      </Text>
                    </Pressable>
                  </>
                )}
                {error && <Text style={styles(colors).error}>{error}</Text>}
                <TextInput
                  value={inputText}
                  style={[
                    styles(colors).task_input,
                    { borderColor: error ? colors.Danger : 'black' }
                  ]}
                  onChangeText={text => setInputText(text)}
                  placeholder={TEXT.Add_New_Button.Task}
                  onPressOut={() => setError(null)}
                  placeholderTextColor={'grey'}
                />
                <DatePicker
                  modal
                  mode="date"
                  open={datePickerOpen}
                  date={date}
                  onConfirm={date => {
                    setDatePickerOpen(false)
                    setDateBtnText(`${date.toLocaleDateString()}`)
                    setDate(date)
                  }}
                  onCancel={() => {
                    setDatePickerOpen(false)
                  }}
                />
                <View style={styles(colors).button_container}>
                  <Pressable
                    onPress={handleTaskConfirm}
                    style={styles(colors).button}>
                    <Text style={styles(colors).button_text}>
                      {TEXT.Confirm}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleExit}
                    style={[styles(colors).button, styles(colors).btn_cancel]}>
                    <Text
                      style={[
                        styles(colors).button_text,
                        styles(colors).btn_cancel_text
                      ]}>
                      {TEXT.Cancel}
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                {error && <Text style={styles(colors).error}>{error}</Text>}
                <TextInput
                  value={inputText}
                  style={[
                    styles(colors).task_input,
                    { borderColor: error ? colors.Danger : 'black' }
                  ]}
                  onChangeText={text => setInputText(text)}
                  placeholder={TEXT.Add_New_Button.Group}
                  onPressOut={() => setError(null)}
                  placeholderTextColor={'grey'}
                />
                <View style={styles(colors).button_container}>
                  <Pressable
                    onPress={handleGroupConfirm}
                    style={styles(colors).button}>
                    <Text style={styles(colors).button_text}>
                      {TEXT.Confirm}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleExit}
                    style={[styles(colors).button, styles(colors).btn_cancel]}>
                    <Text
                      style={[
                        styles(colors).button_text,
                        styles(colors).btn_cancel_text
                      ]}>
                      {TEXT.Cancel}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  )
}

AddNewButton.propTypes = {
  changeVisibility: PropTypes.func,
  visible: PropTypes.bool
}

const styles = colors =>
  StyleSheet.create({
    middleButton: {
      bottom: 25,
      height: 50,
      width: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      backgroundColor: colors.Middle_Btn_Bg,
      elevation: 5
    },
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
      paddingBottom: 40,
      paddingTop: 40,
      width: '100%'
    },
    task_input: {
      fontSize: 20,
      width: '100 %',
      borderRadius: 3,
      padding: 15,
      margin: 20,
      elevation: 5,
      backgroundColor: colors.Input_Background,
      color: colors.Grey_Text
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
      color: colors.Text_Btn_Blue,
      fontSize: 15,
      textAlign: 'center'
    },
    btn_cancel: {
      backgroundColor: colors.Background
    },
    btn_cancel_text: {
      color: colors.Text
    },
    error: {
      color: colors.Danger,
      fontSize: 20,
      marginTop: 15
    },
    dropdown: {
      height: 50,
      borderRadius: 3,
      paddingHorizontal: 8,
      width: '100%',
      marginBottom: 15,
      backgroundColor: colors.Input_Background,
      elevation: 5,
      fontSize: 50
    },
    label: {
      position: 'absolute',
      backgroundColor: colors.Transparent,
      left: 22,
      top: 27,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
      color: colors.Text
    },
    select_date: {
      padding: 15,
      backgroundColor: colors.Background,
      borderColor: colors.Primary,
      borderWidth: 1,
      width: '100%',
      elevation: 5,
      borderRadius: 3,
      marginTop: 10
    }
  })
