import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../api/userApi"

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser
  })
}