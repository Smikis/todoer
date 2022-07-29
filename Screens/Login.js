import React,  { useEffect, useState }from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image
} from 'react-native'

import { Link } from '@react-navigation/native'

import { useAuth } from '../authentication/authContext'

import { GoogleSigninButton } from '@react-native-google-signin/google-signin'

export default function Login () {

    const {loginUserWithEmailAndPass, loginWithGoogle} = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [validating, setValidating] = useState(false)

    function validateInput(){
        setValidating(true)
        if (email === '' || password === '') return
        loginUserWithEmailAndPass(email, password).then(() => {
            setValidating(false)
        })
    }

    return (
        <View style={styles.container}>
          <Text style={styles.login_header}>
              TestNotes
          </Text>
          <TextInput
            value={email}
            style={styles.input}
            onChangeText={text => setEmail(text)}
            placeholder="Email"
            editable={!validating}
            keyboardType='email-address'
          />
          <TextInput
              value={password}
              style={styles.input}
              onChangeText={text => setPassword(text)}
              placeholder="Password"
              secureTextEntry={true}
              editable={!validating}
          />
          <Pressable 
            style={styles.login_btn}
            onPress={validateInput}
          >
            <Text style={styles.login_btn_text}>
            {validating ? 'Loading...' : 'Sign In'}
            </Text>
          </Pressable>
            <View style={styles.separator_line}>
              <Text style={styles.separator_text}>
                Or
              </Text>
            </View>
          <GoogleSigninButton
            style={{height: 60}}
            onPress={loginWithGoogle}
          />
          <View style={{padding: 15}}>
            <Link style={{fontSize: 20, color: 'blue'}} to={{ screen: 'Register'}}>Create account</Link>
          </View>

        </View>
    )
}

const styles = StyleSheet.create({
  login_header: {
    fontSize: 40,
    margin: 15,
    color: 'grey'
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white'
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 15,
    width: '90%',
    margin: 15,
    borderRadius: 3,
    fontSize: 20
  },
  login_btn: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center'
  },
  login_btn_Google:{
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1
  },
  login_btn_text: {
    color: 'white',
    fontSize: 20,
  },
  login_btn_text_Google: {
    color: 'black',
    marginLeft: 10
  },
  separator_line: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    width: '90%',
    padding: 10,
    position: 'relative',
    alignItems: 'center',
    marginBottom: 15
  },
  separator_text: {
    position: 'absolute',
    padding: 10,
    backgroundColor: 'white',
    display: 'flex'
  }
})