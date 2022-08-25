import React, { useState, useRef, useContext } from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'

import { getDoneTasks } from '../utils/getDoneTasks'

import RemoveGroupModal from '../components/RemoveGroupModal'

import AppContext from '../contexts/AppContext'

import Task from '../components/Task'
import Group from '../components/Group'

export default function Home() {
  const [stopScroll, setStopScroll] = useState(false)
  const [removeModalVisible, setRemoveModalVisible] = useState(false)
  const [chosenGroup, setChosenGroup] = useState()

  const { data, toggleDone, toggleCollapsed, updateTaskData, TEXT, colors } =
    useContext(AppContext)

  function renderTasks(item, drag, group) {
    return (
      <Task
        TEXT={TEXT}
        colors={colors}
        drag={drag}
        group={group}
        item={item}
        toggleDone={toggleDone}
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
      />
    )
  }

  return (
    <View style={styles(colors).background}>
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
    </View>
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
