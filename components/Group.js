import React from 'react'

import { StyleSheet, Text, View, Pressable } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

import { GestureHandlerRootView } from 'react-native-gesture-handler'

import DraggableFlatList from 'react-native-draggable-flatlist'

import PropTypes from 'prop-types'

export default function Group({
  item,
  dragItem,
  doneTasks,
  allTasks,
  toggleCollapsed,
  colors,
  setChosenGroup,
  setRemoveModalVisible,
  updateTaskData,
  setStopScroll,
  renderTasks,
  TEXT
}) {
  return (
    <View style={styles(colors).group}>
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
          <Icon
            style={{ marginRight: 15 }}
            name={item.collapsed === false ? 'angle-down' : 'angle-right'}
            size={40}
            color={colors.Grey_Text}
          />
          <Text style={styles(colors).group_text}>
            {item.group.toUpperCase() + ` - ${doneTasks} / ${allTasks}`}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            setChosenGroup(item)
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
          renderItem={({ item, drag }) => renderTasks(item, drag, dragItem)}
          keyExtractor={item => item.id}
          onDragBegin={() => setStopScroll(true)}
          onRelease={() => setStopScroll(false)}
          onDragEnd={({ data }) => updateTaskData(data, item.id)}
        />
      </GestureHandlerRootView>
    </View>
  )
}

Group.propTypes = {
  item: PropTypes.object,
  dragItem: PropTypes.object,
  doneTasks: PropTypes.number,
  allTasks: PropTypes.number,
  toggleCollapsed: PropTypes.func,
  colors: PropTypes.object,
  setChosenGroup: PropTypes.func,
  setRemoveModalVisible: PropTypes.func,
  updateTaskData: PropTypes.func,
  setStopScroll: PropTypes.func,
  parentRef: PropTypes.object,
  renderTasks: PropTypes.func,
  TEXT: PropTypes.object
}

const styles = colors =>
  StyleSheet.create({
    group: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 60
    },
    group_text: {
      fontSize: 20,
      fontWeight: 'bold',
      letterSpacing: 3,
      color: colors.Grey_Text
    },
    group_header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 15
    },
    remove_btn: {
      padding: 10
    },
    remove_btn_text: {
      fontSize: 13,
      fontWeight: 'bold',
      color: colors.Danger
    }
  })
