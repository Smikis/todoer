import {useContext, useEffect, useState} from 'react';

import {StyleSheet, Text, View, Pressable} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import DraggableFlatList from 'react-native-draggable-flatlist';

import AppContext from '../contexts/AppContext';

import {getDoneTasks} from '../utils/getDoneTasks';

import Task from './Task';
import RemoveGroupModal from './RemoveGroupModal';
import RemoveTaskModal from './RemoveTaskModal';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {Group as GroupType} from '../types/group';
import {Task as TaskType} from '../types/task';
import {Colors} from '../types/colors';
import {Theme} from '../types/theme';

const ordering: {
  [key: number]: string;
} = {
  0: 'byDateDESC',
  1: 'byDateASC',
  2: 'byNameDESC',
  3: 'byNameASC',
  4: 'byDoneDESC',
  5: 'byDoneASC',
};

const orderIcon: {
  [key: number]: string;
} = {
  0: 'order-numeric-descending',
  1: 'order-numeric-ascending',
  2: 'order-alphabetical-descending',
  3: 'order-alphabetical-ascending',
  4: 'order-bool-descending',
  5: 'order-bool-ascending',
};

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

interface GroupProps {
  item: GroupType;
  index: number;
  setStopScroll: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Group({item, index, setStopScroll}: GroupProps) {
  const [order, setOrder] = useState(item.order || 0);

  const {
    toggleCollapsed,
    updateTaskData,
    sortTasks,
    colors,
    data,
    TEXT,
    theme,
  } = useContext(AppContext);

  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [removeTaskModalVisible, setRemoveTaskModalVisible] = useState(false);
  const [chosenTask, setChosenTask] = useState<TaskType | null>(null);

  const chevronRotation = useSharedValue(item.collapsed ? 90 : 0);

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${chevronRotation.value}deg`}],
    };
  });

  useEffect(() => {
    chevronRotation.value = !item.collapsed
      ? withTiming(90, {duration: 200})
      : withTiming(0, {duration: 200});
  }, [item.collapsed]);

  const doneTasks = getDoneTasks(item.id, data);
  const allTasks = item.tasks ? item.tasks.length : 0;

  function renderTasks(item: TaskType, drag: any, group: GroupType) {
    return (
      <Task
        drag={drag}
        group={group}
        item={item}
        setRemoveTaskModalVisible={setRemoveTaskModalVisible}
        setChosenTask={setChosenTask}
      />
    );
  }

  useEffect(() => {
    sortTasks(item.id, ordering[order], order);
  }, [order]);

  return (
    <>
      <RemoveGroupModal
        visible={removeModalVisible}
        group={item}
        setVisible={setRemoveModalVisible}
      />
      <RemoveTaskModal
        visible={removeTaskModalVisible}
        setVisible={setRemoveTaskModalVisible}
        task={chosenTask}
        from={item.id}
      />
      <View
        style={[
          styles(colors, theme).group,
          {
            marginTop: index === 0 ? 15 : 0,
            marginBottom: index === data.groups.length - 1 ? 15 : 0,
          },
        ]}>
        {item.id !== 'default' && (
          <Pressable
            style={{
              marginRight: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={() => toggleCollapsed(item.id)}>
            <View style={styles(colors, theme).group_header}>
              <AnimatedIcon
                style={[
                  {
                    marginRight: 15,
                  },
                  chevronStyle,
                ]}
                name={'chevron-right'}
                size={40}
                color={theme === 'Dark' ? colors.White : colors.Black}
              />
              <Text style={styles(colors, theme).group_text}>
                {item.group.toUpperCase() + ` - ${doneTasks}/${allTasks}`}
              </Text>
              <Icon
                onPress={() => {
                  setOrder(order === 5 ? 0 : order + 1);
                }}
                name={orderIcon[order]}
                size={30}
                color={theme === 'Dark' ? colors.White : colors.Black}
                style={{
                  marginLeft: 15,
                  borderColor: theme === 'Dark' ? colors.White : colors.Black,
                  borderWidth: 1,
                  borderRadius: 5,
                }}
              />
            </View>
            <Pressable
              onPress={() => {
                setRemoveModalVisible(true);
              }}
              style={styles(colors, theme).remove_btn}>
              <Text style={styles(colors, theme).remove_btn_text}>
                {TEXT.Remove}
              </Text>
            </Pressable>
          </Pressable>
        )}
        <GestureHandlerRootView>
          <DraggableFlatList
            style={{
              display: item.collapsed ? 'none' : 'flex',
            }}
            data={item.tasks ?? []}
            renderItem={({item: i, drag}) => renderTasks(i, drag, item)}
            keyExtractor={item => item.id}
            onDragBegin={() => setStopScroll(true)}
            onRelease={() => setStopScroll(false)}
            onDragEnd={({data}) => updateTaskData(data, item.id)}
          />
        </GestureHandlerRootView>
      </View>
    </>
  );
}

const styles = (colors: Colors, theme: Theme) =>
  StyleSheet.create({
    group: {
      display: 'flex',
      flexDirection: 'column',
    },
    group_text: {
      fontSize: 20,
      fontWeight: 'bold',
      letterSpacing: 3,
      color: theme === 'Dark' ? colors.White : colors.Black,
      flexShrink: 1,
    },
    group_header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 15,
      flexShrink: 1,
    },
    remove_btn: {
      padding: 10,
    },
    remove_btn_text: {
      fontSize: 13,
      fontWeight: 'bold',
      color: colors.Red,
    },
  });
