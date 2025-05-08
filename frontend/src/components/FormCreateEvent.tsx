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
import { options, organizerPositions, sponsorTypes } from "@/constant/constant";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import { FormDataProps } from "@/types/types";
import useCreateEvent from "@/hooks/events/useCreateEvent";
import formatDateTimeForm from "@/utils/formatDateTimeForm";
import Select from "react-select"; // Import react-select component
import toast from "react-hot-toast";
import validateEventTime from "@/utils/validateEventTime";
import { type Event } from "@/types/types";
import axios from "axios";
import { motion } from "framer-motion";
import { CalendarPlus2, Plus, Trash2 } from "lucide-react";
import UserModal from "./UserEmailModal";
import useFetchUsers from "@/hooks/user/useFetchUsers";
import { type FetchUserProps, type SelectedUserEmail } from "@/types/types";

const FormCreateEvent = () => {
  const {
    mutate: createEvent,
    isPending: isCreatingEvent,
    isError: isCreatingEventError,
    error,
    isSuccess,
    data,
  } = useCreateEvent();
  const {
    data: fetchedUsers,
    isPending: isFetchingUsers,
    isError: isFetchingUsersError,
  } = useFetchUsers();

  const [formEvent, setFormEvent] = useState<FormDataProps>({
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
    sendReminder: false,
    chapelName: "", // New field for chapel name
    sponsors: [], // New field for sponsors array
    organizers: [], // New field for organizers array
  });
  const [timeError, setTimeError] = useState<string>("");
  const [textFieldError, setTextFieldError] = useState<string>("");
  const [countError, setCountError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<FetchUserProps[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SelectedUserEmail[]>([]);

  // New state for managing a new sponsor entry
  const [newSponsor, setNewSponsor] = useState({
    sponsor_name: "",
    sponsor_type: "Secondary",
  });
  // New state for managing a new organizer entry
  const [newOrganizer, setNewOrganizer] = useState({
    name: "",
    position: "Staff",
  });

  // Effect to set the clientEmail field based on selected users
  useEffect(() => {
    if (selectedUsers.length > 0) {
      const emails = selectedUsers.map((user) => user.email);
      setFormEvent((prevFormEvent) => ({
        ...prevFormEvent,
        clientEmail: emails,
      }));
    }
  }, [selectedUsers]);

  useEffect(() => {
    if (isSuccess && data && (data as Event)?.success) {
      console.log(data);
      toast.success("Event scheduled successfully");
    } else if (isCreatingEventError && error) {
      if (axios.isAxiosError(error)) {
        console.log("error: ", error.response?.data?.message);
        const errorMessage =
          error.response?.data?.message || "An error occurred"; // Default message if no message is found
        setCountError(errorMessage);
        toast.error(errorMessage); // Optionally show toast with error message
      } else {
        console.log("error: ", error.message);
        toast.error(error.message); // this will appear "Date is fully booked. Please choose another date." or "Time slot already occupied, please choose another time."
      }
    }
  }, [isSuccess, data, error, isCreatingEventError]);

  useEffect(() => {
    if (fetchedUsers && fetchedUsers.length > 0) {
      console.log("fetchedUsers: ", fetchedUsers);
      setUsers(fetchedUsers);
    }
  }, [fetchedUsers]);

  const handleOnCheckChange = (e: boolean) => {
    if (!formEvent.hasEndDate) {
      setFormEvent({ ...formEvent, isRecurring: e });
    } else {
      return;
    }
  };

  // Handle adding a new sponsor
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

  // Handle removing a sponsor
  const handleRemoveSponsor = (index: number) => {
    const updatedSponsors = [...formEvent.sponsors];
    updatedSponsors.splice(index, 1);
    setFormEvent({ ...formEvent, sponsors: updatedSponsors });
  };

  // Handle adding a new organizer
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

  // Handle removing an organizer
  const handleRemoveOrganizer = (index: number) => {
    const updatedOrganizers = [...formEvent.organizers];
    updatedOrganizers.splice(index, 1);
    setFormEvent({ ...formEvent, organizers: updatedOrganizers });
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formEvent.title ||
      !formEvent.eventType ||
      !formEvent.venue ||
      !formEvent.date ||
      !formEvent.startTime ||
      !formEvent.endTime
    ) {
      setTextFieldError("Please fill out the required field");
      return;
    }

    if (formEvent.startTime && formEvent.endTime && formEvent.date) {
      // Validate the times before submitting the form
      const timeValidationError = validateEventTime(
        formEvent.startTime,
        formEvent.endTime,
        formEvent.date
      );

      if (timeValidationError) {
        setTimeError(timeValidationError);
        return; // Prevent form submission if time is invalid
      }
    }

    // Combine date and time into a full ISO string with timezone for startTime and endTime
    const formattedStartTime = formatDateTimeForm(
      formEvent.date,
      formEvent.startTime
    );
    const formattedEndTime = formatDateTimeForm(
      formEvent.date,
      formEvent.endTime
    );
    createEvent({
      ...formEvent,
      endDate: formEvent.hasEndDate ? formEvent.endDate : null,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });

    setFormEvent({
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
  };

  const handleClickOpenModal = () => {
    setIsModalOpen(true);
  };

  if (isFetchingUsers || isCreatingEvent) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-zinc-900">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (timeError) {
    console.log("timeError: ", timeError);
    toast.error(timeError);
    setTimeError("");
  }

  if (textFieldError) {
    toast.error(textFieldError);
    setTextFieldError("");
  }

  if (countError) {
    toast.error(countError);
    setCountError("");
  }

  if (isFetchingUsersError && isCreatingEventError) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmitForm}
      className="border border-gray-300 rounded-lg p-6 w-full dark:bg-zinc-900 dark:border-gray-800"
    >
      <h2 className="text-2xl font-bold mt-2 mb-3">Schedule Event</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* First Column */}
        <div className="flex-1">
          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label className="dark:text-gray-300">Event</Label>
            <Input
              type="text"
              id="text"
              value={formEvent.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormEvent({ ...formEvent, title: e.target.value })
              }
              className="shadow-none border border-gray-300 focus:ring-1 w-full dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700" 
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

          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label className="dark:text-gray-300">
              Priest<span className="text-gray-500">*</span>
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

          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label className="dark:text-gray-300">
              Chapel Name<span className="text-gray-500">*</span>
            </Label>
            <Input
              type="text"
              id="chapelName"
              value={formEvent.chapelName || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormEvent({ ...formEvent, chapelName: e.target.value })
              }
              className="shadow-none border border-gray-300 focus:ring-1 w-full dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
            />
          </div>

          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label className="dark:text-gray-300" htmlFor="message">
              Description <span className="text-gray-500">*</span>
            </Label>
            <Textarea
              value={formEvent.description || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormEvent({ ...formEvent, description: e.target.value })
              }
              id="message"
              className="border-gray-300 w-full dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700 focus:outline-1 focus:ring-1 focus:outline-gray-300 focus:ring-gray-300"
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
            <Label className="dark:text-gray-300">
              Expected attendance <span className="text-gray-500">*</span>
            </Label>
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
              Email <span className="text-gray-500">*</span>
            </Label>
            <div className="flex  space-x-4">
              <Input
                value={formEvent.clientEmail || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormEvent({ ...formEvent, clientEmail: [e.target.value] })
                }
                type="text"
                id="text"
                className="shadow-none border border-gray-300 focus:ring-0 focus:outline-none w-full dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
              />
              <button
                className="bg-white border border-purple-500 text-purple-600 hover:bg-purple-100 px-4 py-1 rounded-lg cursor-pointer dark:bg-zinc-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                type="button"
                onClick={handleClickOpenModal}
              >
                Select
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4 pb-3">
            <Checkbox
              checked={formEvent.sendReminder}
              onCheckedChange={(e) =>
                setFormEvent({ ...formEvent, sendReminder: !!e })
              }
              id="sendReminder"
              className="cursor-pointer shadow border-1 border-gray-400 dark:border-gray-800"
            />
            <label
              htmlFor="sendReminder"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer dark:text-gray-300"
            >
              Send reminder?
            </label>
          </div>
        </div>

        {/* Second Column */}
        <div className="flex-1">
          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label className="dark:text-gray-300" htmlFor="message">
              Date <span className="text-xs text-gray-500">(YYY/MM/DD)</span>
            </Label>
            <DatePicker
              selected={formEvent.date ? new Date(formEvent.date) : null}
              onChange={(date: Date | null) =>
                setFormEvent({
                  ...formEvent,
                  date: date ? date.toISOString() : null,
                })
              }
              // minDate={new Date()}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormEvent({ ...formEvent, startTime: e.target.value })
                }
                value={formEvent.startTime || ""}
              />
              <span className="flex items-center dark:text-gray-300">to</span>
              <input
                type="time"
                className="border border-gray-300 py-1.5 px-3 w-full rounded-md text-sm dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormEvent({ ...formEvent, endTime: e.target.value })
                }
                value={formEvent.endTime || ""}
              />
            </div>
          </div>

          {/* Sponsors Section */}
          <div className="mt-6 mb-4">
            <Label className="text-md font-semibold dark:text-gray-300">Sponsors</Label>

            <div className="mt-2 space-y-2">
              {formEvent.sponsors.map((sponsor, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-50 p-2 rounded-md dark:bg-zinc-900 dark:border-gray-800"
                >
                  <div className="flex-1">
                    <p className="font-medium dark:text-gray-300">{sponsor.sponsor_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {sponsor.sponsor_type}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-500 dark:hover:text-red-400 dark:hover:bg-zinc-800"
                    onClick={() => handleRemoveSponsor(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 border border-gray-300 rounded-md dark:bg-zinc-900 dark:border-gray-800">
              <h4 className="font-medium text-sm mb-2 dark:text-gray-300">Add Sponsor</h4>
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
                    className="text-sm dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
                    placeholder="Mr. & Mrs. Smith"
                  />
                </div>
                <div className="w-1/3">
                  <Label className="text-xs dark:text-gray-300">Type</Label>
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
                  className="bg-white border border-purple-500 text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-lg dark:bg-zinc-900 dark:border-purple-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={handleAddSponsor}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Organizers Section */}
          <div className="mt-6 mb-4">
            <Label className="text-md font-semibold dark:text-gray-300">Organizers</Label>

            <div className="mt-2 space-y-2">
              {formEvent.organizers.map((organizer, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-50 p-2 rounded-md dark:bg-zinc-900 dark:border-gray-800"
                >
                  <div className="flex-1">
                    <p className="font-medium dark:text-gray-300">{organizer.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {organizer.position}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-500 dar:hover:text-red-500 dark:hover:bg-zinc-800"
                    onClick={() => handleRemoveOrganizer(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 border border-gray-300 rounded-md dark:bg-zinc-900 dark:border-gray-800">
              <h4 className="font-medium text-sm mb-2 dark:text-gray-300">Add Organizer</h4>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label className="text-xs dark:text-gray-300">Name</Label>
                  <Input
                    type="text"
                    value={newOrganizer.name}
                    onChange={(e) =>
                      setNewOrganizer({ ...newOrganizer, name: e.target.value })
                    }
                    className="text-sm dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
                    placeholder="John Doe"
                  />
                </div>
                <div className="w-1/3">
                  <Label className="text-xs dark:text-gray-300">Position</Label>
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
                  className="bg-white border border-purple-500 text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-lg dark:bg-zinc-900 dark:border-purple-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={handleAddOrganizer}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-6 pb-3">
            <Checkbox
              checked={formEvent.isRecurring}
              onCheckedChange={handleOnCheckChange}
              id="terms"
              className="cursor-pointer shadow border-1 border-gray-400 dark:border-gray-800"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer dark:text-gray-300"
            >
              Recurring Event?
            </label>
          </div>
          {formEvent.isRecurring && (
            <div className="">
              <div className="grid w-full items-center gap-1.5 py-2.5">
                <Label className="dark:text-gray-300">Select Recurring Days</Label>
                <Select
                  isMulti
                  placeholder=""
                  className="text-gray-700 border-1 border-gray-50 rounded-sm shadow-none dark:bg-zinc-900 dark:border-gray-800 dark:focus:ring-gray-700"
                  options={options}
                  value={options.filter((option) =>
                    formEvent.recurringDays
                      ? formEvent.recurringDays.includes(option.value)
                      : []
                  )}
                  onChange={(selectedOptions) =>
                    setFormEvent({
                      ...formEvent,
                      recurringDays: selectedOptions
                        ? selectedOptions.map((option) => option.value)
                        : [],
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2 pt-6 pb-3">
                <Checkbox
                  checked={formEvent.hasEndDate}
                  onCheckedChange={(e: boolean) =>
                    setFormEvent({ ...formEvent, hasEndDate: e })
                  }
                  id="terms"
                  className="shadow cursor-pointer border-1 border-gray-400 dark:border-gray-800"
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer dark:text-gray-300"
                >
                  Has End Date?
                </label>
              </div>
            </div>
          )}
          {formEvent.hasEndDate && (
            <div className="grid w-full items-center gap-1.5 py-2.5">
              <Label className="dark:text-gray-300" htmlFor="endDate">
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
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 font-medium cursor-pointer tracking-wide px-4 py-5 text-base rounded-lg text-white flex items-center gap-2 dark:bg-indigo-700 dark:hover:bg-indigo-600"  
        >
          <CalendarPlus2 size={16} /> Schedule Event
        </Button>
      </div>
      {isModalOpen && (
        <UserModal
          setSelectedUsers={setSelectedUsers}
          selectedUsers={selectedUsers}
          users={users}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
        />
      )}
    </motion.form>
  );
};

export default FormCreateEvent;
