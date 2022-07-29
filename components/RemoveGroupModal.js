import React, { useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Modal,
    Pressable
} from 'react-native'

import { removeGroup } from '../utils/removeGroup'

export default function RemoveGroupModal({ data, setData, visible, setVisible, group, setGroupChosen, setRemoveModalVisible, setForceUpdate }) {

    const [inputText, setInputText] = useState('')
    const [error, setError] = useState(null)

    function handleExit() {
        setError(null),
        setInputText('')
        setVisible(false)
        setGroupChosen(null)
    }

    function handleConfirm() {
        if (inputText === '') {setError('Input cannot be empty!'); return}
        if (inputText.toUpperCase() !== group.toUpperCase()) {setError(`Incorrect input!`); return}
        removeGroup(data, setData, group)
        handleExit()
    }

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible || false}
            onRequestClose={handleExit}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.remove_text}>Are you sure you want to remove</Text>
                    <Text style={styles.group_text}>{group ? group.toUpperCase() : null}</Text>
                    { error && <Text style={styles.error}>{error}</Text> }
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={text => setInputText(text)}
                        placeholder={`Type ${group ? group.toUpperCase() : null} to confirm`}
                        onPressOut={() => setError(null)}
                    />
                    <View style={styles.buttons}>
                        <Pressable onPress={handleConfirm} style={styles.confirm_btn}><Text style={styles.confirm_text}>Confirm</Text></Pressable>
                        <Pressable onPress={handleExit} style={styles.cancel_btn}><Text style={styles.cancel_text}>Cancel</Text></Pressable>
                    </View>
                </View>
            </View>
        </Modal>
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
    remove_text: {
        fontSize: 20,
        color: 'black',
        padding: 10,
    },
    group_text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'blue'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%'
    },
    confirm_btn: {
        padding: 10,
        borderRadius: 5,
        borderColor: 'red',
        borderWidth: 1
    },
    confirm_text: {
        color: 'red',
        fontSize: 15
    },
    cancel_btn: {
        padding: 10
    },
    cancel_text: {
        color: 'black',
        fontSize: 15
    },
    input: {
        borderColor: 'black',
        borderWidth: 1,
        margin: 15,
        borderRadius: 5,
        padding: 15,
        width: '90%',
        elevation: 5,
        backgroundColor: 'white'
    },
    error: {
        color: 'red',
        fontSize: 20,
        marginTop: 15
    }
})