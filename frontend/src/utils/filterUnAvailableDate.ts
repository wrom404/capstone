import { type UnAvailableDateProps } from "@/types/types";

const filterUnAvailableDate = (events: UnAvailableDateProps[] | []) => {
  if (!events) {
    console.log("No events.");
    return;
  }

  const filteredDates = events.filter((event) => {
    const count = parseInt(event.count, 10); // Access count directly
    return !isNaN(count) && count >= 2;
  });

  console.log("Original events:", events);
  console.log("Filtered dates:", filteredDates);
  return filteredDates;
};

export default filterUnAvailableDate;