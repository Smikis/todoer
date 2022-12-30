import React, { useState, useContext } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  StatusBar
} from 'react-native'

import { getDoneTasks } from '../utils/getDoneTasks'

import RemoveGroupModal from '../components/RemoveGroupModal'

import AppContext from '../contexts/AppContext'

import Task from '../components/Task'
import Group from '../components/Group'
import RemoveTaskModal from '../components/RemoveTaskModal'

export default function Home() {
  const [stopScroll, setStopScroll] = useState(false)
  const [removeModalVisible, setRemoveModalVisible] = useState(false)
  const [chosenGroup, setChosenGroup] = useState()
  const [removeTaskModalVisible, setRemoveTaskModalVisible] = useState(false)
  const [chosenTask, setChosenTask] = useState()
  const [removeTaskFrom, setRemoveTaskFrom] = useState()

  const {
    data,
    toggleDone,
    toggleCollapsed,
    updateTaskData,
    TEXT,
    colors,
    theme,
    sortTasks
  } = useContext(AppContext)

  function renderTasks(item, drag, group) {
    return (
      <Task
        TEXT={TEXT}
        colors={colors}
        drag={drag}
        group={group}
        item={item}
        toggleDone={toggleDone}
        setRemoveTaskModalVisible={setRemoveTaskModalVisible}
        setChosenTask={setChosenTask}
        setRemoveTaskFrom={setRemoveTaskFrom}
      />
    )
  }

  function renderGroups({ item }) {
    const dragItem = item
    const doneTasks = getDoneTasks(item.id, data)
    const allTasks = item.tasks ? item.tasks.length : 0
    return (
      <Group
        TEXT={TEXT}
        colors={colors}
        dragItem={dragItem}
        doneTasks={doneTasks}
        allTasks={allTasks}
        item={item}
        toggleCollapsed={toggleCollapsed}
        updateTaskData={updateTaskData}
        renderTasks={renderTasks}
        setChosenGroup={setChosenGroup}
        setRemoveModalVisible={setRemoveModalVisible}
        setStopScroll={setStopScroll}
        sortTasks={sortTasks}
      />
    )
  }

  return (
    <SafeAreaView style={styles(colors).background}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={theme === 'Light' ? 'dark-content' : 'light-content'}
      />
      <Text style={styles(colors).header}>{TEXT.Home.Header}</Text>
      {data?.groups?.length > 0 ? (
        <FlatList
          data={data.groups}
          renderItem={renderGroups}
          scrollEnabled={!stopScroll}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles(colors).no_data}>
          <Text style={styles(colors).no_data_text}>
            {TEXT.Home.No_Data_Text_L}
          </Text>
          <Text style={[styles(colors).no_data_text, { fontSize: 20 }]}>
            {TEXT.Home.No_Data_Text_Sm}
          </Text>
        </View>
      )}
      <RemoveGroupModal
        visible={removeModalVisible}
        group={chosenGroup}
        setVisible={setRemoveModalVisible}
        setGroupChosen={setChosenGroup}
      />
      <RemoveTaskModal
        visible={removeTaskModalVisible}
        setVisible={setRemoveTaskModalVisible}
        setTaskChosen={setChosenTask}
        task={chosenTask}
        from={removeTaskFrom}
      />
    </SafeAreaView>
  )
}

const styles = colors =>
  StyleSheet.create({
    background: {
      backgroundColor: colors.Background,
      height: '100%'
    },
    header: {
      textAlign: 'center',
      fontSize: 30,
      padding: 10,
      letterSpacing: 5,
      color: colors.Grey_Text
    },
    no_data: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '90%'
    },
    no_data_text: {
      fontSize: 30,
      color: colors.Grey_Text,
      fontStyle: 'italic'
    }
  })
