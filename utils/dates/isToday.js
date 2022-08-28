export function isToday(date) {
  const today = new Date().getDate()
  const dueDate = new Date(date).getDate()

  return today === dueDate
}
