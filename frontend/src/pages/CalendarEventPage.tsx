import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import fetchAllEvents from "@/hooks/useFetchEvents";
import { type Event, type CalendarEvent } from "@/types/types";
import formatForCalendar from "@/utils/formatForCalendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarEventPage = () => {
  const { isPending, data, error } = useQuery<Event[]>(fetchAllEvents);

  if (isPending) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-gray-800 text-2xl">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-red-600 text-2xl">
          Error while fetching events
        </span>
      </div>
    );
  }

  const myCalendarEvents: CalendarEvent[] = formatForCalendar(data);

  console.log(myCalendarEvents);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={myCalendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "85dvh" }}
      />
    </div>
  );
};

export default CalendarEventPage;
