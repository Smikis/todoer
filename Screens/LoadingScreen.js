import React from 'react'
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View
} from 'react-native'

export default function LoadingScreen(props) {
    return (
        <View style={styles.spinner}>
            <ActivityIndicator
                size='large'
                color='blue'
                animating={props.visible}
            />
            <Text style={styles.loading_text}>Loading...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    spinner: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    loading_text: {
        fontSize: 30,
        color: 'black'
    }
})