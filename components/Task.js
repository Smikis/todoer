import React, { useContext, useEffect } from 'react'

import { ScaleDecorator } from 'react-native-draggable-flatlist'

import { StyleSheet, Text, View, Pressable } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

import PropTypes from 'prop-types'

import { getDueText } from '../utils/getDueText'
import AppContext from '../contexts/AppContext'

import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const MILISECONDS_IN_A_DAY = 86400000

Task.propTypes = {
  item: PropTypes.object,
  drag: PropTypes.func,
  group: PropTypes.object,
  index: PropTypes.number,
  setRemoveTaskModalVisible: PropTypes.func,
  setChosenTask: PropTypes.func,
}

export default function Task({
  item,
  drag,
  index,
  group,
  setRemoveTaskModalVisible,
  setChosenTask,
}) {
  const dueIn =
    Math.ceil((item.due - Date.now()) / MILISECONDS_IN_A_DAY) ?? null

  const {
    toggleDone,
    TEXT,
    colors,
    theme
  } = useContext(AppContext)
  
  const opacity = useSharedValue(0)
  const translateX = useSharedValue(-100)

  const animStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          translateX: translateX.value
        }
      ]
    }
  })

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500, delay: index * 100 })
    translateX.value = withTiming(0, { duration: 500, delay: index * 100 })
  }, [])

  return (
    <ScaleDecorator>
      <AnimatedPressable
        onLongPress={drag}
        style={animStyle}
        onPress={() => {
          if (item.repeating || (item.due - Date.now() <= 0 && item.due)) return
          toggleDone(group.id, item.id)
        }}
      >
        <View
          style={[
            styles(colors, theme).task,
            {
              backgroundColor:
                dueIn <= 1 && item.due && !item.isDone && !item.repeating
                  ? colors.Red
                  : colors.Primary,
              borderLeftColor:
                item.isDone && !item.repeating
                  ? colors.Green
                  : colors.White
            }
          ]}>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles(colors, theme).task_text}>{item.value}</Text>
            {((item.due || item.repeating) && !item.isDone) && <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10
              }}>
              <Icon
                name={'clock-o'}
                size={15}
                color={colors.White}
                style={{ marginRight: 5, marginLeft: 5 }}
              />
              {item.due && !item.isDone && !item.repeating ? (
                <Text style={styles(colors, theme).due_text}>
                  {getDueText(item.due, TEXT)}
                </Text>
              ) : item.repeating ? (
                <Text style={styles(colors, theme).due_text}>
                  {TEXT.Home.Repeating}
                </Text>
              ) : null}
            </View>
            }
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderLeftColor: colors.White,
              borderLeftWidth: 1,
              height: '100%',
              paddingLeft: 20
            }}>
            {(!item.repeating && item.due - Date.now() >= 0) || !item.due ? (
              <Icon
                name={'check'}
                size={20}
                color={item.isDone ? colors.Green : colors.White}
                style={{ marginRight: 20 }}
              />
            ) : null}
            <Icon
              name={'trash-o'}
              color={colors.White}
              size={20}
              style={{ marginRight: 10 }}
              onPress={() => {
                setRemoveTaskModalVisible(true)
                setChosenTask(item)
              }}
            />
          </View>
        </View>
      </AnimatedPressable>
    </ScaleDecorator>
  )
}

const styles = (colors) =>
  StyleSheet.create({
    task: {
      padding: 15,
      paddingLeft: 10,
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
      color: colors.White,
      fontSize: 17,
      paddingHorizontal: 5
    },
    due_text: {
      color: colors.White,
      fontWeight: '500',
      fontSize: 10
    }
  })
