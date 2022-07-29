import React, { useEffect, useState } from 'react'

import { firebase } from '@react-native-firebase/database'
import database from '@react-native-firebase/database'
import { useAuth } from '../authentication/authContext'

const DATABASE_URL = 'https://to-domobileapp-default-rtdb.europe-west1.firebasedatabase.app/'

export function useDb() {

    function createDefaults(user){
        // Used only once when creating a new user
        const reference = firebase
            .app()
            .database(DATABASE_URL)
            .ref(`/users/${user.uid}`)
        
            reference.set({
                groups: [
                    {
                        group: 'default',
                        tasks: [
                            {
                                value: 'default task',
                                state: 'NOT DONE',
                                created: Date.now()
                            }
                        ],
                        created: Date.now(),
                        collapsed: false
                    }
                ]
            })
    }

    async function readData(user){
        let returnData
        const reference = firebase.app().database(DATABASE_URL).ref(`/users/${user.uid}`)

        const res = await reference.once('value')

        returnData = res.val()

        return returnData
    }

    const value = {
        createDefaults,
        readData
    }

    return value
}