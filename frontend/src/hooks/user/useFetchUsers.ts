import { getAllUsers } from "@/api/user/userApi"
import { useQuery } from "@tanstack/react-query"

const useFetchUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers
  })
}

export default useFetchUsers