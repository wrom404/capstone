import BarChartComponent from "@/components/BarChart";
import EventCard from "@/components/EventCard";
import LineChart from "@/components/LineChart";
import PieChartComponent from "@/components/PieChartComponent";

const Page = () => {
  return (
    <div className="min-h-full pb-6">
      <div className="mb-6">
        <h2 className="text-gray-800 font-bold text-2xl">Dashboard</h2>
        <p className="text-sm text-gray-700">
          Visualize data, monitor progress, and gain insights.
        </p>
      </div>
      <EventCard />
      <LineChart />
      <div className="gap-6 flex mt-6">
        <BarChartComponent />
        <PieChartComponent />
      </div>
    </div>
  );
};

export default Page;
