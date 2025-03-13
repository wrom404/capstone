import moment from "moment";
import { type Event } from "@/types/types";

const dayNameToNumber = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

const generateRecurringEvents = (events: Event[]): Event[] => {
  const updatedEvents: Event[] = [];

  events.forEach((event) => {
    // Check if the event is recurring
    if (event?.recurring_days && event?.recurring_days.length > 0) {
      const startDate = moment(event.date); // Use event.date as the start
      const end_date = event.has_end_date ? moment(event.end_date) : null; // Handle optional end date

      let i = 0; // Counter for recurring event dates
      const firstOccurrence = moment(startDate); // Initialize the first occurrence of the event

      // Adjust the start date to match the recurring day (e.g., Wednesday, Monday, etc.)
      const firstValidDay = event.recurring_days
        .map((day) => dayNameToNumber[day as keyof typeof dayNameToNumber])
        .sort((a, b) => a - b)[0]; // Find the first recurring day of the week

      // Align the startDate to the first valid recurring day
      if (firstOccurrence.isoWeekday() !== firstValidDay) {
        // If the first occurrence is not on the recurring day, move the date forward until it aligns
        while (firstOccurrence.isoWeekday() !== firstValidDay) {
          firstOccurrence.add(1, "day");
        }
      }

      // Infinite loop for events with no end date
      while (true) {
        const currentDate = moment(firstOccurrence).add(i, "weeks"); // Add weeks instead of days

        // If there is an end date, stop when current date exceeds the end date
        if (end_date && currentDate.isAfter(end_date)) break;

        // Include only specified recurring days
        const currentDayNumber = currentDate.isoWeekday();
        if (
          event.recurring_days.some(
            (day) => dayNameToNumber[day as keyof typeof dayNameToNumber] === currentDayNumber
          )
        ) {
          updatedEvents.push({
            ...event,
            start: moment
              .utc(event.start_time)
              .set({
                year: currentDate.year(),
                month: currentDate.month(),
                date: currentDate.date(),
              })
              .toDate(),
            end: moment
              .utc(event.end_time)
              .set({
                year: currentDate.year(),
                month: currentDate.month(),
                date: currentDate.date(),
              })
              .toDate(),
          });
        }

        // Increase by 1 week to generate the next instance
        i++;

        // If no end date, continue indefinitely but limit the number of weeks
        if (!end_date && i > 520) break; // Optional limit of 10 years (520 weeks)
      }
    } else {
      // Single event (not recurring)
      updatedEvents.push({
        ...event,
        start: moment(event.start_time).toDate(),
        end: moment(event.end_time).toDate(),
      });
    }
  });

  return updatedEvents;
};

export default generateRecurringEvents;
