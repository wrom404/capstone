import BarChartComponent from "@/components/BarChart";
import EventCard from "@/components/EventCard";
import LineChart from "@/components/LineChart";
import PieChartComponent from "@/components/PieChartComponent";
import useFetchStatusCount from "@/hooks/useFetchStatusCount";

const Page = () => {
  const {
    data: statusCount = {
      success: false,
      eventCounts: { upcoming: 0, completed: 0, scheduled: 0 },
    },
    isPending: isFetchingCount,
    error: countError,
  } = useFetchStatusCount() as {
    data: {
      success: boolean;
      eventCounts: {
        upcoming: number | null;
        completed: number | null;
        scheduled: number | null;
      };
    };
    isPending: boolean;
    error: string | null;
  };

  // Extract eventCounts from the response
  const { eventCounts } = statusCount;

  if (isFetchingCount) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (countError) {
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
      <EventCard eventCounts={eventCounts} />
      <LineChart />
      <div className="gap-6 flex mt-6">
        <BarChartComponent />
        <PieChartComponent />
      </div>
    </div>
  );
};

export default Page;
