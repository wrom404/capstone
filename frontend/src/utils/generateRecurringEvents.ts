import { type Event } from "@/types/types";
import moment from "moment";

const dayNameToNumber: Record<string, number> = {
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
    if (event?.recurring_days && event?.recurring_days.length > 0) {
      const startDate = moment(event.date); 
      const end_date = event.has_end_date ? moment(event.end_date) : null;

      // Get sorted day numbers for the recurring days
      const recurringDayNumbers = event.recurring_days
        .map((day) => dayNameToNumber[day as keyof typeof dayNameToNumber])
        .sort((a, b) => a - b);

      const currentDate = moment(startDate); 

      // Generate occurrences
      while (!end_date || currentDate.isBefore(end_date, "day")) {
        recurringDayNumbers.forEach((dayNumber) => {
          const eventDate = moment(currentDate).isoWeekday(dayNumber).clone(); // Ensure it's a moment object

if (eventDate.isValid() && eventDate.isSameOrAfter(startDate, "day") && 
    (!end_date || eventDate.isBefore(end_date, "day"))) {
  updatedEvents.push({
    ...event,
    start: moment
      .utc(event.start_time)
      .set({
        year: eventDate.year(),
        month: eventDate.month(),
        date: eventDate.date(),
      })
      .toDate(),
    end: moment
      .utc(event.end_time)
      .set({
        year: eventDate.year(),
        month: eventDate.month(),
        date: eventDate.date(),
      })
      .toDate(),
  });
}

        });

        currentDate.add(1, "week"); // Move to the next week
        if (!end_date && updatedEvents.length > 520) break; // Stop infinite loop
      }
    } else {
      updatedEvents.push({
        ...event,
        start: moment(event.start_time).toDate(),
        end: moment(event.end_time).toDate(),
      });
    }
  });

  return updatedEvents;
};

export default generateRecurringEvents