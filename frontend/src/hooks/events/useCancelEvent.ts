import { cancelEvent } from "@/api/event/eventApi"
import { useMutation } from "@tanstack/react-query"

const useCancelEvent = (id: string) => {
  return useMutation({
    mutationKey: ["cancelEvent", id],
    mutationFn: ({ cancelMessage, id }: { cancelMessage: string, id: string }) => cancelEvent({ cancelMessage, id }),
  })
}

export default useCancelEvent;