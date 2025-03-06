import axios from "axios";
import { Event } from "../types/types";

export const getAllEvents = async (): Promise<Event[] | unknown> => {
  try {
    const response = await axios.get("http://localhost:4000/api");
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.log("Error", error);
    return error;
  }
}

