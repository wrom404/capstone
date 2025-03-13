import { useCallback, useState } from "react";
import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";
import useFetchAllEvents from "@/hooks/useFetchEvents";
import { type Event } from "@/types/types";
import formatForCalendar from "@/utils/formatForCalendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarEventPage = () => {
  const { isPending, data, error } = useFetchAllEvents();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState<Date>(new Date());

  const eventStyleGetter = () => {
    const style = {
      backgroundColor: "#1A1A1A",
      color: "white",
      borderRadius: "5px",
      border: "none",
      display: "block",
      fontSize: "14px",
    };
    return { style };
  };

  const handleSelectEvent = useCallback((event: Event) => {
    alert(event);
  }, []);

  if (isPending) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
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

  const myCalendarEvents = formatForCalendar(data);
  console.log(myCalendarEvents);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={myCalendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "85vh" }}
        views={["month", "week", "day", "agenda"]}
        view={view}
        date={date}
        onView={(newView: View) => setView(newView)}
        onNavigate={(newDate) => setDate(newDate)}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default CalendarEventPage;
