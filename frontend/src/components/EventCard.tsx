import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX,
  Calendar,
} from "lucide-react";
import { EventCountProps } from "@/types/types";


const EventCard = ({statusCount }: {statusCount : EventCountProps}) => {
  const [totalEvents, setTotalEvents] = useState<number | null>(null);

  useEffect(() => {
    if (
      statusCount.upcoming &&
      statusCount.completed &&
      statusCount.scheduled
    ) {
      const totalEvents =
        statusCount.upcoming + statusCount.completed + statusCount.scheduled;
      setTotalEvents(totalEvents);
    }
  }, [statusCount]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-6">
        {/* Upcoming Events */}
        <Card className="w-full border rounded-lg shadow-xs p-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-700">
              Upcoming Events
            </CardTitle>
            <CalendarClock className="w-6 h-6 text-indigo-600" />
          </CardHeader>
          <CardContent className="mt-1">
            <p className="text-3xl font-bold leading-tight">
              {statusCount.upcoming ?? 0}
            </p>
            <p className="text-xs text-gray-600 mt-1">Total upcoming events</p>
          </CardContent>
        </Card>

        {/* Scheduled Events */}
        <Card className="w-full border rounded-lg shadow-xs p-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-700">
              Scheduled Events
            </CardTitle>
            <Calendar className="w-6 h-6 text-indigo-600" />
          </CardHeader>
          <CardContent className="mt-1">
            <p className="text-3xl font-bold leading-tight">
              {statusCount.scheduled ?? 0}
            </p>
            <p className="text-xs text-gray-600 mt-1">Total scheduled events</p>
          </CardContent>
        </Card>

        {/* Completed Events */}
        <Card className="w-full border rounded-lg shadow-xs p-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-700">
              Completed Events
            </CardTitle>
            <CalendarCheck className="w-6 h-6 text-indigo-600" />
          </CardHeader>
          <CardContent className="mt-1">
            <p className="text-3xl font-bold leading-tight">
              {statusCount.completed ?? 0}
            </p>
            <p className="text-xs text-gray-600 mt-1">Total completed events</p>
          </CardContent>
        </Card>

        {/* Total Events */}
        <Card className="w-full border rounded-lg shadow-xs p-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-700">
              Total Events
            </CardTitle>
            <CalendarX className="w-6 h-6 text-indigo-600" />
          </CardHeader>
          <CardContent className="mt-1">
            <p className="text-3xl font-bold leading-tight">
              {totalEvents ?? 0}
            </p>
            <p className="text-xs text-gray-600 mt-1">Total number of events</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventCard;
