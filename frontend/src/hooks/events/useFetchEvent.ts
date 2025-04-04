import { useQuery } from "@tanstack/react-query";
import { getEventById } from "../../api/event/eventApi";

const useFetchEvent = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
  })
};

export default useFetchEvent;
