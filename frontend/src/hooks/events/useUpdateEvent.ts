import { updateEvent } from "@/api/event/eventApi"
import { type FormDataProps } from "@/types/types"
import { useMutation } from "@tanstack/react-query"

const useUpdateEvent = (id: string) => {
  return useMutation({
    mutationKey: ["updateEvent", id],
    mutationFn: ({ formEvent, id }: { formEvent: FormDataProps, id: string }) => updateEvent({ formEvent, id })
  })
}

export default useUpdateEvent
