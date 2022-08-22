import React, {createContext, useState, useEffect} from 'react';

import {useAuth} from '../hooks/useAuth';
import {useDb} from '../hooks/useDb';
import useLanguage from '../hooks/useLanguage';

import {getColorsByTheme} from '../services/getColorByTheme';
import {getTextBasedOnLocale} from '../services/getTextBasedOnLanguage';

import PropTypes from 'prop-types';

import {createUID} from '../utils/createUID';

import {
  cancelNotifications,
  createNotifChannelId,
} from '../services/TriggerNotifications';
import {onCreateTriggerNotification} from '../services/TriggerNotifications';

import {useAsyncStorage} from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export function AppProvider({children}) {
  const [theme, setTheme] = useState('Light');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const {readData, updateDb} = useDb();
  const {locale} = useLanguage();
  const {user} = useAuth(() => setData);
  const TEXT = getTextBasedOnLocale(locale);
  const colors = getColorsByTheme(theme);
  const [channelId, setChannelId] = useState('');
  const {getItem, setItem} = useAsyncStorage('@user_theme');

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          setLoading(true);
          const initData = await readData();
          const notifChannel = await createNotifChannelId();
          const user_theme = await getItem();
          setTheme(user_theme);
          setData(initData);
          setChannelId(notifChannel);
          setLoading(false);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    (async () => await updateDb(data))();
  }, [data]);

  useEffect(() => {
    (async () => {
      try {
        await setItem(theme);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [theme]);

  function appendGroup(inputText) {
    let temp = undefined;
    try {
      temp = JSON.parse(JSON.stringify(data));
      temp.groups = [
        ...temp.groups,
        {
          id: createUID(),
          group: inputText,
          created: Date.now(),
          tasks: [],
          collapsed: false,
        },
      ];
    } catch (e) {
      console.log('appendGroup:', e);
      if (temp === null)
        temp = {
          groups: [
            {
              id: createUID(),
              group: inputText,
              created: Date.now(),
              tasks: [],
              collapsed: false,
            },
          ],
        };
    }
    setData(temp);
  }

  function toggleDone(groupId, taskId) {
    let temp = JSON.parse(JSON.stringify(data));

    const groupIndex = temp.groups.findIndex(group => {
      return group.id === groupId;
    });
    const taskIndex = temp.groups[groupIndex].tasks.findIndex(task => {
      return task.id === taskId;
    });

    let currentState = temp.groups[groupIndex].tasks[taskIndex].state;

    temp.groups[groupIndex].tasks[taskIndex].state =
      currentState === 'DONE' ? 'NOT DONE' : 'DONE';

    setData(temp);
  }

  function toggleCollapsed(groupId) {
    let temp = JSON.parse(JSON.stringify(data));
    const index = temp.groups.findIndex(group => {
      return group.id === groupId;
    });
    temp.groups[index].collapsed = !temp.groups[index].collapsed;
    setData(temp);
  }

  function updateTaskData(newData, groupId) {
    let temp = JSON.parse(JSON.stringify(data));

    const index = temp.groups.findIndex(group => {
      return group.id === groupId;
    });

    temp.groups[index].tasks = newData;
    setData(temp);
  }

  async function appendTask(groupId, inputText, dueDate = null) {
    let temp = JSON.parse(JSON.stringify(data));

    const index = temp.groups.findIndex(group => {
      return group.id === groupId;
    });

    const taskId = createUID();

    try {
      temp.groups[index].tasks = [
        ...temp.groups[index].tasks,
        {
          id: taskId,
          created: Date.now(),
          state: 'NOT DONE',
          value: inputText,
          due: dueDate,
        },
      ];
    } catch (e) {
      console.log('appendTask:', e);
      if (
        temp.groups[index].tasks === undefined ||
        temp.groups[index].tasks?.length === 0
      )
        temp.groups[index].tasks = [
          {
            id: taskId,
            created: Date.now(),
            state: 'NOT DONE',
            value: inputText,
            due: dueDate,
          },
        ];
    }
    if (dueDate) {
      await onCreateTriggerNotification(
        dueDate,
        channelId,
        taskId,
        inputText,
        TEXT,
      );
    }

    setData(temp);
  }

  function removeGroup(groupId) {
    let temp = JSON.parse(JSON.stringify(data));
    const index = temp.groups.findIndex(group => {
      return group.id === groupId;
    });

    temp.groups[index]?.tasks.forEach(task => {
      cancelNotifications(task.id);
    });

    temp.groups.splice(index, 1);
    setData(temp);
  }

  function switchTheme() {
    setTheme(prev => (prev === 'Light' ? 'Dark' : 'Light'));
  }

  return (
    <AppContext.Provider
      value={{
        user: user,
        data: data,
        appendGroup: appendGroup,
        toggleDone: toggleDone,
        toggleCollapsed: toggleCollapsed,
        updateTaskData: updateTaskData,
        appendTask: appendTask,
        removeGroup: removeGroup,
        switchTheme: switchTheme,
        loading: loading,
        locale: locale,
        TEXT: TEXT,
        colors: colors,
        theme: theme,
      }}>
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node,
};

export default AppContext;
