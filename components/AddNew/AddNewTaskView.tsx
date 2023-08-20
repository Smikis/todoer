import {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {Dropdown} from 'react-native-element-dropdown';

import Icon from 'react-native-vector-icons/FontAwesome';

import AppContext from '../../contexts/AppContext';

import {getGroups} from '../../utils/getGroups';

import Toast from 'react-native-toast-message';

import CheckBox from '@react-native-community/checkbox';

import DatePicker from 'react-native-date-picker';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {Colors} from '../../types/colors';
import {Theme} from '../../types/theme';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

interface AddNewTaskViewProps {
  handleExit: () => void;
}

export default function AddNewTaskView({handleExit}: AddNewTaskViewProps) {
  const {colors, theme, data, TEXT, appendTask} = useContext(AppContext);
  const {width} = Dimensions.get('window');
  const [taskViewData, setTaskViewData] = useState({
    inputText: '',
    additionalSettingsShown: false,
    groupChosenId: 'default',
    error: null,
    groups: [] as {label: string; value: string}[],
    sendNotification: false,
    date: new Date(),
    toggleRepeating: false,
  });

  const rotation = useSharedValue(0);

  const animatedIcon = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${rotation.value}deg`}],
    };
  });

  async function handleConfirm() {
    if (taskViewData.inputText === '') {
      setTaskViewData(prev => ({...prev, error: TEXT.Validation.Input_Empty}));
      return;
    }

    let res;

    if (taskViewData.sendNotification) {
      if (taskViewData.date.getTime() - Date.now() <= 0) {
        setTaskViewData(prev => ({
          ...prev,
          error: TEXT.Validation.Date_Must_Be_In_Future,
        }));
        return;
      } else {
        res = await appendTask(
          taskViewData.groupChosenId,
          taskViewData.inputText,
          taskViewData.date,
          taskViewData.toggleRepeating,
        );
      }
    } else {
      res = await appendTask(
        taskViewData.groupChosenId,
        taskViewData.inputText,
      );
    }

    switch (res) {
      case 'success':
        Toast.show({
          type: 'successToast',
          text1: TEXT.Toast.Success,
          text2: TEXT.Toast.Task_Success_Text,
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

  useEffect(() => {
    setTaskViewData(prev => ({...prev, groups: getGroups(data)}));
  }, [data]);

  useEffect(() => {
    if (taskViewData.additionalSettingsShown) {
      rotation.value = withTiming(90, {duration: 200});
    } else {
      rotation.value = withTiming(0, {duration: 200});
    }
  }, [taskViewData.additionalSettingsShown]);

  return (
    <>
      {taskViewData.error && (
        <Text style={styles(colors, theme).error}>{taskViewData.error}</Text>
      )}
      <TextInput
        style={styles(colors, theme).input}
        placeholder={TEXT.Add_New_Button.Title}
        placeholderTextColor={colors.Grey}
        allowFontScaling={false}
        onChangeText={text =>
          setTaskViewData(prev => ({...prev, inputText: text}))
        }
        onPressOut={() => setTaskViewData(prev => ({...prev, error: null}))}
        value={taskViewData.inputText}
      />
      {taskViewData.groups.length > 1 && (
        <Dropdown
          style={styles(colors, theme).dropdown}
          placeholderStyle={{color: colors.Grey, fontSize: 15}}
          selectedTextStyle={{
            color: theme === 'Dark' ? colors.White : colors.Black,
            fontSize: 15,
            paddingHorizontal: 8,
          }}
          data={taskViewData.groups}
          labelField="label"
          valueField="value"
          placeholder={TEXT.Add_New_Button.Select_Group}
          showsVerticalScrollIndicator={false}
          containerStyle={{
            backgroundColor:
              theme === 'Dark' ? colors.LightDarkGrey : colors.White,
            paddingHorizontal: 15,
          }}
          renderItem={item => (
            <View
              style={{
                height: 50,
                display: item.label === '' ? 'none' : 'flex',
                justifyContent: 'center',
                backgroundColor:
                  theme === 'Dark' ? colors.LightDarkGrey : colors.White,
              }}>
              <Text
                style={{
                  color: theme === 'Dark' ? colors.White : colors.Black,
                  fontSize: 15,
                }}>
                {item.label}
              </Text>
            </View>
          )}
          onChange={item => {
            setTaskViewData(prev => ({...prev, groupChosenId: item.value}));
          }}
        />
      )}
      <Pressable
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          marginBottom: 20,
        }}
        onPress={() => {
          setTaskViewData(prev => ({
            ...taskViewData,
            additionalSettingsShown: !prev.additionalSettingsShown,
          }));
          Keyboard.dismiss();
        }}>
        <View
          style={{
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AnimatedIcon
            name={'chevron-right'}
            size={20}
            color={theme === 'Dark' ? colors.White : colors.Black}
            style={animatedIcon}
          />
        </View>
        <Text
          style={{
            color: theme === 'Dark' ? colors.White : colors.Black,
            fontSize: 15,
            marginLeft: 10,
          }}>
          {TEXT.Add_New_Button.Additional_Settings}
        </Text>
      </Pressable>
      {taskViewData.additionalSettingsShown && (
        <View
          style={{
            width: '100%',
            paddingLeft: 20,
            paddingRight: 20,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: theme === 'Dark' ? colors.White : colors.Black,
              paddingBottom: 10,
            }}>
            <Icon
              name={'bell'}
              size={20}
              color={theme === 'Dark' ? colors.White : colors.Black}
            />
            <Text
              style={{
                color: theme === 'Dark' ? colors.White : colors.Black,
                fontSize: 15,
                marginLeft: 10,
              }}>
              {TEXT.Add_New_Button.Send_Notification}
            </Text>
            <CheckBox
              tintColors={{
                true: colors.Primary,
                false: theme === 'Dark' ? colors.White : colors.Black,
              }}
              value={taskViewData.sendNotification}
              onValueChange={val =>
                setTaskViewData(prev => ({...prev, sendNotification: val}))
              }
              style={{
                marginLeft: 'auto',
                padding: 20,
              }}
            />
          </View>
          {taskViewData.sendNotification && (
            <>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Icon
                  name={'calendar'}
                  size={20}
                  color={theme === 'Dark' ? colors.White : colors.Black}
                />
                <Text
                  style={{
                    color: theme === 'Dark' ? colors.White : colors.Black,
                    fontSize: 15,
                    marginLeft: 10,
                  }}>
                  {TEXT.Add_New_Button.Select_Date}
                </Text>
              </View>
              <DatePicker
                theme={theme === 'Dark' ? 'dark' : 'light'}
                androidVariant="nativeAndroid"
                style={{
                  width: width,
                  height: 150,
                  alignSelf: 'center',
                  marginBottom: 10,
                }}
                textColor={theme === 'Dark' ? colors.White : colors.Black}
                date={taskViewData.date}
                onDateChange={date =>
                  setTaskViewData(prev => ({...prev, date: date}))
                }
                mode="datetime"
              />
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                  borderTopColor:
                    theme === 'Dark' ? colors.White : colors.Black,
                  borderTopWidth: 1,
                  paddingTop: 10,
                }}>
                <Icon
                  name={'repeat'}
                  size={20}
                  color={theme === 'Dark' ? colors.White : colors.Black}
                />
                <Text
                  style={{
                    color: theme === 'Dark' ? colors.White : colors.Black,
                    fontSize: 15,
                    marginLeft: 10,
                  }}>
                  {TEXT.Add_New_Button.Repeat}
                </Text>
                <CheckBox
                  tintColors={{
                    true: colors.Primary,
                    false: theme === 'Dark' ? colors.White : colors.Black,
                  }}
                  value={taskViewData.toggleRepeating}
                  onValueChange={val =>
                    setTaskViewData(prev => ({...prev, toggleRepeating: val}))
                  }
                  style={{
                    marginLeft: 'auto',
                    padding: 20,
                  }}
                />
              </View>
            </>
          )}
        </View>
      )}
      <View style={styles(colors, theme).button_container}>
        <Pressable onPress={handleConfirm} style={styles(colors, theme).button}>
          <Text style={styles(colors, theme).button_text}>{TEXT.Confirm}</Text>
        </Pressable>
        <Pressable
          onPress={handleExit}
          style={[
            styles(colors, theme).button,
            styles(colors, theme).btn_cancel,
          ]}>
          <Text
            style={[
              styles(colors, theme).button_text,
              styles(colors, theme).btn_cancel_text,
            ]}>
            {TEXT.Cancel}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = (colors: Colors, theme: Theme) =>
  StyleSheet.create({
    input: {
      fontSize: 20,
      width: '100%',
      borderRadius: 3,
      padding: 15,
      elevation: 5,
      backgroundColor: theme === 'Dark' ? colors.LightDarkGrey : colors.White,
      color: theme === 'Dark' ? colors.White : colors.Black,
      marginBottom: 20,
    },
    button_container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      padding: 15,
      backgroundColor: colors.Primary,
      borderRadius: 5,
      width: 100,
      elevation: 5,
    },
    button_text: {
      color: colors.White,
      fontSize: 15,
      textAlign: 'center',
    },
    btn_cancel: {
      backgroundColor: theme === 'Dark' ? colors.DarkGrey : colors.White,
    },
    btn_cancel_text: {
      color: theme === 'Dark' ? colors.White : colors.Black,
    },
    error: {
      color: colors.Red,
      fontSize: 20,
      marginBottom: 15,
      textAlign: 'center',
    },
    dropdown: {
      height: 50,
      borderRadius: 3,
      paddingHorizontal: 8,
      marginBottom: 15,
      backgroundColor: theme === 'Dark' ? colors.LightDarkGrey : colors.White,
      color: theme === 'Dark' ? colors.White : colors.Black,
      fontSize: 15,
      elevation: 5,
    },
  });
