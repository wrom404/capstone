function formatTime(timeString: string) {
  const date = new Date(timeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero for minutes

  return `${hour}:${formattedMinutes} ${period}`;
}

export default formatTime;