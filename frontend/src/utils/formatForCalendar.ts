import { Event } from "@/types/types";
import moment from "moment";

const formatForCalendar = (events: Event[]) => {
  return events.map((event) => ({
    id: event.id,
    event_type: event.event_type,
    title: event.title,
    start: moment(event.start).toDate(), // Ensure correct date conversion
    end: moment(event.end).toDate(), // Ensure correct date conversion
  }));
};

export default formatForCalendar;
