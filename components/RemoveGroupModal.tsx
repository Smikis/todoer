import {useContext, useState} from 'react';
import {StyleSheet, Text, View, TextInput, Pressable} from 'react-native';

import Toast from 'react-native-toast-message';

import AppContext from '../contexts/AppContext';

import ModalView from './ModalView';

import {Group} from '../types/group';
import {Colors} from '../types/colors';
import {Theme} from '../types/theme';

interface RemoveGroupModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  group: Group;
}

export default function RemoveGroupModal({
  visible,
  setVisible,
  group,
}: RemoveGroupModalProps) {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState(null);
  const {TEXT, colors, removeGroup, theme} = useContext(AppContext);

  function handleExit() {
    setError(null);
    setInputText('');
    setVisible(false);
  }

  function handleConfirm() {
    if (inputText === '') {
      setError(TEXT.Validation.Input_Empty);
      return;
    }
    if (inputText.toUpperCase() !== group.group.toUpperCase()) {
      setError(TEXT.Validation.Incorrect_Input);
      return;
    }

    const res = removeGroup(group.id);

    switch (res) {
      case 'success':
        Toast.show({
          type: 'successToast',
          text1: TEXT.Toast.Success,
          text2: `${TEXT.Toast.Remove_Success_Text}`,
          props: {colors: colors, theme: theme},
        });
        break;
      case 'error':
        Toast.show({
          type: 'errorToast',
          text1: TEXT.Toast.Error,
          text2: TEXT.Toast.Error_Text,
          props: {colors: colors, theme: theme},
        });
        break;
    }

    handleExit();
  }

  return (
    <ModalView visible={visible} handleExit={handleExit}>
      <View style={styles(colors, theme).centeredView}>
        <View style={styles(colors, theme).modalView}>
          <Text style={styles(colors, theme).remove_text}>
            {TEXT.Remove_Group_Modal.Remove_Text}
          </Text>
          <Text style={styles(colors, theme).group_text}>
            {group ? group.group.toUpperCase() : null}
          </Text>
          {error && <Text style={styles(colors, theme).error}>{error}</Text>}
          <TextInput
            style={[
              styles(colors, theme).input,
              {shadowColor: error ? colors.Red : colors.Black},
            ]}
            value={inputText}
            onChangeText={text => setInputText(text)}
            placeholder={`${
              TEXT.Placeholders.Type
            } ${group?.group.toUpperCase()} ${TEXT.Placeholders.To_Confirm}`}
            onPressOut={() => setError(null)}
            placeholderTextColor={'grey'}
          />
          <View style={styles(colors, theme).buttons}>
            <Pressable
              onPress={handleConfirm}
              style={styles(colors, theme).confirm_btn}>
              <Text style={styles(colors, theme).confirm_text}>
                {TEXT.Remove}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleExit}
              style={styles(colors, theme).cancel_btn}>
              <Text style={styles(colors, theme).cancel_text}>
                {TEXT.Cancel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ModalView>
  );
}

const styles = (colors: Colors, theme: Theme) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalView: {
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White,
      elevation: 5,
      padding: 20,
      width: '100%',
    },
    remove_text: {
      fontSize: 20,
      color: theme === 'Dark' ? colors.White : colors.Black,
      padding: 10,
    },
    group_text: {
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.Primary,
    },
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '90%',
      marginTop: 10,
    },
    confirm_btn: {
      padding: 15,
      borderRadius: 3,
      borderColor: colors.Red,
      borderWidth: 2,
      backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White,
      elevation: 5,
    },
    confirm_text: {
      color: colors.Red,
      fontSize: 15,
    },
    cancel_btn: {
      padding: 15,
      backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White,
      elevation: 5,
      borderRadius: 3,
    },
    cancel_text: {
      color: theme === 'Dark' ? colors.White : colors.Black,
      fontSize: 15,
    },
    input: {
      margin: 15,
      borderRadius: 3,
      padding: 15,
      width: '90%',
      elevation: 5,
      backgroundColor: theme === 'Dark' ? colors.LightDarkGrey : colors.White,
      color: theme === 'Dark' ? colors.White : colors.Black,
    },
    error: {
      color: colors.Red,
      fontSize: 20,
      marginTop: 15,
    },
  });
