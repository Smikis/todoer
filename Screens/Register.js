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

export default function Register() {
  const { TEXT, colors, theme } = useContext(AppContext)

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    emailError: null,
    passwordError: null,
    confirmPasswordError: null
  })

  const { loginWithGoogle, createUserWithEmailAndPass } = useAuth()

  const [loading, setLoading] = useState(false)

  function clearErrors() {
    setInputs(prev => ({
      ...prev,
      passwordError: null,
      emailError: null,
      confirmPasswordError: null
    }))
  }

  function cleanup() {
    clearErrors()
    setInputs(prev => ({
      ...prev,
      password: '',
      email: '',
      confirmPassword: ''
    }))
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
    if (inputs.password !== inputs.confirmPassword) {
      setInputs(prev => ({
        ...prev,
        confirmPasswordError: TEXT.Validation.Passwords_Dont_Match
      }))
      return
    }

    setLoading(true)

    const res = await createUserWithEmailAndPass(inputs.email, inputs.password)

    switch (res) {
      case 'auth/email-already-in-use':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.Email_In_Use
        }))
        break
      case 'auth/invalid-email':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.Email_Invalid
        }))
        break
      case 'auth/weak-password':
        setInputs(prev => ({
          ...prev,
          passwordError: TEXT.Validation.Weak_Password
        }))
        break
    }

    setLoading(false)
  }

  return (
    <SafeAreaView style={styles(colors, theme).container}>
      <StatusBar
        backgroundColor={theme === 'Dark' ? colors.DarkGrey : colors.White}
        barStyle={theme === 'Light' ? 'dark-content' : 'light-content'}
      />
      <Text style={styles(colors, theme).header}>{TEXT.Register.Header}</Text>
      {inputs.emailError && (
        <Text style={styles(colors, theme).error}>{inputs.emailError}</Text>
      )}
      <TextInput
        value={inputs.email}
        style={[
          styles(colors, theme).input,
          { shadowColor: inputs.emailError ? colors.Red : colors.Black }
        ]}
        onChangeText={text => setInputs(prev => ({ ...prev, email: text }))}
        placeholder={TEXT.Placeholders.Email}
        keyboardType="email-address"
        placeholderTextColor={colors.Grey}
        editable={!loading}
        onPressOut={clearErrors}
      />
      {inputs.passwordError && (
        <Text style={styles(colors, theme).error}>{inputs.passwordError}</Text>
      )}
      <TextInput
        value={inputs.password}
        style={[
          styles(colors, theme).input,
          { shadowColor: inputs.passwordError ? colors.Red : colors.Black }
        ]}
        onChangeText={text => setInputs(prev => ({ ...prev, password: text }))}
        placeholder={TEXT.Placeholders.Password}
        secureTextEntry={true}
        placeholderTextColor={colors.Grey}
        editable={!loading}
        onPressOut={clearErrors}
      />
      {inputs.confirmPasswordError && (
        <Text style={styles(colors, theme).error}>{inputs.confirmPasswordError}</Text>
      )}
      <TextInput
        value={inputs.confirmPassword}
        style={[
          styles(colors, theme).input,
          { shadowColor: inputs.confirmPasswordError ? colors.Red : colors.Black }
        ]}
        onChangeText={text =>
          setInputs(prev => ({ ...prev, confirmPassword: text }))
        }
        placeholder={TEXT.Placeholders.Confirm_Password}
        secureTextEntry={true}
        placeholderTextColor={colors.Grey}
        editable={!loading}
        onPressOut={clearErrors}
      />
      <Pressable style={styles(colors, theme).login_btn} onPress={validateInput}>
        {loading ? (
          <>
            <ActivityIndicator
              style={{ marginRight: 15 }}
              animating={loading}
              size={'small'}
              color={colors.White}
            />
            <Text style={styles(colors, theme).login_btn_text}>{TEXT.Loading}</Text>
          </>
        ) : (
          <Text style={styles(colors, theme).login_btn_text}>
            {TEXT.Register.Sign_Up}
          </Text>
        )}
      </Pressable>
      <View style={styles(colors, theme).separator_line}>
        <Text style={styles(colors, theme).separator_text}>{TEXT.Separator}</Text>
      </View>
      <GoogleSigninButton style={{ height: 60 }} onPress={loginWithGoogle} />
      <View style={{ padding: 15 }}>
        <Link
          onPress={cleanup}
          style={{ fontSize: 20, color: colors.Grey }}
          to={{ screen: 'Login' }}>
          {TEXT.Login.Sign_In}
        </Link>
      </View>
    </SafeAreaView>
  )
}

const styles = (colors, theme) =>
  StyleSheet.create({
    header: {
      fontSize: 40,
      margin: 15,
      color: colors.Grey
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White
    },
    input: {
      padding: 15,
      width: '90%',
      margin: 15,
      borderRadius: 3,
      fontSize: 20,
      color: colors.Black,
      backgroundColor: theme === 'Dark' ? colors.LightDarkGrey : colors.White,
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
      color: colors.White,
      fontSize: 20
    },
    separator_line: {
      borderBottomWidth: 1,
      borderBottomColor: colors.Grey,
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
      backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White,
      display: 'flex',
      color: colors.Grey
    },
    error: {
      color: colors.Red,
      fontSize: 20,
      marginTop: 15
    }
  })
