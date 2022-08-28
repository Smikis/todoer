export function isTomorrow(date) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dueDate = new Date(date).getDate()

  return tomorrow.getDate() === dueDate
}
