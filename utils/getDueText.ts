export function getDueText(date: number, TEXT: any) {
  const now = new Date();
  const dueDate = new Date(date);
  const diff = dueDate.valueOf() - now.valueOf();
  const months = Math.round(diff / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (diff < 0) {
    return TEXT.Home.Overdue;
  }

  if (months > 0) {
    return `${TEXT.Home.NotifSentIn} ${months} ${TEXT.Home.Months}`;
  }

  if (days > 0) {
    return `${TEXT.Home.NotifSentIn} ${days} ${TEXT.Home.Days}`;
  }

  if (hours > 0) {
    return `${TEXT.Home.NotifSentIn} ${hours} ${TEXT.Home.Hours}`;
  }

  if (minutes > 0) {
    return `${TEXT.Home.NotifSentIn} ${minutes} ${TEXT.Home.Minutes}`;
  }

  if (seconds > 0) {
    return TEXT.Home.Soon;
  }

  return TEXT.Home.Overdue;
}
