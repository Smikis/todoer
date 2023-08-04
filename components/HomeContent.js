import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../contexts/AppContext'
import { FlatList } from 'react-native-gesture-handler'
import Group from './Group'

export default function HomeContent() {
  const { data } = useContext(AppContext)
  const [stopScroll, setStopScroll] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const inter = setInterval(() => {
      setCount(prev => prev + 1)
      if (count === 5) {
        setCount(0)
      }
    }, 5000)

    return () => clearInterval(inter)
  }, [])

  return (
    <FlatList
      data={data?.groups || []}
      renderItem={({ item, index }) => (
        <Group item={item} index={index} setStopScroll={setStopScroll} />
      )}
      scrollEnabled={!stopScroll}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.id}
    />
  )
}
