export function getNotifTimestamp(dueDate: Date) {
  const due = new Date(dueDate);

  return due.valueOf();
}
