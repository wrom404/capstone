import { createEvent } from "@/api/eventApi"
import { useMutation } from "@tanstack/react-query"

const useCreateEvent = () => {
  return useMutation({
    mutationKey: ["createEvent"],
    mutationFn: createEvent,
  })
}

export default useCreateEvent