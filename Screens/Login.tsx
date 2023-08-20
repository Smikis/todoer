import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';

import {Link} from '@react-navigation/native';

import {useAuth} from '../hooks/useAuth';

import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import AppContext from '../contexts/AppContext';
import {Colors} from '../types/colors';

export default function Login() {
  const {loginUserWithEmailAndPass, loginWithGoogle, continueAsGuest} =
    useAuth();

  const {TEXT, colors} = useContext(AppContext);

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    emailError: null,
    passwordError: null,
  });

  const [loading, setLoading] = useState(false);

  function clearErrors() {
    setInputs(prev => ({...prev, emailError: null, passwordError: null}));
  }

  function cleanup() {
    clearErrors();
    setInputs(prev => ({...prev, email: '', password: ''}));
  }

  async function validateInput() {
    if (inputs.email === '') {
      setInputs(prev => ({
        ...prev,
        emailError: TEXT.Validation.Email_Empty,
      }));
      return;
    }
    if (inputs.password === '') {
      setInputs(prev => ({
        ...prev,
        passwordError: TEXT.Validation.Password_Empty,
      }));
      return;
    }

    setLoading(true);

    const res = await loginUserWithEmailAndPass(inputs.email, inputs.password);

    switch (res) {
      case 'auth/invalid-email':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.Email_Invalid,
        }));
        break;
      case 'auth/user-not-found':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.User_Doesnt_Exist,
        }));
        break;
      case 'auth/wrong-password':
        setInputs(prev => ({
          ...prev,
          passwordError: TEXT.Validation.Wrong_Password,
        }));
        break;
    }
    setLoading(false);
    cleanup();
  }

  async function handleGoogleLogin() {
    setLoading(true);
    const resp = await loginWithGoogle();

    switch (resp) {
      case 'auth/account-exists-with-different-credential':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.Email_Exists,
        }));
        break;
      case 'auth/invalid-credential':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.Credential_Expired,
        }));
        break;
      case 'auth/user-disabled':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.User_Disabled,
        }));
        break;
      case 'auth/user-not-found':
        setInputs(prev => ({
          ...prev,
          emailError: TEXT.Validation.User_Doesnt_Exist,
        }));
        break;
      case 'auth/wrong-password':
        setInputs(prev => ({
          ...prev,
          passwordError: TEXT.Validation.Wrong_Password,
        }));
        break;
    }

    setLoading(false);
    cleanup();
  }

  async function handleContinueAsGuest() {
    setLoading(true);
    await continueAsGuest();
    setLoading(false);
    cleanup();
  }

  return (
    <SafeAreaView style={styles(colors).container}>
      <StatusBar backgroundColor={colors.Primary} barStyle={'light-content'} />
      <Image
        source={require('../icons/play_store_512.png')}
        style={{
          width: 200,
          height: 200,
          resizeMode: 'contain',
        }}
      />
      <GoogleSigninButton onPress={handleGoogleLogin} />
      <View style={styles(colors).separator_line}>
        <Text style={styles(colors).separator_text}>{TEXT.Separator}</Text>
      </View>
      {inputs.emailError && (
        <Text style={styles(colors).error}>{inputs.emailError}</Text>
      )}
      <TextInput
        value={inputs.email}
        style={styles(colors).input}
        onChangeText={text => setInputs(prev => ({...prev, email: text}))}
        placeholder={TEXT.Placeholders.Email}
        editable={!loading}
        keyboardType="email-address"
        placeholderTextColor={colors.LightBlue}
        onPressOut={clearErrors}
      />
      {inputs.passwordError && (
        <Text style={styles(colors).error}>{inputs.passwordError}</Text>
      )}
      <TextInput
        value={inputs.password}
        style={styles(colors).input}
        onChangeText={text => setInputs(prev => ({...prev, password: text}))}
        placeholder={TEXT.Placeholders.Password}
        secureTextEntry={true}
        editable={!loading}
        placeholderTextColor={colors.LightBlue}
        onPressOut={clearErrors}
      />
      <Pressable style={styles(colors).login_btn} onPress={validateInput}>
        {loading ? (
          <>
            <ActivityIndicator
              style={{marginRight: 15}}
              size={'small'}
              color={colors.Black}
            />
            <Text style={styles(colors).login_btn_text}>{TEXT.Loading}</Text>
          </>
        ) : (
          <Text style={styles(colors).login_btn_text}>
            {TEXT.Login.Sign_In}
          </Text>
        )}
      </Pressable>

      <View style={{padding: 15}}>
        <Link
          onPress={cleanup}
          style={{fontSize: 20, color: colors.White}}
          to={{screen: 'Register'}}>
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
  );
}

const styles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: colors.Primary,
      padding: 15,
    },
    input: {
      padding: 15,
      width: '100%',
      margin: 15,
      fontSize: 20,
      color: colors.White,
      borderBottomColor: colors.White,
      borderBottomWidth: 2,
    },
    login_btn: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: colors.White,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 100,
      justifyContent: 'center',
      flexDirection: 'row',
      marginTop: 15,
    },
    login_btn_text: {
      color: colors.Black,
      fontSize: 20,
    },
    separator_line: {
      borderBottomWidth: 1,
      borderBottomColor: colors.White,
      width: '100%',
      padding: 10,
      position: 'relative',
      alignItems: 'center',
      marginBottom: 15,
      marginTop: 15,
    },
    separator_text: {
      position: 'absolute',
      padding: 10,
      backgroundColor: colors.Primary,
      color: colors.White,
    },
    error: {
      color: colors.Red,
      fontSize: 20,
      marginTop: 15,
    },
    continue_as_guest: {
      padding: 15,
    },
    continue_as_guest_text: {
      color: colors.White,
      fontSize: 17,
    },
  });
