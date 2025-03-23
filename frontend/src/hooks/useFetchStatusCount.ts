import { getEventsStatusCounts } from "@/api/eventApi";
import { useQuery } from "@tanstack/react-query";

const useFetchStatusCount = () => {
  return useQuery({
    queryKey: ["statusCount"],
    queryFn: getEventsStatusCounts
  })
}

export default useFetchStatusCount;