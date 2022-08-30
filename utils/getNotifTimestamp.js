import { isTomorrow } from './dates/isTomorrow'

export function getNotifTimestamp(dueDate) {
  let date = new Date()
  const due = Date.parse(dueDate)
  const dueD = new Date(due).getDate()

  if (isTomorrow(dueDate)) {
    date.setDate(dueD)
    date.setHours(8, 0)
  } else {
    date.setDate(dueD - 1)
    date.setHours(8, 0)
  }

  return date.valueOf()
}
