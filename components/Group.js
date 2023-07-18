import React, { useContext, useEffect, useState } from 'react'

import { StyleSheet, Text, View, Pressable } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { GestureHandlerRootView } from 'react-native-gesture-handler'

import DraggableFlatList from 'react-native-draggable-flatlist'

import PropTypes from 'prop-types'
import AppContext from '../contexts/AppContext'
import { getDoneTasks } from '../utils/getDoneTasks'
import Task from './Task'
import RemoveGroupModal from './RemoveGroupModal'
import RemoveTaskModal from './RemoveTaskModal'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const ordering = {
  0: 'byDateDESC',
  1: 'byDateASC',
  2: 'byNameDESC',
  3: 'byNameASC',
  4: 'byDoneDESC',
  5: 'byDoneASC'
}

const orderIcon = {
  0: 'order-numeric-descending',
  1: 'order-numeric-ascending',
  2: 'order-alphabetical-descending',
  3: 'order-alphabetical-ascending',
  4: 'order-bool-descending',
  5: 'order-bool-ascending'
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon)

export default function Group({
  item,
  index,
  setStopScroll,
}) {
  const [order, setOrder] = useState(item.order || 0)

  const {
    toggleCollapsed,
    updateTaskData,
    sortTasks,
    colors,
    data,
    TEXT
  } = useContext(AppContext)

  const [removeModalVisible, setRemoveModalVisible] = useState(false)
  const [removeTaskModalVisible, setRemoveTaskModalVisible] = useState(false)
  const [chosenTask, setChosenTask] = useState()

  const chevronRotation = useSharedValue(item.collapsed ? 90 : 0)

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${chevronRotation.value}deg` }]
    }
  })

  useEffect(() => {
    chevronRotation.value = !item.collapsed ? withTiming(90, { duration: 200 }) : withTiming(0, { duration: 200 })
  }, [item.collapsed])

  const doneTasks = getDoneTasks(item.id, data)
  const allTasks = item.tasks ? item.tasks.length : 0

  function renderTasks(item, drag, group, index) {
    return (
      <Task
        drag={drag}
        group={group}
        item={item}
        index={index}
        setRemoveTaskModalVisible={setRemoveTaskModalVisible}
        setChosenTask={setChosenTask}
      />
    )
  }

  useEffect(() => {
    sortTasks(item.id, ordering[order], order)
  }, [order])

  return (
    <>
      <RemoveGroupModal
        visible={removeModalVisible}
        group={item}
        setVisible={setRemoveModalVisible}
      />
      <RemoveTaskModal
        visible={removeTaskModalVisible}
        setVisible={setRemoveTaskModalVisible}
        task={chosenTask}
        from={item.id}
      />
      <View style={[styles(colors).group, {
        marginTop: index === 0 ? 15 : 0,
      }]}>
        <Pressable
          style={{
            marginRight: 15,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          onPress={() => toggleCollapsed(item.id)}>
          <View style={styles(colors).group_header}>
            <AnimatedIcon
              style={[{ 
                marginRight: 15,
              }, chevronStyle]}
              name={'chevron-right'}
              size={40}
              color={colors.Grey}
            />
            <Text style={styles(colors).group_text}>
              {item.group.toUpperCase() + ` - ${doneTasks} / ${allTasks}`}
            </Text>
            <Icon
              onPress={() => {
                setOrder(order === 5 ? 0 : order + 1)
              }}
              name={orderIcon[order]}
              size={30}
              color={colors.Grey}
              style={{
                marginLeft: 15,
                borderColor: colors.Grey,
                borderWidth: 1,
                borderRadius: 5
              }}
            />
          </View>
          <Pressable
            onPress={() => {
              setRemoveModalVisible(true)
            }}
            style={styles(colors).remove_btn}>
            <Text style={styles(colors).remove_btn_text}>{TEXT.Remove}</Text>
          </Pressable>
        </Pressable>
        <GestureHandlerRootView>
          <DraggableFlatList
            style={{ display: item.collapsed ? 'none' : 'flex' }}
            data={item.tasks ?? []}
            renderItem={({ item: i, drag, index }) => renderTasks(i, drag, item, index)}
            keyExtractor={item => item.id}
            onDragBegin={() => setStopScroll(true)}
            onRelease={() => setStopScroll(false)}
            onDragEnd={({ data }) => updateTaskData(data, item.id)}
          />
        </GestureHandlerRootView>
      </View>
    </>
  )
}

Group.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
  setStopScroll: PropTypes.func,
}

const styles = (colors) =>
  StyleSheet.create({
    group: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 60,
    },
    group_text: {
      fontSize: 20,
      fontWeight: 'bold',
      letterSpacing: 3,
      color: colors.Grey,
      flexShrink: 1,
    },
    group_header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 15,
      flexShrink: 1
    },
    remove_btn: {
      padding: 10
    },
    remove_btn_text: {
      fontSize: 13,
      fontWeight: 'bold',
      color: colors.Red
    }
  })
