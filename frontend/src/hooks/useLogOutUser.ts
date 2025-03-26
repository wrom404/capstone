import { logOutUser } from "@/api/userApi";
import { useMutation } from "@tanstack/react-query";

const useLogOutUser = () => {
  return useMutation({
    mutationKey: ["logoutUser"],
    mutationFn: logOutUser
  })
}

export default useLogOutUser;