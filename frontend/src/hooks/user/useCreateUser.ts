import { createUser } from "@/api/user/userApi"
import { useMutation } from "@tanstack/react-query"

const useCreateUser = () => {
  return useMutation({
    mutationKey: ["createUser"],
    mutationFn: createUser
  })
}

export default useCreateUser