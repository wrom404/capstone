import { getEventsFromLastMonth } from "@/api/event/eventApi";
import { useQuery } from "@tanstack/react-query";

const useFetchEventsLastMonth = () => {
  return useQuery({
    queryKey: ["eventsLastMonth"],
    queryFn: getEventsFromLastMonth,
  })
};

export default useFetchEventsLastMonth;
