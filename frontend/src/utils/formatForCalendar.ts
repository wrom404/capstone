import { type Event } from "@/types/types";
import moment from "moment";

const formatForCalendar = (events: Event[]) => {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    start: moment(event.date).toDate(), // Ensure correct date conversion
    end: moment(event.date).toDate(), // Ensure correct date conversion
    // allDay: event.allDay,
  }));
};

export default formatForCalendar;