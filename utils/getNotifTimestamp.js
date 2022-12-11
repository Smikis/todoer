export function getNotifTimestamp(dueDate) {
  const due = new Date(Date.parse(dueDate))

  return due.valueOf()
}
