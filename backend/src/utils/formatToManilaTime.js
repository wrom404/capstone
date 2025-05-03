function formatToManilaTime(date) {
  const convertedTime = date.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // change to true for AM/PM format
    timeZone: "Asia/Manila",
  });

  return convertedTime;
}

export default formatToManilaTime;
