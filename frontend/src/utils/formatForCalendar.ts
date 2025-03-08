import { type CalendarEvent, type Event } from "@/types/types";

const formatForCalendar = (events: Event[]): CalendarEvent[] => {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    venue: event.venue,

    event_type: event.event_type,
    priest_name: event.priest_name,
    client_number: event.client_number,
    date: event.date,
    start_time: event.start_time,
    end_time: event.end_time,
    status: event.status,
    is_recurring: event.is_recurring,
    recurring_days: event.recurring_days,
    has_end_date: event.has_end_date,
    end_date: event.end_date,
    created_at: event.created_at,


    start: new Date(`${event.date.split("T")[0]}T${event.start_time}`),
    end: new Date(`${event.date.split("T")[0]}T${event.end_time}`),
  }));
};

export default formatForCalendar;