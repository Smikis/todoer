import React, { useContext, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native'

import { Link } from '@react-navigation/native'

import { useAuth } from '../hooks/useAuth'

import { GoogleSigninButton } from '@react-native-google-signin/google-signin'
import AppContext from '../contexts/AppContext'

export default function Login() {
  const { loginUserWithEmailAndPass, loginWithGoogle, continueAsGuest } =
    useAuth()

  const { TEXT, colors, theme } = useContext(AppContext)

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    emailError: null,
    passwordError: null
  })

  const [loading, setLoading] = useState(false)

  function clearErrors() {
    setInputs(prev => ({ ...prev, emailError: null, passwordError: null }))
  }

  function cleanup() {
    clearErrors()
    setInputs(prev => ({ ...prev, email: '', password: '' }))
  }

  async function validateInput() {
    if (inputs.email === '') {
      setInputs(prev => ({
        ...prev,
        emailError: TEXT.Validation.Email_Empty
      }))
      return
    }
    if (inputs.password === '') {
      setInputs(prev => ({
        ...prev,
        passwordError: TEXT.Validation.Password_Empty
      }))
      return
    }

    setLoading(true)

    const res = await loginUserWithEmailAndPass(inputs.email, inputs.password)

    switch (res) {
      case 'auth/invalid-email':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.Email_Invalid
        }))
        break
      case 'auth/user-not-found':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.User_Doesnt_Exist
        }))
        break
      case 'auth/wrong-password':
        setInputs(prev => ({
          ...prev,
          passwordError: TEXT.Validation.Wrong_Password
        }))
        break
    }
    setLoading(false)
    cleanup()
  }

  async function handleGoogleLogin() {
    setLoading(true)
    const resp = await loginWithGoogle()

    switch (resp) {
      case 'auth/account-exists-with-different-credential':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.Email_Exists
        }))
        break
      case 'auth/invalid-credential':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.Credential_Expired
        }))
        break
      case 'auth/user-disabled':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.User_Disabled
        }))
        break
      case 'auth/user-not-found':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.User_Doesnt_Exist
        }))
        break
      case 'auth/wrong-password':
        setInputs(prev => ({
          ...prev,
          passwordError: TEXT.Validation.Wrong_Password
        }))
        break
    }

    setLoading(false)
    cleanup()
  }

  async function handleContinueAsGuest() {
    setLoading(true)
    await continueAsGuest()
    setLoading(false)
    cleanup()
  }

  return (
    <SafeAreaView style={styles(colors).container}>
      <StatusBar
        backgroundColor={colors.Background}
        barStyle={theme === 'Light' ? 'dark-content' : 'light-content'}
      />
      <Text style={styles(colors).header}>{TEXT.Login.Header}</Text>
      {inputs.emailError && (
        <Text style={styles(colors).error}>{inputs.emailError}</Text>
      )}
      <TextInput
        value={inputs.email}
        style={[
          styles(colors).input,
          { shadowColor: inputs.emailError ? colors.Danger : 'black' }
        ]}
        onChangeText={text => setInputs(prev => ({ ...prev, email: text }))}
        placeholder={TEXT.Placeholders.Email}
        editable={!loading}
        keyboardType="email-address"
        placeholderTextColor={'grey'}
        onPressOut={clearErrors}
      />
      {inputs.passwordError && (
        <Text style={styles(colors).error}>{inputs.passwordError}</Text>
      )}
      <TextInput
        value={inputs.password}
        style={[
          styles(colors).input,
          {
            shadowColor: inputs.passwordError ? colors.Danger : 'black'
          }
        ]}
        onChangeText={text => setInputs(prev => ({ ...prev, password: text }))}
        placeholder={TEXT.Placeholders.Password}
        secureTextEntry={true}
        editable={!loading}
        placeholderTextColor={'grey'}
        onPressOut={clearErrors}
      />
      <Pressable style={styles(colors).login_btn} onPress={validateInput}>
        {loading ? (
          <>
            <ActivityIndicator
              style={{ marginRight: 15 }}
              animating={loading}
              size={'small'}
              color={'white'}
            />
            <Text style={styles(colors).login_btn_text}>{TEXT.Loading}</Text>
          </>
        ) : (
          <Text style={styles(colors).login_btn_text}>
            {TEXT.Login.Sign_In}
          </Text>
        )}
      </Pressable>
      <View style={styles(colors).separator_line}>
        <Text style={styles(colors).separator_text}>{TEXT.Separator}</Text>
      </View>
      <GoogleSigninButton style={{ height: 60 }} onPress={handleGoogleLogin} />
      <View style={{ padding: 15 }}>
        <Link
          onPress={cleanup}
          style={{ fontSize: 20, color: colors.Grey_Text }}
          to={{ screen: 'Register' }}>
          {TEXT.Login.Create_Account}
        </Link>
      </View>
      <Pressable
        style={styles(colors).continue_as_guest}
        onPress={handleContinueAsGuest}>
        <Text style={styles(colors).continue_as_guest_text}>
          {TEXT.Continue_Without_Account}
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = colors =>
  StyleSheet.create({
    header: {
      fontSize: 40,
      margin: 15,
      color: colors.Grey_Text
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: colors.Background
    },
    input: {
      padding: 15,
      width: '90%',
      margin: 15,
      borderRadius: 3,
      fontSize: 20,
      color: colors.Grey_Text,
      backgroundColor: colors.Input_Background,
      elevation: 5
    },
    login_btn: {
      width: '90%',
      alignItems: 'center',
      backgroundColor: colors.Primary,
      padding: 15,
      borderRadius: 3,
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      elevation: 5,
      marginTop: 15
    },
    login_btn_text: {
      color: colors.Text_Btn_Blue,
      fontSize: 20
    },
    separator_line: {
      borderBottomWidth: 1,
      borderBottomColor: colors.Text,
      width: '90%',
      padding: 10,
      position: 'relative',
      alignItems: 'center',
      marginBottom: 15,
      marginTop: 15
    },
    separator_text: {
      position: 'absolute',
      padding: 10,
      backgroundColor: colors.Background,
      display: 'flex',
      color: colors.Text
    },
    error: {
      color: colors.Danger,
      fontSize: 20,
      marginTop: 15
    },
    continue_as_guest: {
      padding: 15
    },
    continue_as_guest_text: {
      color: colors.Grey_Text,
      fontSize: 17
    }
  })
