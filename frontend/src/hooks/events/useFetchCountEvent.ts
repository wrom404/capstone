import { getUnavailableDate } from "@/api/event/eventApi"
import { useQuery } from "@tanstack/react-query"

const useFetchUnAvailableDate = () => {
  return useQuery({
    queryKey: ["eventCount"],
    queryFn: getUnavailableDate
  })
}

export default useFetchUnAvailableDate;