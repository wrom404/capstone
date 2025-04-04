import { updateUser } from "@/api/user/userApi"
import { FetchedUserProps } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: ({ updatedUser }: { updatedUser: FetchedUserProps }) => updateUser({ id, updatedUser }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allUsers"] })
  })
}

export default useUpdateUser