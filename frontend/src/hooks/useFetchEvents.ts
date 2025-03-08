import { getAllEvents } from "../api/eventApi";

const fetchAllEvents = {
  queryKey: ["events"],
  queryFn: getAllEvents,
};

export default fetchAllEvents;

