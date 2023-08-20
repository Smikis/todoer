import React, {createContext, useState, useEffect} from 'react';

import {useAuth} from '../hooks/useAuth';
import {useDb} from '../hooks/useDb';
import {useLanguage} from '../hooks/useLanguage';

import {getTextBasedOnLocale} from '../services/getTextBasedOnLanguage';
import {onCreateTriggerNotification} from '../services/TriggerNotifications';
import {cancelNotifications} from '../services/TriggerNotifications';

import notifee from '@notifee/react-native';

import {createUID} from '../utils/createUID';

import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import Toast from 'react-native-toast-message';

import {COLORS as colors} from '../constants/COLORS';

import SplashScreen from 'react-native-splash-screen';

import {UserData} from '../types/userData';
import {Task} from '../types/task';
import {Theme} from '../types/theme';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

const AppContext = createContext(
  {} as {
    user: FirebaseAuthTypes.User | undefined;
    data: UserData;
    loading: boolean;
    locale: string;
    TEXT: any;
    colors: typeof colors;
    theme: Theme;
    firstLaunch: boolean | null;
    appendGroup: (inputText: string, defaultGroup?: boolean) => string;
    toggleDone: (groupId: string, taskId: string) => void;
    toggleCollapsed: (groupId: string) => void;
    updateTaskData: (newData: Task[], groupId: string) => void;
    appendTask: (
      groupId: string,
      inputText: string,
      dueDate?: Date,
      toggleRepeating?: boolean,
    ) => Promise<string>;
    removeGroup: (groupId: string) => string;
    removeTask: (groupId: string, taskId: string) => string;
    switchTheme: () => void;
    sortTasks: (groupId: string, sorting: string, sort: number) => void;
    setFirstLaunch: React.Dispatch<React.SetStateAction<boolean | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    groupExists: (inputText: string) => boolean;
  },
);

