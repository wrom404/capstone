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
import { FormDataProps } from "@/types/types";
import useCreateEvent from "@/hooks/useCreateEvent";
import formatDateTimeForm from "@/utils/formatDateTimeForm";
import Select from "react-select"; // Import react-select component
import toast from "react-hot-toast";

const FormEvent = () => {
  const {
    mutate: createEvent,
    isPending,
    error,
    isSuccess,
    data,
  } = useCreateEvent();
  const [formEvent, setFormEvent] = useState<FormDataProps>({
    title: "",
    description: "",
    venue: "",
    expectedAttendance: "",
    eventType: "",
    priestName: "",
    clientNumber: "",
    date: "", // ISO string (e.g., "2025-04-04T16:00:00.000Z")
    startTime: "", // "HH:MM:SS" format
    endTime: "", // "HH:MM:SS" format
    isRecurring: false,
    recurringDays: [],
    hasEndDate: false,
    endDate: "",
  });

  const options = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
  ];

  useEffect(() => {
    if (data || isSuccess) {
      console.log(data);
      toast.success("Event created successfully");
    }
  }, [isSuccess, data]);

  const handleOnCheckChange = (e: boolean) => {
    if (!formEvent.hasEndDate) {
      setFormEvent({ ...formEvent, isRecurring: e });
    } else {
      return;
    }
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      clientNumber: "",
      date: "",
      startTime: "",
      endTime: "",
      isRecurring: false,
      recurringDays: [],
      hasEndDate: false,
      endDate: "",
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen h-screen flex justify-center items-center">
        <span className="text-red-600 text-lg">Something went wrong</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmitForm}
      className="border border-gray-300 rounded-lg p-6 w-full"
    >
      <h2 className="text-2xl font-bold mt-2 mb-3">Create Event</h2>
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label>Event</Label>
            <Input
              type="text"
              id="text"
              value={formEvent.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormEvent({ ...formEvent, title: e.target.value })
              }
              className="shadow-none border border-gray-400 focus:ring-1 w-full"
            />
          </div>
          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label>Category</Label>
            <CustomSelect
              value={formEvent.eventType || ""}
              onValueChange={(e) =>
                setFormEvent({ ...formEvent, eventType: e })
              }
            >
              <SelectTrigger className="w-full border border-gray-400 shadow-none">
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
          {(formEvent.eventType == "mass" ||
            formEvent.eventType == "wedding" ||
            formEvent.eventType == "baptism" ||
            formEvent.eventType == "funeral" ||
            formEvent.eventType == "confession") && (
            <div className="grid w-full items-center gap-1.5 py-2.5">
              <Label>Priest Name</Label>
              <Input
                type="text"
                id="text"
                value={formEvent.priestName || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormEvent({ ...formEvent, priestName: e.target.value })
                }
                className="shadow-none border border-gray-400 focus:ring-1 w-full"
              />
            </div>
          )}
          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label htmlFor="message">Description</Label>
            <Textarea
              value={formEvent.description || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormEvent({ ...formEvent, description: e.target.value })
              }
              id="message"
              className="border-gray-400 w-full"
            />
          </div>
          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label>Venue</Label>
            <Input
              value={formEvent.venue || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormEvent({ ...formEvent, venue: e.target.value })
              }
              type="text"
              id="text"
              className="shadow-none border border-gray-400 focus:ring-1 w-full"
            />
          </div>

          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label>Expected attendance</Label>
            <CustomSelect
              value={formEvent.expectedAttendance || ""}
              onValueChange={(e) =>
                setFormEvent({ ...formEvent, expectedAttendance: e })
              }
            >
              <SelectTrigger className="w-full border border-gray-400 shadow-none">
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
            <Label>
              Client Number{" "}
              <span className="text-xs text-gray-600">(Optional)</span>
            </Label>
            <Input
              value={formEvent.clientNumber || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormEvent({ ...formEvent, clientNumber: e.target.value })
              }
              type="text"
              id="text"
              className="shadow-none border border-gray-400 focus:ring-0 focus:outline-none w-full"
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
                  date: date ? date.toISOString() : null,
                })
              }
              minDate={new Date()}
              isClearable
              dateFormat="yyyy/MM/dd"
              className="text-sm border border-gray-400 focus:outline-1 focus:ring-1 focus:outline-gray-300 focus:ring-gray-300 w-full py-1.5 px-3 rounded-md"
            />
          </div>
          <div className="grid w-full items-center gap-1.5 py-2.5">
            <Label>Time</Label>
            <div className="flex gap-4">
              <input
                type="time"
                className="border border-gray-400 py-1.5 px-3 w-full rounded-md text-sm"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormEvent({ ...formEvent, startTime: e.target.value })
                }
                value={formEvent.startTime || ""}
              />
              <span className="flex items-center">to</span>
              <input
                type="time"
                className="border border-gray-400 py-1.5 px-3 w-full rounded-md text-sm"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormEvent({ ...formEvent, endTime: e.target.value })
                }
                value={formEvent.endTime || ""}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 py-6">
            <Checkbox
              checked={formEvent.isRecurring}
              onCheckedChange={handleOnCheckChange}
              id="terms"
              className="cursor-pointer shadow border-1 border-gray-400"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  cursor-pointer"
            >
              Recurring Event?
            </label>
          </div>
          {formEvent.isRecurring && (
            <div className="">
              <div className="grid w-full items-center gap-1.5 py-2.5">
                <Label>Select Recurring Days</Label>
                <Select
                  isMulti
                  placeholder=""
                  className="text-gray-700 border-1 border-gray-300 rounded-sm shadow-none"
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
              <div className="flex items-center space-x-2 py-6">
                <Checkbox
                  checked={formEvent.hasEndDate}
                  onCheckedChange={(e: boolean) =>
                    setFormEvent({ ...formEvent, hasEndDate: e })
                  }
                  id="terms"
                  className="shadow cursor-pointer border-1 border-gray-400"
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  cursor-pointer"
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
                className="text-sm border border-gray-400 focus:outline-1 focus:ring-1 focus:outline-gray-300 focus:ring-gray-300 w-full py-1.5 px-3 rounded-md"
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
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end my-2 mt-4">
        <Button type="submit" className="bg-[#1a1a1a] cursor-pointer">
          Create
        </Button>
      </div>
    </form>
  );
};

export default FormEvent;
