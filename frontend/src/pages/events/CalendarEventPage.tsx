import { useCallback, useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";
import useFetchAllEvents from "@/hooks/events/useFetchEvents";
import { type UnAvailableDateProps, type Event } from "@/types/types";
import generateRecurringEvents from "@/utils/generateRecurringEvents"; // Import your recurring logic
import formatForCalendar from "@/utils/formatForCalendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useFetchUnAvailableDate from "@/hooks/events/useFetchCountEvent";
import filterUnAvailableDate from "@/utils/filterUnAvailableDate";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "@/style/calendarOverrides.css";

const localizer = momentLocalizer(moment);

const CalendarEventPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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
  const navigate = useNavigate();
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

  console.log("fetchedEvents: ", fetchedEvents);

  const todayString = moment().format("YYYY-MM-DD");
  const dayPropGetter = (date: Date) => {
    const dateString = moment(date).format("YYYY-MM-DD");
    const matchingEvent = eventCount.find(
      (event) => moment(event.date).format("YYYY-MM-DD") === dateString
    );

    const count = matchingEvent ? parseInt(matchingEvent.count, 10) : 0;
    const isLimitReached = count >= 10;

    return {
      style: {
        backgroundColor: isLimitReached
          ? "#f0f0f0"
          : isDarkMode
          ? "oklch(21% 0.006 285.885)"
          : "white",
        color: isLimitReached ? "white" : isDarkMode ? "white" : "black",
        fontWeight: dateString === todayString ? "bold" : "normal",
        cursor: isLimitReached ? "not-allowed" : "pointer",
        border: dateString === todayString ? "1px solid #2563eb" : undefined,
        borderLeft:
          dateString !== todayString ? "1px solid #ddd" : "2px solid #1e3a8a",
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
        // border: "1px solid #ddd",
        fontWeight: "600",
      },
    };
  };

  const handleSelectEvent = useCallback(
    (event: Event) => {
      //
      navigate(`/event/${event.id}`);
    },
    [navigate]
  );

  if (isFetchingEvents || isUnAvailableDate) {
    return (
      <div className="min-h-screen flex justify-center items-center dark:bg-zinc-900">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
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
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-2 md:px-8 py-4" // ADD some padding
    >
      <div className="w-full overflow-x-auto">
        <Calendar
          localizer={localizer}
          events={myCalendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "80vh", minHeight: "500px" }} // FIX height for smaller screens
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
      <div className="mt-6 dark:bg-zinc-900 bg-white p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-600">
          Event Legend
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:gap-6 md:gap-2 gap-0">
          <div className="flex items-center space-x-2 group dark:hover:bg-zinc-800 hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="w-4 h-4 rounded-full bg-[#d4edda] dark:bg-[#14532d]"></div>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Mass
            </span>
          </div>
          <div className="flex items-center space-x-2 group dark:hover:bg-zinc-800 hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="w-4 h-4 rounded-full bg-[#fcd5ce] dark:bg-[#842029]"></div>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Wedding
            </span>
          </div>
          <div className="flex items-center space-x-2 group dark:hover:bg-zinc-800 hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="w-4 h-4 rounded-full bg-[#cfe2f3] dark:bg-[#084298]"></div>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Baptism
            </span>
          </div>
          <div className="flex items-center space-x-2 group dark:hover:bg-zinc-800 hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="w-4 h-4 rounded-full bg-[#f8f9fa] dark:bg-[#495057]"></div>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Funeral
            </span>
          </div>
          <div className="flex items-center space-x-2 group dark:hover:bg-zinc-800 hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="w-4 h-4 rounded-full bg-[#e2d3f3] dark:bg-[#5f378d]"></div>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Confession
            </span>
          </div>
          <div className="flex items-center space-x-2 group dark:hover:bg-zinc-800 hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="w-4 h-4 rounded-full bg-[#ffe5b4] dark:bg-[#7f4300]"></div>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Meeting
            </span>
          </div>
          <div className="flex items-center space-x-2 group dark:hover:bg-zinc-800 hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="w-4 h-4 rounded-full bg-[#f7f7e9] dark:*bg-[#495057]"></div>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Others
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarEventPage;
