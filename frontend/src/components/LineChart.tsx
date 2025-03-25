import { useMemo } from "react";
import moment from "moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type Event } from "@/types/types";

const CustomTooltip = ({
  active = false,
  payload = [],
}: {
  active?: boolean;
  payload?: { value: number }[];
}) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="text-gray-700 text-sm">
          {`Events: `}
          <span className="font-semibold">{payload[0]?.value ?? 0}</span>
        </p>
      </div>
    );
  }
  return null;
};

const LineChartComponent = ({ fetchedEvents }: { fetchedEvents: Event[] }) => {
  const transformedData = useMemo(() => {
    if (!fetchedEvents || !Array.isArray(fetchedEvents)) return [];

    const eventCounts: Record<number, number> = {};
    fetchedEvents.forEach((event) => {
      if (!event.date) return; // Ensure date is valid

      const day = moment(event.date).date();
      eventCounts[day] = (eventCounts[day] || 0) + 1;
    });

    return Object.keys(eventCounts).map((day) => ({
      date: Number(day),
      events: eventCounts[Number(day)],
    }));
  }, [fetchedEvents]);

  console.log(
    "Final transformedData for Recharts:",
    JSON.stringify(transformedData, null, 2)
  );

  const currentMonth = moment().format("MMM");

  return (
    <ResponsiveContainer
      className="mt-2 border-none w-fit rounded-xl shadow-none flex items-center justify-center"
      width="100%"
      height={300}
    >
      <LineChart
        data={transformedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(day) =>
            day % 2 === 0 ? `${day} ${currentMonth}` : ""
          }
        />
        <YAxis domain={[0, 10]} ticks={[2, 4, 6, 8, 10]} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="events"
          stroke="oklch(0.511 0.262 276.966)"
          dot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
