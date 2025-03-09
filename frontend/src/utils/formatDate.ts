function formatDate(dateString: string) {
  // Convert the input string into a Date object
  const date = new Date(dateString);

  // Create an array of month names
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Extract the month, day, and year
  const month = months[date.getMonth()]; // Month is 0-indexed
  const day = date.getDate(); // Day of the month
  const year = date.getFullYear(); // Year

  // Return the formatted string
  return `${month} ${day}, ${year}`;
}

export default formatDate