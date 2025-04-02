import { deleteEvent } from "@/api/event/eventApi"
import { useMutation } from "@tanstack/react-query"

const useDeleteEvent = () => {
  return useMutation({
    mutationFn: deleteEvent,
  })
}

export default useDeleteEvent;