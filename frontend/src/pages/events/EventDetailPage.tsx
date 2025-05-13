import useFetchEvent from "@/hooks/events/useFetchEvent";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Repeat,
  Church,
  Tags,
  Handshake,
  UserCog,
  Mail as MailIcon,
  MessageCircleMore,
} from "lucide-react";
import { useEffect, useState } from "react";
import { type FormDataProps } from "@/types/types";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import CustomCancelModal from "@/components/CustomCancelModal";
import useCancelEvent from "@/hooks/events/useCancelEvent";
import toast from "react-hot-toast";
import useUserStore from "@/store/useUserStore";
import { motion } from "framer-motion";
import moment from "moment-timezone";
import { roles as adminRoles } from "@/constant/constant";

/**
 * Converts an ISO date string to a formatted date string (YYYY-MM-DD) in Asia/Manila timezone.
 *
 * Why it's needed:
 * - Dates from the backend (especially in ISO format) are usually in UTC or have a timezone offset.
 * - If we simply split the string (e.g. isoString.split("T")[0]), the browser might interpret the time in the user's local timezone,
 *   which can lead to off-by-one-day errors (e.g. May 10 becoming May 9 in the UI).
 *
 * What it does:
 * - Uses Moment.js with timezone support to interpret the date as Asia/Manila time (UTC+8).
 * - Ensures that the correct local date is extracted regardless of the user's local timezone.
 *
 * @param isoString - An ISO 8601 formatted datetime string (e.g. "2025-05-10T00:00:00+08:00")
 * @returns A string in "YYYY-MM-DD" format representing the correct date in Asia/Manila time.
 */
const formatDateFromISO = (isoString: string) => {
  if (!isoString) return "";
  return moment.tz(isoString, "Asia/Manila").format("YYYY-MM-DD");
};

const formatTimeFromISO = (isoString: string) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return "";
  }
};

