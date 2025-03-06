import { queryOptions } from "@tanstack/react-query";
import { getAllEvents } from "../api/eventApi";

const fetchAllEvents = () => {
  return queryOptions({
    queryKey: ["events"],
    queryFn: () => Promise.resolve(getAllEvents()),
  })
}

export default fetchAllEvents;