import { useState, useEffect } from 'react'

import auth from '@react-native-firebase/auth'

import {
  GoogleSignin,
  statusCodes
} from '@react-native-google-signin/google-signin'

import { removeData } from './useDb'

export function useAuth() {
  const [user, setUser] = useState()

  async function createUserWithEmailAndPass(email, password) {
    const resp = await auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(e => {
        return e.code
      })
    return resp
  }

  async function continueAsGuest() {
    return await auth().signInAnonymously()
  }

  async function loginUserWithEmailAndPass(email, password) {
    return await auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        return error.code
      })
  }

  async function loginWithGoogle() {
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

  async function logout() {
    const isSignedIn = await GoogleSignin.isSignedIn()
    if (isSignedIn) {
      try {
        await GoogleSignin.revokeAccess()
        await GoogleSignin.signOut()
        await auth().signOut()
      } catch (e) {
        console.log(e)
      }
    } else if (user.isAnonymous) {
      try {
        await removeData(user.uid)
        await auth().currentUser.delete()
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        await auth().signOut()
      } catch (e) {
        console.log(e)
      }
    }
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
    continueAsGuest
  }

  return value
}
