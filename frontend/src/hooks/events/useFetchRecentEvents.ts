import { getRecentEvents } from "@/api/event/eventApi"
import { useQuery } from "@tanstack/react-query"

const useFetchRecentEvents = () => {
  return useQuery({
    queryKey: ["recentEvents"],
    queryFn: getRecentEvents,
  })
}

export default useFetchRecentEvents