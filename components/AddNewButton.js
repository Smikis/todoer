import { useLinkProps } from '@react-navigation/native'
import React, { useState } from 'react'
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
import { appendGroup } from '../utils/appendGroup'
import { appendTask } from '../utils/appendTask'
import { groupExists } from '../utils/groupExists'

export default function AddNewButton(props) {
    const [inputText, setInputText] = useState('')
    const [error, setError] = useState(null)
    const [firstDropdownValue, setFirstDropdownValue] = useState(1)
    const [isFirstDropdownFocused, setFirstDropdownFocused] = useState(false)
    const [secondDropdownValue, setSecondDropdownValue] = useState()
    const [isSecondDropdownFocused, setSecondDropdownFocused] = useState(false)
    const [groupChosen, setGroupChosen] = useState()

    const groups = getGroups(props.data)

    function handleExit() {
        props.changeVisibility(false)
        setInputText('')
        setError(null)
        setFirstDropdownValue(1)
        setFirstDropdownFocused(false)
        setSecondDropdownValue()
        setSecondDropdownFocused(false)
        setGroupChosen()
    }

    function handleTaskConfirm() {
        if (!groupChosen) { setError('No group selected!'); return }
        if (inputText === '') { setError('Input cannot be empty!'); return }
        appendTask(props.data, groupChosen, inputText)
        handleExit()
    }

    function handleGroupConfirm() {
        if (inputText === '') { setError('Input cannot be empty!'); return }
        if (groupExists(props.data, inputText)) { setError('Group already exists!'); return }
        appendGroup(props.data, inputText)
        handleExit()
    }

    return (
        <>
            <Pressable
                style={{
                    bottom: 20,
                    height: 50,
                    width: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    backgroundColor: 'blue',
                    elevation: 5
                }}
                onPress={() => props.changeVisibility(true)}
            >
                <Icon name="plus" color="white" size={30} />
            </Pressable>
            <Modal
                animationType='fade'
                transparent={true}
                visible={props.visible || false}
                onRequestClose={handleExit}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.label}>
                            Choose to add
                        </Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={[{ label: 'Task', value: 1 }, { label: 'Group', value: 2 }]}
                            labelField="label"
                            valueField="value"
                            placeholder='Select'
                            value={firstDropdownValue}
                            onFocus={() => setFirstDropdownFocused(true)}
                            onBlur={() => setFirstDropdownFocused(false)}
                            onChange={item => {
                                setFirstDropdownValue(item.value);
                                setFirstDropdownFocused(false);
                                setError(null)
                                setInputText('')
                            }}
                        />
                        {firstDropdownValue === 1 ?
                            <>
                                <Text style={[styles.label, { top: 73 }]}>
                                    Choose group
                                </Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={groups}
                                    labelField="label"
                                    valueField="value"
                                    placeholder='Select'
                                    value={secondDropdownValue}
                                    onFocus={() => setSecondDropdownFocused(true)}
                                    onBlur={() => setSecondDropdownFocused(false)}
                                    onChange={item => {
                                        setSecondDropdownValue(item.value);
                                        setSecondDropdownFocused(false);
                                        setGroupChosen(item.label)
                                    }}
                                />
                                {error && <Text style={styles.error}>{error}</Text>}
                                <TextInput
                                    value={inputText}
                                    style={[styles.task_input, { borderColor: error ? 'red' : 'black' }]}
                                    onChangeText={text => setInputText(text)}
                                    placeholder="Task"
                                    onPressOut={() => setError(null)}
                                />
                                <View style={styles.button_container}>
                                    <Pressable onPress={handleTaskConfirm} style={styles.button}>
                                        <Text style={styles.button_text}>Confirm</Text>
                                    </Pressable>
                                    <Pressable onPress={handleExit} style={[styles.button, styles.btn_cancel]}>
                                        <Text style={[styles.button_text, styles.btn_cancel_text]}>Cancel</Text>
                                    </Pressable>
                                </View>
                            </> :
                            <>
                                {error && <Text style={styles.error}>{error}</Text>}
                                <TextInput
                                    value={inputText}
                                    style={[styles.task_input, { borderColor: error ? 'red' : 'black' }]}
                                    onChangeText={text => setInputText(text)}
                                    placeholder="Group"
                                    onPressOut={() => setError(null)}
                                />
                                <View style={styles.button_container}>
                                    <Pressable onPress={handleGroupConfirm} style={styles.button}>
                                        <Text style={styles.button_text}>Confirm</Text>
                                    </Pressable>
                                    <Pressable onPress={handleExit} style={[styles.button, styles.btn_cancel]}>
                                        <Text style={[styles.button_text, styles.btn_cancel_text]}>Cancel</Text>
                                    </Pressable>
                                </View>
                            </>
                        }
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        padding: 20
    },
    modalView: {
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: 'white',
        elevation: 5,
        padding: 20,
        width: '100%'
    },
    modalHeader: {
        fontSize: 30,
        color: 'black'
    },
    task_input: {
        fontSize: 20,
        width: '100 %',
        borderRadius: 3,
        padding: 15,
        margin: 20,
        elevation: 5,
        backgroundColor: 'white'
    },
    button_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    button: {
        padding: 15,
        backgroundColor: 'blue',
        borderRadius: 5,
        width: 100,
        elevation: 5
    },
    button_text: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center'
    },
    btn_cancel: {
        backgroundColor: 'white',
    },
    btn_cancel_text: {
        color: 'black'
    },
    error: {
        color: 'red',
        fontSize: 20,
        marginTop: 15
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    dropdown: {
        height: 50,
        borderRadius: 3,
        paddingHorizontal: 8,
        width: '100%',
        marginBottom: 15,
        elevation: 5,
        backgroundColor: 'white'
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
})