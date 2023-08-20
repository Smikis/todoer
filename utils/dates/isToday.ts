export function isToday(date: Date) {
  const today = new Date().getDate();
  const dueDate = new Date(date).getDate();

  return today === dueDate;
}
