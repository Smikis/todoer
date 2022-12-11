import { firebase } from '@react-native-firebase/database'

import { useAuth } from './useAuth'

import { DATABASE_URL } from '../constants/CONSTANTS'

export async function removeData(uid) {
  try {
    const reference = firebase.app().database(DATABASE_URL).ref(`/users/${uid}`)

    await reference.remove()
  } catch (e) {
    console.log('removeData:', e)
  }
}

export function useDb() {
  const { user } = useAuth()

  async function readData() {
    let returnData = {}
    try {
      const reference = firebase
        .app()
        .database(DATABASE_URL)
        .ref(`/users/${user.uid}`)

      const res = await reference.once('value')

      returnData = res.val()
    } catch (e) {
      console.log('readData:', e)
    }

    return returnData
  }

  async function updateDb(newData) {
    try {
      const reference = firebase
        .app()
        .database(DATABASE_URL)
        .ref(`/users/${user.uid}`)

      await reference.update(newData)
    } catch (e) {
      console.log('updateDb:', e)
    }
  }

  const value = {
    readData,
    updateDb
  }

  return value
}
