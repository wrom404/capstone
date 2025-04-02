import { restoreCanceledEvent } from "@/api/event/eventApi"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const useRestoreEvent = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["restoreEvent", id],
    mutationFn: (id: string) => restoreCanceledEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["canceledEvents"] }); // ✅ Refetch canceled events list
      queryClient.invalidateQueries({ queryKey: ["events"] }); // ✅ Optionally refetch the active events list
    }
  })
}

export default useRestoreEvent;