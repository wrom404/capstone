const formatTimeEditForm = (timeString: string) => {
  if (!timeString) return ""; // Handle empty values

  const formatTime = new Date(timeString);
  if (isNaN(formatTime.getTime())) return ""; // Handle invalid dates

  // .getHours() and .getMinutes() extract local time and .padStart(2, "0") ensures proper HH:MM formatting.
  const hours = formatTime.getHours().toString().padStart(2, "0");
  const minutes = formatTime.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`; // Ensures correct "HH:MM" format
};

export default formatTimeEditForm