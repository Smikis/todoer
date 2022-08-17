export function isTomorrow(date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueDate = new Date(date).getDate();

  if (tomorrow.getDate() === dueDate) {
    return true;
  }

  return false;
}
