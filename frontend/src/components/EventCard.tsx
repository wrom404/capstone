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
import { motion } from "framer-motion";

const EventCard = ({ statusCount }: { statusCount: EventCountProps }) => {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="w-full border rounded-lg shadow-xs p-4 h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-700">
                Upcoming Events
              </CardTitle>
              <div className="bg-indigo-50 p-1.5 rounded-md">
                <CalendarClock className="w-6 h-6 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent className="mt-1">
              <p className="text-3xl font-bold leading-tight">
                {statusCount.upcoming ?? 0}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Total upcoming events
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Scheduled Events */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className=""
        >
          <Card className="w-full border rounded-lg shadow-xs p-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-700">
                Scheduled Events
              </CardTitle>
              <div className="bg-indigo-50 p-1.5 rounded-md">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent className="mt-1">
              <p className="text-3xl font-bold leading-tight">
                {statusCount.scheduled ?? 0}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Total scheduled events
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Completed Events */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className=""
        >
          <Card className="w-full border rounded-lg shadow-xs p-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-700">
                Completed Events
              </CardTitle>
              <div className="bg-indigo-50 p-1.5 rounded-md">
                <CalendarCheck className="w-6 h-6 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent className="mt-1">
              <p className="text-3xl font-bold leading-tight">
                {statusCount.completed ?? 0}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Total completed events
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Events */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className=""
        >
          <Card className="w-full border rounded-lg shadow-xs p-4">
            <CardHeader className="flex flex-row items-center justify-between gap-x-0">
              <CardTitle className="text-base font-semibold text-gray-700">
                Total Events
              </CardTitle>
              <div className="bg-indigo-50 p-1.5 rounded-md">
                <CalendarX className="w-6 h-6 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent className="mt-1">
              <p className="text-3xl font-bold leading-tight">
                {totalEvents ?? 0}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Total number of events
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EventCard;
