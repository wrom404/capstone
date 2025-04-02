import { getCanceledEvents } from "@/api/event/eventApi";
import { useQuery } from "@tanstack/react-query";

const useFetchCanceledEvent = () => {
  return useQuery({
    queryKey: ["canceledEvents"],
    queryFn: getCanceledEvents
  })
};

export default useFetchCanceledEvent;
