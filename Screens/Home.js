import React, { useEffect, useState, useRef } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Pressable
} from 'react-native'

import { GestureHandlerRootView, FlatList } from 'react-native-gesture-handler'

import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist"

import Icon from 'react-native-vector-icons/FontAwesome'

import { getDoneTasks } from '../utils/getDoneTasks'
import { toggleCollapsed } from '../utils/toggleCollapsed'
import { updateTaskData } from '../utils/updateTaskData'
import { toggleDone } from '../utils/toggleDone'

import RemoveGroupModal from '../components/RemoveGroupModal'

export default function Home({ data, setData }) {

    const [forceUpdate, setForceUpdate] = useState()
    const parentRef = useRef(null)
    const [stopScroll, setStopScroll] = useState(false)
    const [removeModalVisible, setRemoveModalVisible] = useState(false)
    const [chosenGroup, setChosenGroup] = useState()

    const renderTasks = (item, drag, group) => {
        return (
            <ScaleDecorator>
                <Pressable onLongPress={drag}>
                    <View style={styles.task}>
                        <Text style={styles.task_text}>{item.value}</Text>
                        <Icon onPress={() => toggleDone(group.group, data, setData, setForceUpdate, item)} name={'check'} size={25} color={item.state === 'DONE' ? 'lime' : 'grey'} />
                    </View>
                </Pressable>
            </ScaleDecorator>
        )
    }

    const renderGroups = ({ item }) => {
        const dragItem = item
        const taskData = data
        const doneTasks = getDoneTasks(item.group, data)
        const allTasks = item.tasks.length
        return (
            <View style={styles.group}>
                <Pressable style={{ marginRight: 15, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => toggleCollapsed(item, data, setData, setForceUpdate)} >
                    <View style={styles.group_header}>
                        <Icon style={{ marginRight: 15 }} name={item.collapsed === false ? 'angle-down' : 'angle-right'} size={40} color='black' />
                        <Text style={styles.group_text}>{item.group.toUpperCase() + ` - ${doneTasks} / ${allTasks}`}</Text>
                    </View>
                    <Pressable onPress={() => {setChosenGroup(item.group); setRemoveModalVisible(true)}} style={styles.remove_btn}><Text style={styles.remove_btn_text}>Remove</Text></Pressable>
                </Pressable>
                <GestureHandlerRootView>
                    <DraggableFlatList
                        style={{ display: item.collapsed === true ? 'none' : 'flex' }}
                        data={item.tasks}
                        simultaneousHandlers={parentRef}
                        renderItem={({ item, drag }) => renderTasks(item, drag, dragItem)}
                        keyExtractor={(item) => item.created}
                        onDragBegin={() => setStopScroll(true)}
                        onRelease={() => setStopScroll(false)}
                        onDragEnd={({ data }) => updateTaskData(data, taskData, setForceUpdate, item, setData)}
                    />
                </GestureHandlerRootView>
            </View>
        )
    }

    return (
        <View>
            <Text style={styles.header}>YOUR TASKS</Text>
            <RemoveGroupModal
                data={data}
                setData={setData}
                visible={removeModalVisible} 
                group={chosenGroup} 
                setVisible={setRemoveModalVisible} 
                setGroupChosen={setChosenGroup}
                setForceUpdate={setForceUpdate}
            />
            <FlatList
                data={data.groups}
                renderItem={renderGroups}
                scrollEnabled={!stopScroll}
                ref={(f) => f && (parentRef.current = f._listRef._scrollRef)}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    group: {
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 60
    },
    group_text: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 3,
    },
    task: {
        padding: 15,
        backgroundColor: 'blue',
        borderRadius: 5,
        borderColor: 'black',
        elevation: 5,
        marginBottom: 10,
        marginTop: 10,
        marginRight: 15,
        marginLeft: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    task_text: {
        color: 'white',
        fontSize: 17
    },
    group_header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
    },
    header: {
        textAlign: 'center',
        fontSize: 30,
        padding: 10,
        letterSpacing: 5
    },
    remove_btn: {
        padding: 10
    },
    remove_btn_text: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'red'
    }
})