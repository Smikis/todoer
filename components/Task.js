import React from 'react'

import { ScaleDecorator } from 'react-native-draggable-flatlist'

import { StyleSheet, Text, View, Pressable } from 'react-native'

import { isToday } from '../utils/dates/isToday'
import { isTomorrow } from '../utils/dates/isTomorrow'

import Icon from 'react-native-vector-icons/FontAwesome'

import PropTypes from 'prop-types'

const MILISECONDS_IN_A_DAY = 86400000

Task.propTypes = {
  dueIn: PropTypes.number,
  colors: PropTypes.object,
  item: PropTypes.object,
  TEXT: PropTypes.object,
  drag: PropTypes.func,
  group: PropTypes.object,
  toggleDone: PropTypes.func,
  setRemoveTaskModalVisible: PropTypes.func,
  setChosenTask: PropTypes.func,
  setRemoveTaskFrom: PropTypes.func
}

export default function Task({
  colors,
  item,
  TEXT,
  drag,
  group,
  toggleDone,
  setRemoveTaskModalVisible,
  setChosenTask,
  setRemoveTaskFrom
}) {
  const dueIn =
    Math.ceil((item.due - Date.now()) / MILISECONDS_IN_A_DAY) ?? null
  return (
    <ScaleDecorator>
      <Pressable
        onLongPress={drag}
        onPress={() => toggleDone(group.id, item.id)}>
        <View
          style={[
            styles(colors).task,
            {
              backgroundColor:
                dueIn >= 0 && !item.isDone && !item.repeating
                  ? colors.Danger
                  : colors.Primary,
              borderLeftColor: item.isDone ? colors.Check_Done : colors.Check
            }
          ]}>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles(colors).task_text}>{item.value}</Text>
            {dueIn >= 0 && !item.isDone && !item.repeating ? (
              <Text style={styles(colors).due_text}>
                {isToday(item.due) === true
                  ? TEXT.Home.Due_Today
                  : isTomorrow(item.due) === true
                  ? TEXT.Home.Due_Tomorrow
                  : `${TEXT.Home.Due_In} ${dueIn} ${TEXT.Home.Days} `}
              </Text>
            ) : item.repeating ? (
              <Text style={styles(colors).due_text}>{TEXT.Home.Repeating}</Text>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <Icon
              name={'check'}
              size={20}
              color={item.isDone ? colors.Check_Done : colors.Check}
              style={{ marginRight: 15 }}
            />
            <Icon
              name={'trash'}
              color={colors.Grey_Text}
              size={20}
              onPress={() => {
                setRemoveTaskModalVisible(true)
                setChosenTask(item)
                setRemoveTaskFrom(group.id)
              }}
            />
          </View>
        </View>
      </Pressable>
    </ScaleDecorator>
  )
}

const styles = colors =>
  StyleSheet.create({
    task: {
      padding: 15,
      backgroundColor: colors.Primary,
      borderRadius: 3,
      elevation: 5,
      marginBottom: 10,
      marginTop: 10,
      marginRight: 15,
      marginLeft: 15,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderLeftWidth: 7
    },
    task_text: {
      color: colors.Task_Text,
      fontSize: 17
    },
    due_text: {
      color: colors.Task_Text,
      paddingTop: 5,
      fontWeight: 'bold'
    }
  })