const EventDetailPage = () => {
  const { id } = useParams();
  const {
    data: fetchedEvent,
    isPending: isFetchingEvents,
    error: fetchedError,
  } = useFetchEvent(id || "");

  const {
    mutate: cancelEvent,
    isPending: isCancelingEvent,
    error: canceledError,
    isSuccess,
  } = useCancelEvent(id || "");
  const { userRole } = useUserStore();
  const [events, setEvents] = useState<FormDataProps>({
    title: "",
    description: "",
    venue: "",
    expectedAttendance: "",
    eventType: "",
    priestName: "",
    clientEmail: [],
    date: "", // ISO string (e.g., "2025-04-04T16:00:00.000Z")
    startTime: "", // "HH:MM:SS" format
    endTime: "", // "HH:MM:SS" format
    isRecurring: false,
    recurringDays: [],
    hasEndDate: false,
    endDate: "",
    status: "",
    id: "",
    cancelReason: "",
    wifeName: "",
    husbandName: "",
    childName: "",
    chapelName: "", // New field for chapel name
    sponsors: [], // New field for sponsors array
    organizers: [], // New field for organizers array
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cancelMessage, setCancelMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const eventData = fetchedEvent?.[0];
    if (eventData) {
      setEvents({
        id: eventData.id?.toString() || "",
        title: eventData.title || "",
        description: eventData.description || "",
        venue: eventData.venue || "",
        expectedAttendance: eventData.expected_attendance || "",
        eventType: eventData.event_type || "",
        priestName: eventData.priest_name || "",
        clientEmail: eventData.client_email || [],
        date: formatDateFromISO(eventData.date || "") || "",
        startTime: eventData.start_time
          ? formatTimeFromISO(eventData.start_time)
          : "",
        endTime: eventData.end_time
          ? formatTimeFromISO(eventData.end_time)
          : "",
        isRecurring: eventData.is_recurring || false,
        recurringDays: eventData.recurring_days || [],
        hasEndDate: eventData.has_end_date || false,
        endDate: eventData.end_date || "",
        chapelName: eventData.chapel_name || "",
        status: eventData.status || "",
        sponsors: eventData.sponsors || [],
        organizers: eventData.organizers || [],
        cancelReason: eventData?.cancel_reason || "",
        wifeName: eventData.wife_name || "",
        husbandName: eventData.husband_name || "",
        childName: eventData.child_name || "",
      });
    }
  }, [fetchedEvent]);
  console.log("events: ", events);
  useEffect(() => {
    if (isSuccess) {
      toast.success("Event canceled successfully.");
      navigate(-1);
    }
  }, [isSuccess, navigate]);

  const handleClickEvent = (id: number) => {
    navigate(`/edit-event/${id}`);
  };

  const onConfirm = () => {
    if (cancelMessage) {
      console.log("Id: ", id);
      console.log("Reason: ", cancelMessage);
      cancelEvent({ cancelMessage, id: id || "" });
      setIsModalOpen(false);
    }
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const handleOnChange = (reason: string) => {
    setCancelMessage(reason);
  };

  if (isFetchingEvents || isCancelingEvent) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (fetchedError || canceledError) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-red-600 text-2xl">
          Error while fetching events
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <main className="container mx-auto px-4 pb-8">
        <button
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors cursor-pointer dark:text-indigo-400 dark:hover:text-indigo-300"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Events
        </button>

        <div className="bg-white rounded-xl border overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
          {/* Event Header */}
          <div className=" p-6 border-b border-indigo-100 dark:border-gray-700 bg-indigo-50 dark:bg-zinc-900">
            <div className="flex justify-between items-start">
              <div className="pr-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                  {events.title}
                </h2>
                <p className="text-gray-600 mt-2 dark:text-gray-300">
                  {events.description}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  events.status === "upcoming"
                    ? "bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300"
                    : events.status === "completed"
                    ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200"
                    : events.status === "canceled"
                    ? "bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-300"
                    : "bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200"
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
            <div className="flex">
              <div className="flex-1 space-y-6">
                <div className="flex text-gray-700">
                  <Calendar className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-500" />
                  <div>
                    <p className="font-medium text-gray-800 text-base dark:text-gray-300">
                      Date
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {events.date &&
                        new Date(events.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      {events.hasEndDate && " - "}
                      {events.endDate &&
                        new Date(events.endDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                    </p>
                  </div>
                </div>

                <div className="flex text-gray-700 dark:text-gray-400">
                  <Clock className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-500" />
                  <div>
                    <p className="font-medium text-gray-800 text-base dark:text-gray-300">
                      Time
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {events.startTime &&
                        events.date &&
                        new Date(
                          `${events.date}T${events.startTime}`
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}{" "}
                      -{" "}
                      {events.endTime &&
                        events.date &&
                        new Date(
                          `${events.date}T${events.endTime}`
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                    </p>
                  </div>
                </div>

                {events.isRecurring && (
                  <div className="flex text-gray-700 max-w-lg">
                    <Repeat className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-500" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-300 text-base">
                        Recurring Schedule
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {events.recurringDays?.map((day, index) => (
                          <span key={day}>
                            {day}
                            {events.recurringDays &&
                              index < events.recurringDays.length - 1 && (
                                <strong className="font-bold"> · </strong>
                              )}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-6">
                <div className="flex text-gray-700 dark:text-gray-400">
                  <Tags className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-500" />
                  <div>
                    <p className="font-medium text-gray-800 text-base dark:text-gray-300">
                      Category
                    </p>
                    <p>{events.eventType}</p>
                  </div>
                </div>
                {events.chapelName && (
                  <div className="flex text-gray-700">
                    <Church className="w-6 h-6 mr-3 text-indigo-600" />
                    <div>
                      <p className="font-medium text-gray-800 text-base">
                        Chapel
                      </p>
                      <p>{events.chapelName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location and Attendance Section */}
            <div className="flex pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex-1 space-y-6">
                <div className="flex text-gray-700 dark:text-gray-400">
                  <MapPin className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-500" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-300">
                      Venue
                    </p>
                    <p>{events.venue}</p>
                  </div>
                </div>

                <div className="flex text-gray-700 dark:text-gray-400">
                  <Users className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-500" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-300 text-base">
                      Expected Attendance
                    </p>
                    <p>{events.expectedAttendance} people</p>
                  </div>
                </div>
                {events.cancelReason && (
                  <div className="flex text-gray-700 dark:text-gray-400">
                    <MessageCircleMore className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-500" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-300 text-base">
                        Cancel Reason
                      </p>
                      <p>{events.cancelReason} </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-6">
                {events.husbandName && events.wifeName && (
                  <>
                    <div className="flex text-gray-700 dark:text-gray-400">
                      <Users className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-500" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-300 text-base">
                          Husband
                        </p>
                        <p>{events.husbandName}</p>
                      </div>
                    </div>
                    <div className="flex text-gray-700 dark:text-gray-400">
                      <Users className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-500" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-300 text-base">
                          Wife
                        </p>
                        <p>{events.wifeName}</p>
                      </div>
                    </div>
                  </>
                )}
                {events.childName && (
                  <div className="flex text-gray-700 dark:text-gray-400">
                    <Users className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-500" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-300 text-base">
                        Child
                      </p>
                      <p>{events.childName}</p>
                    </div>
                  </div>
                )}
                {events.sponsors.length > 0 && (
                  <div className="flex pt-4 border-gray-100 dark:border-gray-700">
                    <Handshake className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-500" />
                    <div className="">
                      <p className="font-medium text-gray-800 mb-1 dark:text-gray-300">
                        Sponsors:
                      </p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                        {events.sponsors.map((sponsor, index) => (
                          <li key={index}>
                            {sponsor.sponsor_name}{" "}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              ({sponsor.sponsor_type})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {events.organizers.length > 0 && (
                  <div className="flex pt-4 border-gray-100 dark:border-gray-700">
                    <UserCog className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-500" />
                    <div className="">
                      <p className="font-medium text-gray-800 mb-1 dark:text-gray-300">
                        Organizers:
                      </p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                        {events.organizers.map((organizer, index) => (
                          <li key={index}>
                            {organizer.name}{" "}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              ({organizer.position})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details Section */}
            {events.priestName && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-gray-300">
                    Officiated by:
                  </span>{" "}
                  {events.priestName}
                </p>
              </div>
            )}

            {events.clientEmail && events.clientEmail.length > 0 && (
              <div className="pt-4 border-t border-gray-100 flex dark:border-gray-700">
                <div className="">
                  <MailIcon className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-500" />
                </div>
                <div className="">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-gray-300">
                      Email
                    </span>{" "}
                    {events.clientEmail &&
                      events.clientEmail.length > 0 &&
                      events.clientEmail.map((email, index) => (
                        <span
                          key={index}
                          className="mr-2 block dark:text-gray-400"
                        >
                          {email}
                        </span>
                      ))}
                  </p>
                </div>
              </div>
            )}
            <div className="border-t pt-6 flex justify-end dark:border-gray-700">
              {userRole &&
                adminRoles.includes(userRole) &&
                events.status !== "canceled" && (
                  <div className="">
                    <Button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 font-medium cursor-pointer py-5 px-4 text-base dark:bg-indigo-700 dark:hover:bg-indigo-800 text-gray-50"
                      onClick={() => handleClickEvent(Number(events.id) || 0)}
                    >
                      Edit Event
                    </Button>
                    <Button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 cursor-pointer ml-2.5 py-5 px-4 text-base dark:bg-red-700 dark:hover:bg-red-800 text-gray-50 font-medium"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Cancel Event
                    </Button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>
      <CustomCancelModal
        isModalOpen={isModalOpen}
        onCancel={onCancel}
        onConfirm={onConfirm}
        cancelMessage={cancelMessage}
        handleOnChange={handleOnChange}
      />
    </motion.div>
  );
};

export default EventDetailPage;
