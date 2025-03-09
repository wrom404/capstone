function formatTime(timeString: string) {
  // Split the input string into hours, minutes, and seconds
  const [hours, minutes] = timeString.split(":");

  // Convert the hours to a 12-hour format and determine AM/PM
  const hour = parseInt(hours) % 12 || 12; // Convert 0 to 12 for midnight
  const period = parseInt(hours) >= 12 ? "PM" : "AM";

  // Return the formatted time
  return `${hour}:${minutes} ${period}`;
}

export default formatTime