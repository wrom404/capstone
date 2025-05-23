import axios, { AxiosError } from "axios";
import { type UnAvailableDateProps, type Event, type FormDataProps, type CanceledEvent, EventCountProps } from "../../types/types";

export const getAllEvents = async (): Promise<Event[] | []> => {

  try {
    const response = await axios.get("http://localhost:4000/api/event");

    if (!response.data.success || !Array.isArray(response.data.data)) {
      return [];
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
};

export const getEventById = async (id: string): Promise<Event[] | []> => {
  console.log("API called with ID:", id);
  try {
    const response = await axios.get(`http://localhost:4000/api/event/${id}`);
    console.log("Full API response:", response);

    if (!response.data.success) {
      console.error("API reported failure:", response.data.error);
      return response.data.error;
    }
    console.log("Parsed response data:", response.data.data);
    const eventData = response.data.data;
    return Array.isArray(eventData) ? eventData : [eventData];
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
  return [];
}

export const getUnavailableDate = async (): Promise<UnAvailableDateProps | []> => {
  try {
    const response = await axios.get('http://localhost:4000/api/event/unavailable-date');

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
    const response = await axios.delete(`http://localhost:4000/api/event/${id}`);

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
  console.log("events: ", events)
  try {
    const response = await axios.post('http://localhost:4000/api/event/create-event', events);

    if (!response.data.success) {
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
          console.log("Error message:", responseData.message); // will display "Time slot already occupied, please choose another time." or "Date is fully booked. Please choose another date."
          throw new Error(responseData.message);
        } else {
          console.log("Error message:", axiosError.message);
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
    const response = await axios.put(`http://localhost:4000/api/event/${id}`, formattedEvent)

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
    const response = await axios.put(`http://localhost:4000/api/event/${id}/cancel`, { cancelMessage });
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
    const response = await axios.get('http://localhost:4000/api/event/canceled/events');

    if (!response.data.success || !Array.isArray(response.data.data)) {
      return []; // ✅ Always return an array
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

export const restoreCanceledEvent = async (id: string): Promise<{ success: boolean, message: string } | []> => {
  try {
    const response = await axios.put(`http://localhost:4000/api/event/${id}/restore`);

    if (!response.data.success) {
      console.log(response.data.message)
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

export const getEventsStatusCounts = async (): Promise<EventCountProps> => {
  try {
    const response = await axios.get('http://localhost:4000/api/event/counts');
    if (!response.data.success) {
      console.log(response.data.error);
      return { upcoming: 0, completed: 0, scheduled: 0 }; // Return a valid default object
    }
    return response.data.eventCounts; // Return the actual object, not an array
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error: ", error.message)
    } else {
      console.log("Unexpected error: ", error)
    }
    return { upcoming: 0, completed: 0, scheduled: 0 }; // Return a fallback object
  }
}

export const getRecentEvents = async (): Promise<Event[] | []> => {
  try {
    const response = await axios.get('http://localhost:4000/api/event/recent');

    if (!response.data.success) {
      console.log(response.data.error);
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

export const getEventsFromLastMonth = async (): Promise<Event[] | []> => {
  try {
    const response = await axios.get("http://localhost:4000/api/event/last-month");
    return response.data.rows; // Assuming your backend response structure is { success: true, rows: [...] }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error: ", error.message)
    } else {
      console.log("Unexpected error: ", error)
    }

    return [];
  }
};
