import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../../api/user/userApi"

export const useLoginUser = () => {
  return useMutation({
    mutationKey: ["loginUser"],
    mutationFn: loginUser,
  })
}