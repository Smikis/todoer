import React, { useState } from 'react'
import {
    Animated, Pressable,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image
} from 'react-native'

import { useAuth } from '../authentication/authContext'

import Icon from 'react-native-vector-icons/FontAwesome'

export default function Profile() {
    const { user, logout } = useAuth()
    const [isPressed, setIsPressed] = useState(false)

    return (
        <View style={styles.profile_container}>
            <View style={styles.pfp}>
                {user ? ( user.photoURL ? <Image source={{'uri': user.photoURL}} style={{ height: 140, width: 140, borderRadius: 100, overflow: 'hidden' }} /> : <><View style={styles.profile_circle} /><Icon style={styles.icon_style} name='user-o' color='white' size={100} /></>) : null}
            </View>
            <Text style={styles.username_style}>{user ? (user.displayName ? user.displayName.toUpperCase() : user.email.substring(0, user.email.indexOf('@')).toUpperCase()) : null}</Text>
            <TouchableHighlight
                style={styles.logout_btn} 
                onPress={logout}
                activeOpacity={1}
                underlayColor='rgba(0, 0, 255, 0.5)'
                onHideUnderlay = { () => setIsPressed(false) }
                onShowUnderlay = { () => setIsPressed(true) }
            >
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                    <Text style={styles.logout_btn_text}>Log out</Text>
                    <Icon name='sign-out' color={'white'} size={20}/>
                </View>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    profile_container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    profile_circle: {
        backgroundColor: 'grey',
        width: 140,
        height: 140,
        borderRadius: 100,
        position: 'absolute'
    },
    icon_style: {
        position: 'relative'
    },
    username_style: {
        fontSize: 30,
        color: 'black'
    },
    pfp: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    logout_btn: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        width: 200,
        margin: 25
    },
    logout_btn_text: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20
    }
})