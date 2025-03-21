import axios, { AxiosError } from "axios";
import { type UnAvailableDateProps, type Event, type FormDataProps, type CanceledEvent } from "../types/types";

export const getAllEvents = async (): Promise<Event[]> => {

  try {
    const response = await axios.get("http://localhost:4000/api");

    if (response.data.success) {
      return response.data.data;
    }
    return response.data?.error;
  } catch (error) {
    // handle different error case
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return [];
  }
};

export const getEventById = async (id: string): Promise<Event[] | []> => {
  try {
    const response = await axios.get(`http://localhost:4000/api/${id}`);

    if (!response.data.success) {
      return response.data.error;
    }
    return response.data.data;
  } catch (error) {
    // handle different error case
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return [];
  }
}

export const getUnavailableDate = async (): Promise<UnAvailableDateProps | []> => {
  try {
    const response = await axios.get('http://localhost:4000/api/unavailable-date');

    if (!response.data.success) {
      return response.data.error;
    }
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error: ", error.message)
    } else {
      console.log("Unexpected error: ", error)
    }

    return [];
  }
}

export const deleteEvent = async (id: number): Promise<Event | string> => {

  try {
    const response = await axios.delete(`http://localhost:4000/api/${id}`);

    if (response.data.success) {
      return response.data.data;
    }
    return response.data?.error;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error: ", error.message)
    } else {
      console.log("Unexpected Error: ", error)
    }
    return "An unknown error occurred.";
  }
}

export const createEvent = async (events: FormDataProps): Promise<Event | string> => {
  try {
    const response = await axios.post('http://localhost:4000/api/create-event', events);

    if (!response.data.success) {
      console.log("may error");
      throw new Error("Date is fully booked. Please choose another date.");
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) { //This correctly checks if the error is an axios error.
      console.log("Axios error: ", error.message);
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.data) { // This checks if the error response has data.
        console.log("axiosError.response.data:", axiosError.response.data);
        const responseData = axiosError.response.data as {
          success?: boolean;
          count?: string;
          message?: string;
        };

        if (responseData && responseData.message) { //Check: If responseData.message exists, it throws a new Error with the message.
          console.log("Error message:", responseData.message);
          throw new Error(responseData.message);
        } else {
          throw new Error(axiosError.message);
        }
      } else {
        throw new Error(axiosError.message); // This line catches the backend "fully booked" message
      }
    } else {
      console.log("Unexpected error: ", error);
      throw new Error("An unknown error occurred.");
    }
  }
};

export const updateEvent = async ({ formEvent, id }: { formEvent: FormDataProps, id: string }): Promise<Event> => {

  try {

    console.log("formEvent: ", formEvent)
    // Create Date objects for startTime and endTime
    // This converts the time from a simple string format like "08:00" into a full local DateTime (e.g., "2025-03-26T08:00:00" in local time)
    const startDateTime = new Date(`${formEvent.date && formEvent.date.split('T')[0]}T${formEvent.startTime}:00`);
    const endDateTime = new Date(`${formEvent.date && formEvent.date.split('T')[0]}T${formEvent.endTime}:00`);

    const formattedEvent = {
      ...formEvent,
      // Convert local time to UTC format (ISO 8601)
      // This ensures that the backend receives a properly formatted UTC timestamp (e.g., "2025-03-26T00:00:00.000Z")
      // and now convert startDateTime and endDateTime (which is in UTC+8) to UTC (Zulu time, Z). now the value is 2025-03-26T00:00:00.000Z  (UTC time) and The +08:00 offset is removed, and the time is converted to UTC (Z).
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      endDate: formEvent.endDate || null
    }
    console.log("formattedEvent: ", formattedEvent)
    const response = await axios.put(`http://localhost:4000/api/${id}`, formattedEvent)

    if (!response.data.success) {
      console.log(response.data?.message)
      throw new Error(response.data.message);
    }
    console.log(response.data.data)

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.message)
      throw new Error(error.message);
    }
    console.log("An unknown error occurred.")
    console.log("error: ", error)
    throw new Error("An unknown error occurred.")
  }
}

export const cancelEvent = async ({ cancelMessage, id }: { cancelMessage: string, id: string }): Promise<string | null> => {
  if (!cancelMessage || !id) {
    console.log("No message or id")
    return null;
  }
  try {
    const response = await axios.put(`http://localhost:4000/api/${id}/cancel`, { cancelMessage });
    if (!response.data.success) {
      console.log(response.data?.message);
      throw new Error(response.data?.message)
    }
    return response.data.data;
  } catch (error) {
    console.log(error)
    throw new Error("An unknown error occurred.");
  }
}

export const getCanceledEvents = async (): Promise<CanceledEvent[] | []> => {
  try {
    const response = await axios.get('http://localhost:4000/api/canceled/events');

    if (!response.data.success) {
      return response.data.message;
    }
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error: ", error.message)
    } else {
      console.log("Unexpected error: ", error)
    }

    return [];
  }
}