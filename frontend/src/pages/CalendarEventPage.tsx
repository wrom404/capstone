import { useCallback, useState } from "react";
import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import fetchAllEvents from "@/hooks/useFetchEvents";
import { type Event, type CalendarEvent } from "@/types/types";
import formatForCalendar from "@/utils/formatForCalendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarEventPage = () => {
  const { isPending, data, error } = useQuery<Event[]>(fetchAllEvents);

  // Fix: Explicitly type state
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState<Date>(new Date());

  const handleSelectEvent = useCallback((event: Event) => {
    alert(event);
  }, []);

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

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={myCalendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "85dvh" }}
        views={["month", "week", "day", "agenda"]} // Enable views
        view={view} // Controlled view state
        date={date} // Controlled date state
        onView={(newView: View) => setView(newView)} // Ensure type safety
        onNavigate={(newDate) => setDate(newDate)} // Handle navigation
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default CalendarEventPage;
