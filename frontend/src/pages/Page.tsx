import BarChartComponent from "@/components/BarChart";
import EventCard from "@/components/EventCard";
import LineChart from "@/components/LineChart";
import PieChartComponent from "@/components/PieChartComponent";
import useFetchRecentEvents from "@/hooks/useFetchRecentEvents";
import useFetchStatusCount from "@/hooks/useFetchStatusCount";
import { useEffect } from "react";

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

  useEffect(() => {
    if (recentEvent) {
      console.log("recentEvent: ", recentEvent);
    }
  }, [recentEvent]);


  if (isFetchingCount || isFetchingEvent) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (countError || fetchError) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <span className="text-red-600 text-2xl">
          Error while fetching events
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-6">
      <div className="mb-6">
        <h2 className="text-gray-800 font-bold text-2xl">Dashboard</h2>
        <p className="text-sm text-gray-700">
          Visualize data, monitor progress, and gain insights.
        </p>
      </div>
      <EventCard statusCount={statusCount} />
      <LineChart />
      <div className="gap-6 flex mt-6">
        <BarChartComponent />
        <PieChartComponent />
      </div>
    </div>
  );
};

export default Page;
