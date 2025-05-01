import { getEventById } from "@/api/event/eventApi";
import { useQuery } from "@tanstack/react-query";

const useFetchEvent = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
    enabled: !!id, // only run if id is truthy
  })
};

export default useFetchEvent;
