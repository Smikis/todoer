import React from 'react'

import { StyleSheet, Text, View, Pressable } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { GestureHandlerRootView } from 'react-native-gesture-handler'

import DraggableFlatList from 'react-native-draggable-flatlist'

import PropTypes from 'prop-types'

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
  TEXT,
  sortTasks
}) {
  const [order, setOrder] = React.useState(item.order || 0)

  React.useEffect(() => {
    sortTasks(item.id, ordering[order], order)
  }, [order])

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
            name={item.collapsed === false ? 'chevron-down' : 'chevron-right'}
            size={40}
            color={colors.Grey_Text}
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
            color={colors.Grey_Text}
            style={{
              marginLeft: 15,
              borderColor: colors.Grey_Text,
              borderWidth: 1,
              borderRadius: 5
            }}
          />
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
  TEXT: PropTypes.object,
  sortTasks: PropTypes.func
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
      color: colors.Grey_Text,
      flexShrink: 1
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
      color: colors.Danger
    }
  })
