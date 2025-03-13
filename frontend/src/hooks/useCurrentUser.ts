import { currentUser } from "@/api/userApi";
import { UserProps } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const useCurrentUser = () => {
  return useQuery<UserProps | null>({
    queryKey: ["currentUser"],
    queryFn: currentUser, 
  });
};

export default useCurrentUser;
