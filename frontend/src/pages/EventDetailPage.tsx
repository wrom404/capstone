import useFetchAllEvent from "@/hooks/useFetchEvent";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Repeat,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Event } from "@/types/types";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const EventDetailPage = () => {
  const { id } = useParams();
  const { data, isPending, error } = useFetchAllEvent(id || "");
  const [events, setEvents] = useState<Event>({
    title: "",
    description: "",
    venue: "",
    expected_attendance: "",
    event_type: "",
    priest_name: "",
    client_number: "",
    date: "", // ISO string (e.g., "2025-04-04T16:00:00.000Z")
    start_time: "", // "HH:MM:SS" format
    end_time: "", // "HH:MM:SS" format
    is_recurring: false,
    recurring_days: [],
    has_end_date: false,
    end_date: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setEvents(data[0]);
    }
  }, [data]);

  if (isPending) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  console.log(data);

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-red-600 text-2xl">
          Error while fetching events
        </span>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        <button
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Events
        </button>

        <div className="bg-white rounded-xl border overflow-hidden">
          {/* Event Header */}
          <div className=" p-6 border-b border-indigo-100">
            <div className="flex justify-between items-start">
              <div className="pr-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {events.title}
                </h2>
                <p className="text-gray-600 mt-2">{events.description}</p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  events.status === "upcoming"
                    ? "bg-green-100 text-green-800"
                    : events.status === "completed"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-indigo-200 text-indigo-800"
                }`}
              >
                {events.status &&
                  events.status.charAt(0).toUpperCase() +
                    events.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Events Details */}
          <div className="p-6 space-y-6">
            {/* Date and Time Section */}
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-6 h-6 mr-3 text-indigo-600" />
                <div>
                  <p className="font-medium">Date</p>
                  <p>
                    {events.date &&
                      new Date(events.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <Clock className="w-6 h-6 mr-3 text-indigo-600" />
                <div>
                  <p className="font-medium">Time</p>
                  <p>
                    {events.start_time &&
                      new Date(events.start_time).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}{" "}
                    -{" "}
                    {events.end_time &&
                      new Date(events.end_time).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                  </p>
                </div>
              </div>

              {events.is_recurring && (
                <div className="flex items-center text-gray-700">
                  <Repeat className="w-6 h-6 mr-3 text-indigo-600" />
                  <div>
                    <p className="font-medium">Recurring Schedule</p>
                    <p>Every {events.recurring_days?.join(" and ")}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Location and Attendance Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-gray-700">
                <MapPin className="w-6 h-6 mr-3 text-indigo-600" />
                <div>
                  <p className="font-medium">Venue</p>
                  <p>{events.venue}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <Users className="w-6 h-6 mr-3 text-indigo-600" />
                <div>
                  <p className="font-medium">Expected Attendance</p>
                  <p>{events.expected_attendance} people</p>
                </div>
              </div>
            </div>

            {/* Additional Details Section */}
            {events.priest_name && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-gray-600">
                  <span className="font-medium">Officiated by:</span>{" "}
                  {events.priest_name}
                </p>
              </div>
            )}

            {events.client_number && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-gray-600">
                  <span className="font-medium">Contact Number:</span>{" "}
                  {events.client_number}
                </p>
              </div>
            )}
            <div className="border-t pt-6 flex justify-end">
              <div className="">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 font-bold cursor-pointer"
                >
                  Edit Event
                </Button>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 font-bold cursor-pointer ml-2.5"
                >
                  Cancel Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetailPage;
