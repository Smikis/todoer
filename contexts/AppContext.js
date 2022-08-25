import React, { createContext, useState, useEffect } from 'react'

import { useAuth } from '../hooks/useAuth'
import { useDb } from '../hooks/useDb'
import useLanguage from '../hooks/useLanguage'

import { getColorsByTheme } from '../services/getColorByTheme'
import { getTextBasedOnLocale } from '../services/getTextBasedOnLanguage'
import { onCreateTriggerNotification } from '../services/TriggerNotifications'
import {
  cancelNotifications,
  createNotifChannelId
} from '../services/TriggerNotifications'

import PropTypes from 'prop-types'

import { createUID } from '../utils/createUID'

import { useAsyncStorage } from '@react-native-async-storage/async-storage'

import Toast from 'react-native-toast-message'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('Light')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const { readData, updateDb } = useDb()
  const { locale } = useLanguage()
  const { user } = useAuth(() => setData)
  const TEXT = getTextBasedOnLocale(locale)
  const colors = getColorsByTheme(theme)
  const [channelId, setChannelId] = useState('')
  const { getItem, setItem } = useAsyncStorage('@user_theme')

  useEffect(() => {
    if (user) {
      ;(async () => {
        try {
          setLoading(true)
          const initData = await readData()
          const notifChannel = await createNotifChannelId()
          const user_theme = await getItem()
          if (user_theme !== null && user_theme !== theme) setTheme(user_theme)
          setData(initData)
          setChannelId(notifChannel)
          setLoading(false)
        } catch (e) {
          console.log(e)
        }
      })()
    }
  }, [user])

  useEffect(() => {
    ;(async () => await updateDb(data))()
  }, [data])

  function appendGroup(inputText) {
    let temp = undefined

    const group = {
      id: createUID(),
      group: inputText,
      created: Date.now(),
      tasks: [],
      collapsed: false
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

    let currentState = temp.groups[groupIndex].tasks[taskIndex].state

    temp.groups[groupIndex].tasks[taskIndex].state =
      currentState === 'DONE' ? 'NOT DONE' : 'DONE'

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
        props: { colors: colors }
      })
    }

    setData(temp)
  }

  async function appendTask(groupId, inputText, dueDate) {
    let temp = JSON.parse(JSON.stringify(data))

    const index = temp.groups.findIndex(group => {
      return group.id === groupId
    })

    const taskId = createUID()

    const task = {
      id: taskId,
      created: Date.now(),
      state: 'NOT DONE',
      value: inputText,
      due: dueDate ? Date.parse(dueDate) : null
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
      } catch {
        return 'error'
      }
    }

    if (dueDate) {
      await onCreateTriggerNotification(
        dueDate,
        channelId,
        taskId,
        inputText,
        TEXT
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

  async function switchTheme() {
    const newTheme = theme === 'Light' ? 'Dark' : 'Light'
    setTheme(newTheme)
    await setItem(newTheme)
  }

  return (
    <AppContext.Provider
      value={{
        user,
        data,
        appendGroup,
        toggleDone,
        toggleCollapsed,
        updateTaskData,
        appendTask,
        removeGroup,
        switchTheme,
        loading,
        locale,
        TEXT,
        colors,
        theme
      }}>
      {children}
    </AppContext.Provider>
  )
}

AppProvider.propTypes = {
  children: PropTypes.node
}

export default AppContext
