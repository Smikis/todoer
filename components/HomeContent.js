import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import AppContext from '../contexts/AppContext'
import { FlatList } from 'react-native-gesture-handler'
import Group from './Group'

export default function HomeContent() {
    const { data, TEXT, colors } = useContext(AppContext)
    const [stopScroll, setStopScroll] = useState(false)
    const [count, setCount] = useState(0)

    useEffect(() => {
        const inter = setInterval(() => {
            setCount((prev) => prev + 1)
            if (count === 5) {
                setCount(0)
            }
        }, 5000)

        return () => clearInterval(inter)
    }, [])

    return data?.groups?.length > 0 ? (
            <FlatList
                data={data.groups}
                renderItem={({item, index}) => (
                    <Group
                        item={item}
                        index={index}
                        setStopScroll={setStopScroll}
                    />
                )}
                scrollEnabled={!stopScroll}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
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
        )
}

const styles = (colors) => 
    StyleSheet.create({
        no_data: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '90%'
        },
        no_data_text: {
            fontSize: 30,
            color: colors.Grey,
            fontStyle: 'italic'
        }
    })