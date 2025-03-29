import BarChartComponent from "@/components/BarChart";
import EventCard from "@/components/EventCard";
import LineChartComponent from "@/components/LineChart";
import useFetchEventsLastMonth from "@/hooks/useFetchEventLastMonth";
import useFetchRecentEvents from "@/hooks/useFetchRecentEvents";
import useFetchStatusCount from "@/hooks/useFetchStatusCount";
import { useEffect } from "react";
import { motion } from "framer-motion";

const Page = () => {
  const {
    data: recentEvent,
    isPending: isFetchingEvent,
    error: fetchError,
  } = useFetchRecentEvents();
  const {
    data: statusCount,
    isPending: isFetchingCount,
    error: countError,
  } = useFetchStatusCount();
  const {
    data: eventLastMonth,
    isPending: isFetchingLastMonth,
    error: lastMonthError,
  } = useFetchEventsLastMonth();

  useEffect(() => {
    if (recentEvent || eventLastMonth) {
      console.log("recentEvent: ", recentEvent);
      console.log("eventLastMonth: ", eventLastMonth);
    }
  }, [recentEvent, eventLastMonth]);

  if (isFetchingCount || isFetchingEvent || isFetchingLastMonth) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (countError || fetchError || lastMonthError) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <span className="text-red-600 text-2xl">
          Error while fetching events
        </span>
      </div>
    );
  }
  console.log("Props passed to LineChartComponent:", eventLastMonth);

  return (
    <div className="h-full pb-6">
      <div className="mb-6">
        <h2 className="text-gray-800 font-bold text-2xl">Dashboard</h2>
        <p className="text-sm text-gray-700">
          Visualize data, monitor progress, and gain insights.
        </p>
      </div>
      <EventCard statusCount={statusCount} />
      <div className="flex max-sm:flex-col gap-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: .3 }}
          className="w-full h-full border rounded-xl shadow-xs"
        >
          <div className="">
            <h2 className="text-gray-800 font-semibold text-base mt-6 mx-8">
              Monthly Event Activity
            </h2>
            <p className="text-gray-600 text-sm mx-8">
              Shows the number of events on specific dates from the this month.
            </p>
          </div>
          <LineChartComponent fetchedEvents={eventLastMonth ?? []} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: .4 }}
          className="w-full h-full border rounded-xl shadow-xs"
        >
          <div className="">
            <h2 className="text-gray-800 font-semibold text-base mt-6 mx-8">
              Event Type Distribution
            </h2>
            <p className="text-gray-600 text-sm mx-8">
              Displays the number of events for each event type this month.
            </p>
          </div>
          <BarChartComponent fetchedEvents={eventLastMonth ?? []} />
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
