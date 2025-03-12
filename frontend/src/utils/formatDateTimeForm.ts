const formatDateTime = (date: string | null, time: string | null) => {
  if (date && time) {
    const dateObj = new Date(date); // Ensure date is a Date object
    const timeParts = time.split(":");
    dateObj.setHours(parseInt(timeParts[0], 10));
    dateObj.setMinutes(parseInt(timeParts[1], 10));

    return dateObj.toISOString(); // Convert to ISO string format
  }
  return null;
};

export default formatDateTime