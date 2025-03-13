import { useQuery } from "@tanstack/react-query";
import { getEventById } from "../api/eventApi";

const useFetchAllEvent = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
  })
};

export default useFetchAllEvent;
