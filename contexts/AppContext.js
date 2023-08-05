import React, { createContext, useState, useEffect } from 'react'

import { useAuth } from '../hooks/useAuth'
import { useDb } from '../hooks/useDb'
import { useLanguage } from '../hooks/useLanguage'

import { getTextBasedOnLocale } from '../services/getTextBasedOnLanguage'
import { onCreateTriggerNotification } from '../services/TriggerNotifications'
import { cancelNotifications } from '../services/TriggerNotifications'

import notifee from '@notifee/react-native'

import PropTypes from 'prop-types'

import { createUID } from '../utils/createUID'

import { useAsyncStorage } from '@react-native-async-storage/async-storage'

import Toast from 'react-native-toast-message'

import { COLORS as colors } from '../constants/COLORS'

import SplashScreen from 'react-native-splash-screen'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('Light')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const { readData, updateDb } = useDb()
  const { locale } = useLanguage()
  const { user } = useAuth()
  const TEXT = getTextBasedOnLocale(locale)
  const { getItem, setItem } = useAsyncStorage('@user_theme')
  const { getItem: getFirstLaunch, setItem: setFirstLaunchItem } =
    useAsyncStorage('@first_launch')
  const [firstLaunch, setFirstLaunch] = useState(null)

  SplashScreen.hide()

  useEffect(() => {
    if (user) {
      ;(async () => {
        try {
          setLoading(true)
          const initData = await readData()
          const user_theme = await getItem()

          if (user_theme !== null && user_theme !== theme) setTheme(user_theme)
          setData(initData)

          setLoading(false)
        } catch (e) {
          console.log(e)
        }
      })()
      if (firstLaunch === true) setFirstLaunch(false)
    }
  }, [user])

  useEffect(() => {
    ;(async () => await updateDb(data))()
  }, [data])

  useEffect(() => {
    ;(async () => {
      const fl = await getFirstLaunch()

      if (fl === null && !user) {
        setFirstLaunch(true)
        setFirstLaunchItem('false')
      } else {
        setFirstLaunch(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (!groupExists('')) appendGroup('', true)
  }, [loading])

  function groupExists(inputText) {
    try {
      for (let group of data.groups) if (group.group === inputText) return true
    } catch (e) {
      console.log(e)
    }
    return false
  }

  function appendGroup(inputText, defaultGroup = false) {
    let temp = undefined

    const group = {
      id: defaultGroup === false ? createUID() : 'default',
      group: inputText,
      tasks: [],
      collapsed: false,
      order: 0
    }

    try {
      temp = JSON.parse(JSON.stringify(data))
      temp.groups = [...temp.groups, group]
    } catch (e) {
      console.log('appendGroup:', e)
      try {
        if (temp === null)
          temp = {
            groups: [group]
          }
      } catch {
        return 'error'
      }
    }
    setData(temp)
    return 'success'
  }

  function toggleDone(groupId, taskId) {
    let temp = JSON.parse(JSON.stringify(data))

    const groupIndex = temp.groups.findIndex(group => {
      return group.id === groupId
    })
    const taskIndex = temp.groups[groupIndex].tasks.findIndex(task => {
      return task.id === taskId
    })

    let currentState = temp.groups[groupIndex].tasks[taskIndex].isDone

    temp.groups[groupIndex].tasks[taskIndex].isDone = !currentState

    setData(temp)
  }

  function toggleCollapsed(groupId) {
    let temp = JSON.parse(JSON.stringify(data))
    const index = temp.groups.findIndex(group => {
      return group.id === groupId
    })
    temp.groups[index].collapsed = !temp.groups[index].collapsed
    setData(temp)
  }

  function updateTaskData(newData, groupId) {
    let temp = JSON.parse(JSON.stringify(data))

    const index = temp.groups.findIndex(group => {
      return group.id === groupId
    })
    try {
      temp.groups[index].tasks = newData
    } catch {
      Toast.show({
        type: 'errorToast',
        text1: TEXT.Toast.Error,
        text2: TEXT.Toast.Error_Text,
        props: { colors: colors, theme: theme }
      })
    }

    setData(temp)
  }

  async function appendTask(
    groupId = 'default',
    inputText,
    dueDate,
    toggleRepeating
  ) {
    let temp = JSON.parse(JSON.stringify(data))

    const index = temp.groups.findIndex(group => {
      return group.id === groupId
    })

    const taskId = createUID()

    const task = {
      id: taskId,
      isDone: false,
      value: inputText,
      due: dueDate ? Date.parse(dueDate) : null,
      repeating: toggleRepeating
    }

    try {
      temp.groups[index].tasks = [...temp.groups[index].tasks, task]
    } catch (e) {
      console.log('appendTask:', e)
      try {
        if (
          temp.groups[index].tasks === undefined ||
          temp.groups[index].tasks?.length === 0
        )
          temp.groups[index].tasks = [task]
      } catch (e) {
        console.log(e)
        return 'error'
      }
    }

    if (dueDate) {
      onCreateTriggerNotification(
        dueDate,
        taskId,
        inputText,
        TEXT,
        toggleRepeating
      )
    }

    setData(temp)
    return 'success'
  }

  function removeGroup(groupId) {
    let temp = JSON.parse(JSON.stringify(data))

    const index = temp.groups.findIndex(group => {
      return group.id === groupId
    })

    try {
      temp.groups[index]?.tasks?.forEach(task => {
        cancelNotifications(task.id)
      })
      temp.groups.splice(index, 1)
    } catch {
      return 'error'
    }
    setData(temp)
    return 'success'
  }

  function removeTask(groupId, taskId) {
    let temp = JSON.parse(JSON.stringify(data))

    const groupIndex = temp.groups.findIndex(group => {
      return group.id === groupId
    })

    const taskIndex = temp.groups[groupIndex].tasks.findIndex(task => {
      return task.id === taskId
    })

    try {
      temp.groups[groupIndex].tasks.splice(taskIndex, 1)
    } catch {
      return 'error'
    }
    setData(temp)
    notifee.cancelNotification(taskId)

    return 'success'
  }

  async function switchTheme() {
    const newTheme = theme === 'Light' ? 'Dark' : 'Light'
    setTheme(newTheme)
    await setItem(newTheme)
  }

  function sortTasks(groupId, sorting, sort) {
    let temp = JSON.parse(JSON.stringify(data))

    const groupIndex = temp.groups.findIndex(group => {
      return group.id === groupId
    })

    temp.groups[groupIndex].order = sort
    try {
      switch (sorting) {
        case 'byDateASC':
          temp.groups[groupIndex].tasks.sort((a, b) => {
            var dateA = new Date(a.due)
            var dateB = new Date(b.due)
            if (!dateA.toJSON()) {
              return 1
            }
            if (!dateB.toJSON()) {
              return -1
            }
            return dateA - dateB
          })
          break
        case 'byDateDESC':
          temp.groups[groupIndex].tasks.sort((a, b) => {
            var dateA = new Date(a.due)
            var dateB = new Date(b.due)
            if (!dateA.toJSON()) {
              return 1
            }
            if (!dateB.toJSON()) {
              return -1
            }
            return dateB - dateA
          })
          break
        case 'byNameDESC':
          temp.groups[groupIndex].tasks.sort((a, b) => {
            return b.value.localeCompare(a.value)
          })
          break
        case 'byNameASC':
          temp.groups[groupIndex].tasks.sort((a, b) => {
            return a.value.localeCompare(b.value)
          })
          break
        case 'byDoneASC':
          temp.groups[groupIndex].tasks.sort((a, b) => {
            return a.isDone - b.isDone
          })
          break
        case 'byDoneDESC':
          temp.groups[groupIndex].tasks.sort((a, b) => {
            return b.isDone - a.isDone
          })
          break
      }
    } catch (e) {
      console.log('sortTasks error:', e)
    }

    setData(temp)
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
        groupExists
      }}>
      {children}
    </AppContext.Provider>
  )
}

AppProvider.propTypes = {
  children: PropTypes.node
}

export default AppContext
