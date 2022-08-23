import React, {useState, useRef, useContext} from 'react';
import {StyleSheet, Text, View, Pressable, FlatList} from 'react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

import Icon from 'react-native-vector-icons/FontAwesome';

import {getDoneTasks} from '../utils/getDoneTasks';

import RemoveGroupModal from '../components/RemoveGroupModal';

import AppContext from '../contexts/AppContext';
import {isToday} from '../utils/dates/isToday';
import {isTomorrow} from '../utils/dates/isTomorrow';

const MILISECONDS_IN_A_DAY = 86400000;

export default function Home() {
  const parentRef = useRef(null);
  const [stopScroll, setStopScroll] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [chosenGroup, setChosenGroup] = useState();

  const {data, toggleDone, toggleCollapsed, updateTaskData, TEXT, colors} =
    useContext(AppContext);

  function renderTasks(item, drag, group) {
    const dueIn =
      Math.ceil((item.due - Date.now()) / MILISECONDS_IN_A_DAY) ?? null;

    return (
      <ScaleDecorator>
        <Pressable onLongPress={drag}>
          <View
            style={[
              styles(colors).task,
              {
                backgroundColor:
                  dueIn && dueIn >= 0 ? colors.Danger : colors.Primary,
              },
            ]}>
            <View>
              <Text style={styles(colors).task_text}>{item.value}</Text>
              {dueIn >= 0 ? (
                <Text style={styles(colors).due_text}>
                  {isToday(item.due) === true
                    ? TEXT.Home.Due_Today
                    : isTomorrow(item.due) === true
                    ? TEXT.Home.Due_Tomorrow
                    : `${TEXT.Home.Due_In} ${dueIn} ${TEXT.Home.Days} `}
                </Text>
              ) : null}
            </View>
            <Icon
              onPress={() => toggleDone(group.id, item.id)}
              name={'check'}
              size={25}
              color={item.state === 'DONE' ? colors.Check_Done : colors.Check}
            />
          </View>
        </Pressable>
      </ScaleDecorator>
    );
  }

  function renderGroups({item}) {
    const dragItem = item;
    const doneTasks = getDoneTasks(item.id, data);
    const allTasks = item.tasks ? item.tasks.length : 0;
    return (
      <View style={styles(colors).group}>
        <Pressable
          style={{
            marginRight: 15,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onPress={() => toggleCollapsed(item.id)}>
          <View style={styles(colors).group_header}>
            <Icon
              style={{marginRight: 15}}
              name={item.collapsed === false ? 'angle-down' : 'angle-right'}
              size={40}
              color={colors.Grey_Text}
            />
            <Text style={styles(colors).group_text}>
              {item.group.toUpperCase() + ` - ${doneTasks} / ${allTasks}`}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setChosenGroup(item);
              setRemoveModalVisible(true);
            }}
            style={styles(colors).remove_btn}>
            <Text style={styles(colors).remove_btn_text}>{TEXT.Remove}</Text>
          </Pressable>
        </Pressable>
        <GestureHandlerRootView>
          <DraggableFlatList
            style={{display: item.collapsed === true ? 'none' : 'flex'}}
            data={item.tasks ? item.tasks : []}
            simultaneousHandlers={parentRef}
            renderItem={({item, drag}) => renderTasks(item, drag, dragItem)}
            keyExtractor={item => item.id}
            onDragBegin={() => setStopScroll(true)}
            onRelease={() => setStopScroll(false)}
            onDragEnd={({data}) => updateTaskData(data, item.id)}
          />
        </GestureHandlerRootView>
      </View>
    );
  }

  return (
    <View style={styles(colors).background}>
      <Text style={styles(colors).header}>{TEXT.Home.Header}</Text>
      <RemoveGroupModal
        visible={removeModalVisible}
        group={chosenGroup}
        setVisible={setRemoveModalVisible}
        setGroupChosen={setChosenGroup}
      />
      {data?.groups?.length > 0 ? (
        <FlatList
          data={data.groups}
          renderItem={renderGroups}
          scrollEnabled={!stopScroll}
          ref={f => f && (parentRef.current = f._listRef._scrollRef)}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles(colors).no_data}>
          <Text style={styles(colors).no_data_text}>
            {TEXT.Home.No_Data_Text_L}
          </Text>
          <Text style={[styles(colors).no_data_text, {fontSize: 20}]}>
            {TEXT.Home.No_Data_Text_Sm}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = colors =>
  StyleSheet.create({
    background: {
      backgroundColor: colors.Background,
      height: '100%',
    },
    group: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 60,
    },
    group_text: {
      fontSize: 20,
      fontWeight: 'bold',
      letterSpacing: 3,
      color: colors.Grey_Text,
    },
    task: {
      padding: 15,
      backgroundColor: colors.Primary,
      borderRadius: 5,
      elevation: 5,
      marginBottom: 10,
      marginTop: 10,
      marginRight: 15,
      marginLeft: 15,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    task_text: {
      color: colors.Task_Text,
      fontSize: 17,
    },
    group_header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 15,
    },
    header: {
      textAlign: 'center',
      fontSize: 30,
      padding: 10,
      letterSpacing: 5,
      color: colors.Grey_Text,
    },
    remove_btn: {
      padding: 10,
    },
    remove_btn_text: {
      fontSize: 13,
      fontWeight: 'bold',
      color: colors.Danger,
    },
    no_data: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '90%',
    },
    no_data_text: {
      fontSize: 30,
      color: colors.Grey_Text,
      fontStyle: 'italic',
    },
    due_text: {
      color: colors.Task_Text,
      paddingTop: 5,
    },
  });
