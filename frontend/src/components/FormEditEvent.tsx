import { Input } from "@/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select as CustomSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import useFetchEvent from "@/hooks/events/useFetchEvent";
import Select from "react-select";
import useUpdateEvent from "@/hooks/events/useUpdateEvent";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Save, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import moment from "moment-timezone";

// Sponsor and Organizer interfaces
interface Sponsor {
  sponsor_name: string;
  sponsor_type: string;
}

interface Organizer {
  name: string;
  position: string;
}

// Extended FormDataProps interface
interface FormDataProps {
  title: string;
  description: string;
  venue: string;
  expectedAttendance: string;
  eventType: string;
  priestName: string;
  clientEmail: string[];
  date: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringDays: string[];
  hasEndDate: boolean;
  endDate: string | null;
  chapelName: string;
  sponsors: Sponsor[];
  organizers: Organizer[];
}

const dayOptions = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

const sponsorTypes = [
  { value: "Principal", label: "Principal" },
  { value: "Secondary", label: "Secondary" },
  // { value: "Honorary", label: "Honorary" },
];

const organizerPositions = [
  { value: "Parishioner", label: "Parishioner" },
  { value: "Staff", label: "Staff" },
  { value: "Volunteer", label: "Volunteer" },
  { value: "Committee Head", label: "Committee Head" },
  { value: "Others", label: "Others" },
];

// Option arrays for dropdown selects

