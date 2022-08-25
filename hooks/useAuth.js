import { useState, useEffect } from 'react'

import auth from '@react-native-firebase/auth'
import { firebase } from '@react-native-firebase/database'

import {
  GoogleSignin,
  statusCodes
} from '@react-native-google-signin/google-signin'

import { createUID } from '../utils/createUID'

const DATABASE_URL =
  'https://to-domobileapp-default-rtdb.europe-west1.firebasedatabase.app/'

export function useAuth(setData) {
  const [user, setUser] = useState()

  async function createDefaults(user) {
    // Used only once when creating a new user
    try {
      const reference = firebase
        .app()
        .database(DATABASE_URL)
        .ref(`/users/${user.uid}`)

      const data = {
        groups: [
          {
            group: 'default',
            id: createUID(),
            tasks: [
              {
                value: 'Your first task!',
                state: 'NOT DONE',
                created: Date.now(),
                id: createUID()
              }
            ],
            created: Date.now(),
            collapsed: false
          }
        ]
      }

      await reference.set(data)

      setData(data)
    } catch (e) {
      console.log('createDefaults:', e)
    }
  }

  async function createUserWithEmailAndPass(email, password) {
    const resp = await auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(e => {
        return e.code
      })
    if (resp?.additionalUserInfo?.isNewUser === true)
      await createDefaults(resp.user)
    return resp
  }

  async function loginUserWithEmailAndPass(email, password) {
    return await auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        return error.code
      })
  }

  async function loginWithGoogle() {
    GoogleSignin.configure({
      webClientId:
        '13955733373-mbg4hm5sbuen066djl4gbbmmre1mc4ft.apps.googleusercontent.com'
    })
    try {
      await GoogleSignin.hasPlayServices()

      // Receive user id token
      const { idToken } = await GoogleSignin.signIn()

      // Generate Google credentials
      const gCredential = auth.GoogleAuthProvider.credential(idToken)

      // Sign user in using Google credentials
      await auth().signInWithCredential(gCredential)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('user cancelled the login flow')
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('operation (e.g. sign in) is in progress already')
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('play services not available or outdated')
        // play services not available or outdated
      } else {
        console.log(error)
      }
    }
  }

  function logout() {
    return auth().signOut()
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user)
    })
    return subscriber
  }, [])

  const value = {
    user,
    loginWithGoogle,
    loginUserWithEmailAndPass,
    createUserWithEmailAndPass,
    logout,
    createDefaults
  }

  return value
}
