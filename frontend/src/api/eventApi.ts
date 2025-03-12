import axios from "axios";
import { type Event, type FormDataProps } from "../types/types";

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
  console.log(events)
  try {
    const response = await axios.post('http://localhost:4000/api/create-event', events);

    if (response.data.success) {
      return response.data.data;
    }
    return response.data?.error;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error: ", error.message)
    } else {
      console.log("Unexpected error: ", error)
    }

    return "An unknown error occurred.";
  }
}