const FormEditEvent = ({ id }: { id: string | undefined }) => {
  const {
    data,
    error: fetchedError,
    isPending: isFetchingEvent,
    isSuccess, // Add this to check if the query completed successfully
  } = useFetchEvent(id || "");

  const {
    mutate: updateEvent,
    isPending: isUpdatingEvent,
    error: updateError,
  } = useUpdateEvent(id || "");

  // const [loading, setLoading] = useState(true);
  const [isSuccessMessage, setIsSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [formEvent, setFormEvent] = useState<FormDataProps>({
    title: "",
    description: "",
    venue: "",
    expectedAttendance: "",
    eventType: "",
    priestName: "",
    clientEmail: [],
    date: "",
    startTime: "",
    endTime: "",
    isRecurring: false,
    recurringDays: [],
    hasEndDate: false,
    endDate: "",
    chapelName: "",
    sponsors: [],
    organizers: [],
  });
  // New state for managing a new sponsor entry
  const [newSponsor, setNewSponsor] = useState({
    sponsor_name: "",
    sponsor_type: "Secondary",
  });
  const [newOrganizer, setNewOrganizer] = useState({
    name: "",
    position: "Staff",
  });
  const navigate = useNavigate();

  // Log the complete query result
  console.log("Query result:", {
    data,
    error: fetchedError,
    isPending: isFetchingEvent,
    isSuccess,
  });

  // Format the date and time from ISO string
  const formatDateFromISO = (isoString: string) => {
    if (!isoString) return "";
    return moment.tz(isoString, "Asia/Manila").format("YYYY-MM-DD");
  };
  // Format time from ISO string (HH:MM)
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

  useEffect(() => {
    if (data && data.length > 0) {
      console.log("Fetched Data:", data); // Debugging log

      const eventData = data[0];
      console.log(eventData);
      setFormEvent({
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
        sponsors: eventData.sponsors || [],
        organizers: eventData.organizers || [],
      });
      // Set loading to false after data is processed
      setIsLoading(false);
    }
  }, [data]);

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formEvent);
    updateEvent({ formEvent, id: id || "" });
    setIsSuccessMessage("Updated successfully");
  };

  const handleOnCheckChange = (checked: boolean) => {
    if (!formEvent.hasEndDate) {
      setFormEvent({
        ...formEvent,
        isRecurring: checked,
        recurringDays: checked ? formEvent.recurringDays : [],
        hasEndDate: checked ? formEvent.hasEndDate : false,
        endDate: checked && formEvent.hasEndDate ? formEvent.endDate : "",
      });
    } else {
      return;
    }
  };

  const handleRemoveSponsor = (index: number) => {
    const updatedSponsors = [...formEvent.sponsors];
    updatedSponsors.splice(index, 1);
    setFormEvent({ ...formEvent, sponsors: updatedSponsors });
  };

  const handleAddSponsor = () => {
    if (!newSponsor.sponsor_name) {
      toast.error("Sponsor name is required");
      return;
    }

    setFormEvent({
      ...formEvent,
      sponsors: [...formEvent.sponsors, newSponsor],
    });

    // Reset the new sponsor form
    setNewSponsor({ sponsor_name: "", sponsor_type: "Secondary" });
  };

  const handleRemoveOrganizer = (index: number) => {
    const updatedOrganizers = [...formEvent.organizers];
    updatedOrganizers.splice(index, 1);
    setFormEvent({ ...formEvent, organizers: updatedOrganizers });
  };

  const handleAddOrganizer = () => {
    if (!newOrganizer.name) {
      toast.error("Organizer name is required");
      return;
    }

    setFormEvent({
      ...formEvent,
      organizers: [...formEvent.organizers, newOrganizer],
    });

    // Reset the new organizer form
    setNewOrganizer({ name: "", position: "Staff" });
  };

  if (isFetchingEvent || isUpdatingEvent || isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center dark:bg-zinc-900">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (updateError || fetchedError) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="text-red-600 text-2xl">
          Error while fetching events
        </span>
      </div>
    );
  }

  if (isSuccessMessage) {
    toast.success(isSuccessMessage);
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmitForm}
      className="border border-gray-300 rounded-lg p-6 w-full dark:bg-zinc-900 dark:border-gray-800"
    >
      <h2 className="text-2xl font-bold mt-2 mb-3">Edit Event</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* First Column */}
        <div className="flex-1">
          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label className="dark:text-gray-300">Event</Label>
            <Input
              type="text"
              id="text"
              value={formEvent.title || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormEvent({ ...formEvent, title: e.target.value })
              }
              className="shadow-none border bg-white border-gray-300 focus:ring-1 w-full dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
            />
          </div>

          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label className="dark:text-gray-300">Category</Label>
            <CustomSelect
              value={formEvent.eventType || ""}
              onValueChange={(e) =>
                setFormEvent({ ...formEvent, eventType: e })
              }
            >
              <SelectTrigger className="w-full border border-gray-300 shadow-none dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mass">Mass</SelectItem>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="baptism">Baptism</SelectItem>
                <SelectItem value="funeral">Funeral</SelectItem>
                <SelectItem value="confession">Confession</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </CustomSelect>
          </div>

          {(formEvent.eventType === "mass" ||
            formEvent.eventType === "wedding" ||
            formEvent.eventType === "baptism" ||
            formEvent.eventType === "funeral" ||
            formEvent.eventType === "confession") && (
            <div className="grid w-full items-center gap-1.5 py-2.5">
              <Label className="dark:text-gray-300">
                Priest Name<span className="text-gray-500">*</span>
              </Label>
              <Input
                type="text"
                id="text"
                value={formEvent.priestName || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormEvent({ ...formEvent, priestName: e.target.value })
                }
                className="shadow-none border border-gray-300 focus:ring-1 w-full dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
              />
            </div>
          )}

          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label className="dark:text-gray-300">Chapel Name</Label>
            <Input
              type="text"
              value={formEvent.chapelName || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormEvent({ ...formEvent, chapelName: e.target.value })
              }
              className="shadow-none border border-gray-300 focus:ring-1 w-full dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
            />
          </div>

          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label htmlFor="message">Description</Label>
            <Textarea
              value={formEvent.description || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormEvent({ ...formEvent, description: e.target.value })
              }
              id="message"
              className="border-gray-300 w-full dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700 shadow-none focus:ring-1"
            />
          </div>

          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label className="dark:text-gray-300">Venue</Label>
            <Input
              value={formEvent.venue || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormEvent({ ...formEvent, venue: e.target.value })
              }
              type="text"
              id="text"
              className="shadow-none border border-gray-300 focus:ring-1 w-full dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
            />
          </div>

          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label className="dark:text-gray-300">Expected attendance</Label>
            <CustomSelect
              value={formEvent.expectedAttendance || ""}
              onValueChange={(e) =>
                setFormEvent({ ...formEvent, expectedAttendance: e })
              }
            >
              <SelectTrigger className="w-full border border-gray-300 shadow-none dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="500">500</SelectItem>
              </SelectContent>
            </CustomSelect>
          </div>

          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label className="dark:text-gray-300">
              Client Email <span className="text-gray-50">*</span>
            </Label>
            <Input
              value={formEvent.clientEmail || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormEvent({ ...formEvent, clientEmail: [e.target.value] })
              }
              type="text"
              id="text"
              className="shadow-none border border-gray-300 focus:ring-0 focus:outline-none w-full dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
            />
          </div>
        </div>

        {/* Second Column */}
        <div className="flex-1">
          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label htmlFor="message">
              Date <span className="text-xs text-gray-500">(YYY/MM/DD)</span>
            </Label>
            <DatePicker
              selected={formEvent.date ? new Date(formEvent.date) : null}
              onChange={(date: Date | null) =>
                setFormEvent({
                  ...formEvent,
                  date: date ? date.toISOString().split("T")[0] : "",
                })
              }
              minDate={new Date()}
              isClearable
              dateFormat="yyyy/MM/dd"
              className="text-sm border border-gray-300 focus:outline-1 focus:ring-1 focus:outline-gray-300 focus:ring-gray-300 w-full py-1.5 px-3 rounded-md dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
            />
          </div>

          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label className="dark:text-gray-300">Time</Label>
            <div className="flex gap-4">
              <input
                type="time"
                className="border border-gray-300 py-1.5 px-3 w-full rounded-md text-sm dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
                onChange={(e) =>
                  setFormEvent((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                value={formEvent?.startTime ?? ""}
              />

              <span className="flex items-center">to</span>
              <input
                type="time"
                className="border border-gray-300 py-1.5 px-3 w-full rounded-md text-sm dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
                onChange={(e) =>
                  setFormEvent((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
                value={formEvent?.endTime ?? ""}
              />
            </div>
          </div>

          {/* Sponsors Section */}
          <div className="mt-6 mb-4 dark:bg-zinc-900 ">
            <Label className="text-md font-semibold dark:text-gray-300">
              Sponsors
            </Label>

            <div className="mt-2 space-y-2 dark:bg-zinc-900">
              {formEvent.sponsors.map((sponsor, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-50 p-2 rounded-md dark:bg-zinc-900 dark:border-gray-7  00"
                >
                  <div className="flex-1">
                    <p className="font-medium">{sponsor.sponsor_name}</p>
                    <p className="text-sm text-gray-500">
                      {sponsor.sponsor_type}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:bg-zinc-900 dark:text-red-500 dark:hover:bg-zinc-800 dark:hover:text-red-600"
                    onClick={() => handleRemoveSponsor(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 border border-gray-300 rounded-md dark:bg-zinc-900 dark:border-gray-800">
              <h4 className="font-medium text-sm mb-2">Add Sponsor</h4>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label className="text-xs dark:text-gray-300">Name</Label>
                  <Input
                    type="text"
                    value={newSponsor.sponsor_name}
                    onChange={(e) =>
                      setNewSponsor({
                        ...newSponsor,
                        sponsor_name: e.target.value,
                      })
                    }
                    className="text-sm"
                    placeholder="Mr. & Mrs. Smith"
                  />
                </div>
                <div className="w-1/3">
                  <Label className="text-xs">Type</Label>
                  <CustomSelect
                    value={newSponsor.sponsor_type}
                    onValueChange={(e) =>
                      setNewSponsor({ ...newSponsor, sponsor_type: e })
                    }
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sponsorTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </CustomSelect>
                </div>
                <Button
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer dark:bg-indigo-700 dark:hover:bg-indigo-800"
                  onClick={handleAddSponsor}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Organizers Section */}
          <div className="mt-6 mb-4">
            <Label className="text-md font-semibold">Organizers</Label>

            <div className="mt-2 space-y-2">
              {formEvent.organizers.map((organizer, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-50 p-2 rounded-md dark:bg-zinc-900 dark:border-gray-800"
                >
                  <div className="flex-1">
                    <p className="font-medium">{organizer.name}</p>
                    <p className="text-sm text-gray-500">
                      {organizer.position}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-zinc-800 dark:hover:text-red-600"
                    onClick={() => handleRemoveOrganizer(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 border border-gray-300 rounded-md dark:bg-zinc-900 dark:border-gray-800">
              <h4 className="font-medium text-sm mb-2">Add Organizer</h4>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label className="text-xs">Name</Label>
                  <Input
                    type="text"
                    value={newOrganizer.name}
                    onChange={(e) =>
                      setNewOrganizer({ ...newOrganizer, name: e.target.value })
                    }
                    className="text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="w-1/3">
                  <Label className="text-xs">Position</Label>
                  <CustomSelect
                    value={newOrganizer.position}
                    onValueChange={(e) =>
                      setNewOrganizer({ ...newOrganizer, position: e })
                    }
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {organizerPositions.map((position) => (
                        <SelectItem key={position.value} value={position.value}>
                          {position.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </CustomSelect>
                </div>
                <Button
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer dark:bg-indigo-700 dark:hover:bg-indigo-800"
                  onClick={handleAddOrganizer}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 py-6">
            <Checkbox
              checked={formEvent.isRecurring}
              onCheckedChange={handleOnCheckChange}
              id="terms"
              className="cursor-pointer shadow border-1 border-gray-400 dark:border-gray-800 dark:bg-zinc-900 dark:focus:ring-gray-700"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Recurring Event?
            </label>
          </div>

          {formEvent.isRecurring && (
            <div className="">
              <div className="grid w-full items-center gap-1.5 py-2.5">
                <Label className="dark:text-gray-300">
                  Select Recurring Days
                </Label>
                <Select
                  isMulti
                  placeholder=""
                  className="text-gray-700 border-1 border-gray-300 rounded-sm shadow-none dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
                  options={dayOptions}
                  value={dayOptions.filter(
                    (option) =>
                      formEvent.recurringDays &&
                      formEvent.recurringDays.includes(option.value)
                  )}
                  onChange={(selectedOptions) =>
                    setFormEvent({
                      ...formEvent,
                      recurringDays: selectedOptions.map(
                        (option) => option.value
                      ),
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2 py-6">
                <Checkbox
                  checked={formEvent.hasEndDate}
                  onCheckedChange={(e: boolean) =>
                    setFormEvent({ ...formEvent, hasEndDate: e })
                  }
                  id="terms"
                  className="shadow cursor-pointer border-1 border-gray-300 dark:border-gray-800 dark:bg-zinc-900 dark:focus:ring-gray-700"
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Has End Date?
                </label>
              </div>
            </div>
          )}

          {formEvent.hasEndDate && (
            <div className="grid w-full items-center gap-1.5 py-2.5">
              <Label htmlFor="endDate">
                End Date{" "}
                <span className="text-xs text-gray-500">(YYY/MM/DD)</span>
              </Label>
              <DatePicker
                id="endDate"
                minDate={new Date()}
                dateFormat="yyyy/MM/dd"
                className="text-sm border border-gray-300 focus:outline-1 focus:ring-1 focus:outline-gray-300 focus:ring-gray-300 w-full py-1.5 px-3 rounded-md dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
                selected={
                  formEvent.endDate ? new Date(formEvent.endDate) : null
                }
                onChange={(date: Date | null) =>
                  setFormEvent({
                    ...formEvent,
                    endDate: date ? date.toISOString() : null,
                  })
                }
                isClearable
                autoComplete="off"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end my-2 mt-4">
        <Button
          type="button"
          onClick={() => navigate(-1)}
          className="py-5 hover:bg-gray-200 text-base bg-gray-100 rounded-lg text-gray-700 hover:text-gray-900 font-medium cursor-pointer tracking-wide mr-2 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-gray-200"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="py-5 text-base bg-indigo-600 hover:bg-indigo-700 font-medium cursor-pointer tracking-wide dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg flex items-center justify-center"
        >
          <Save className="" /> Save Changes
        </Button>
      </div>
    </motion.form>
  );
};

export default FormEditEvent;
