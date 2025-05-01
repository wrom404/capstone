import { deleteEvent } from "@/api/event/eventApi"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    mutationKey: ["deleteEvent"],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }), // invalidateQueries in useDeleteUser will properly refresh the cache associated with the getAllUsers query. Basically refetch/refresh the api call from getAllUsers
  })
}

export default useDeleteEvent;