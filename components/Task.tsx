import {useContext} from 'react';

import {ScaleDecorator} from 'react-native-draggable-flatlist';

import {StyleSheet, Text, View, Pressable} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import {getDueText} from '../utils/getDueText';
import AppContext from '../contexts/AppContext';

import Animated from 'react-native-reanimated';

import {Task as TaskType} from '../types/task';
import {Group} from '../types/group';
import {Colors} from '../types/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MILISECONDS_IN_A_DAY = 86400000;

interface TaskProps {
  item: TaskType;
  drag: any;
  group: Group;
  setRemoveTaskModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setChosenTask: React.Dispatch<React.SetStateAction<any>>;
}

export default function Task({
  item,
  drag,
  group,
  setRemoveTaskModalVisible,
  setChosenTask,
}: TaskProps) {
  const dueIn =
    item.due && Math.ceil((item.due - Date.now()) / MILISECONDS_IN_A_DAY);

  const {toggleDone, TEXT, colors} = useContext(AppContext);

  return (
    <ScaleDecorator>
      <AnimatedPressable
        onLongPress={drag}
        onPress={() => {
          if (item.repeating || (item.due && item.due - Date.now() <= 0))
            return;
          toggleDone(group.id, item.id);
        }}>
        <View
          style={[
            styles(colors).task,
            {
              backgroundColor:
                dueIn &&
                dueIn <= 1 &&
                item.due &&
                !item.isDone &&
                !item.repeating
                  ? colors.Red
                  : colors.Primary,
              borderLeftColor:
                item.isDone && !item.repeating ? colors.Green : colors.White,
            },
          ]}>
          <View style={{flexShrink: 1}}>
            <Text style={styles(colors).task_text}>{item.value}</Text>
            {(item.due || item.repeating) && !item.isDone && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  flexShrink: 1,
                }}>
                <Icon
                  name={'clock-o'}
                  size={15}
                  color={colors.White}
                  style={{marginRight: 5, marginLeft: 5}}
                />
                {item.due && !item.isDone && !item.repeating ? (
                  <Text style={styles(colors).due_text}>
                    {getDueText(item.due, TEXT)}
                  </Text>
                ) : item.repeating ? (
                  <Text style={styles(colors).due_text}>
                    {TEXT.Home.Repeating}
                  </Text>
                ) : null}
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderLeftColor: colors.White,
              borderLeftWidth: 1,
              height: '100%',
              paddingLeft: 20,
              marginLeft: 20,
            }}>
            {(!item.repeating && item.due && item.due - Date.now() >= 0) ||
            !item.due ? (
              <Icon
                name={'check'}
                size={20}
                color={item.isDone ? colors.Green : colors.White}
                style={{marginRight: 20}}
              />
            ) : null}
            <Icon
              name={'trash-o'}
              color={colors.White}
              size={20}
              style={{marginRight: 10}}
              onPress={() => {
                setRemoveTaskModalVisible(true);
                setChosenTask(item);
              }}
            />
          </View>
        </View>
      </AnimatedPressable>
    </ScaleDecorator>
  );
}

const styles = (colors: Colors) =>
  StyleSheet.create({
    task: {
      paddingVertical: 15,
      paddingHorizontal: 10,
      backgroundColor: colors.Primary,
      borderRadius: 3,
      elevation: 5,
      marginBottom: 10,
      marginTop: 10,
      marginRight: 15,
      marginLeft: 15,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderLeftWidth: 7,
    },
    task_text: {
      color: colors.White,
      fontSize: 17,
      paddingLeft: 5,
      flexShrink: 1,
    },
    due_text: {
      color: colors.White,
      fontWeight: '500',
      fontSize: 10,
    },
  });
