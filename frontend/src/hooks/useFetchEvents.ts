import { useQuery } from "@tanstack/react-query";
import { getAllEvents } from "../api/eventApi";

const useFetchAllEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: getAllEvents,
  })
};

export default useFetchAllEvents;
