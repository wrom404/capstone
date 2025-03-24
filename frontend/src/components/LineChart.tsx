import useFetchEventsLastMonth from "@/hooks/useFetchEventLastMonth";
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

interface Event {
  id: number;
  date: string;
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="text-gray-700 text-sm">
          {`Events: `}
          <span className="font-semibold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function CalendarLineChart() {
  const { data: fetchedEvents, isPending, error } = useFetchEventsLastMonth();

  const transformedData = useMemo(() => {
    if (!fetchedEvents || !Array.isArray(fetchedEvents)) return [];

    const eventCounts: Record<number, number> = {};
    fetchedEvents.forEach((event: Event) => {
      const day = moment(event.date).date();
      eventCounts[day] = (eventCounts[day] || 0) + 1;
    });

    return Object.keys(eventCounts).map((day) => ({
      date: Number(day),
      events: eventCounts[Number(day)],
    }));
  }, [fetchedEvents]);

  if (isPending) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <span className="text-red-600 text-2xl">
          Error while fetching events
        </span>
      </div>
    );
  }

  const currentMonth = moment().format("MMM");

  return (
    <ResponsiveContainer className={"mt-6 border p-4"} width="100%" height={300}>
      <h3 className="font-semibold text-gray-800">Line Chart</h3>
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
}