export function AppProvider({children}: {children: React.ReactNode}) {
  const [theme, setTheme] = useState<Theme>('Light');
  const [data, setData] = useState<UserData>({} as UserData);
  const [loading, setLoading] = useState(false);
  const {readData, updateDb} = useDb();
  const {locale} = useLanguage();
  const {user} = useAuth();
  const TEXT = getTextBasedOnLocale(locale);
  const {getItem, setItem} = useAsyncStorage('@user_theme');
  const {getItem: getFirstLaunch, setItem: setFirstLaunchItem} =
    useAsyncStorage('@first_launch');
  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);

  SplashScreen.hide();

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          setLoading(true);
          const initData = await readData();
          const user_theme = await getItem();

          if (user_theme !== null && user_theme !== theme)
            setTheme(user_theme as Theme);
          setData(initData as UserData);

          setLoading(false);
        } catch (e) {
          console.log(e);
        }
      })();
      if (firstLaunch === true) setFirstLaunch(false);
    }
  }, [user]);

  useEffect(() => {
    (async () => await updateDb(data))();
  }, [data]);

  useEffect(() => {
    (async () => {
      const fl = await getFirstLaunch();

      if (fl === null && !user) {
        setFirstLaunch(true);
        setFirstLaunchItem('false');
      } else {
        setFirstLaunch(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!groupExists('')) appendGroup('', true);
  }, [loading]);

  function groupExists(inputText: string) {
    try {
      for (let group of data.groups) if (group.group === inputText) return true;
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  function appendGroup(inputText: string, defaultGroup = false) {
    let temp = undefined;

    const group = {
      id: defaultGroup === false ? createUID() : 'default',
      group: inputText,
      tasks: [],
      collapsed: false,
      order: 0,
    };

    try {
      temp = JSON.parse(JSON.stringify(data));
      temp.groups = [...temp.groups, group];
    } catch (e) {
      console.log('appendGroup:', e);
      try {
        if (temp === null)
          temp = {
            groups: [group],
          };
      } catch {
        return 'error';
      }
    }
    setData(temp);
    return 'success';
  }

  function toggleDone(groupId: string, taskId: string) {
    let temp: UserData = JSON.parse(JSON.stringify(data));

    const groupIndex = temp.groups.findIndex(group => {
      return group.id === groupId;
    });
    const taskIndex = temp.groups[groupIndex].tasks.findIndex(task => {
      return task.id === taskId;
    });

    let currentState = temp.groups[groupIndex].tasks[taskIndex].isDone;

    temp.groups[groupIndex].tasks[taskIndex].isDone = !currentState;

    setData(temp);
  }

  function toggleCollapsed(groupId: string) {
    let temp: UserData = JSON.parse(JSON.stringify(data));
    const index = temp.groups.findIndex(group => {
      return group.id === groupId;
    });
    temp.groups[index].collapsed = !temp.groups[index].collapsed;
    setData(temp);
  }

  function updateTaskData(newData: Task[], groupId: string) {
    let temp: UserData = JSON.parse(JSON.stringify(data));

    const index = temp.groups.findIndex(group => {
      return group.id === groupId;
    });
    try {
      temp.groups[index].tasks = newData;
    } catch {
      Toast.show({
        type: 'errorToast',
        text1: TEXT.Toast.Error,
        text2: TEXT.Toast.Error_Text,
        props: {colors: colors, theme: theme},
      });
    }

    setData(temp);
  }

  async function appendTask(
    groupId = 'default',
    inputText: string,
    dueDate?: Date,
    toggleRepeating = false,
  ) {
    let temp: UserData = JSON.parse(JSON.stringify(data));

    const index = temp.groups.findIndex(group => {
      return group.id === groupId;
    });

    const taskId = createUID();

    const task: Task = {
      id: taskId,
      isDone: false,
      value: inputText,
      due: dueDate ? dueDate.valueOf() : null,
      repeating: toggleRepeating,
    };

    try {
      temp.groups[index].tasks = [...temp.groups[index].tasks, task];
    } catch (e) {
      console.log('appendTask:', e);
      try {
        if (
          temp.groups[index].tasks === undefined ||
          temp.groups[index].tasks?.length === 0
        )
          temp.groups[index].tasks = [task];
      } catch (e) {
        console.log(e);
        return 'error';
      }
    }

    if (dueDate) {
      onCreateTriggerNotification(
        dueDate,
        taskId,
        inputText,
        TEXT,
        toggleRepeating,
      );
    }

    setData(temp);
    return 'success';
  }

  function removeGroup(groupId: string) {
    let temp: UserData = JSON.parse(JSON.stringify(data));

    const index = temp.groups.findIndex(group => {
      return group.id === groupId;
    });

    try {
      temp.groups[index]?.tasks?.forEach(task => {
        cancelNotifications(task.id);
      });
      temp.groups.splice(index, 1);
    } catch {
      return 'error';
    }
    setData(temp);
    return 'success';
  }

  function removeTask(groupId: string, taskId: string) {
    let temp: UserData = JSON.parse(JSON.stringify(data));

    const groupIndex = temp.groups.findIndex(group => {
      return group.id === groupId;
    });

    const taskIndex = temp.groups[groupIndex].tasks.findIndex(task => {
      return task.id === taskId;
    });

    try {
      temp.groups[groupIndex].tasks.splice(taskIndex, 1);
    } catch {
      return 'error';
    }
    setData(temp);
    notifee.cancelNotification(taskId);

    return 'success';
  }

  async function switchTheme() {
    const newTheme = theme === 'Light' ? 'Dark' : 'Light';
    setTheme(newTheme);
    await setItem(newTheme);
  }

  function sortTasks(groupId: string, sorting: string, sort: number) {
    let temp: UserData = JSON.parse(JSON.stringify(data));

    const groupIndex = temp.groups.findIndex(group => {
      return group.id === groupId;
    });

    temp.groups[groupIndex].order = sort;
    try {
      switch (sorting) {
        case 'byDateASC':
          temp.groups[groupIndex].tasks.sort((a, b) => {
            const dateA: any = new Date(a.due || 0);
            const dateB: any = new Date(b.due || 0);
            if (!dateA.toJSON()) {
              return 1;
            }
            if (!dateB.toJSON()) {
              return -1;
            }
            return dateA - dateB;
          });
          break;
        case 'byDateDESC':
          temp.groups[groupIndex].tasks.sort((a, b) => {
            const dateA: any = new Date(a.due || 0);
            const dateB: any = new Date(b.due || 0);
            if (!dateA.toJSON()) {
              return 1;
            }
            if (!dateB.toJSON()) {
              return -1;
            }
            return dateB - dateA;
          });
          break;
        case 'byNameDESC':
          temp.groups[groupIndex].tasks.sort((a, b) => {
            return b.value.localeCompare(a.value);
          });
          break;
        case 'byNameASC':
          temp.groups[groupIndex].tasks.sort((a, b) => {
            return a.value.localeCompare(b.value);
          });
          break;
        case 'byDoneASC':
          temp.groups[groupIndex].tasks.sort((a: any, b: any) => {
            return a.isDone - b.isDone;
          });
          break;
        case 'byDoneDESC':
          temp.groups[groupIndex].tasks.sort((a: any, b: any) => {
            return b.isDone - a.isDone;
          });
          break;
      }
    } catch (e) {
      console.log('sortTasks error:', e);
    }

    setData(temp);
  }

  return (
    <AppContext.Provider
      value={{
        user,
        data,
        loading,
        locale,
        TEXT,
        colors,
        theme,
        firstLaunch,
        appendGroup,
        toggleDone,
        toggleCollapsed,
        updateTaskData,
        appendTask,
        removeGroup,
        removeTask,
        switchTheme,
        sortTasks,
        setFirstLaunch,
        setLoading,
        groupExists,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
