import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { type Event } from "@/types/types";

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="text-gray-700 text-sm">{label}</p>
        <p className="text-gray-700 text-sm">
          count: <span className="font-medium">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const BarChartComponent = ({ fetchedEvents }: { fetchedEvents: Event[] }) => {
  console.log("Fetched Events:", fetchedEvents);

  // Step 1: Count occurrences of each event type
  const EVENT_TYPES = [
    "mass",
    "wedding",
    "baptism",
    "funeral",
    "confession",
    "meeting",
    "others",
  ];

  const eventCounts = fetchedEvents.reduce((acc, event) => {
    if (event.event_type) {
      const type = event.event_type.toLowerCase(); // Convert to lowercase
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = EVENT_TYPES.map((type) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize for display
    count: eventCounts[type] || 0,
  }));

  return (
    <ResponsiveContainer
      className="mt-2 border-none w-fit rounded-xl shadow-none flex items-center justify-center"
      width={"100%"}
      height={300}
    >
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        className="bg-none"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-15} dy={10} />
        <YAxis
          domain={[0, 20]}
          ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="count"
          stackId="a"
          fill="oklch(0.511 0.262 276.966)"
          minPointSize={5}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
