import { getUserById } from "@/api/user/userApi";
import { useQuery } from "@tanstack/react-query";

const useFetchUser = (id: string | null, { enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => (id ? getUserById(id) : Promise.resolve(null)), // Avoids API call if id is null
    enabled: enabled && !!id,
  });
};


export default useFetchUser;
