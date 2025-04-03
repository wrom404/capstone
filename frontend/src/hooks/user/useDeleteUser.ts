import { deleteUser } from "@/api/user/userApi"
import { useQueryClient, useMutation } from "@tanstack/react-query"

const useDeleteUser = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteUser", id],
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allUsers"] }), // invalidateQueries in useDeleteUser will properly refresh the cache associated with the getAllUsers query. Basically refetch/refresh the api call from getAllUsers
    onError: (error) => console.error("Error deleting user:", error)
  })
}

export default useDeleteUser