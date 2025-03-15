import { useCallback, useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";
import useFetchAllEvents from "@/hooks/useFetchEvents";
import { type UnAvailableDateProps, type Event } from "@/types/types";
import generateRecurringEvents from "@/utils/generateRecurringEvents"; // Import your recurring logic
import formatForCalendar from "@/utils/formatForCalendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useFetchUnAvailableDate from "@/hooks/useFetchCountEvent";
import filterUnAvailableDate from "@/utils/filterUnAvailableDate";

const localizer = momentLocalizer(moment);

const CalendarEventPage = () => {
  const {
    isPending: isFetchingEvents,
    data: fetchedEvents,
    error: fetchEventsError,
  } = useFetchAllEvents();
  const {
    isPending: isUnAvailableDate,
    data: unAvailableDate,
    error: fetchUnAvailableError,
  } = useFetchUnAvailableDate();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]); // State to store all events
  const [eventCount, setEventCount] = useState<UnAvailableDateProps[]>([]);

  // Fetch and generate recurring events when data is available
  useEffect(() => {
    if (fetchedEvents) {
      const allEvents = generateRecurringEvents(fetchedEvents); // Generate all events including recurring ones
      setEvents(allEvents); // Store the events, including recurring ones
    }
  }, [fetchedEvents]);

  useEffect(() => {
    if (unAvailableDate) {
      const datesArray = Array.isArray(unAvailableDate)
        ? unAvailableDate
        : [unAvailableDate];
      const filteredDate = filterUnAvailableDate(datesArray);
      if (filteredDate && filteredDate.length > 0) {
        setEventCount(filteredDate);
      }
    }
  }, [unAvailableDate]);

  const dayPropGetter = (date: Date) => {
    const dateString = moment(date).format("YYYY-MM-DD");
    // Find the matching object in eventCount
    const matchingEvent = eventCount.find(
      (event) => moment(event.date).format("YYYY-MM-DD") === dateString
    );

    const count = matchingEvent ? parseInt(matchingEvent.count, 10) : 0;
    const isLimitReached = count >= 3;

    return {
      style: {
        backgroundColor: isLimitReached ? "#f0f0f0" : "white",
        color: isLimitReached ? "white" : "black",
        cursor: isLimitReached ? "not-allowed" : "pointer",
      },
    };
  };

  // Format the events for the calendar
  const myCalendarEvents = formatForCalendar(events);

  const eventPropGetter = (event: Event) => {
    let backgroundColor = "#ffffff";
    let color = "#000000";

    switch (event.event_type) {
      case "mass":
        backgroundColor = "#d4edda";
        color = "#155724";
        break;
      case "wedding":
        backgroundColor = "#fcd5ce";
        color = "#842029";
        break;
      case "baptism":
        backgroundColor = "#cfe2f3";
        color = "#084298";
        break;
      case "funeral":
        backgroundColor = "#f8f9fa";
        color = "#495057";
        break;
      case "confession":
        backgroundColor = "#e2d3f3";
        color = "#5f378d";
        break;
      case "meeting":
        backgroundColor = "#ffe5b4";
        color = "#7f4300";
        break;
      case "others":
        backgroundColor = "#f7f7e9";
        color = "#495057";
        break;
      default:
        backgroundColor = "#ffffff";
        color = "#212529";
    }

    return {
      style: {
        backgroundColor,
        color,
        padding: "2px",
        fontSize: "14px",
        border: "1px solid #ddd",
        fontWeight: "600",
      },
    };
  };

  const handleSelectEvent = useCallback((event: Event) => {
    alert(event.title); // Show the title when an event is selected
  }, []);

  if (isFetchingEvents || isUnAvailableDate) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (fetchEventsError || fetchUnAvailableError) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-red-600 text-2xl">
          Error while fetching events
        </span>
      </div>
    );
  }

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
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
      />
    </div>
  );
};

export default CalendarEventPage;
