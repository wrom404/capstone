import axios from "axios";
import { Event } from "../types/types";

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await axios.get("http://localhost:4000/api");

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error("Failed to fetch events");
};

export const deleteEvent = async (id: number) => {
  const response = await axios.delete(`http://localhost:4000/api/${id}`);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error("Failed to delete event");
}



